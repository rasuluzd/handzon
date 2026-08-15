"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, Tick } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tag } from "@/components/ui/Tag";
import { VippsButton } from "@/components/ui/VippsButton";
import { StepProgress } from "@/components/booking/StepProgress";
import { OptionRow } from "@/components/booking/OptionRow";
import { useCountUp } from "@/components/booking/use-count-up";
import { OpenStatus } from "@/components/site/OpenStatus";
import { bookingAdapter, MEMBER_DISCOUNT_RATE } from "@/lib/booking-adapter";
import { formatDistance, getBrowserPosition, rankLocations } from "@/lib/geo";
import type { GeoPoint } from "@/lib/geo";
import {
  formatDayParts,
  formatDayRange,
  formatDuration,
  formatIsoDate,
  formatIsoDateLower,
  formatKr,
  formatKrExact,
  formatKrPlain,
  formatOrgNr,
} from "@/lib/format";
import { hoursForDay, weekdayIndex } from "@/lib/opening-hours";
import {
  addOnAffinity,
  addOns,
  getEffectivePrice,
  getOrganization,
  isServiceAvailable,
  locations,
  serviceCategories,
  services,
} from "@/lib/mock-data";
import { getServiceImage } from "@/lib/service-images";
import { isValidRegNr, lookupVehicle, normalizeRegNr } from "@/lib/vehicle-lookup";
import { downloadReceiptPdf } from "@/lib/receipt";
import type { ReceiptLine } from "@/lib/receipt";
import type { Booking, TimeSlot, Vehicle } from "@/lib/types";
import logo from "@/public/logo-original.webp";
import logoWhite from "@/public/logo-white.png";

/**
 * 7-stegs lukket bookingtrakt (FR-2.1), utformet etter SCREENS.md § Booking.
 * All tilstand ligger i én reducer, så tilbake-navigasjon aldri mister data.
 * UI-koden kjenner kun BookingAdapter-grensesnittet (spor A/B-uavhengig).
 *
 * Header og footer er skjult gjennom hele flyten — ingenting skal konkurrere
 * med steget.
 */

const PAD = "px-[clamp(16px,4vw,40px)]";

interface WizardState {
  step: number;
  locationId: string | null;
  regNr: string;
  vehicle: Vehicle | null;
  serviceId: string | null;
  date: string | null;
  time: string | null;
  addOnIds: string[];
  contact: { name: string; phone: string };
  member: boolean;
  /** True mens man redigerer ett valg fra oppsummeringen (steg 6). */
  editing: boolean;
  booking: Booking | null;
}

type WizardAction =
  | { type: "goto"; step: number }
  | { type: "edit"; step: number }
  | { type: "vippsLogin" }
  | { type: "selectLocation"; locationId: string }
  | { type: "setRegNr"; regNr: string }
  | { type: "setVehicle"; vehicle: Vehicle | null }
  | { type: "continue" }
  | { type: "selectService"; serviceId: string }
  | { type: "selectSlot"; date: string; time: string }
  | { type: "toggleAddOn"; addOnId: string }
  | { type: "setContact"; contact: Partial<WizardState["contact"]> }
  | { type: "confirmed"; booking: Booking };

/**
 * Ved redigering fra oppsummeringen: hopp tilbake til oppsummeringen (steg 6) så
 * snart alt er utfylt. Er noe blitt ugyldig av endringen (f.eks. ny avdeling
 * nullstiller tidspunktet), rutes man til første steg som mangler data — og
 * ender på oppsummeringen igjen når det er fylt ut.
 */
function routeAfterEdit(state: WizardState): number {
  if (!state.locationId) return 1;
  if (!isValidRegNr(state.regNr) || !state.vehicle) return 2;
  if (!state.serviceId || !isServiceAvailable(state.serviceId, state.locationId)) return 3;
  if (!state.date || !state.time) return 4;
  return 6;
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "goto":
      return { ...state, step: action.step, editing: false };
    case "edit":
      return { ...state, editing: true, step: action.step };
    case "vippsLogin":
      return {
        ...state,
        member: true,
        contact: {
          name: state.contact.name || "Kari Nordmann",
          phone: state.contact.phone || "912 34 567",
        },
      };
    /* Valgene endrer bare tilstanden. Selve stegskiftet skjer først når man
       trykker «Gå videre» — et feilklikk skal aldri kaste deg videre. */
    case "selectLocation": {
      const changed = state.locationId !== action.locationId;
      const serviceStillAvailable = state.serviceId
        ? isServiceAvailable(state.serviceId, action.locationId)
        : true;
      return {
        ...state,
        locationId: action.locationId,
        date: changed ? null : state.date,
        time: changed ? null : state.time,
        serviceId: serviceStillAvailable ? state.serviceId : null,
      };
    }
    case "setRegNr":
      return { ...state, regNr: action.regNr, vehicle: null };
    case "setVehicle":
      return { ...state, vehicle: action.vehicle };
    case "continue": {
      if (state.editing) {
        const step = routeAfterEdit(state);
        return { ...state, step, editing: step !== 6 };
      }
      return { ...state, step: Math.min(7, state.step + 1) };
    }
    case "selectService": {
      const changed = state.serviceId !== action.serviceId;
      return {
        ...state,
        serviceId: action.serviceId,
        date: changed ? null : state.date,
        time: changed ? null : state.time,
      };
    }
    case "selectSlot":
      return { ...state, date: action.date, time: action.time };
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
  /** «Endre tid» fra Min side: forhåndsutfylt regnr. */
  initialRegNr?: string;
  /** «Endre tid» fra Min side: start på tidspunkt-steget (4). */
  initialStep?: number;
}

export function BookingWizard({
  initialLocationId,
  initialServiceId,
  initialRegNr,
  initialStep,
}: BookingWizardProps) {
  const [state, dispatch] = useReducer(reducer, {
    step: initialStep ?? (initialLocationId ? 2 : 1),
    locationId: initialLocationId,
    regNr: initialRegNr ? normalizeRegNr(initialRegNr) : "",
    vehicle: null,
    serviceId: initialServiceId,
    date: null,
    time: null,
    addOnIds: [],
    contact: { name: "", phone: "" },
    member: false,
    editing: false,
    booking: null,
  });

  // «Endre tid» fra Min side: slå opp bilen så oppsummeringen viser merke/modell.
  useEffect(() => {
    if (initialRegNr) {
      lookupVehicle(initialRegNr).then((vehicle) => {
        if (vehicle) dispatch({ type: "setVehicle", vehicle });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flytt fokus til nytt stegs overskrift, og rull til toppen av steget.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [state.step]);

  /* Retningsbevisst stegskifte: framover glir inn fra høyre, tilbake fra
     venstre (MOTION.md § Bookingsteg). */
  const prevStep = useRef(state.step);
  const direction = state.step >= prevStep.current ? "hz-fwd" : "hz-back";
  useEffect(() => {
    prevStep.current = state.step;
  }, [state.step]);

  const location = locations.find((item) => item.id === state.locationId) ?? null;
  const service = services.find((item) => item.id === state.serviceId) ?? null;
  const backVisible = state.step > 1 && state.step < 7;

  /* Bekreftelsen på steg 6 bor her og ikke i StepSummary, slik at den sticky
     baren kan utløse den. Knappen er aldri `disabled`: en avslått knapp sluker
     trykket helt på touch — ingen click, ingen :active, ingen forklaring — og
     hjelpeteksten lå under knappen, altså utenfor skjerm i det man trykket.
     Nå sender et trykk deg til feltet som mangler. */
  const [submitting, setSubmitting] = useState(false);
  const [contactTouched, setContactTouched] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const contactValid =
    state.contact.name.trim().length > 1 &&
    state.contact.phone.replace(/\s/g, "").length >= 8;

  async function handleConfirm() {
    if (!contactValid) {
      setContactTouched(true);
      const target =
        state.contact.name.trim().length > 1 ? phoneRef.current : nameRef.current;
      target?.scrollIntoView({ block: "center", behavior: "smooth" });
      target?.focus({ preventScroll: true });
      return;
    }
    setSubmitting(true);
    const booking = await bookingAdapter.createBooking({
      locationId: state.locationId!,
      regNr: state.regNr,
      vehicle: state.vehicle,
      serviceId: state.serviceId!,
      addOnIds: state.addOnIds,
      date: state.date!,
      time: state.time!,
      contact: state.contact,
      member: state.member,
    });
    dispatch({ type: "confirmed", booking });
  }

  /* Steg 1, 3, 4 og 6 bekreftes i en sticky bar som reiser seg så snart du har
     valgt noe — den blir liggende i syne, så du slipper å rulle for å komme
     videre. Steg 5 har sin egen bar med løpende sum.

     Beløpet står i baren fra og med steg 3. Før lå prisen bare i tjenesteraden
     du nettopp rullet forbi, og dukket først opp igjen på steg 5 — sammen med
     et mersalg. Prisen er det siste kunden vurderer på; den skal være synlig. */
  const stepPrice =
    location && service
      ? bookingAdapter.calculateTotal(location.id, service.id, state.addOnIds, {
          member: state.member,
        }).totalOre
      : 0;

  const confirm =
    state.step === 1 && location
      ? { label: "Valgt avdeling", value: `Handz On ${location.name}`, amount: undefined }
      : state.step === 3 && service && location
        ? {
            label: "Valgt tjeneste",
            value: service.name,
            amount: formatKr(
              bookingAdapter.calculateTotal(location.id, service.id, [], {
                member: state.member,
              }).totalOre,
            ),
          }
        : state.step === 4 && state.date && state.time
          ? {
              label: "Valgt tidspunkt",
              value: `${formatIsoDate(state.date)} kl. ${state.time}`,
              amount: formatKr(stepPrice),
            }
          : null;
  const sticky =
    state.step === 5 || state.step === 6 || state.step === 7 || confirm !== null;

  return (
    /* `flex flex-col` + `flex-1` på innholdet presser bunnbaren ned til
       viewportkanten når steget er kortere enn skjermen. Med ren `sticky`
       fløt baren midt på skjermen på korte steg — den så ut som en feil.
       `min-h-dvh` i stedet for `min-h-screen`: 100vh er høyere enn den
       synlige flaten på mobil når adresselinja vises, og ga falsk rulling. */
    <div className="mx-auto flex min-h-dvh max-w-[720px] flex-col bg-surface">
      {/* Sticky chrome: tilbake, logo, avbryt, progresjon.
          Helt ugjennomsiktig: bakgrunnen var allerede 95 % hvit, så blur-en
          var visuelt et null-op — men den kostet en uskarphetspass på 390px
          bredde i hver eneste rullefreme, gjennom hele trakten. */}
      <div className={`sticky top-0 z-40 border-b border-line bg-surface pb-3 pt-2 ${PAD}`}>
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => backVisible && dispatch({ type: "goto", step: state.step - 1 })}
            className={`-m-2 inline-flex min-h-[44px] items-center p-2 text-[15px] text-body-soft hover:text-navy ${backVisible ? "" : "invisible"}`}
          >
            ← Tilbake
          </button>
          <Image src={logo} alt="Handz On Auto Care" className="h-[26px] w-auto" preload />
          <Link
            href="/"
            className="-m-2 inline-flex min-h-[44px] items-center p-2 text-[15px] text-body-soft hover:text-navy"
          >
            {state.step === 7 ? "Lukk" : "Avbryt"}
          </Link>
        </div>
        <StepProgress step={state.step} />
      </div>

      <div className={`flex-1 pt-[clamp(20px,3.4vw,36px)] ${PAD} ${sticky ? "pb-24" : "pb-10"}`}>
        {/* Retningsanimasjonen ligger på stegoverskriften, ikke på hele steget:
            steg 3 er et deltre på flere tusen piksler med atten bilder, og en
            transform over hele det treet ga en garantert lang paint akkurat
            der brukeren venter. Resten toner inn uten forskyvning. */}
        <div key={state.step}>
          {state.step === 1 && (
            <StepLocation
              state={state}
              dispatch={dispatch}
              headingRef={headingRef}
              direction={direction}
            />
          )}
          {state.step === 2 && (
            <StepVehicle
              state={state}
              dispatch={dispatch}
              headingRef={headingRef}
              direction={direction}
            />
          )}
          {state.step === 3 && location && (
            <StepService
              state={state}
              dispatch={dispatch}
              headingRef={headingRef}
              direction={direction}
            />
          )}
          {state.step === 4 && location && service && (
            <StepTime
              state={state}
              dispatch={dispatch}
              headingRef={headingRef}
              direction={direction}
            />
          )}
          {state.step === 5 && service && (
            <StepAddOns
              state={state}
              dispatch={dispatch}
              headingRef={headingRef}
              direction={direction}
            />
          )}
          {state.step === 6 && location && service && (
            <StepSummary
              state={state}
              dispatch={dispatch}
              headingRef={headingRef}
              direction={direction}
              nameRef={nameRef}
              phoneRef={phoneRef}
              contactTouched={contactTouched}
              contactValid={contactValid}
            />
          )}
          {state.step === 7 && state.booking && (
            <StepConfirmation
              booking={state.booking}
              headingRef={headingRef}
              direction={direction}
            />
          )}
        </div>
      </div>

      {confirm && (
        <BottomBar
          label={confirm.label}
          value={confirm.value}
          amount={confirm.amount}
          action={
            <Button
              className="shrink-0 hz:min-h-[54px] hz:px-[30px]"
              onClick={() => dispatch({ type: "continue" })}
            >
              {state.editing ? "Til oppsummering" : "Gå videre"}
            </Button>
          }
        />
      )}

      {state.step === 5 && service && state.locationId && (
        <AddOnBar state={state} dispatch={dispatch} serviceName={service.name} />
      )}

      {/* Bekreftelsessiden får samme bunnbar som resten av trakten. De to
          tingene folk faktisk vil gjøre etterpå — hente bekreftelsen og se
          bestillingen — lå nederst under et helt oppsummeringskort. */}
      {state.step === 7 && state.booking && (
        <BottomBar
          compact
          label="Referanse"
          value={state.booking.reference}
          action={
            <div className="flex flex-1 gap-2 hz:flex-none">
              <Button
                variant="secondary"
                className="flex-1 hz:flex-none"
                onClick={() => state.booking && downloadReceipt(state.booking)}
              >
                Last ned PDF
              </Button>
              <ButtonLink href="/min-side" className="flex-1 hz:flex-none">
                Se på Min side
              </ButtonLink>
            </div>
          }
        />
      )}

      {state.step === 6 && location && service && (
        <BottomBar
          compact
          label="Å betale ved henting"
          value="Du betaler i avdelingen"
          amount={formatKr(stepPrice)}
          action={
            <Button
              className="shrink-0 hz:min-h-[54px] hz:px-[30px]"
              loading={submitting}
              onClick={handleConfirm}
            >
              Bekreft bestilling
            </Button>
          }
        />
      )}
    </div>
  );
}

/**
 * Sticky bunnbar for hele trakten — én rad, også på mobil.
 *
 * Før brakk knappen til egen linje (`max-hz:w-full` i en `flex-wrap`-rad) og
 * baren ble 139px høy. En permanent CTA er riktig; å bruke en sjettedel av
 * skjermen på den i en liste man skal velge fra er det ikke. Nå er baren 71px.
 */
function BottomBar({
  label,
  value,
  amount,
  action,
  compact,
}: {
  label: string;
  value: string;
  amount?: string;
  action: ReactNode;
  /** Skjuler tekstblokka under 900px når knappeteksten trenger plassen. */
  compact?: boolean;
}) {
  return (
    <div
      className={`hz-rise sticky bottom-0 z-30 border-t border-line bg-surface pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-sticky ${PAD}`}
    >
      <div className="mx-auto flex max-w-[720px] items-center gap-3">
        <div className={`min-w-0 flex-1 ${compact ? "max-hz:hidden" : ""}`}>
          <p className="truncate text-[12px] text-body-soft">{label}</p>
          <p className="mt-0.5 truncate font-heading text-[14.5px] font-semibold text-ink hz:text-[15.5px]">
            {value}
          </p>
        </div>
        {amount && (
          <span className={`shrink-0 text-right ${compact ? "max-hz:flex-1 max-hz:text-left" : ""}`}>
            <span className="block font-heading text-[19px] font-bold leading-none tabular text-ink hz:text-[23px]">
              {amount}
            </span>
            <span className="mt-0.5 block text-[11px] text-body-soft hz:text-[12.5px]">
              inkl. mva
            </span>
          </span>
        )}
        {action}
      </div>
    </div>
  );
}

/**
 * Sticky bunnbar på steg 5. Baren reiser seg når den monteres, og summen
 * teller opp eller ned når et tillegg hukes av (MOTION.md).
 */
function AddOnBar({
  state,
  dispatch,
  serviceName,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  serviceName: string;
}) {
  const { totalOre } = bookingAdapter.calculateTotal(
    state.locationId!,
    state.serviceId!,
    state.addOnIds,
    { member: state.member },
  );
  const shown = useCountUp(totalOre);

  return (
    <BottomBar
      label={serviceName}
      value={
        state.addOnIds.length > 0
          ? `${state.addOnIds.length} tillegg valgt`
          : "Ingen tillegg"
      }
      amount={formatKr(shown)}
      action={
        <Button
          className="shrink-0 hz:min-h-[54px] hz:px-[30px]"
          onClick={() => dispatch({ type: "goto", step: 6 })}
        >
          Gå videre
        </Button>
      }
    />
  );
}

type HeadingRef = React.RefObject<HTMLHeadingElement | null>;

interface StepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  headingRef: HeadingRef;
  /** `hz-fwd` / `hz-back` — animasjonsklassen for retningsbevisst stegskifte. */
  direction: string;
}

function StepHead({
  title,
  help,
  headingRef,
  direction,
}: {
  title: string;
  help?: string;
  headingRef: HeadingRef;
  direction: string;
}) {
  return (
    <div className={`mb-4 hz:mb-5 ${direction}`}>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-heading text-[clamp(24px,3.6vw,34px)] font-bold leading-[1.1] tracking-[-.024em] text-ink outline-none hz:leading-[1.08]"
      >
        {title}
      </h1>
      {help && (
        <p className="mt-1.5 text-[14.5px] leading-[1.45] text-body-soft hz:mt-2 hz:text-[16px]">
          {help}
        </p>
      )}
    </div>
  );
}

/* ---------- Steg 1: avdeling ---------- */
function StepLocation({ state, dispatch, headingRef, direction }: StepProps) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [locating, setLocating] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const ranking = useMemo(
    () => rankLocations(locations, query, position),
    [query, position],
  );

  /* Søker eller geolokaliserer man, er hele lista allerede relevant. Ellers
     vises fem — fjorten kort à ~110px er 1500px rulling på steget FØR man har
     sett en eneste pris, og en bruker i Bergen må forbi elleve Østlands-
     avdelinger for å finne sin egen. */
  const filtered = Boolean(query.trim()) || position !== null;
  const shown = filtered || showAll ? ranking.results : ranking.results.slice(0, 5);
  const hidden = ranking.results.length - shown.length;

  async function handleLocate() {
    setLocating(true);
    setPosition(await getBrowserPosition());
    setQuery("");
    setLocating(false);
  }

  return (
    <div>
      <StepHead
        title="Velg avdeling"
        help="Der du leverer og henter bilen."
        headingRef={headingRef}
        direction={direction}
      />
      <div className="mb-2.5 flex flex-wrap gap-2.5">
        <label className="relative block flex-1 max-hz:w-full max-hz:flex-none">
          <span className="sr-only">Søk etter avdeling</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute left-[14px] top-1/2 size-[18px] -translate-y-1/2 text-muted"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPosition(null);
            }}
            placeholder="By eller postnummer"
            className="min-h-[46px] w-full rounded-control border border-line-heavy bg-surface py-[11px] pl-11 pr-3.5 text-[16px] text-ink outline-none focus:border-navy focus:shadow-[0_0_0_3px_var(--color-navy-14)]"
          />
        </label>
        <Button
          variant="secondary"
          onClick={handleLocate}
          loading={locating}
          className="max-hz:w-full"
        >
          <MapPin aria-hidden className="size-4" strokeWidth={1.75} />
          Nær meg
        </Button>
      </div>
      <p aria-live="polite" className="mb-3 text-[13.5px] text-body-soft">
        {ranking.note}
      </p>

      <div className="flex flex-col gap-2.5">
        {shown.map((item) => {
          const selected = state.locationId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => dispatch({ type: "selectLocation", locationId: item.id })}
              className={`w-full cursor-pointer rounded-card bg-surface text-left transition-[border-color,background-color] duration-[120ms] ease-standard ${
                selected
                  ? "border-2 border-navy bg-navy-06 p-[13px] hz:p-[19px]"
                  : "border border-line-strong p-3.5 hover:border-navy hover:bg-navy-06 hz:p-5"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="font-heading text-[17px] font-semibold leading-tight text-ink hz:text-[18px]">
                    Handz On {item.name}
                    {ranking.showDistance && item.distanceKm !== undefined && (
                      <span className="ml-2.5 text-[14px] font-normal tabular text-navy">
                        {formatDistance(item.distanceKm)}
                      </span>
                    )}
                  </span>
                  {/* Gateadressen er utelatt på mobil: den hjelper ikke med å
                      velge avdeling, bare med å kjøre dit — og den kostet en
                      hel ekstra linje per kort på fjorten kort. */}
                  <span className="mt-1 block text-[13.5px] leading-[1.35] text-body-soft hz:text-[14px]">
                    {item.center}
                    <span className="max-hz:hidden"> · {item.address}</span>
                    {`, ${item.postalCode} ${item.city}`}
                  </span>
                  <span className="mt-2 flex min-h-[26px] flex-wrap items-center gap-2 hz:mt-3">
                    <OpenStatus hours={item.openingHours} />
                    {item.campaign && (
                      <Tag className="whitespace-normal text-left">{item.campaign}</Tag>
                    )}
                  </span>
                </span>
                <Tick on={selected} />
              </span>
            </button>
          );
        })}
      </div>

      {hidden > 0 && (
        <Button
          variant="secondary"
          block
          className="mt-2.5"
          onClick={() => setShowAll(true)}
        >
          Vis alle {ranking.results.length} avdelinger
        </Button>
      )}
    </div>
  );
}

/* ---------- Steg 2: bilen din ---------- */
function StepVehicle({ state, dispatch, headingRef, direction }: StepProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">(
    state.vehicle ? "found" : "idle",
  );
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const valid = isValidRegNr(state.regNr);

  async function handleLookup() {
    setStatus("loading");
    const vehicle = await lookupVehicle(state.regNr);
    if (vehicle) {
      dispatch({ type: "setVehicle", vehicle });
      setStatus("found");
    } else {
      setStatus("error");
    }
  }

  return (
    <div>
      <StepHead
        title="Bilen din"
        help="Vi henter merke og modell fra Statens vegvesen."
        headingRef={headingRef}
        direction={direction}
      />
      <label
        htmlFor="regnr"
        className="mb-[7px] block font-heading text-[13px] font-semibold text-body-strong"
      >
        Registreringsnummer
      </label>
      {/* Feltet ligger i et skjema slik at Enter/Go på mobiltastaturet gjør
          oppslaget. Uten det måtte man lukke tastaturet for å nå knappen, som
          på små skjermer lå bak tastaturet. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (valid && status !== "loading") void handleLookup();
        }}
      >
        <input
          id="regnr"
          type="text"
          inputMode="text"
          enterKeyHint="go"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={7}
          value={state.regNr}
          onChange={(event) => {
            setStatus("idle");
            dispatch({ type: "setRegNr", regNr: normalizeRegNr(event.target.value) });
          }}
          placeholder="EB12345"
          className={`w-full rounded-card border-[1.5px] bg-surface px-3 py-4 text-center font-heading text-[26px] font-bold uppercase tracking-[.22em] tabular text-ink outline-none indent-[.22em] placeholder:text-neutral-300 focus:border-navy focus:shadow-[0_0_0_3px_var(--color-navy-14)] hz:py-[18px] hz:text-[30px] hz:tracking-[.26em] hz:indent-[.26em] ${
            status === "error" ? "border-danger bg-danger-bg" : "border-line-heavy"
          }`}
        />
      </form>
      <p className="mt-2 text-[13.5px] leading-[1.45] text-body-soft">
        To bokstaver og fem sifre — for eksempel EB 12345.
        {process.env.NODE_ENV !== "production" && (
          <span className="block text-muted-light">
            Demo: EB12345, DR34567, FE11111 (feiltilfelle).
          </span>
        )}
      </p>

      {status !== "found" && (
        <Button
          size="lg"
          block
          className="mt-[18px]"
          disabled={!valid}
          loading={status === "loading"}
          onClick={handleLookup}
        >
          Hent bilinfo
        </Button>
      )}

      {status === "found" && state.vehicle && (
        <>
          {/* Kortet folder seg ut nedenfra når oppslaget treffer. */}
          <Card className="hz-unfold mt-5 border-navy bg-navy-06">
            <p className="text-[13.5px] text-body-soft">Vi fant bilen din</p>
            <p className="mt-1.5 font-heading text-[21px] font-bold text-ink">
              {state.vehicle.make} {state.vehicle.model}
              {state.vehicle.year ? ` (${state.vehicle.year})` : ""}
            </p>
            <p className="mt-1 text-[13.5px] text-body-soft">
              {[state.vehicle.fuel, state.vehicle.color, state.regNr]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </Card>
          <Button
            size="lg"
            block
            className="mt-[18px]"
            onClick={() => dispatch({ type: "continue" })}
          >
            Dette stemmer — gå videre
          </Button>
        </>
      )}

      {status === "error" && (
        <Card className="mt-5 border-danger bg-danger-bg">
          <p className="mb-3.5 text-[15px] leading-[1.55] text-body-strong">
            Vi fikk ikke svar fra motorvognregisteret. Fyll inn bilinfo manuelt, så går
            bestillingen like fint.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input
              aria-label="Merke"
              placeholder="Merke"
              value={make}
              onChange={(event) => setMake(event.target.value)}
              className="min-h-[46px] rounded-control border border-line-heavy bg-surface px-3.5 py-[11px] text-[16px] text-ink outline-none focus:border-navy"
            />
            <input
              aria-label="Modell"
              placeholder="Modell"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="min-h-[46px] rounded-control border border-line-heavy bg-surface px-3.5 py-[11px] text-[16px] text-ink outline-none focus:border-navy"
            />
          </div>
          <Button
            variant="secondary"
            block
            className="mt-3.5"
            disabled={!valid}
            onClick={() => {
              dispatch({
                type: "setVehicle",
                vehicle: {
                  regNr: state.regNr,
                  make: make || "Ukjent merke",
                  model,
                  year: 0,
                  fuel: "",
                  color: "",
                },
              });
              dispatch({ type: "continue" });
            }}
          >
            Fortsett uten oppslag
          </Button>
        </Card>
      )}
    </div>
  );
}

/* ---------- Steg 3: tjeneste ---------- */
function StepService({ state, dispatch, headingRef, direction }: StepProps) {
  const locationId = state.locationId!;
  const location = locations.find((item) => item.id === locationId)!;
  const [category, setCategory] = useState<string | null>(null);
  const categories = useMemo(() => serviceCategories(), []);
  const shown = category ? categories.filter((item) => item.label === category) : categories;

  const help = [
    state.vehicle ? `${state.vehicle.make} ${state.vehicle.model}`.trim() : null,
    state.regNr || null,
    `Handz On ${location.name}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      <StepHead
        title="Velg tjeneste"
        help={help}
        headingRef={headingRef}
        direction={direction}
      />

      {state.member ? (
        <div className="mb-4 rounded-card border border-navy bg-navy-06 px-3.5 py-2.5 hz:mb-[22px] hz:px-[18px] hz:py-4">
          <p className="font-heading text-[15px] font-semibold text-navy hz:text-[16px]">
            Medlemspris aktiv
          </p>
          <p className="mt-[3px] text-[13.5px] text-body-soft hz:text-[14px]">
            10 % avslag er trukket fra prisene under.
          </p>
        </div>
      ) : (
        /* Én rad på mobil. Stablet brukte blokka 144px — sammen med chrome og
           overskrift startet første tjenesterad 494px ned, altså 1,3 synlige
           tjenester på steget der salget faktisk skjer. */
        <div className="mb-4 flex flex-nowrap items-center justify-between gap-3 rounded-card border border-line-strong px-3.5 py-2.5 hz:mb-[22px] hz:flex-wrap hz:gap-4 hz:px-[18px] hz:py-4">
          <div className="min-w-0">
            <p className="font-heading text-[14px] font-semibold leading-tight text-ink hz:text-[16px]">
              Medlem? Få 10 % på tjenesten.
            </p>
            <p className="mt-[3px] text-[14px] text-body-soft max-hz:hidden">
              Gratis medlemskap — hver 6. Basic-vask er gratis.
            </p>
          </div>
          <VippsButton
            onClick={() => dispatch({ type: "vippsLogin" })}
            className="shrink-0"
          />
        </div>
      )}

      {/* Chipene BREKKER linje, de ruller ikke. Sju kategorier måler ~680px i
          et 358px vindu: som strimmel lå to av dem permanent utenfor kanten og
          ble aldri oppdaget. To rader koster 52px én gang; skjulte kategorier
          koster salg hver gang. */}
      <div
        className="mb-3.5 flex flex-wrap gap-2 hz:mb-[18px]"
        role="group"
        aria-label="Filtrer på kategori"
      >
        <Chip active={category === null} onClick={() => setCategory(null)}>
          Alle
        </Chip>
        {categories.map((item) => (
          <Chip
            key={item.label}
            active={category === item.label}
            onClick={() => setCategory(item.label)}
          >
            {item.label}
          </Chip>
        ))}
      </div>

      {shown.map((item, index) => {
        const items = services.filter((service) => service.category === item.label);
        return (
          /* Luften ligger på KATEGORI-diven, ikke på overskriften. `first:mt-0`
             sto på <p>-en, som alltid er første barn i sin egen div — regelen
             traff derfor hver eneste overskrift, og `mt-[26px]` slo aldri inn.
             Resultatet var null avstand mellom forrige kategoris siste kort og
             neste overskrift. */
          <div key={item.label} className={index === 0 ? "" : "mt-7 hz:mt-8"}>
            <p className="mb-2.5 border-b border-line pb-2.5 font-heading text-[12px] font-semibold uppercase tracking-[.16em] text-body-soft">
              {item.label}
            </p>
            <div className="flex flex-col gap-2.5">
              {items.map((service) => {
                const available = isServiceAvailable(service.id, locationId);
                const price = getEffectivePrice(service.id, locationId);
                const memberPrice =
                  price - Math.round((price * MEMBER_DISCOUNT_RATE) / 100) * 100;
                return (
                  <OptionRow
                    key={service.id}
                    image={getServiceImage(service.slug).thumb}
                    title={service.name}
                    tags={
                      <>
                        {/* Bevisst INGEN «Mest booket» her: sju av atten
                            tjenester har `popular`, så merkelappen ville stått
                            på sju rader samtidig. Et signal som gjelder 40 % av
                            utvalget er ikke et signal — og rødt er reservert ett
                            konverteringspunkt per skjerm. */}
                        {service.guarantee && <Tag>{service.guarantee}</Tag>}
                        {!available && <Tag variant="mute">Ikke tilgjengelig her</Tag>}
                      </>
                    }
                    description={service.description}
                    meta={`Varighet ca. ${formatDuration(service.durationMin)}`}
                    priceOre={available ? (state.member ? memberPrice : price) : undefined}
                    wasOre={available && state.member ? price : undefined}
                    selected={state.serviceId === service.id}
                    disabled={!available}
                    onClick={() =>
                      dispatch({ type: "selectService", serviceId: service.id })
                    }
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="mt-5 text-[13.5px] leading-[1.55] text-body-soft">
        Prisene gjelder Handz On {location.name} og er inkl. mva. Tillegg som
        asfaltfjerning (+450,-) og seterens (+500,-) velger du i steg 5.
      </p>
      <HelpLine location={location} />
    </div>
  );
}

/**
 * Nødutgangen i trakten. Er man usikker på hvilken tjeneste bilen trenger, er
 * alternativet i dag å lukke fanen — avdelingens telefonnummer sto ingen steder
 * i bookingen. På mobil holder kunden allerede en telefon.
 */
function HelpLine({ location }: { location: (typeof locations)[number] }) {
  return (
    <p className="mt-3 text-[13.5px] leading-[1.55] text-body-soft">
      Usikker? Ring Handz On {location.name} på{" "}
      <a
        href={`tel:${location.phone.replace(/\s/g, "")}`}
        className="-my-2 inline-flex min-h-[44px] items-center font-semibold text-navy hover:text-navy-hover hz:my-0 hz:min-h-0"
      >
        {location.phone}
      </a>
    </p>
  );
}

/* ---------- Steg 4: tidspunkt ---------- */
function StepTime({ state, dispatch, headingRef, direction }: StepProps) {
  const location = locations.find((item) => item.id === state.locationId)!;
  const service = services.find((item) => item.id === state.serviceId)!;
  const [days, setDays] = useState<string[]>([]);
  const [slotsByDay, setSlotsByDay] = useState<Record<string, TimeSlot[]>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(state.date);
  const [loading, setLoading] = useState(true);
  const addOnKey = state.addOnIds.join(",");

  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    const upcoming: string[] = [];
    /* Stripa starter I DAG. Den startet i morgen, og kastet dermed bort selve
       konseptet: kunden som står på senteret nå, med bilen på parkeringen,
       kunne ikke bestille for i dag. Passerte klokkeslett filtreres bort i
       booking-adapteren, så dagens chip forsvinner av seg selv om kvelden. */
    for (let offset = 0; offset < 14; offset += 1) {
      const day = new Date(today);
      day.setDate(today.getDate() + offset);
      upcoming.push(
        `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`,
      );
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
        (current) => current ?? upcoming.find((day) => map[day].length > 0) ?? upcoming[0],
      );
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.locationId, state.serviceId, addOnKey]);

  const activeDay = selectedDay ?? days[0] ?? null;

  /* Kalendersiden er UTLEDET av valgt dag, ikke lagret — da følger den med av
     seg selv når «første ledige dag» lander i uke to, uten en effekt som
     setter state (react-hooks/set-state-in-effect). Overstyringen settes bare
     når brukeren selv bytter uke, og nullstilles så snart en dag velges. */
  const [pageOverride, setPageOverride] = useState<number | null>(null);
  const PAGE_SIZE = 7;
  const pageCount = Math.max(1, Math.ceil(days.length / PAGE_SIZE));
  const activeIndex = activeDay ? days.indexOf(activeDay) : -1;
  const derivedPage = activeIndex >= 0 ? Math.floor(activeIndex / PAGE_SIZE) : 0;
  const page = Math.min(pageCount - 1, Math.max(0, pageOverride ?? derivedPage));
  const pageDays = days.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const slots = activeDay ? (slotsByDay[activeDay] ?? []) : [];
  const closed = activeDay
    ? Boolean(hoursForDay(location.openingHours, weekdayIndex(new Date(`${activeDay}T12:00:00`)))?.closed)
    : false;
  const nextOpenDay = days.find((day) => (slotsByDay[day] ?? []).length > 0);

  return (
    <div>
      <StepHead
        title="Velg tidspunkt"
        help={`${service.name} · ca. ${formatDuration(service.durationMin)}. Vi tar bilen mens du er på senteret.`}
        headingRef={headingRef}
        direction={direction}
      />

      {/* Uke-kalender, ikke rullestrimmel. Fjorten dag-chips på rad måler
          1052px i et 390px vindu: man så fem dager og måtte dra sidelengs 2,7
          skjermbredder for resten — uten at noe fortalte at de fantes. Sju
          kolonner får plass i bredden på enhver telefon, og ‹ › bytter uke.
          Ingen horisontal rulling igjen i steget. */}
      <div className="mb-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Forrige uke"
            disabled={page === 0}
            onClick={() => setPageOverride(page - 1)}
            className="-ml-2 grid size-11 shrink-0 place-items-center rounded-control text-navy transition-colors duration-[120ms] hover:bg-navy-06 disabled:text-neutral-300 disabled:hover:bg-transparent"
          >
            <ChevronLeft aria-hidden className="size-5" strokeWidth={2} />
          </button>
          <span
            aria-live="polite"
            className="min-w-0 truncate text-center font-heading text-[14.5px] font-semibold text-ink hz:text-[15.5px]"
          >
            {pageDays.length > 0 &&
              formatDayRange(pageDays[0], pageDays[pageDays.length - 1])}
          </span>
          <button
            type="button"
            aria-label="Neste uke"
            disabled={page >= pageCount - 1}
            onClick={() => setPageOverride(page + 1)}
            className="-mr-2 grid size-11 shrink-0 place-items-center rounded-control text-navy transition-colors duration-[120ms] hover:bg-navy-06 disabled:text-neutral-300 disabled:hover:bg-transparent"
          >
            <ChevronRight aria-hidden className="size-5" strokeWidth={2} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 hz:gap-2">
          {pageDays.map((day) => {
            const parts = formatDayParts(day);
            const selected = activeDay === day;
            const empty = !loading && (slotsByDay[day] ?? []).length === 0;
            return (
              <button
                key={day}
                type="button"
                aria-pressed={selected}
                aria-label={`${formatIsoDate(day)}${empty ? " — ingen ledige tider" : ""}`}
                onClick={() => {
                  setSelectedDay(day);
                  setPageOverride(null);
                }}
                className={`cursor-pointer rounded-card border px-0.5 py-2 text-center transition-colors duration-[120ms] hz:py-2.5 ${
                  selected
                    ? "border-navy bg-navy"
                    : "border-line-heavy bg-surface hover:border-navy"
                } ${empty && !selected ? "opacity-45" : ""}`}
              >
                <span
                  className={`block truncate text-[10.5px] leading-none ${selected ? "text-on-navy" : "text-body-soft"} hz:text-[11.5px]`}
                >
                  {parts.rel === "I dag" ? "I dag" : parts.wd}
                </span>
                <span
                  className={`mt-1.5 block font-heading text-[17px] font-bold leading-none tabular hz:text-[19px] ${selected ? "text-white" : "text-ink"}`}
                >
                  {parts.dd}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mb-3 text-[14.5px] text-body-soft hz:text-[15px]">
        {loading
          ? "Henter ledige tider…"
          : activeDay
            ? `Ledige tider ${formatIsoDateLower(activeDay)}`
            : ""}
      </p>

      {!loading && slots.length === 0 ? (
        <EmptyState
          icon={<Calendar aria-hidden className="size-10" strokeWidth={1.75} />}
          title={closed ? "Stengt på søndager" : "Ingen ledige tider denne dagen"}
          text="Prøv en annen dag — det er som regel god plass tidlig i uka."
          action={
            nextOpenDay ? (
              <Button variant="secondary" onClick={() => setSelectedDay(nextOpenDay)}>
                Vis neste ledige dag
              </Button>
            ) : undefined
          }
        />
      ) : (
        /* Fire kolonner på mobil: tre ga 110px brede ruter for «08:00» og
           «3 plasser», altså nesten halve bredden tom, og seks rader rulling
           for en formiddag som får plass på én skjerm i fire kolonner. */
        <div className="grid grid-cols-4 gap-2 hz:grid-cols-3 hz:gap-2.5">
          {slots.map((slot, index) => {
            const picked = state.date === slot.date && state.time === slot.time;
            return (
            <button
              // Nøklet på dagen, så tidene kommer inn etter hverandre når
              // dagen byttes — 20 ms mellom, maks 12 trinn (MOTION.md).
              key={`${slot.date}-${slot.time}`}
              type="button"
              aria-pressed={picked}
              style={{ "--d": `${Math.min(index, 12) * 20}ms` } as React.CSSProperties}
              onClick={() =>
                dispatch({ type: "selectSlot", date: slot.date, time: slot.time })
              }
              className={`hz-slot cursor-pointer rounded-control px-1 py-2.5 text-center transition-colors duration-[120ms] hz:px-1.5 hz:py-3 ${
                picked
                  ? "border-2 border-navy bg-navy-06"
                  : "border border-line-strong bg-surface hover:border-navy hover:bg-navy-06"
              }`}
            >
              <span
                className={`block font-heading text-[16px] font-bold tabular hz:text-[17px] ${picked ? "text-navy" : "text-ink"}`}
              >
                {slot.time}
              </span>
              <span
                className={`mt-0.5 block whitespace-nowrap text-[10.5px] hz:text-[12px] ${slot.capacityLeft === 1 ? "text-danger" : "text-body-soft"}`}
              >
                {slot.capacityLeft === 1 ? "1 plass igjen" : `${slot.capacityLeft} plasser`}
              </span>
            </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------- Steg 5: tillegg ---------- */
function StepAddOns({ state, dispatch, headingRef, direction }: StepProps) {
  const recommended = state.serviceId ? (addOnAffinity[state.serviceId] ?? []) : [];
  const sorted = [...addOns].sort((a, b) => {
    const ai = recommended.indexOf(a.id);
    const bi = recommended.indexOf(b.id);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div>
      <StepHead
        title="Vil du legge til noe?"
        help="Vi gjør det mens bilen først står inne — du sparer en ekstra tur."
        headingRef={headingRef}
        direction={direction}
      />
      <div className="flex flex-col gap-2.5">
        {sorted.map((addOn) => (
          <OptionRow
            key={addOn.id}
            title={addOn.name}
            tags={
              recommended.includes(addOn.id) ? (
                <Tag variant="red">Ofte valgt sammen</Tag>
              ) : undefined
            }
            description={addOn.description}
            meta={`+ ca. ${formatDuration(addOn.durationMin)}`}
            priceOre={addOn.priceOre}
            pricePrefix="+ "
            selected={state.addOnIds.includes(addOn.id)}
            onClick={() => dispatch({ type: "toggleAddOn", addOnId: addOn.id })}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Steg 6: oppsummering ---------- */
function StepSummary({
  state,
  dispatch,
  headingRef,
  direction,
  nameRef,
  phoneRef,
  contactTouched,
  contactValid,
}: StepProps & {
  nameRef: RefObject<HTMLInputElement | null>;
  phoneRef: RefObject<HTMLInputElement | null>;
  contactTouched: boolean;
  contactValid: boolean;
}) {
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
  const nameInvalid = contactTouched && state.contact.name.trim().length <= 1;
  const phoneInvalid = contactTouched && state.contact.phone.replace(/\s/g, "").length < 8;

  return (
    <div>
      <StepHead
        title="Oppsummering"
        help="Sjekk at alt stemmer før du bekrefter."
        headingRef={headingRef}
        direction={direction}
      />

      <Card elevated>
        <SummaryRow
          label="Avdeling"
          value={`Handz On ${location.name}`}
          onEdit={() => dispatch({ type: "edit", step: 1 })}
        />
        <SummaryRow
          label="Bil"
          value={
            state.vehicle
              ? `${state.vehicle.make} ${state.vehicle.model}`.trim() + ` · ${state.regNr}`
              : state.regNr
          }
          onEdit={() => dispatch({ type: "edit", step: 2 })}
        />
        <SummaryRow
          label="Tjeneste"
          value={service.name}
          onEdit={() => dispatch({ type: "edit", step: 3 })}
        />
        <SummaryRow
          label="Tidspunkt"
          value={state.date ? `${formatIsoDate(state.date)} kl. ${state.time}` : "—"}
          onEdit={() => dispatch({ type: "edit", step: 4 })}
        />
        {chosenAddOns.length > 0 && (
          <SummaryRow
            label="Tillegg"
            value={chosenAddOns.map((addOn) => addOn.name).join(", ")}
            onEdit={() => dispatch({ type: "edit", step: 5 })}
          />
        )}
      </Card>

      <Card elevated className="mt-3.5">
        <p className="mb-3 font-heading text-[16px] font-semibold text-ink">
          Prisspesifikasjon
        </p>
        <PriceLine label={service.name} amount={formatKrPlain(servicePrice)} />
        {chosenAddOns.map((addOn) => (
          <PriceLine
            key={addOn.id}
            label={addOn.name}
            amount={formatKrPlain(addOn.priceOre)}
          />
        ))}
        {memberDiscountOre > 0 && (
          <PriceLine
            label="Kundeklubb-rabatt (10 %)"
            amount={`−${formatKrPlain(memberDiscountOre)}`}
            accent
          />
        )}
        <PriceLine label="Herav mva. (25 %)" amount={formatKrExact(vatOre)} mute />
        <div className="mt-2.5 flex justify-between gap-4 border-t border-line-strong pt-3 font-heading text-[17px] font-bold text-ink">
          <span>Å betale ved henting</span>
          <span className="text-[19px] tabular">{formatKrPlain(totalOre)}</span>
        </div>
        {organization && (
          <p className="mt-2.5 text-[13.5px] leading-[1.6] text-body-soft">
            Alle priser er inkl. mva. Selger: {organization.legalName}, org.{" "}
            {formatOrgNr(organization.orgNr)}.
          </p>
        )}
      </Card>

      <Card elevated className="mt-3.5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-heading text-[16px] font-semibold text-ink">Kontaktinfo</p>
          {!state.member && (
            <VippsButton
              label="Fyll ut med"
              onClick={() => dispatch({ type: "vippsLogin" })}
            />
          )}
        </div>
        <div className="grid gap-3.5">
          <div>
            <label
              htmlFor="navn"
              className="mb-[7px] block font-heading text-[13px] font-semibold text-body-strong"
            >
              Navn
            </label>
            <input
              id="navn"
              ref={nameRef}
              autoComplete="name"
              enterKeyHint="next"
              placeholder="Kari Nordmann"
              aria-invalid={nameInvalid || undefined}
              aria-describedby={nameInvalid ? "navn-feil" : undefined}
              value={state.contact.name}
              onChange={(event) =>
                dispatch({ type: "setContact", contact: { name: event.target.value } })
              }
              className={`min-h-[46px] w-full rounded-control border bg-surface px-3.5 py-[11px] text-[16px] text-ink outline-none focus:border-navy focus:shadow-[0_0_0_3px_var(--color-navy-14)] ${
                nameInvalid ? "border-danger bg-danger-bg" : "border-line-heavy"
              }`}
            />
            {/* Feilen står ved feltet, ikke under knappen nederst på en 1200px
                lang side — der så ingen den i det de trykket. */}
            {nameInvalid && (
              <p id="navn-feil" className="mt-1.5 text-[13.5px] text-danger">
                Skriv inn navnet ditt.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="tlf"
              className="mb-[7px] block font-heading text-[13px] font-semibold text-body-strong"
            >
              Mobilnummer
            </label>
            <input
              id="tlf"
              ref={phoneRef}
              type="tel"
              inputMode="tel"
              enterKeyHint="done"
              autoComplete="tel"
              placeholder="912 34 567"
              aria-invalid={phoneInvalid || undefined}
              aria-describedby={phoneInvalid ? "tlf-feil" : "tlf-hjelp"}
              value={state.contact.phone}
              onChange={(event) =>
                dispatch({ type: "setContact", contact: { phone: event.target.value } })
              }
              className={`min-h-[46px] w-full rounded-control border bg-surface px-3.5 py-[11px] text-[16px] text-ink outline-none focus:border-navy focus:shadow-[0_0_0_3px_var(--color-navy-14)] ${
                phoneInvalid ? "border-danger bg-danger-bg" : "border-line-heavy"
              }`}
            />
            {phoneInvalid ? (
              <p id="tlf-feil" className="mt-1.5 text-[13.5px] text-danger">
                Skriv inn et mobilnummer med minst åtte sifre.
              </p>
            ) : (
              <p id="tlf-hjelp" className="mt-2 text-[13.5px] text-body-soft">
                Vi sender bekreftelse og melding når bilen er klar.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Trygghetslinja står OVER handlingen, ikke under: den skal leses før
          man bekrefter. Selve knappen ligger i den sticky bunnbaren. */}
      <p className="mt-3.5 text-[13.5px] leading-[1.55] text-body-soft">
        Gratis avbestilling frem til 24 timer før avtalt tid. Du betaler i avdelingen når
        du henter bilen{contactValid ? "" : " — fyll inn navn og mobilnummer for å bekrefte"}.
      </p>
      <HelpLine location={location} />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0 first:pt-0 hz:py-3.5">
      <div className="min-w-0">
        <p className="text-[12.5px] text-body-soft hz:text-[13px]">{label}</p>
        <p className="mt-[3px] font-heading text-[15.5px] font-semibold leading-tight text-ink hz:text-[16px]">
          {value}
        </p>
      </div>
      {onEdit && (
        /* «Endre» er den eneste rettemuligheten rett før bekreftelse. Som ren
           tekst var trykkflaten ~40×20px; nå er den 44px høy og strekker seg
           ut i kanten der tommelen faktisk lander. */
        <button
          type="button"
          onClick={onEdit}
          className="-my-2 -mr-2 inline-flex min-h-[44px] shrink-0 items-center px-2 font-heading text-[14px] font-semibold text-navy hover:text-navy-hover"
        >
          Endre
        </button>
      )}
    </div>
  );
}

function PriceLine({
  label,
  amount,
  accent,
  mute,
}: {
  label: string;
  amount: string;
  accent?: boolean;
  mute?: boolean;
}) {
  const tone = accent ? "text-navy" : mute ? "text-body-soft" : "text-body";
  const amountTone = accent ? "text-navy" : mute ? "text-body-soft" : "text-ink";
  return (
    <div className={`flex justify-between gap-4 py-[5px] text-[15px] ${tone}`}>
      <span>{label}</span>
      <span className={`font-heading font-semibold tabular ${amountTone}`}>{amount}</span>
    </div>
  );
}

/**
 * Ordrebekreftelsen som PDF. Ligger på modulnivå og ikke inne i steget, fordi både
 * bekreftelsessiden og den sticky bunnbaren skal kunne utløse den — baren
 * rendres av `BookingWizard`, ikke av `StepConfirmation`.
 */
function downloadReceipt(booking: Booking) {
  const location = locations.find((item) => item.id === booking.locationId)!;
  const service = services.find((item) => item.id === booking.serviceId)!;
  const organization = getOrganization(location.orgId);
  const chosenAddOns = addOns.filter((addOn) => booking.addOnIds.includes(addOn.id));
  const servicePrice = getEffectivePrice(service.id, booking.locationId);
  const addOnTotal = chosenAddOns.reduce((sum, addOn) => sum + addOn.priceOre, 0);
  const discountOre = servicePrice + addOnTotal - booking.totalOre;
  const lines: ReceiptLine[] = [
    { label: service.name, amount: formatKrPlain(servicePrice) },
    ...chosenAddOns.map((addOn) => ({
      label: addOn.name,
      amount: formatKrPlain(addOn.priceOre),
    })),
  ];
  if (discountOre > 0) {
    lines.push({
      label: "Kundeklubb-rabatt (10 %)",
      amount: `−${formatKrPlain(discountOre)}`,
      accent: true,
    });
  }
  void downloadReceiptPdf({
    reference: booking.reference,
    sellerName: organization?.legalName ?? "Handz On Auto Care",
    orgNr: formatOrgNr(booking.orgNr),
    address: `${location.address}, ${location.postalCode} ${location.city}`,
    branchName: `Handz On ${location.name}`,
    when: `${formatIsoDate(booking.date)} kl. ${booking.time}`,
    regNr: booking.regNr,
    vehicle: booking.vehicle
      ? `${booking.vehicle.make} ${booking.vehicle.model}`.trim()
      : "",
    lines,
    vat: formatKrExact(booking.vatOre),
    total: formatKrPlain(booking.totalOre),
    issuedAt: formatIsoDate(new Date().toISOString().slice(0, 10)),
  });
}

/* ---------- Steg 7: bekreftelse ---------- */
function StepConfirmation({
  booking,
  headingRef,
  direction,
}: {
  booking: Booking;
  headingRef: HeadingRef;
  direction: string;
}) {
  const location = locations.find((item) => item.id === booking.locationId)!;
  const service = services.find((item) => item.id === booking.serviceId)!;
  const organization = getOrganization(location.orgId);
  const chosenAddOns = addOns.filter((addOn) => booking.addOnIds.includes(addOn.id));

  return (
    <div>
      <div className={`mb-5 text-center hz:mb-[26px] ${direction}`}>
        <span className="hz-pop-lg mx-auto grid size-14 place-items-center rounded-full bg-status-open-bg text-status-open hz:size-16">
          <Check aria-hidden className="size-7 hz:size-8" strokeWidth={1.75} />
        </span>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-3.5 font-heading text-[25px] font-bold text-ink outline-none hz:mt-4 hz:text-[29px]"
        >
          Takk for bestillingen
        </h1>
        <p className="mt-2 text-[15px] text-body-soft hz:text-[16px]">
          Referanse{" "}
          <strong className="font-heading font-bold tabular text-ink">
            {booking.reference}
          </strong>
          . Bekreftelse er sendt på SMS.
        </p>
      </div>

      <Card elevated flush>
        <div className="flex items-center justify-between gap-3 bg-navy px-[22px] py-4">
          <Image src={logoWhite} alt="Handz On Auto Care" className="h-6 w-auto" />
          <span className="font-heading text-[12px] font-semibold uppercase tracking-[.14em] text-on-navy-eyebrow">
            Ordrebekreftelse
          </span>
        </div>
        <div className="p-[22px]">
          <SummaryRow label="Referanse" value={booking.reference} />
          <SummaryRow label="Tjeneste" value={service.name} />
          {chosenAddOns.length > 0 && (
            <SummaryRow
              label="Tillegg"
              value={chosenAddOns.map((addOn) => addOn.name).join(", ")}
            />
          )}
          <SummaryRow
            label="Avdeling"
            value={`Handz On ${location.name} · ${location.address}`}
          />
          <SummaryRow
            label="Tidspunkt"
            value={`${formatIsoDate(booking.date)} kl. ${booking.time}`}
          />
          <SummaryRow
            label="Bil"
            value={
              booking.vehicle
                ? `${booking.vehicle.make} ${booking.vehicle.model}`.trim() +
                  ` · ${booking.regNr}`
                : booking.regNr
            }
          />

          <div className="my-4 border-t border-dashed border-line-heavy" />
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-heading text-[16px] font-semibold text-ink">
              Å betale ved henting
            </span>
            <span className="font-heading text-[28px] font-bold leading-none tabular text-navy">
              {formatKr(booking.totalOre)}
            </span>
          </div>
          <p className="mt-1 text-right text-[13.5px] text-body-soft">
            inkl. mva. {formatKrExact(booking.vatOre)}
          </p>

          <div
            aria-hidden
            className="mt-5 h-11"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg,var(--color-ink) 0 2px,transparent 2px 4px,var(--color-ink) 4px 5px,transparent 5px 9px,var(--color-ink) 9px 12px,transparent 12px 14px)",
            }}
          />
          <p className="mt-3.5 text-[13.5px] leading-[1.6] text-body-soft">
            Utstedes av {organization?.legalName}, org. {formatOrgNr(booking.orgNr)}.
            Dette er en bekreftelse på bestillingen, ikke en kvittering — den får du
            i avdelingen når du betaler.
          </p>
        </div>
      </Card>

      <Card className="mt-3.5 bg-surface-alt">
        <p className="mb-2 font-heading text-[16px] font-semibold text-ink">Slik blir det</p>
        <ul className="flex flex-col gap-2.5">
          {[
            `Møt opp i skranken hos Handz On ${location.name} og lever nøkkelen.`,
            "Gjør ærendene dine på senteret — vi sender SMS når bilen er klar.",
            "Du betaler ved henting. Gratis avbestilling til 24 timer før.",
          ].map((item) => (
            <li
              key={item}
              className="flex gap-2.5 border-t border-line pt-[11px] text-[16px] leading-[1.5] text-body"
            >
              <Check
                aria-hidden
                className="mt-0.5 size-[18px] shrink-0 text-status-open"
                strokeWidth={1.75}
              />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* «Last ned PDF» og «Se på Min side» ligger i den sticky bunnbaren,
          som i alle de andre stegene — de sto før nederst på en side full av
          ordredetaljer, så man måtte rulle helt ned for å finne dem. Her står
          bare den rolige veien ut. */}
      <ButtonLink href="/" variant="ghost" block className="mt-5">
        Til forsiden
      </ButtonLink>
    </div>
  );
}
