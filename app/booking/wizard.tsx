"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { bookingAdapter, MEMBER_DISCOUNT_RATE } from "@/lib/booking-adapter";
import { formatDistance, getBrowserPosition, rankLocations } from "@/lib/geo";
import type { GeoPoint } from "@/lib/geo";
import {
  formatDayParts,
  formatDuration,
  formatIsoDate,
  formatOre,
  formatOreExact,
  formatOrgNr,
} from "@/lib/format";
import {
  addOnAffinity,
  addOns,
  getEffectivePrice,
  getOrganization,
  isServiceAvailable,
  locations,
  services,
} from "@/lib/mock-data";
import { isValidRegNr, lookupVehicle, normalizeRegNr } from "@/lib/vehicle-lookup";
import type { Booking, TimeSlot, Vehicle } from "@/lib/types";

/**
 * 7-stegs lukket bookingtrakt (FR-2.1) i designet fra reference-prototypen.
 * All tilstand ligger i én reducer, så tilbake-navigasjon aldri mister data.
 * UI-koden kjenner kun BookingAdapter-grensesnittet (spor A/B-uavhengig).
 */

const STEP_LABELS = [
  "Avdeling",
  "Bilen din",
  "Tjeneste",
  "Tidspunkt",
  "Tillegg",
  "Oppsummering",
  "Bekreftelse",
] as const;

/* Delte kortstiler (speiler prototypens selCard/tick). */
const selCard = (selected: boolean): string =>
  `cursor-pointer rounded-[10px] px-[18px] py-[17px] transition-colors ${
    selected
      ? "border-2 border-navy bg-navy/6"
      : "border-2 border-line-strong bg-surface hover:border-navy/40"
  }`;

const tickCls = (selected: boolean): string =>
  `flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[14px] ${
    selected
      ? "bg-navy text-white"
      : "border-2 border-[rgba(20,32,58,0.18)] text-transparent"
  }`;

interface WizardState {
  step: number;
  locationId: string | null;
  regNr: string;
  vehicle: Vehicle | null;
  manualVehicle: boolean;
  serviceId: string | null;
  date: string | null;
  time: string | null;
  addOnIds: string[];
  contact: { name: string; phone: string };
  member: boolean;
  booking: Booking | null;
}

type WizardAction =
  | { type: "goto"; step: number }
  | { type: "vippsLogin" }
  | { type: "selectLocation"; locationId: string }
  | { type: "setRegNr"; regNr: string }
  | { type: "setVehicle"; vehicle: Vehicle | null }
  | { type: "setManualVehicle"; manual: boolean }
  | { type: "selectService"; serviceId: string }
  | { type: "selectSlot"; date: string; time: string }
  | { type: "toggleAddOn"; addOnId: string }
  | { type: "setContact"; contact: Partial<WizardState["contact"]> }
  | { type: "confirmed"; booking: Booking };

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "goto":
      return { ...state, step: action.step };
    case "vippsLogin":
      return {
        ...state,
        member: true,
        contact: {
          name: state.contact.name || "Kari Nordmann",
          phone: state.contact.phone || "91234567",
        },
      };
    case "selectLocation":
      return {
        ...state,
        locationId: action.locationId,
        date: state.locationId === action.locationId ? state.date : null,
        time: state.locationId === action.locationId ? state.time : null,
        step: 2,
      };
    case "setRegNr":
      return { ...state, regNr: action.regNr, vehicle: null, manualVehicle: false };
    case "setVehicle":
      return { ...state, vehicle: action.vehicle };
    case "setManualVehicle":
      return { ...state, manualVehicle: action.manual };
    case "selectService":
      return {
        ...state,
        serviceId: action.serviceId,
        date: state.serviceId === action.serviceId ? state.date : null,
        time: state.serviceId === action.serviceId ? state.time : null,
        step: 4,
      };
    case "selectSlot":
      return { ...state, date: action.date, time: action.time, step: 5 };
    case "toggleAddOn":
      return {
        ...state,
        addOnIds: state.addOnIds.includes(action.addOnId)
          ? state.addOnIds.filter((id) => id !== action.addOnId)
          : [...state.addOnIds, action.addOnId],
      };
    case "setContact":
      return { ...state, contact: { ...state.contact, ...action.contact } };
    case "confirmed":
      return { ...state, booking: action.booking, step: 7 };
  }
}

interface BookingWizardProps {
  initialLocationId: string | null;
  initialServiceId: string | null;
}

export function BookingWizard({
  initialLocationId,
  initialServiceId,
}: BookingWizardProps) {
  const [state, dispatch] = useReducer(reducer, {
    step: initialLocationId ? 2 : 1,
    locationId: initialLocationId,
    regNr: "",
    vehicle: null,
    manualVehicle: false,
    serviceId: initialServiceId,
    date: null,
    time: null,
    addOnIds: [],
    contact: { name: "", phone: "" },
    member: false,
    booking: null,
  });

  const location = locations.find((item) => item.id === state.locationId);
  const service = services.find((item) => item.id === state.serviceId);
  const backVisible = state.step > 1 && state.step < 7;

  return (
    <div className="mx-auto max-w-[680px] pb-10 pt-4">
      {/* Chrome: tilbake, stegteller, progresjon */}
      <div className="px-6 pb-[22px] pt-1.5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => backVisible && dispatch({ type: "goto", step: state.step - 1 })}
            className={`text-[16px] text-body-soft hover:text-navy ${backVisible ? "" : "invisible"}`}
          >
            ← Tilbake
          </button>
          <span className="font-heading text-[15px] font-medium text-muted">
            Steg {state.step} av 7
          </span>
        </div>
        <div className="flex gap-1.5">
          {STEP_LABELS.map((label, index) => (
            <div
              key={label}
              className={`h-[5px] flex-1 rounded-[3px] ${
                index + 1 <= state.step ? "bg-navy" : "bg-line-strong"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 font-heading text-[14px] font-medium text-muted">
          {STEP_LABELS[state.step - 1]}
        </p>
      </div>

      {state.step === 1 && <StepLocation state={state} dispatch={dispatch} />}
      {state.step === 2 && <StepVehicle state={state} dispatch={dispatch} />}
      {state.step === 3 && location && <StepService state={state} dispatch={dispatch} />}
      {state.step === 4 && location && service && (
        <StepTime state={state} dispatch={dispatch} />
      )}
      {state.step === 5 && service && <StepAddOns state={state} dispatch={dispatch} />}
      {state.step === 6 && location && service && (
        <StepSummary state={state} dispatch={dispatch} />
      )}
      {state.step === 7 && state.booking && (
        <StepConfirmation booking={state.booking} />
      )}
    </div>
  );
}

/* ---------- Steg 1: avdeling ---------- */
function StepLocation({
  state,
  dispatch,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [locating, setLocating] = useState(false);

  const ranking = useMemo(
    () => rankLocations(locations, query, position),
    [query, position],
  );

  async function handleLocate() {
    setLocating(true);
    setPosition(await getBrowserPosition());
    setLocating(false);
  }

  return (
    <div className="px-6 pt-2">
      <h2 className="mb-1.5 font-heading text-[25px] font-bold text-ink">
        Velg avdeling
      </h2>
      <p className="mb-[18px] text-[16px] text-muted">
        Der du leverer og henter bilen.
      </p>
      <div className="mb-2 flex gap-2.5">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPosition(null);
          }}
          placeholder="By eller postnummer"
          className="min-w-0 flex-1 rounded-[8px] border border-[rgba(20,32,58,0.16)] bg-surface px-4 py-3.5 text-[16px] text-ink outline-none placeholder:text-muted-light focus:border-navy"
        />
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="shrink-0 rounded-[8px] border border-navy/30 bg-surface px-4 font-heading text-[15px] font-semibold text-navy hover:bg-surface-alt disabled:opacity-60"
        >
          {locating ? "Finner…" : "📍 Nær meg"}
        </button>
      </div>
      {ranking.note && (
        <p className="mx-0.5 mb-3.5 mt-1.5 text-[14px] text-muted">{ranking.note}</p>
      )}
      <div className="mt-3 flex flex-col gap-2.5">
        {ranking.results.map((item) => {
          const selected = state.locationId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => dispatch({ type: "selectLocation", locationId: item.id })}
              className={`text-left ${selCard(selected)}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-heading text-[17px] font-semibold text-ink">
                    Handz On {item.name}
                    {ranking.showDistance && "distanceKm" in item && (
                      <span className="ml-2 text-[14px] font-normal text-navy">
                        {formatDistance(item.distanceKm as number)}
                      </span>
                    )}
                  </div>
                  <div className="mt-[3px] text-[13.5px] text-muted">
                    {item.address}, {item.postalCode} {item.city}
                  </div>
                </div>
                <span className={tickCls(selected)}>✓</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Steg 2: bil ---------- */
function StepVehicle({
  state,
  dispatch,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">(
    state.vehicle ? "found" : "idle",
  );
  const [manualMake, setManualMake] = useState("");
  const [manualModel, setManualModel] = useState("");
  const valid = isValidRegNr(state.regNr);

  async function handleLookup() {
    setStatus("loading");
    try {
      const vehicle = await lookupVehicle(state.regNr);
      if (vehicle) {
        dispatch({ type: "setVehicle", vehicle });
        setStatus("found");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
      dispatch({ type: "setManualVehicle", manual: true });
    }
  }

  function handleManualContinue() {
    dispatch({
      type: "setVehicle",
      vehicle: {
        regNr: normalizeRegNr(state.regNr),
        make: manualMake || "Ukjent merke",
        model: manualModel || "",
        year: 0,
        fuel: "",
        color: "",
      },
    });
    dispatch({ type: "goto", step: 3 });
  }

  return (
    <div className="px-6 pt-2">
      <h2 className="mb-1.5 font-heading text-[25px] font-bold text-ink">
        Bilen din
      </h2>
      <p className="mb-5 text-[16px] text-muted">
        Vi henter merke og modell fra Statens vegvesen.
      </p>
      <label
        htmlFor="regnr"
        className="mb-2 block text-[15px] font-semibold text-ink"
      >
        Registreringsnummer
      </label>
      <input
        id="regnr"
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        maxLength={8}
        value={state.regNr}
        onChange={(event) => {
          setStatus("idle");
          dispatch({ type: "setRegNr", regNr: normalizeRegNr(event.target.value) });
        }}
        placeholder="EB12345"
        className="w-full rounded-[10px] border-[1.5px] border-[rgba(20,32,58,0.16)] bg-surface p-[18px] text-center font-heading text-[28px] font-bold uppercase tracking-[0.28em] text-ink outline-none placeholder:text-muted-light/50 focus:border-navy"
      />
      <p className="mt-2.5 text-[14px] text-muted-light">
        To bokstaver og fem sifre. Prøv f.eks. EB12345.
      </p>

      {status !== "found" && (
        <Button
          fullWidth
          className="mt-4 py-[18px] text-[18px]"
          disabled={!valid || status === "loading"}
          onClick={handleLookup}
        >
          {status === "loading" ? "Slår opp…" : "Hent bilinfo"}
        </Button>
      )}

      {status === "found" && state.vehicle && (
        <>
          <div className="mt-[18px] rounded-[12px] border-[1.5px] border-navy/35 bg-navy/5 p-[18px]">
            <div className="text-[14px] text-muted">Vi fant bilen din</div>
            <div className="mt-1 font-heading text-[20px] font-bold text-ink">
              {state.vehicle.make} {state.vehicle.model}
              {state.vehicle.year ? ` (${state.vehicle.year})` : ""}
            </div>
            {state.vehicle.fuel && (
              <div className="mt-[3px] text-[14.5px] text-muted">
                {state.vehicle.fuel} · {state.vehicle.color}
              </div>
            )}
          </div>
          <Button
            fullWidth
            className="mt-4 py-[18px] text-[18px]"
            onClick={() => dispatch({ type: "goto", step: 3 })}
          >
            Dette stemmer — gå videre
          </Button>
        </>
      )}

      {status === "error" && (
        <div className="mt-[18px] rounded-[12px] border-[1.5px] border-[rgba(190,70,70,0.4)] bg-[rgba(190,70,70,0.05)] p-[18px]">
          <p className="mb-3.5 text-[15px] leading-[1.5] text-body-strong">
            Vi fikk ikke svar fra motorvognregisteret. Fyll inn bilinfo manuelt,
            så går bestillingen like fint.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={manualMake}
              onChange={(event) => setManualMake(event.target.value)}
              placeholder="Merke"
              className="rounded-[8px] border border-[rgba(20,32,58,0.16)] bg-surface p-3.5 text-[15.5px] text-ink outline-none focus:border-navy"
            />
            <input
              type="text"
              value={manualModel}
              onChange={(event) => setManualModel(event.target.value)}
              placeholder="Modell"
              className="rounded-[8px] border border-[rgba(20,32,58,0.16)] bg-surface p-3.5 text-[15.5px] text-ink outline-none focus:border-navy"
            />
          </div>
          <Button
            fullWidth
            className="mt-3.5"
            disabled={!valid}
            onClick={handleManualContinue}
          >
            Fortsett uten oppslag
          </Button>
        </div>
      )}
    </div>
  );
}

/* ---------- Steg 3: tjeneste ---------- */
function StepService({
  state,
  dispatch,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const locationId = state.locationId!;
  const categories = [...new Set(services.map((service) => service.category))];

  return (
    <div className="px-6 pt-2">
      <h2 className="mb-4 font-heading text-[25px] font-bold text-ink">
        Velg tjeneste
      </h2>

      {state.member ? (
        <div className="mb-[18px] rounded-[10px] border border-navy/30 bg-navy/6 px-4 py-3.5 text-[14.5px] text-navy">
          Kundeklubb-medlem — medlemsprisene under er oppdatert.
        </div>
      ) : (
        <div className="mb-[18px] flex items-center justify-between gap-3 rounded-[10px] border border-line-strong px-4 py-3.5">
          <span className="text-[14px] text-body-soft">
            Medlem? Logg inn for medlemspris.
          </span>
          <button
            type="button"
            onClick={() => dispatch({ type: "vippsLogin" })}
            className="shrink-0 rounded-[7px] bg-vipps px-3.5 py-2.5 font-heading text-[14px] font-semibold text-white hover:brightness-110"
          >
            Vipps
          </button>
        </div>
      )}

      {categories.map((category) => {
        const items = services.filter(
          (service) =>
            service.category === category &&
            isServiceAvailable(service.id, locationId),
        );
        if (items.length === 0) return null;
        return (
          <div key={category} className="mb-[22px]">
            <h3 className="mb-2.5 font-heading text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-light">
              {category}
            </h3>
            <div className="flex flex-col gap-2.5">
              {items.map((service) => {
                const selected = state.serviceId === service.id;
                const price = getEffectivePrice(service.id, locationId);
                const memberPrice =
                  price - Math.round((price * MEMBER_DISCOUNT_RATE) / 100) * 100;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() =>
                      dispatch({ type: "selectService", serviceId: service.id })
                    }
                    className={`text-left ${selCard(selected)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-heading text-[17px] font-semibold text-ink">
                          {service.name}
                        </div>
                        <div className="mt-[3px] text-[13.5px] text-muted">
                          {service.description}
                        </div>
                        <div className="mt-[5px] text-[13px] text-muted-light">
                          Varighet ca. {formatDuration(service.durationMin)}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {state.member ? (
                          <>
                            <div className="text-[13px] text-muted-light line-through">
                              {formatOre(price)}
                            </div>
                            <div className="font-heading text-[16px] font-bold text-navy">
                              {formatOre(memberPrice)}
                            </div>
                          </>
                        ) : (
                          <div className="font-heading text-[16px] font-bold text-ink">
                            {formatOre(price)}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Steg 4: tidspunkt ---------- */
function StepTime({
  state,
  dispatch,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [days, setDays] = useState<string[]>([]);
  const [slotsByDay, setSlotsByDay] = useState<Record<string, TimeSlot[]>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(state.date);
  const [loading, setLoading] = useState(true);
  const addOnKey = state.addOnIds.join(",");

  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    const upcoming: string[] = [];
    for (let offset = 1; offset <= 14; offset += 1) {
      const day = new Date(today);
      day.setDate(today.getDate() + offset);
      upcoming.push(day.toISOString().slice(0, 10));
    }
    setDays(upcoming);
    setLoading(true);
    Promise.all(
      upcoming.map((day) =>
        bookingAdapter.getAvailableSlots(
          state.locationId!,
          state.serviceId!,
          state.addOnIds,
          day,
        ),
      ),
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, TimeSlot[]> = {};
      upcoming.forEach((day, index) => {
        map[day] = results[index];
      });
      setSlotsByDay(map);
      setSelectedDay(
        (current) =>
          current ?? upcoming.find((day) => map[day].length > 0) ?? upcoming[0],
      );
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.locationId, state.serviceId, addOnKey]);

  const activeDay = selectedDay ?? days[0] ?? null;
  const slots = activeDay ? (slotsByDay[activeDay] ?? []) : [];

  return (
    <div className="pt-2">
      <div className="px-6">
        <h2 className="mb-1.5 font-heading text-[25px] font-bold text-ink">
          Velg tidspunkt
        </h2>
        <p className="mb-[18px] text-[16px] text-muted">
          Vi tar bilen mens du er på senteret.
        </p>
      </div>

      <div className="hz-scroll flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-6 pb-5 pt-0.5">
        {days.map((day) => {
          const parts = formatDayParts(day);
          const selected = activeDay === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`w-[66px] shrink-0 snap-start rounded-[10px] py-[13px] text-center transition-all ${
                selected
                  ? "border border-navy bg-navy"
                  : "border border-[rgba(20,32,58,0.14)] bg-surface"
              }`}
            >
              <div className={`text-[13px] ${selected ? "text-white/85" : "text-muted"}`}>
                {parts.wd}
              </div>
              <div
                className={`my-[3px] font-heading text-[22px] font-bold ${selected ? "text-white" : "text-ink"}`}
              >
                {parts.dd}
              </div>
              <div className={`text-[12px] ${selected ? "text-white/85" : "text-muted"}`}>
                {parts.mon}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6">
        <div className="mb-3.5 text-[15px] text-body-soft">
          Ledige tider{activeDay ? ` ${formatIsoDate(activeDay)}` : ""}
        </div>
        {loading ? (
          <p className="py-2 text-[15px] text-muted">Henter ledige tider…</p>
        ) : slots.length === 0 ? (
          <p className="py-2 text-[15px] text-muted">
            Ingen ledige tider denne dagen — prøv en annen dag.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {slots.map((slot) => {
              const selected = state.date === slot.date && state.time === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() =>
                    dispatch({ type: "selectSlot", date: slot.date, time: slot.time })
                  }
                  className={`rounded-[9px] py-3 text-center transition-all ${
                    selected
                      ? "border border-navy bg-navy text-white"
                      : "border border-[rgba(20,32,58,0.14)] bg-surface text-ink"
                  }`}
                >
                  <div className="font-heading text-[17px] font-semibold">
                    {slot.time}
                  </div>
                  <div
                    className={`mt-0.5 text-[11px] ${selected ? "text-white/85" : "text-muted-light"}`}
                  >
                    {slot.capacityLeft === 1
                      ? "1 plass igjen"
                      : `${slot.capacityLeft} plasser`}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Steg 5: tillegg ---------- */
function StepAddOns({
  state,
  dispatch,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const recommendedIds = state.serviceId ? (addOnAffinity[state.serviceId] ?? []) : [];
  const sorted = [...addOns].sort((a, b) => {
    const aIndex = recommendedIds.indexOf(a.id);
    const bIndex = recommendedIds.indexOf(b.id);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });

  return (
    <>
      <div className="px-6 pt-2">
        <h2 className="mb-1.5 font-heading text-[25px] font-bold text-ink">
          Tilleggstjenester
        </h2>
        <p className="mb-5 text-[16px] text-muted">
          Gjør det skikkelig når bilen først er inne — dette velger andre sammen
          med tjenesten din.
        </p>
        <div className="flex flex-col gap-2.5">
          {sorted.map((addOn) => {
            const selected = state.addOnIds.includes(addOn.id);
            const recommended = recommendedIds.includes(addOn.id);
            return (
              <button
                key={addOn.id}
                type="button"
                onClick={() => dispatch({ type: "toggleAddOn", addOnId: addOn.id })}
                className={`text-left ${selCard(selected)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading text-[17px] font-semibold text-ink">
                        {addOn.name}
                      </span>
                      {recommended && (
                        <span className="rounded-full bg-navy/10 px-2.5 py-[3px] text-[11.5px] font-semibold text-navy">
                          Ofte valgt sammen
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[13.5px] text-muted">
                      {addOn.description}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5">
                    <span className="whitespace-nowrap font-heading text-[15px] font-bold text-navy">
                      + {formatOre(addOn.priceOre)}
                    </span>
                    <span className={tickCls(selected)}>✓</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 z-30 mt-7 bg-gradient-to-b from-surface/0 from-0% to-surface to-[34%] px-6 pb-[22px] pt-4">
        <Button
          fullWidth
          className="py-[18px] text-[18px]"
          onClick={() => dispatch({ type: "goto", step: 6 })}
        >
          {state.addOnIds.length > 0
            ? `Gå videre med ${state.addOnIds.length} tillegg`
            : "Gå videre uten tillegg"}
        </Button>
      </div>
    </>
  );
}

/* ---------- Steg 6: oppsummering ---------- */
function StepSummary({
  state,
  dispatch,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const location = locations.find((item) => item.id === state.locationId)!;
  const service = services.find((item) => item.id === state.serviceId)!;
  const organization = getOrganization(location.orgId);
  const chosenAddOns = addOns.filter((addOn) => state.addOnIds.includes(addOn.id));
  const servicePrice = getEffectivePrice(service.id, location.id);
  const { totalOre, vatOre, memberDiscountOre } = bookingAdapter.calculateTotal(
    location.id,
    service.id,
    state.addOnIds,
    { member: state.member },
  );
  const contactValid =
    state.contact.name.trim().length > 1 && state.contact.phone.trim().length >= 8;

  async function handleConfirm() {
    setSubmitting(true);
    const booking = await bookingAdapter.createBooking({
      locationId: location.id,
      regNr: state.regNr,
      vehicle: state.vehicle,
      serviceId: service.id,
      addOnIds: state.addOnIds,
      date: state.date!,
      time: state.time!,
      contact: state.contact,
      member: state.member,
    });
    dispatch({ type: "confirmed", booking });
  }

  return (
    <div className="px-6 pt-2">
      <h2 className="mb-[18px] font-heading text-[25px] font-bold text-ink">
        Oppsummering
      </h2>

      {/* Bestillingsdetaljer */}
      <div className="overflow-hidden rounded-[12px] border border-line-strong bg-surface">
        <SummaryRow
          label="Avdeling"
          value={`Handz On ${location.name}`}
          sub={`${location.address}, ${location.postalCode} ${location.city}`}
          onEdit={() => dispatch({ type: "goto", step: 1 })}
        />
        <SummaryRow
          label="Bil"
          value={
            state.vehicle
              ? `${state.vehicle.make} ${state.vehicle.model}`.trim() || "—"
              : "—"
          }
          sub={state.regNr}
          subMono
          onEdit={() => dispatch({ type: "goto", step: 2 })}
        />
        <SummaryRow
          label="Tidspunkt"
          value={
            state.date ? `${formatIsoDate(state.date)} kl. ${state.time}` : "—"
          }
          onEdit={() => dispatch({ type: "goto", step: 4 })}
          last
        />
      </div>

      {/* Prisspesifikasjon */}
      <div className="mt-3.5 rounded-[12px] border border-line-strong bg-surface p-[18px]">
        <div className="mb-3 font-heading text-[16px] font-semibold text-ink">
          Prisspesifikasjon
        </div>
        <div className="flex justify-between py-1.5 text-[15px] text-body-strong">
          <span>{service.name}</span>
          <span>{formatOre(servicePrice)}</span>
        </div>
        {chosenAddOns.map((addOn) => (
          <div
            key={addOn.id}
            className="flex justify-between py-1.5 text-[15px] text-body-strong"
          >
            <span>{addOn.name}</span>
            <span>{formatOre(addOn.priceOre)}</span>
          </div>
        ))}
        {memberDiscountOre > 0 && (
          <div className="flex justify-between py-1.5 text-[15px] text-navy">
            <span>Kundeklubb-rabatt (10 %)</span>
            <span>− {formatOre(memberDiscountOre)}</span>
          </div>
        )}
        <div className="mt-1 flex justify-between border-t border-line pb-1.5 pt-2 text-[13.5px] text-muted-light">
          <span>Herav mva. (25 %)</span>
          <span>{formatOreExact(vatOre)}</span>
        </div>
        <div className="flex items-baseline justify-between pt-2">
          <span className="font-heading text-[17px] font-semibold text-ink">
            Å betale ved henting
          </span>
          <span className="font-heading text-[24px] font-bold text-ink">
            {formatOre(totalOre)}
          </span>
        </div>
        {organization && (
          <p className="mt-3 text-[12.5px] text-muted-light">
            Selger: {organization.legalName}, org.nr{" "}
            {formatOrgNr(organization.orgNr)}. Kvittering sendes på e-post.
          </p>
        )}
      </div>

      {/* Kontaktinfo */}
      <div className="mt-3.5 rounded-[12px] border border-line-strong bg-surface p-[18px]">
        <div className="mb-1 font-heading text-[16px] font-semibold text-ink">
          Kontaktinfo
        </div>
        <p className="mb-3.5 text-[13.5px] text-muted">
          Vi sender bekreftelse og påminnelse på SMS.
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            autoComplete="name"
            value={state.contact.name}
            onChange={(event) =>
              dispatch({ type: "setContact", contact: { name: event.target.value } })
            }
            placeholder="Navn"
            className="w-full rounded-[8px] border border-[rgba(20,32,58,0.16)] bg-surface px-4 py-3.5 text-[16px] text-ink outline-none focus:border-navy"
          />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={state.contact.phone}
            onChange={(event) =>
              dispatch({ type: "setContact", contact: { phone: event.target.value } })
            }
            placeholder="Mobilnummer"
            className="w-full rounded-[8px] border border-[rgba(20,32,58,0.16)] bg-surface px-4 py-3.5 text-[16px] text-ink outline-none focus:border-navy"
          />
          {!state.member && (
            <button
              type="button"
              onClick={() => dispatch({ type: "vippsLogin" })}
              className="w-full rounded-[8px] bg-vipps py-3.5 font-heading text-[15px] font-semibold text-white hover:brightness-110"
            >
              Fyll ut med Vipps
            </button>
          )}
        </div>
      </div>

      <Button
        fullWidth
        className="mt-[18px] py-[18px] text-[18px]"
        disabled={!contactValid || submitting}
        onClick={handleConfirm}
      >
        {submitting ? "Bekrefter…" : `Bekreft bestilling – ${formatOre(totalOre)}`}
      </Button>
      <p className="mt-3 text-center text-[13px] text-muted-light">
        Gratis avbestilling frem til 24 timer før avtalt tid.
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  sub,
  subMono,
  onEdit,
  last,
}: {
  label: string;
  value: string;
  sub?: string;
  subMono?: boolean;
  onEdit: () => void;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between px-[18px] py-4 ${last ? "" : "border-b border-line"}`}
    >
      <div>
        <div className="mb-1 text-[13px] text-muted-light">{label}</div>
        <div className="font-heading text-[16px] font-semibold text-ink">
          {value}
        </div>
        {sub && (
          <div
            className={`mt-0.5 text-[13px] text-muted ${subMono ? "font-heading tracking-[0.05em]" : ""}`}
          >
            {sub}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-[15px] font-semibold text-navy hover:text-navy-hover"
      >
        Endre
      </button>
    </div>
  );
}

/* ---------- Steg 7: bekreftelse ---------- */
function StepConfirmation({ booking }: { booking: Booking }) {
  const location = locations.find((item) => item.id === booking.locationId);
  const service = services.find((item) => item.id === booking.serviceId);
  const chosenAddOns = addOns.filter((addOn) => booking.addOnIds.includes(addOn.id));

  return (
    <div className="px-6 pt-5">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-[18px] flex h-[72px] w-[72px] items-center justify-center rounded-full bg-navy/10">
          <span className="text-[34px] leading-none text-navy">✓</span>
        </div>
        <h2 className="mb-2 font-heading text-[27px] font-bold text-ink">
          Takk for bestillingen!
        </h2>
        <p className="max-w-[320px] text-[16px] text-body-soft">
          Referanse{" "}
          <span className="font-heading font-bold text-ink">
            {booking.reference}
          </span>
          . Bekreftelse er sendt på SMS.
        </p>
      </div>

      {/* Digital kvittering */}
      <div className="overflow-hidden rounded-[12px] border border-[rgba(20,32,58,0.14)] bg-surface">
        <div className="flex items-center justify-between bg-navy px-[22px] py-[18px]">
          <div className="font-heading text-[18px] font-bold text-white">
            Handz On Auto Care
          </div>
          <div className="text-[13px] text-on-navy-soft">Kvittering</div>
        </div>
        <div className="px-[22px] py-[18px]">
          <ReceiptRow label="Referanse" value={booking.reference} />
          <ReceiptRow label="Tjeneste" value={service?.name ?? ""} alignRight />
          {chosenAddOns.length > 0 && (
            <div className="flex justify-between gap-4 pb-2 pt-1 text-[13.5px]">
              <span className="text-muted-light">Tillegg</span>
              <span className="text-right text-muted">
                {chosenAddOns.map((addOn) => addOn.name).join(", ")}
              </span>
            </div>
          )}
          <ReceiptRow
            label="Avdeling"
            value={`Handz On ${location?.name ?? ""}`}
            alignRight
          />
          <ReceiptRow
            label="Tidspunkt"
            value={`${formatIsoDate(booking.date)} kl. ${booking.time}`}
            alignRight
          />
          <ReceiptRow label="Bil" value={booking.regNr} mono />
        </div>
        <div className="flex items-baseline justify-between border-t border-dashed border-[rgba(20,32,58,0.22)] px-[22px] py-3.5">
          <span className="text-[15px] text-muted">Å betale ved henting</span>
          <span className="font-heading text-[24px] font-bold text-ink">
            {formatOre(booking.totalOre)}
          </span>
        </div>
        <div
          className="mx-[22px] mb-[18px] h-[52px] rounded-[2px] opacity-90"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #16223A 0 2px, transparent 2px 4px, #16223A 4px 5px, transparent 5px 9px)",
          }}
        />
        <p className="mx-[22px] mb-[18px] text-[12px] text-muted-light">
          Utstedes av org.nr {formatOrgNr(booking.orgNr)}. Kvitteringen legges på
          Min side etter utført behandling.
        </p>
      </div>

      <div className="mt-[22px] flex flex-col gap-3">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => window.print()}
        >
          Last ned kvittering (PDF)
        </Button>
        <Button variant="primary" fullWidth onClick={() => (window.location.href = "/")}>
          Til forsiden
        </Button>
      </div>
      <p className="mt-4 text-center text-[13px] text-muted-light">
        Avtalen, endring/avbestilling og kvitteringen finner du på{" "}
        <Link href="/min-side" className="font-semibold text-navy hover:text-navy-hover">
          Min side
        </Link>
        .
      </p>
    </div>
  );
}

function ReceiptRow({
  label,
  value,
  alignRight,
  mono,
}: {
  label: string;
  value: string;
  alignRight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4 py-2 text-[15px]">
      <span className="text-muted">{label}</span>
      <span
        className={`font-heading font-semibold text-ink ${alignRight ? "text-right" : ""} ${mono ? "tracking-[0.05em]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
