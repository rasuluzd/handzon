"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { bookingAdapter, MEMBER_DISCOUNT_RATE } from "@/lib/booking-adapter";
import { formatDistance, getBrowserPosition, rankLocations } from "@/lib/geo";
import type { GeoPoint } from "@/lib/geo";
import {
  formatDuration,
  formatIsoDate,
  formatIsoDateShort,
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
 * 7-stegs lukket bookingtrakt (FR-2.1). All tilstand ligger i én reducer, så
 * tilbake-navigasjon aldri mister data. Kjenner kun BookingAdapter-grensesnittet.
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
  /** Kundeklubb-medlem etter Vipps-innlogging (FR-2.2) — påvirker pris i steg 3 og 6. */
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
      // Mock av Vipps + kundeklubb-oppslag (FR-2.2): identitet hentes og
      // lojalitetsstatus aktiverer medlemspriser i steg 3 og 6.
      return {
        ...state,
        member: true,
        contact: {
          name: state.contact.name || "Kari Nordmann",
          phone: state.contact.phone || "91234567",
        },
      };
    case "selectLocation":
      // Bytte av avdeling nullstiller tidspunkt (kapasiteten er lokal),
      // men beholder bil og tjeneste.
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

  const stepDone = (step: number): boolean => {
    switch (step) {
      case 1:
        return state.locationId !== null;
      case 2:
        return isValidRegNr(state.regNr);
      case 3:
        return state.serviceId !== null;
      case 4:
        return state.date !== null && state.time !== null;
      case 5:
        return true;
      case 6:
        return state.contact.name.trim().length > 1 && state.contact.phone.trim().length >= 8;
      default:
        return false;
    }
  };

  const maxReachableStep = (): number => {
    for (let step = 1; step <= 6; step += 1) {
      if (!stepDone(step)) return step;
    }
    return 6;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">
        {state.step === 7 ? "Takk for bestillingen!" : "Bestill time"}
      </h1>

      <Stepper
        currentStep={state.step}
        maxReachable={state.booking ? 0 : maxReachableStep()}
        onNavigate={(step) => dispatch({ type: "goto", step })}
      />

      <div className="mt-6">
        {state.step === 1 && (
          <StepLocation
            selectedId={state.locationId}
            onSelect={(locationId) => dispatch({ type: "selectLocation", locationId })}
          />
        )}
        {state.step === 2 && (
          <StepVehicle state={state} dispatch={dispatch} />
        )}
        {state.step === 3 && location && (
          <StepService
            locationId={location.id}
            selectedId={state.serviceId}
            member={state.member}
            onVippsLogin={() => dispatch({ type: "vippsLogin" })}
            onSelect={(serviceId) => dispatch({ type: "selectService", serviceId })}
          />
        )}
        {state.step === 4 && location && service && (
          <StepTime state={state} dispatch={dispatch} />
        )}
        {state.step === 5 && service && (
          <StepAddOns state={state} dispatch={dispatch} />
        )}
        {state.step === 6 && location && service && (
          <StepSummary state={state} dispatch={dispatch} />
        )}
        {state.step === 7 && state.booking && <StepConfirmation booking={state.booking} />}
      </div>

      {state.step > 1 && state.step < 7 && (
        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: "goto", step: state.step - 1 })}
          >
            ← Tilbake
          </Button>
        </div>
      )}
    </div>
  );
}

function Stepper({
  currentStep,
  maxReachable,
  onNavigate,
}: {
  currentStep: number;
  maxReachable: number;
  onNavigate: (step: number) => void;
}) {
  return (
    <nav aria-label="Bestillingssteg" className="mt-5">
      <ol className="flex gap-1.5">
        {STEP_LABELS.map((label, index) => {
          const step = index + 1;
          const isCurrent = step === currentStep;
          const isDone = step < currentStep;
          const clickable = step <= maxReachable && step !== currentStep && currentStep < 7;
          return (
            <li key={label} className="flex-1">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onNavigate(step)}
                aria-current={isCurrent ? "step" : undefined}
                className={`block h-1.5 w-full rounded-full transition-colors ${
                  isCurrent || isDone ? "bg-accent" : "bg-border"
                } ${clickable ? "cursor-pointer hover:bg-accent-strong" : ""}`}
                title={`${step}. ${label}`}
              >
                <span className="sr-only">
                  Steg {step}: {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-sm text-muted">
        Steg {Math.min(currentStep, 7)} av 7 · {STEP_LABELS[currentStep - 1]}
      </p>
    </nav>
  );
}

/* Steg 1 — avdeling */
function StepLocation({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (locationId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [locating, setLocating] = useState(false);

  // FR-2.1 steg 1: et søk sorterer etter nærhet i stedet for å tømme lista.
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
    <section aria-label="Velg avdeling">
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Søk på by eller postnummer"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base placeholder:text-muted/60 focus:border-accent focus:outline-none"
        />
        <Button
          variant="secondary"
          className="shrink-0 !px-4"
          disabled={locating}
          onClick={handleLocate}
        >
          {locating ? "Finner…" : "📍 Nær meg"}
        </Button>
      </div>
      {ranking.note && (
        <p className="mt-2 text-sm text-muted">{ranking.note}</p>
      )}
      <ul className="mt-4 space-y-2">
        {ranking.results.map((location) => (
          <li key={location.id}>
            <button
              type="button"
              onClick={() => onSelect(location.id)}
              className={`w-full rounded-xl border p-4 text-left transition-colors hover:border-accent ${
                selectedId === location.id
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface"
              }`}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">Handz On {location.name}</span>
                {ranking.showDistance && "distanceKm" in location && (
                  <span className="shrink-0 text-sm text-accent">
                    {formatDistance(location.distanceKm as number)}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-sm text-muted">
                {location.address}, {location.postalCode} {location.city}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Steg 2 — registreringsnummer (FR-2.1.2, NFR-3) */
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
      // SVV nede: manuell inntasting tar over (NFR-3).
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
    <section aria-label="Registreringsnummer">
      <label className="block">
        <span className="text-sm font-semibold">Bilens registreringsnummer</span>
        <input
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
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-4 text-center font-mono text-2xl uppercase tracking-[0.3em] placeholder:text-muted/40 focus:border-accent focus:outline-none"
        />
      </label>
      <p className="mt-2 text-sm text-muted">
        Vi henter bilens merke og modell fra Statens vegvesen. To bokstaver og
        fem sifre, f.eks. EB12345.
      </p>

      {status !== "found" && (
        <Button
          fullWidth
          className="mt-4"
          disabled={!valid || status === "loading"}
          onClick={handleLookup}
        >
          {status === "loading" ? "Slår opp…" : "Hent bilinfo"}
        </Button>
      )}

      {status === "found" && state.vehicle && (
        <>
          <Card className="mt-4 border-accent/40">
            <p className="text-sm text-muted">Vi fant bilen din:</p>
            <p className="mt-1 text-lg font-semibold">
              {state.vehicle.make} {state.vehicle.model}
              {state.vehicle.year ? ` (${state.vehicle.year})` : ""}
            </p>
            {state.vehicle.fuel && (
              <p className="text-sm text-muted">
                {state.vehicle.fuel} · {state.vehicle.color}
              </p>
            )}
          </Card>
          <Button
            fullWidth
            className="mt-4"
            onClick={() => dispatch({ type: "goto", step: 3 })}
          >
            Dette stemmer — gå videre
          </Button>
        </>
      )}

      {status === "error" && (
        <Card className="mt-4 border-danger/40">
          <p className="text-sm">
            Vi fikk ikke svar fra motorvognregisteret. Fyll inn bilinfo manuelt,
            så går bestillingen like fint.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input
              type="text"
              value={manualMake}
              onChange={(event) => setManualMake(event.target.value)}
              placeholder="Merke"
              className="rounded-xl border border-border bg-surface px-3 py-2.5 focus:border-accent focus:outline-none"
            />
            <input
              type="text"
              value={manualModel}
              onChange={(event) => setManualModel(event.target.value)}
              placeholder="Modell"
              className="rounded-xl border border-border bg-surface px-3 py-2.5 focus:border-accent focus:outline-none"
            />
          </div>
          <Button fullWidth className="mt-3" disabled={!valid} onClick={handleManualContinue}>
            Fortsett uten oppslag
          </Button>
        </Card>
      )}
    </section>
  );
}

/* Steg 3 — tjeneste (FR-5.2: lokal pris · FR-2.2: medlemspris) */
function StepService({
  locationId,
  selectedId,
  member,
  onVippsLogin,
  onSelect,
}: {
  locationId: string;
  selectedId: string | null;
  member: boolean;
  onVippsLogin: () => void;
  onSelect: (serviceId: string) => void;
}) {
  const categories = [...new Set(services.map((service) => service.category))];
  return (
    <section aria-label="Velg tjeneste" className="space-y-6">
      {member ? (
        <Card className="border-accent/40 bg-accent/10 !py-3 text-sm">
          Kundeklubb-medlem — medlemsprisene under er oppdatert automatisk.
        </Card>
      ) : (
        <Card className="flex items-center justify-between gap-3 !py-3">
          <p className="text-sm text-muted">
            Medlem i kundeklubben? Logg inn, så oppdateres prisene automatisk.
          </p>
          <Button variant="vipps" className="!min-h-10 shrink-0 !px-4 text-sm" onClick={onVippsLogin}>
            Logg inn med Vipps
          </Button>
        </Card>
      )}
      {categories.map((category) => {
        const items = services.filter(
          (service) =>
            service.category === category && isServiceAvailable(service.id, locationId),
        );
        if (items.length === 0) return null;
        return (
          <div key={category}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              {category}
            </h2>
            <ul className="mt-2 space-y-2">
              {items.map((service) => {
                const price = getEffectivePrice(service.id, locationId);
                const memberPrice =
                  price - Math.round((price * MEMBER_DISCOUNT_RATE) / 100) * 100;
                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(service.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-colors hover:border-accent ${
                        selectedId === service.id
                          ? "border-accent bg-accent/10"
                          : "border-border bg-surface"
                      }`}
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold">{service.name}</span>
                        {member ? (
                          <span className="shrink-0 text-right">
                            <span className="block text-xs text-muted line-through">
                              {formatOre(price)}
                            </span>
                            <span className="font-bold text-accent">
                              {formatOre(memberPrice)}
                            </span>
                          </span>
                        ) : (
                          <span className="shrink-0 font-bold">{formatOre(price)}</span>
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {service.description}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        Varighet ca. {formatDuration(service.durationMin)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

/* Steg 4 — tidspunkt (FR-2.1 steg 4) */
function StepTime({
  state,
  dispatch,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}) {
  const [days, setDays] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(state.date);
  const [slotsByDay, setSlotsByDay] = useState<Record<string, TimeSlot[]>>({});

  // Datoene beregnes på klienten (i en mikrotask) for å unngå
  // SSR-/hydreringsavvik rundt «i dag».
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const today = new Date();
      const upcoming: string[] = [];
      for (let offset = 1; offset <= 14; offset += 1) {
        const day = new Date(today);
        day.setDate(today.getDate() + offset);
        upcoming.push(day.toISOString().slice(0, 10));
      }
      setDays(upcoming);
      setSelectedDay((current) => current ?? upcoming[0]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedDay || !state.locationId || !state.serviceId) return;
    let cancelled = false;
    bookingAdapter
      .getAvailableSlots(state.locationId, state.serviceId, [], selectedDay)
      .then((result) => {
        if (!cancelled) {
          setSlotsByDay((cache) => ({ ...cache, [selectedDay]: result }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDay, state.locationId, state.serviceId]);

  const slots = selectedDay ? (slotsByDay[selectedDay] ?? null) : null;

  return (
    <section aria-label="Velg tidspunkt">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Velg dag
      </h2>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedDay === day
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border bg-surface text-muted hover:border-accent"
            }`}
          >
            {formatIsoDateShort(day)}
          </button>
        ))}
      </div>

      <h2 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted">
        Ledige tider{selectedDay ? ` ${formatIsoDate(selectedDay)}` : ""}
      </h2>
      {slots === null ? (
        <p className="mt-3 text-sm text-muted">Henter ledige tider…</p>
      ) : slots.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Ingen ledige tider denne dagen — prøv en annen dag.
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((slot) => (
            <li key={slot.time}>
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: "selectSlot", date: slot.date, time: slot.time })
                }
                className={`w-full rounded-xl border px-2 py-3 font-semibold transition-colors hover:border-accent ${
                  state.date === slot.date && state.time === slot.time
                    ? "border-accent bg-accent/10"
                    : "border-border bg-surface"
                }`}
              >
                {slot.time}
                <span className="block text-[11px] font-normal text-muted">
                  {slot.capacityLeft === 1 ? "1 plass igjen" : `${slot.capacityLeft} plasser`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* Steg 5 — tilleggstjenester («ofte valgt sammen», FR-3.2) */
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
    <section aria-label="Tilleggstjenester">
      <p className="text-sm text-muted">
        Gjør det skikkelig når bilen først er inne — dette velger andre kunder
        sammen med tjenesten din.
      </p>
      <ul className="mt-4 space-y-2">
        {sorted.map((addOn) => {
          const selected = state.addOnIds.includes(addOn.id);
          const recommended = recommendedIds.includes(addOn.id);
          return (
            <li key={addOn.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => dispatch({ type: "toggleAddOn", addOnId: addOn.id })}
                className={`w-full rounded-xl border p-4 text-left transition-colors hover:border-accent ${
                  selected ? "border-accent bg-accent/10" : "border-border bg-surface"
                }`}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">
                    {addOn.name}
                    {recommended && <Badge className="ml-2 align-middle">Ofte valgt sammen</Badge>}
                  </span>
                  <span className="shrink-0 font-bold">+ {formatOre(addOn.priceOre)}</span>
                </span>
                <span className="mt-1 block text-sm text-muted">{addOn.description}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <Button fullWidth className="mt-5" onClick={() => dispatch({ type: "goto", step: 6 })}>
        {state.addOnIds.length > 0
          ? `Gå videre med ${state.addOnIds.length} tillegg`
          : "Gå videre uten tillegg"}
      </Button>
    </section>
  );
}

/* Steg 6 — oppsummering med mva-spesifikasjon (FR-2.1 steg 6, T-1) */
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
    <section aria-label="Oppsummering" className="space-y-4">
      <Card>
        <h2 className="font-semibold">Din bestilling</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Avdeling</dt>
            <dd className="text-right">
              Handz On {location.name}
              <span className="block text-xs text-muted">
                {location.address}, {location.postalCode} {location.city}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Bil</dt>
            <dd className="text-right">
              {state.vehicle
                ? `${state.vehicle.make} ${state.vehicle.model}`.trim()
                : "—"}
              <span className="block font-mono text-xs text-muted">{state.regNr}</span>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Tidspunkt</dt>
            <dd className="text-right">
              {state.date ? formatIsoDate(state.date) : ""} kl. {state.time}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="font-semibold">Prisspesifikasjon</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>{service.name}</dt>
            <dd>{formatOre(servicePrice)}</dd>
          </div>
          {chosenAddOns.map((addOn) => (
            <div key={addOn.id} className="flex justify-between gap-4">
              <dt>{addOn.name}</dt>
              <dd>{formatOre(addOn.priceOre)}</dd>
            </div>
          ))}
          {memberDiscountOre > 0 && (
            <div className="flex justify-between gap-4 text-accent">
              <dt>Kundeklubb-rabatt (10 %)</dt>
              <dd>− {formatOre(memberDiscountOre)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-t border-border pt-2 text-muted">
            <dt>Herav mva. (25 %)</dt>
            <dd>{formatOreExact(vatOre)}</dd>
          </div>
          <div className="flex justify-between gap-4 text-base font-bold">
            <dt>Å betale ved henting</dt>
            <dd>{formatOre(totalOre)}</dd>
          </div>
        </dl>
        {organization && (
          <p className="mt-3 text-xs text-muted">
            Selger: {organization.legalName}, org.nr {formatOrgNr(organization.orgNr)}.
            Kvittering med full spesifikasjon sendes på e-post og finnes på Min side.
          </p>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold">Kontaktinfo</h2>
        <p className="mt-1 text-sm text-muted">
          Vi sender bekreftelse og påminnelse på SMS.
        </p>
        <div className="mt-3 space-y-3">
          <input
            type="text"
            autoComplete="name"
            value={state.contact.name}
            onChange={(event) =>
              dispatch({ type: "setContact", contact: { name: event.target.value } })
            }
            placeholder="Navn"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 focus:border-accent focus:outline-none"
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
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 focus:border-accent focus:outline-none"
          />
          {!state.member && (
            <Button
              variant="vipps"
              fullWidth
              onClick={() => dispatch({ type: "vippsLogin" })}
            >
              Fyll ut med Vipps
            </Button>
          )}
        </div>
      </Card>

      <Button fullWidth disabled={!contactValid || submitting} onClick={handleConfirm}>
        {submitting ? "Bekrefter…" : `Bekreft bestilling – ${formatOre(totalOre)}`}
      </Button>
      <p className="text-center text-xs text-muted">
        Gratis avbestilling frem til 24 timer før avtalt tid.
      </p>
    </section>
  );
}

/* Steg 7 — bekreftelse */
function StepConfirmation({ booking }: { booking: Booking }) {
  const location = locations.find((item) => item.id === booking.locationId);
  const service = services.find((item) => item.id === booking.serviceId);
  const chosenAddOns = addOns.filter((addOn) => booking.addOnIds.includes(addOn.id));

  return (
    <section aria-label="Bekreftelse" className="space-y-4">
      <Card className="border-success/40 text-center">
        <p aria-hidden className="text-4xl">✓</p>
        <p className="mt-2 text-lg font-semibold">Bestillingen er bekreftet</p>
        <p className="mt-1 text-sm text-muted">
          Referanse <span className="font-mono font-semibold text-foreground">{booking.reference}</span>
        </p>
      </Card>

      <Card>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Tjeneste</dt>
            <dd>
              {service?.name}
              {chosenAddOns.length > 0 && (
                <span className="block text-xs text-muted">
                  + {chosenAddOns.map((addOn) => addOn.name).join(", ")}
                </span>
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Tidspunkt</dt>
            <dd>
              {formatIsoDate(booking.date)} kl. {booking.time}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Avdeling</dt>
            <dd className="text-right">
              Handz On {location?.name}
              <span className="block text-xs text-muted">
                {location?.address}, {location?.postalCode} {location?.city}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Bil</dt>
            <dd className="font-mono">{booking.regNr}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-2 font-bold">
            <dt>Å betale</dt>
            <dd>{formatOre(booking.totalOre)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted">
          Utstedes av org.nr {formatOrgNr(booking.orgNr)}. Du får SMS-bekreftelse
          nå og en påminnelse dagen før. Kvitteringen legges på Min side etter
          utført behandling.
        </p>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => {
            window.location.href = "/min-side";
          }}
        >
          Gå til Min side
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Til forsiden
        </Button>
      </div>
    </section>
  );
}
