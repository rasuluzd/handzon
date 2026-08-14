import type { Booking, BookingRequest, TimeSlot } from "./types";
import { hashString, mulberry32 } from "./prng";
import {
  addOns,
  getEffectivePrice,
  isServiceAvailable,
  locations,
  organizations,
  services,
} from "./mock-data";

/**
 * Porten mellom bookingflyten og booking-backenden (T-3). Kravspesifikasjonen
 * forutsetter Avio ED/POS som «Single Source of Truth» (spor A); spor B er
 * beredskap dersom API-tilgang ikke innvilges.
 *
 * To produksjonsimplementasjoner er planlagt bak dette grensesnittet
 * (docs/IMPLEMENTASJONSPLAN.md kap. 1.2):
 *   - Spor A: AvioBookingAdapter — kalender/kapasitet/ordre mot Avio MYO0/ED/POS-API
 *   - Spor B: InternalBookingAdapter — egen bookingmotor (kapasitetslogikk i kap. 5)
 *
 * Demoen kjører MockBookingAdapter. UI-koden kjenner kun dette grensesnittet,
 * så sporvalget endrer ikke én linje i bookingflyten.
 */
export interface PriceBreakdown {
  totalOre: number;
  vatOre: number;
  /** Kundeklubb-rabatt (FR-2.2) — 0 uten medlemskap eller ved fallback (NFR-3). */
  memberDiscountOre: number;
}

export interface BookingAdapter {
  getAvailableSlots(
    locationId: string,
    serviceId: string,
    addOnIds: string[],
    date: string,
  ): Promise<TimeSlot[]>;
  createBooking(request: BookingRequest): Promise<Booking>;
  calculateTotal(
    locationId: string,
    serviceId: string,
    addOnIds: string[],
    options?: { member?: boolean },
  ): PriceBreakdown;
}

/**
 * Kundeklubb-rabatt (FR-2.2): i produksjon hentes lojalitetsstatus fra ekstern
 * kundedatabase etter Vipps-innlogging; er tjenesten nede brukes standard
 * prisliste (NFR-3). Demoen bruker en flat medlemsrabatt på hovedtjenesten.
 */
export const MEMBER_DISCOUNT_RATE = 0.1;

function minutesFrom(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Mandag = 0 … søndag = 6, fra ISO-dato. */
function weekdayIndex(isoDate: string): number {
  const jsDay = new Date(`${isoDate}T12:00:00`).getDay();
  return (jsDay + 6) % 7;
}

/**
 * Tidligste starttidspunkt i minutter for en gitt dato. Gjelder bare i dag:
 * dagsstripa i bookingen starter på dagens dato, og da må klokkeslett som
 * allerede har passert bort. En time varsel er lagt inn fordi kunden skal
 * rekke å kjøre til avdelingen — det er samme forutsetning som resten av
 * kapasitetsmodellen bygger på.
 */
const LEAD_TIME_MIN = 60;

function earliestStart(isoDate: string): number {
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  if (isoDate !== todayIso) return -1;
  return now.getHours() * 60 + now.getMinutes() + LEAD_TIME_MIN;
}

export class MockBookingAdapter implements BookingAdapter {
  /**
   * Genererer tidsluker etter samme modell som produksjonens kapasitetslogikk
   * (kap. 5): åpningsvindu − varighet − buffer, rastrert til 30 min, med
   * pseudotilfeldig belegg trukket deterministisk fra (avdeling, dato).
   */
  async getAvailableSlots(
    locationId: string,
    serviceId: string,
    addOnIds: string[],
    date: string,
  ): Promise<TimeSlot[]> {
    const location = locations.find((item) => item.id === locationId);
    const service = services.find((item) => item.id === serviceId);
    if (!location || !service || !isServiceAvailable(serviceId, locationId)) {
      return [];
    }

    const hours = location.openingHours[weekdayIndex(date)];
    if (!hours || hours.closed) return [];

    const addOnMinutes = addOns
      .filter((addOn) => addOnIds.includes(addOn.id))
      .reduce((sum, addOn) => sum + addOn.durationMin, 0);
    const bufferMin = 15;
    const totalDuration = service.durationMin + addOnMinutes + bufferMin;

    const open = minutesFrom(hours.open);
    const close = minutesFrom(hours.close);
    const lastStart = close - totalDuration;

    const earliest = earliestStart(date);
    const random = mulberry32(hashString(`${locationId}:${date}`));
    const slots: TimeSlot[] = [];
    for (let start = open; start <= lastStart; start += 30) {
      /* Belegget trekkes uansett, også for tider som filtreres bort — ellers
         ville dagens ledige tider fått andre kapasitetstall enn i morgendagens
         visning av samme rute, og tallene sluttet å være deterministiske. */
      const demand = start < 12 * 60 ? 0.55 : 0.35;
      const taken = Math.floor(random() * (location.maxConcurrentCars + 1) * demand);
      const capacityLeft = Math.max(0, location.maxConcurrentCars - taken);
      if (capacityLeft > 0 && start >= earliest) {
        slots.push({ date, time: toTime(start), capacityLeft });
      }
    }
    return slots;
  }

  calculateTotal(
    locationId: string,
    serviceId: string,
    addOnIds: string[],
    options?: { member?: boolean },
  ): PriceBreakdown {
    const servicePrice = getEffectivePrice(serviceId, locationId);
    const addOnTotal = addOns
      .filter((addOn) => addOnIds.includes(addOn.id))
      .reduce((sum, addOn) => sum + addOn.priceOre, 0);
    // Rabatten rundes til hele kroner så medlemsprisen blir «pen».
    const memberDiscountOre = options?.member
      ? Math.round((servicePrice * MEMBER_DISCOUNT_RATE) / 100) * 100
      : 0;
    const totalOre = servicePrice + addOnTotal - memberDiscountOre;
    // Priser er inkl. 25 % mva; mva-andelen er total × 0,25 / 1,25.
    const vatOre = Math.round(totalOre / 5);
    return { totalOre, vatOre, memberDiscountOre };
  }

  async createBooking(request: BookingRequest): Promise<Booking> {
    const location = locations.find((item) => item.id === request.locationId);
    const organization = organizations.find((org) => org.id === location?.orgId);
    const { totalOre, vatOre } = this.calculateTotal(
      request.locationId,
      request.serviceId,
      request.addOnIds,
      { member: request.member },
    );
    const reference = `HOAC-${(hashString(
      `${request.locationId}:${request.regNr}:${request.date}:${request.time}`,
    ) % 9000) + 1000}`;

    return {
      id: `bk-${reference.toLowerCase()}`,
      reference,
      locationId: request.locationId,
      orgNr: organization?.orgNr ?? "",
      regNr: request.regNr,
      vehicle: request.vehicle,
      serviceId: request.serviceId,
      addOnIds: request.addOnIds,
      date: request.date,
      time: request.time,
      status: "confirmed",
      totalOre,
      vatOre,
    };
  }
}

export const bookingAdapter: BookingAdapter = new MockBookingAdapter();
