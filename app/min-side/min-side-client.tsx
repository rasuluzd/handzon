"use client";

import { useState } from "react";
import { Calendar, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { Button, ButtonExternal, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tag } from "@/components/ui/Tag";
import { VippsButton } from "@/components/ui/VippsButton";
import { StampCard } from "@/components/site/StampCard";
import { bookingAdapter } from "@/lib/booking-adapter";
import {
  formatIsoDate,
  formatIsoDateNumeric,
  formatKrExact,
  formatKrPlain,
  formatOrgNr,
} from "@/lib/format";
import { addOns, getOrganization, locations, services } from "@/lib/mock-data";
import { downloadReceiptPdf } from "@/lib/receipt";

/**
 * Kundeportal (FR-4), utformet etter SCREENS.md § Min side.
 * Innlogging og data er mocket: i produksjon står Vipps Logg inn (OIDC) / OTP
 * bak Auth.js, og data hentes org-scopet fra API-et.
 */

interface PortalBooking {
  reference: string;
  locationSlug: string;
  serviceSlug: string;
  regNr: string;
  /** Dager fra i dag — negative er utført. */
  offset: number;
  time: string;
  addOnIds: string[];
}

const portalBookings: PortalBooking[] = [
  {
    reference: "HOAC-4271",
    locationSlug: "lambertseter",
    serviceSlug: "vask-ut-innvendig-premium",
    regNr: "EB12345",
    offset: 3,
    time: "10:00",
    addOnIds: ["add-dekkrens"],
  },
  {
    reference: "HOAC-3966",
    locationSlug: "lambertseter",
    serviceSlug: "polering-basic",
    regNr: "EB12345",
    offset: -32,
    time: "12:30",
    addOnIds: [],
  },
  {
    reference: "HOAC-3712",
    locationSlug: "sandvika",
    serviceSlug: "rens-innvendig",
    regNr: "DR34567",
    offset: -75,
    time: "09:00",
    addOnIds: ["add-ozon"],
  },
  {
    reference: "HOAC-3255",
    locationSlug: "lambertseter",
    serviceSlug: "vask-utvendig-premium",
    regNr: "DR34567",
    offset: -140,
    time: "15:30",
    addOnIds: [],
  },
];

const cars = [
  {
    regNr: "EB12345",
    make: "Tesla",
    model: "Model Y",
    year: 2023,
    note: "Hvit · Elektrisk",
    visits: 7,
    last: "Polering – Basic",
  },
  {
    regNr: "DR34567",
    make: "Volkswagen",
    model: "Golf",
    year: 2019,
    note: "Grå · Bensin",
    visits: 4,
    last: "Rens innvendig",
  },
];

type Tab = "avtaler" | "historikk" | "kvitteringer" | "personvern";

/**
 * Fanene ligger i et 2x2-rutenett under 900px. Som horisontal strimmel målte
 * raden ~435px mot 358px tilgjengelig, og fordi `.hz-scroll` skjuler
 * scrollbaren fantes ingen antydning om at de to siste fanene lå utenfor
 * skjermkanten — de var i praksis usynlige. Den korte etiketten brukes bare på
 * mobil, der en halv kolonne er ~140px bred.
 *
 * Fanen heter «Ordrekopier», ikke «Kvitteringer». Kvitteringen produseres av
 * kassen i avdelingen; å vise den her forutsetter et grensesnitt mot Avio
 * POS/ED (FR-4.3). Det vi kan vise uten kassetilgang er vår egen ordre.
 */
const tabs: Array<{ key: Tab; label: string; short: string }> = [
  { key: "avtaler", label: "Kommende avtaler", short: "Kommende" },
  { key: "historikk", label: "Historikk", short: "Historikk" },
  { key: "kvitteringer", label: "Ordrekopier", short: "Ordrekopier" },
  { key: "personvern", label: "Personvern", short: "Personvern" },
];

function isoFromOffset(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function details(booking: PortalBooking) {
  const location = locations.find((item) => item.slug === booking.locationSlug)!;
  const service = services.find((item) => item.slug === booking.serviceSlug)!;
  const chosenAddOns = addOns.filter((addOn) => booking.addOnIds.includes(addOn.id));
  const totals = bookingAdapter.calculateTotal(location.id, service.id, booking.addOnIds);
  return { location, service, chosenAddOns, totals };
}

/** Forhåndsutfylt booking — samme avdeling, tjeneste og bil som en tidligere ordre. */
function bookingHref(booking: PortalBooking, step?: "tid") {
  const { location, service } = details(booking);
  const base = `/booking?avdeling=${location.slug}&tjeneste=${service.slug}&regnr=${booking.regNr}`;
  return step ? `${base}&steg=${step}` : base;
}

export function MinSide() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("avtaler");
  const [cancelled, setCancelled] = useState<string[]>([]);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  if (deleted) {
    return (
      <div className="mx-auto max-w-[480px] px-[clamp(16px,4vw,64px)] py-[clamp(32px,8vw,88px)]">
        <Card elevated className="text-center">
          <p className="font-heading text-[18px] font-semibold text-ink hz:text-[19px]">
            Sletteforespørsel mottatt
          </p>
          <p className="mt-2.5 text-[15px] leading-[1.6] text-body-soft">
            Profilen og persondataene dine anonymiseres umiddelbart. Kvitteringer og
            bokføringspliktige bilag må hver avdeling oppbevare i fem år etter
            regnskapsårets slutt — de kan ikke lenger knyttes til deg som person.
          </p>
          <Button
            variant="secondary"
            className="mt-5 max-hz:w-full"
            onClick={() => {
              setDeleted(false);
              setConfirmingDelete(false);
              setLoggedIn(false);
            }}
          >
            Til forsiden
          </Button>
        </Card>
      </div>
    );
  }

  const upcoming = portalBookings.filter((booking) => booking.offset > 0);
  const past = portalBookings.filter((booking) => booking.offset < 0);

  return (
    <div className="mx-auto max-w-[760px] px-[clamp(16px,4vw,64px)] pb-[clamp(48px,6vw,72px)] pt-[clamp(22px,4vw,48px)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-heading text-[26px] font-bold tracking-[-.02em] text-ink hz:text-[32px]">
            Hei, Kari
          </h1>
          <p className="mt-1 text-[13.5px] text-body-soft hz:text-[14px]">
            Innlogget med Vipps · 912 34 567
          </p>
        </div>
        <Button variant="ghost" className="shrink-0" onClick={() => setLoggedIn(false)}>
          Logg ut
        </Button>
      </div>

      <nav
        aria-label="Min side"
        className="mt-4 grid grid-cols-2 gap-2 hz:mt-[22px] hz:flex hz:flex-wrap"
      >
        {tabs.map(({ key, label, short }) => (
          <Chip key={key} active={tab === key} onClick={() => setTab(key)}>
            <span className="hz:hidden">{short}</span>
            <span className="max-hz:hidden">{label}</span>
          </Chip>
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-3 hz:mt-[22px] hz:gap-3.5">
        {tab === "avtaler" && (
          <>
            {upcoming.length > 0 ? (
              <>
                {upcoming.map((booking) => (
                  <BookingRow
                    key={booking.reference}
                    booking={booking}
                    cancelled={cancelled.includes(booking.reference)}
                    onCancel={() => setCancelled([...cancelled, booking.reference])}
                  />
                ))}
                {/* En innlogget kunde med avtale er den mest kjøpsklare besøkende
                    vi har, men hadde ingen vei til booking herfra: CTA-en lå kun
                    inne i EmptyState, altså bare når det ikke var noe å bestille
                    fra. Den ligger nå rett under listen, over kundeklubben. */}
                <ButtonLink href="/booking" size="lg" className="hz:self-start">
                  Bestill ny time
                </ButtonLink>
              </>
            ) : (
              <EmptyState
                icon={<Calendar aria-hidden className="size-10" strokeWidth={1.75} />}
                title="Ingen kommende avtaler"
                text="Neste ledige tid hos Handz On Lambertseter er i morgen kl. 08:30."
                action={<ButtonLink href="/booking">Bestill time</ButtonLink>}
              />
            )}

            <div className="on-dark rounded-card-lg bg-navy p-4 hz:p-[26px]">
              <p className="mb-3 font-heading text-[12px] font-semibold uppercase tracking-[.2em] text-on-navy-eyebrow">
                Kundeklubb
              </p>
              <StampCard filled={4} />
              <p className="mt-3.5 text-[15px] leading-[1.5] text-on-navy hz:mt-4 hz:text-[15.5px] hz:leading-[1.55]">
                Du har 4 av 6 stempler. To behandlinger til, så er den utvendige
                Basic-vasken gratis. Husk at spylervæsken fylles gratis hver gang du er
                innom.
              </p>
            </div>

            <div>
              <h2 className="mb-2.5 mt-1 font-heading text-[19px] font-semibold text-ink hz:mb-3 hz:mt-3 hz:text-[21px]">
                Bilene dine
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-2.5 hz:gap-3">
                {cars.map((car) => (
                  <Card key={car.regNr}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-heading text-[16.5px] font-semibold text-ink hz:text-[17px]">
                          {car.make} {car.model}
                        </p>
                        <p className="mt-[3px] text-[13.5px] text-body-soft">
                          {car.year} · {car.note}
                        </p>
                      </div>
                      <span className="shrink-0 rounded border border-line-strong bg-surface-alt px-2 py-1 font-heading text-[13px] font-bold tracking-[.14em] text-ink">
                        {car.regNr}
                      </span>
                    </div>
                    <p className="mt-3 border-t border-line pt-2.5 text-[13.5px] text-body-soft">
                      {car.visits} behandlinger · sist {car.last}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "historikk" &&
          past.map((booking) => <BookingRow key={booking.reference} booking={booking} />)}

        {tab === "kvitteringer" && (
          <>
            <p className="mb-3 text-[14px] leading-[1.5] text-body-soft hz:mb-3.5 hz:text-[14.5px]">
              Oversikt over utførte behandlinger. Selve kvitteringen får du i avdelingen
              når du betaler.
            </p>
            <Card elevated flush>
            {past.map((booking, index) => {
              const { location, service, totals } = details(booking);
              const organization = getOrganization(location.orgId);
              return (
                /* Pris og PDF-knapp ligger på egen linje under 900px. På én rad
                   var de to ikke-krympbare, og tekstblokka ble presset til
                   ~112px — tjenestenavnet brakk til fire-fem linjer. */
                <div
                  key={booking.reference}
                  className={`flex flex-col gap-2.5 px-4 py-3.5 hz:flex-row hz:flex-wrap hz:items-center hz:gap-3.5 hz:px-5 hz:py-4 ${index > 0 ? "border-t border-line" : ""}`}
                >
                  <div className="min-w-0 hz:flex-1">
                    <p className="font-heading text-[15.5px] font-semibold leading-[1.35] text-ink hz:text-[16px]">
                      {service.name}
                    </p>
                    <p className="mt-1 text-[13px] tabular leading-[1.45] text-body-soft hz:text-[13.5px]">
                      {booking.reference} · {formatIsoDateNumeric(isoFromOffset(booking.offset))}{" "}
                      · {organization?.legalName}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-heading text-[19px] font-bold tabular text-navy">
                      {formatKrPlain(totals.totalOre)}
                    </span>
                    <Button
                      variant="secondary"
                      className="shrink-0"
                      onClick={() => downloadReceipt(booking)}
                    >
                      <ExternalLink aria-hidden className="size-4" strokeWidth={1.75} />
                      PDF
                    </Button>
                  </div>
                </div>
              );
            })}
            </Card>
          </>
        )}

        {tab === "personvern" && (
          <>
            <Card elevated>
              <h2 className="mb-2 font-heading text-[18px] font-semibold text-ink hz:mb-2.5 hz:text-[19px]">
                Dine data
              </h2>
              <p className="text-[15px] leading-[1.6] text-body-soft hz:text-[15.5px]">
                Vi lagrer navn, mobilnummer, registreringsnummer og behandlingshistorikk.
                Hver avdeling er en egen juridisk enhet og behandlingsansvarlig for sine
                egne ordrer.
              </p>
              <div className="mt-4 flex flex-col gap-2.5 hz:mt-[18px] hz:flex-row hz:flex-wrap">
                <Button variant="secondary" onClick={exportData}>
                  <ExternalLink aria-hidden className="size-4" strokeWidth={1.75} />
                  Last ned mine data
                </Button>
                <ButtonLink href="/kontakt" variant="secondary">
                  Endre samtykker
                </ButtonLink>
              </div>
            </Card>
            <Card>
              <h2 className="mb-2 font-heading text-[18px] font-semibold text-ink hz:mb-2.5 hz:text-[19px]">
                Slett profilen min
              </h2>
              <p className="text-[15px] leading-[1.6] text-body-soft hz:text-[15.5px]">
                Profilen anonymiseres umiddelbart. Bokføringspliktige bilag må
                avdelingen oppbevare i fem år etter regnskapsårets slutt, men de kobles
                fra deg som person.
              </p>
              {/* Sletting er irreversibel og lå tidligere ett trykk unna, rett
                  under en identisk formatert seksjon. På touch er bomtrykk
                  vesentlig mer sannsynlig enn med mus, så handlingen krever nå
                  en bekreftelse. «Avbryt» ligger nederst der tommelen lander. */}
              {confirmingDelete ? (
                <div className="mt-4">
                  <p role="alert" className="text-[15px] font-semibold leading-[1.5] text-ink">
                    Er du sikker? Dette kan ikke angres.
                  </p>
                  <div className="mt-3 flex flex-col gap-2.5 hz:flex-row hz:flex-wrap">
                    <Button variant="danger" onClick={() => setDeleted(true)}>
                      Ja, slett profilen
                    </Button>
                    <Button variant="secondary" onClick={() => setConfirmingDelete(false)}>
                      Avbryt
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="danger"
                  className="mt-4 max-hz:w-full"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Slett profilen min
                </Button>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="mx-auto max-w-[440px] px-[clamp(16px,4vw,64px)] py-[clamp(32px,8vw,88px)]">
      <h1 className="font-heading text-[26px] font-bold tracking-[-.02em] text-ink hz:text-[32px]">
        Min side
      </h1>
      <p className="mt-2 text-[16.5px] leading-[1.55] text-body-soft hz:text-[17px]">
        Se kommende avtaler, historikk per bil, ordrekopier og kundeklubb-status.
      </p>
      <Card elevated className="mt-6 grid gap-3 hz:mt-7">
        <VippsButton block onClick={onLogin} />
        <Button variant="secondary" size="lg" block onClick={onLogin}>
          Engangskode på SMS
        </Button>
        <p className="text-center text-[13px] leading-[1.5] text-body-soft">
          Passordfritt og trygt. Vi bruker Vipps til å bekrefte at det er deg.
        </p>
      </Card>
      {/* Booking krever ikke innlogging. En ny kunde som lander her — f.eks. fra
          kontaktsidens «Til Min side»-kort — møtte tidligere en logg inn-vegg
          uten vei videre, fordi «bestiller» bare var brødtekst. */}
      <div className="mt-5 rounded-card border border-line-strong bg-surface-alt p-4">
        <p className="flex items-start gap-2.5 text-[14.5px] leading-[1.55] text-body-soft">
          <ShieldCheck
            aria-hidden
            className="mt-px size-[18px] shrink-0 text-status-open"
            strokeWidth={1.75}
          />
          Ny kunde? Du får automatisk en profil første gang du bestiller — bestillingen
          ligger her etterpå.
        </p>
        <ButtonLink href="/booking" variant="secondary" size="lg" block className="mt-3.5">
          Bestill time
        </ButtonLink>
      </div>
    </div>
  );
}

function BookingRow({
  booking,
  cancelled,
  onCancel,
}: {
  booking: PortalBooking;
  cancelled?: boolean;
  onCancel?: () => void;
}) {
  const { location, service, chosenAddOns, totals } = details(booking);
  const upcoming = booking.offset > 0;
  const date = isoFromOffset(booking.offset);
  const mapQuery = `Handz On ${location.name}, ${location.address}, ${location.postalCode} ${location.city}`;

  return (
    <Card elevated={upcoming} className={cancelled ? "opacity-55" : undefined}>
      {/* Prisen står i egen høyrekolonne fra 900px. På mobil ga det tittelen
          ~198px, og «Vask ut- og innvendig – Premium» brakk til tre linjer —
          derfor legger prisen seg som egen linje under teksten. */}
      <div className="flex flex-col gap-2 hz:flex-row hz:flex-wrap hz:justify-between hz:gap-3.5">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {cancelled ? (
              <Tag variant="mute">Avbestilt</Tag>
            ) : upcoming ? (
              <Tag variant="open">Bekreftet</Tag>
            ) : (
              <Tag variant="mute">Utført</Tag>
            )}
            <span className="font-heading text-[13px] font-semibold tabular text-body-soft">
              {booking.reference}
            </span>
          </div>
          <p className="font-heading text-[17px] font-semibold leading-[1.3] text-ink hz:text-[18px]">
            {service.name}
          </p>
          <p className="mt-1 text-[14.5px] leading-[1.45] text-body-soft">
            {formatIsoDate(date)} kl. {booking.time} · Handz On {location.name}
          </p>
          <p className="mt-[3px] text-[13.5px] leading-[1.45] text-body-soft">
            {booking.regNr}
            {chosenAddOns.length > 0
              ? ` · ${chosenAddOns.map((addOn) => addOn.name).join(", ")}`
              : ""}
          </p>
        </div>
        <div className="flex items-baseline gap-2 hz:block hz:shrink-0 hz:text-right">
          <p className="font-heading text-[20px] font-bold tabular text-navy hz:text-[22px]">
            {formatKrPlain(totals.totalOre)}
          </p>
          <p className="text-[12.5px] text-body-soft hz:mt-0.5">inkl. mva</p>
        </div>
      </div>

      {upcoming && !cancelled && (
        /* Tre 38px-kontroller på én linje målte ~365px mot 302px tilgjengelig og
           brakk, og «Avbestill» hadde `ml-auto` — den destruktive handlingen
           havnet nederst til høyre, der tommelen lander. Nå tar «Endre tid»
           full bredde på mobil, og ml-auto gjelder først fra 900px. */
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line pt-3.5 hz:mt-4 hz:gap-2.5">
          <ButtonLink
            href={bookingHref(booking, "tid")}
            variant="secondary"
            className="max-hz:w-full"
          >
            Endre tid
          </ButtonLink>
          <ButtonExternal
            variant="ghost"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
            aria-label="Veibeskrivelse (åpnes i ny fane)"
          >
            <MapPin aria-hidden className="size-4" strokeWidth={1.75} />
            Veibeskrivelse
          </ButtonExternal>
          <Button variant="danger" className="hz:ml-auto" onClick={onCancel}>
            Avbestill
          </Button>
        </div>
      )}

      {!upcoming && (
        /* Historikken er sidens sterkeste kjøpssignal: kunden har allerede
           kjøpt akkurat denne tjenesten. Lenken forhåndsutfyller avdeling,
           tjeneste og bil, så gjenkjøp er ett trykk unna. */
        <div className="mt-3.5 border-t border-line pt-3.5">
          <ButtonLink
            href={bookingHref(booking)}
            variant="secondary"
            className="max-hz:w-full"
          >
            Bestill på nytt
          </ButtonLink>
        </div>
      )}

      {cancelled && (
        <p className="mt-3 text-[14px] leading-[1.5] text-body-soft">
          Avbestilt uten gebyr. Du får bekreftelse på SMS.
        </p>
      )}
    </Card>
  );
}

function downloadReceipt(booking: PortalBooking) {
  const { location, service, chosenAddOns, totals } = details(booking);
  const organization = getOrganization(location.orgId);
  void downloadReceiptPdf({
    /* Min side viser utførte, betalte jobber. Da er «Å betale ved henting»
       feil, og «Kvittering» ville vært en påstand vi ikke kan innfri uten
       grensesnitt mot kassen — dette er en ordrekopi. */
    kind: "kopi",
    reference: booking.reference,
    sellerName: organization?.legalName ?? "Handz On Auto Care",
    orgNr: formatOrgNr(organization?.orgNr ?? ""),
    address: `${location.address}, ${location.postalCode} ${location.city}`,
    branchName: `Handz On ${location.name}`,
    when: `${formatIsoDate(isoFromOffset(booking.offset))} kl. ${booking.time}`,
    regNr: booking.regNr,
    vehicle: "",
    lines: [
      { label: service.name, amount: formatKrPlain(service.priceOre) },
      ...chosenAddOns.map((addOn) => ({
        label: addOn.name,
        amount: formatKrPlain(addOn.priceOre),
      })),
    ],
    vat: formatKrExact(totals.vatOre),
    total: formatKrPlain(totals.totalOre),
    issuedAt: formatIsoDateNumeric(isoFromOffset(booking.offset)),
  });
}

function exportData() {
  const blob = new Blob([JSON.stringify({ kunde: "Kari Nordmann", bookinger: portalBookings }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "handzon-mine-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
}
