import type { Booking, BookingRequest, TimeSlot } from "./types";
import {
  addOns,
  getEffectivePrice,
  isServiceAvailable,
  locations,
  organizations,
  services,
} from "./mock-data";

/**
 * Porten mellom bookingflyten og booking-backenden (FR-3.1).
 *
 * To produksjonsimplementasjoner er planlagt bak dette grensesnittet
 * (docs/IMPLEMENTASJONSPLAN.md kap. 1.2):
 *   - Spor A: AvioBookingAdapter — kalender/kapasitet/ordre mot Avio MYO0/ED/POS-API
 *   - Spor B: InternalBookingAdapter — egen bookingmotor (kapasitetslogikk i kap. 5)
 *
 * Demoen kjører MockBookingAdapter. UI-koden kjenner kun dette grensesnittet,
 * så sporvalget endrer ikke én linje i bookingflyten.
 */
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
  ): { totalOre: number; vatOre: number };
}

/** Deterministisk PRNG (mulberry32) — samme input gir alltid samme tidsluker. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

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

    const random = mulberry32(hashString(`${locationId}:${date}`));
    const slots: TimeSlot[] = [];
    for (let start = open; start <= lastStart; start += 30) {
      // Belegg varierer med tid på dagen — formiddag er mest etterspurt.
      const demand = start < 12 * 60 ? 0.55 : 0.35;
      const taken = Math.floor(random() * (location.maxConcurrentCars + 1) * demand);
      const capacityLeft = Math.max(0, location.maxConcurrentCars - taken);
      if (capacityLeft > 0) {
        slots.push({ date, time: toTime(start), capacityLeft });
      }
    }
    return slots;
  }

  calculateTotal(
    locationId: string,
    serviceId: string,
    addOnIds: string[],
  ): { totalOre: number; vatOre: number } {
    const servicePrice = getEffectivePrice(serviceId, locationId);
    const addOnTotal = addOns
      .filter((addOn) => addOnIds.includes(addOn.id))
      .reduce((sum, addOn) => sum + addOn.priceOre, 0);
    const totalOre = servicePrice + addOnTotal;
    // Priser er inkl. 25 % mva; mva-andelen er total × 0,25 / 1,25.
    const vatOre = Math.round(totalOre / 5);
    return { totalOre, vatOre };
  }

  async createBooking(request: BookingRequest): Promise<Booking> {
    const location = locations.find((item) => item.id === request.locationId);
    const organization = organizations.find((org) => org.id === location?.orgId);
    const { totalOre, vatOre } = this.calculateTotal(
      request.locationId,
      request.serviceId,
      request.addOnIds,
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
