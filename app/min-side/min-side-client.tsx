"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { formatIsoDate, formatOre, formatOrgNr } from "@/lib/format";
import { getOrganization, locations, services } from "@/lib/mock-data";

/**
 * Kundeportal (FR-4). Innlogging og data er mocket: i produksjon står
 * Vipps Logg inn (OIDC) / OTP bak Auth.js, og data hentes org-scopet fra API-et.
 */

interface PortalBooking {
  reference: string;
  locationId: string;
  serviceId: string;
  regNr: string;
  daysFromNow: number;
  time: string;
  totalOre: number;
  status: "confirmed" | "completed";
}

const portalBookings: PortalBooking[] = [
  { reference: "HOAC-4271", locationId: "loc-lambertseter", serviceId: "svc-komplett", regNr: "EB12345", daysFromNow: 3, time: "10:00", totalOre: 219900, status: "confirmed" },
  { reference: "HOAC-3966", locationId: "loc-lambertseter", serviceId: "svc-utvendig-voks", regNr: "EB12345", daysFromNow: -32, time: "12:30", totalOre: 89900, status: "completed" },
  { reference: "HOAC-3712", locationId: "loc-sandvika", serviceId: "svc-innvendig-rens", regNr: "DR34567", daysFromNow: -75, time: "09:00", totalOre: 149900, status: "completed" },
  { reference: "HOAC-3255", locationId: "loc-lambertseter", serviceId: "svc-utvendig-vask", regNr: "DR34567", daysFromNow: -140, time: "15:30", totalOre: 44900, status: "completed" },
];

const dangerButton =
  "rounded-[8px] px-3 py-2 font-heading text-[14px] font-semibold text-[#b04a4a] hover:bg-[rgba(176,74,74,0.08)]";
const smallButton =
  "rounded-[8px] border-[1.5px] border-navy/35 bg-surface px-3 py-2 font-heading text-[14px] font-semibold text-navy hover:bg-surface-alt";

function isoDateFromOffset(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

type Tab = "avtaler" | "historikk" | "kvitteringer" | "personvern";

export function MinSide() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("avtaler");
  const [cancelled, setCancelled] = useState<string[]>([]);
  const [deleteRequested, setDeleteRequested] = useState(false);

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-heading text-[32px] font-bold text-ink">Min side</h1>
        <p className="mt-2 text-body-soft">
          Se kommende avtaler, historikk per bil og kvitteringer.
        </p>
        <Card className="mt-8 space-y-3">
          <Button variant="vipps" fullWidth onClick={() => setLoggedIn(true)}>
            Logg inn med Vipps
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setLoggedIn(true)}>
            Engangskode på SMS eller e-post
          </Button>
          <p className="text-center text-[13px] text-muted-light">
            Passordfritt og trygt. Demo: begge valg logger inn en testbruker.
          </p>
        </Card>
      </div>
    );
  }

  if (deleteRequested) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <Card className="text-center">
          <p className="font-heading text-[18px] font-semibold text-ink">
            Sletteforespørsel mottatt
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-body-soft">
            Profilen og persondataene dine anonymiseres umiddelbart. Kvitteringer
            og bokføringspliktige bilag må hver avdeling (egen juridisk enhet)
            oppbevare i 6 år etter bokføringsloven — de kan ikke lenger knyttes
            til deg som person.
          </p>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => {
              setDeleteRequested(false);
              setLoggedIn(false);
            }}
          >
            Til forsiden
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-[32px] font-bold text-ink">Hei, Kari!</h1>
          <p className="mt-1 text-[14px] text-muted">
            Innlogget med Vipps · 912 34 567
          </p>
        </div>
        <Button variant="ghost" onClick={() => setLoggedIn(false)}>
          Logg ut
        </Button>
      </div>

      <nav
        aria-label="Min side-faner"
        className="hz-scroll mt-6 flex gap-2 overflow-x-auto pb-1"
      >
        {(
          [
            ["avtaler", "Kommende avtaler"],
            ["historikk", "Historikk"],
            ["kvitteringer", "Kvitteringer"],
            ["personvern", "Personvern"],
          ] as Array<[Tab, string]>
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-current={tab === key ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 font-heading text-[14px] font-semibold transition-colors ${
              tab === key
                ? "border-navy bg-navy/8 text-ink"
                : "border-line-strong text-muted hover:border-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "avtaler" && (
          <UpcomingBookings
            cancelled={cancelled}
            onCancel={(ref) => setCancelled([...cancelled, ref])}
          />
        )}
        {tab === "historikk" && <History />}
        {tab === "kvitteringer" && <Receipts />}
        {tab === "personvern" && <Privacy onDelete={() => setDeleteRequested(true)} />}
      </div>
    </div>
  );
}

function bookingDetails(booking: PortalBooking) {
  const location = locations.find((item) => item.id === booking.locationId);
  const service = services.find((item) => item.id === booking.serviceId);
  return { location, service };
}

function UpcomingBookings({
  cancelled,
  onCancel,
}: {
  cancelled: string[];
  onCancel: (reference: string) => void;
}) {
  const upcoming = portalBookings.filter((booking) => booking.daysFromNow > 0);
  return (
    <div className="space-y-3">
      {upcoming.map((booking) => {
        const { location, service } = bookingDetails(booking);
        const isCancelled = cancelled.includes(booking.reference);
        return (
          <Card key={booking.reference} className={isCancelled ? "opacity-60" : ""}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-[17px] font-semibold text-ink">
                  {service?.name}
                </p>
                <p className="mt-0.5 text-[14px] text-muted">
                  {formatIsoDate(isoDateFromOffset(booking.daysFromNow))} kl.{" "}
                  {booking.time}
                </p>
                <p className="text-[14px] text-muted">
                  Handz On {location?.name} ·{" "}
                  <span className="font-heading tracking-[0.05em]">
                    {booking.regNr}
                  </span>
                </p>
              </div>
              <Badge>{isCancelled ? "Avbestilt" : "Bekreftet"}</Badge>
            </div>
            {!isCancelled ? (
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/booking?avdeling=${location?.slug}`}
                  className={smallButton}
                >
                  Endre tid
                </Link>
                <button
                  type="button"
                  className={dangerButton}
                  onClick={() => onCancel(booking.reference)}
                >
                  Avbestill
                </button>
              </div>
            ) : (
              <p className="mt-3 text-[14px] text-muted">
                Avbestilt uten gebyr. Du får bekreftelse på SMS.
              </p>
            )}
          </Card>
        );
      })}
      <ButtonLink href="/booking" fullWidth className="mt-2">
        Bestill ny time
      </ButtonLink>
    </div>
  );
}

function History() {
  const completed = portalBookings.filter((booking) => booking.daysFromNow < 0);
  const byRegNr = useMemo(() => {
    const groups = new Map<string, PortalBooking[]>();
    for (const booking of completed) {
      groups.set(booking.regNr, [...(groups.get(booking.regNr) ?? []), booking]);
    }
    return [...groups.entries()];
  }, [completed]);

  return (
    <div className="space-y-6">
      {byRegNr.map(([regNr, bookings]) => (
        <section key={regNr} aria-label={`Historikk for ${regNr}`}>
          <h2 className="font-heading text-[14px] font-semibold tracking-[0.05em] text-muted">
            {regNr}
          </h2>
          <div className="mt-2 space-y-2">
            {bookings.map((booking) => {
              const { location, service } = bookingDetails(booking);
              return (
                <Card
                  key={booking.reference}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-heading text-[17px] font-semibold text-ink">
                      {service?.name}
                    </p>
                    <p className="text-[14px] text-muted">
                      {formatIsoDate(isoDateFromOffset(booking.daysFromNow))} · Handz
                      On {location?.name}
                    </p>
                  </div>
                  <p className="font-heading font-bold text-navy">
                    {formatOre(booking.totalOre)}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Receipts() {
  const completed = portalBookings.filter((booking) => booking.daysFromNow < 0);
  return (
    <div className="space-y-3">
      <p className="text-[14px] text-muted">
        Kvitteringer utstedes av avdelingens juridiske enhet og oppbevares i 6 år.
      </p>
      {completed.map((booking) => {
        const { location, service } = bookingDetails(booking);
        const organization = location ? getOrganization(location.orgId) : undefined;
        return (
          <Card
            key={booking.reference}
            className="flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-heading text-[17px] font-semibold text-ink">
                Kvittering {booking.reference}
              </p>
              <p className="text-[14px] text-muted">
                {formatIsoDate(isoDateFromOffset(booking.daysFromNow))} ·{" "}
                {service?.name}
              </p>
              {organization && (
                <p className="text-[12.5px] text-muted-light">
                  {organization.legalName} · org.nr{" "}
                  {formatOrgNr(organization.orgNr)}
                </p>
              )}
            </div>
            <button
              type="button"
              className={smallButton}
              onClick={() =>
                window.alert(
                  "Demo: PDF-kvittering lastes ned fra objektlageret i produksjon.",
                )
              }
            >
              Last ned PDF
            </button>
          </Card>
        );
      })}
    </div>
  );
}

function Privacy({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="space-y-3">
      <Card>
        <h2 className="font-heading text-[17px] font-semibold text-ink">
          Samtykker
        </h2>
        <ul className="mt-3 space-y-2 text-[15px] text-body">
          <li className="flex justify-between gap-3">
            <span>SMS-påminnelser om avtaler</span>
            <Badge>Aktivt</Badge>
          </li>
          <li className="flex justify-between gap-3">
            <span>Tilbud og kampanjer på e-post</span>
            <Badge>Aktivt</Badge>
          </li>
        </ul>
      </Card>
      <Card>
        <h2 className="font-heading text-[17px] font-semibold text-ink">
          Dine data
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          Du kan når som helst eksportere dataene dine eller be om sletting.
          Sletting anonymiserer profilen umiddelbart; bokføringspliktige
          kvitteringer oppbevares i 6 år hos hver enkelt avdeling (egen juridisk
          enhet) i tråd med bokføringsloven.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className={smallButton}
            onClick={() =>
              window.alert(
                "Demo: dataeksport (JSON) genereres og sendes på e-post i produksjon.",
              )
            }
          >
            Eksporter data
          </button>
          <button type="button" className={dangerButton} onClick={onDelete}>
            Slett meg
          </button>
        </div>
      </Card>
    </div>
  );
}
