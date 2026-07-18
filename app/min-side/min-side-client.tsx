"use client";

import { useMemo, useState } from "react";
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
  { reference: "HOAC-4271", locationId: "loc-oslo-alna", serviceId: "svc-komplett", regNr: "EB12345", daysFromNow: 3, time: "10:00", totalOre: 219900, status: "confirmed" },
  { reference: "HOAC-3966", locationId: "loc-oslo-alna", serviceId: "svc-utvendig-voks", regNr: "EB12345", daysFromNow: -32, time: "12:30", totalOre: 89900, status: "completed" },
  { reference: "HOAC-3712", locationId: "loc-oslo-skoyen", serviceId: "svc-innvendig-rens", regNr: "DR34567", daysFromNow: -75, time: "09:00", totalOre: 149900, status: "completed" },
  { reference: "HOAC-3255", locationId: "loc-oslo-alna", serviceId: "svc-utvendig-vask", regNr: "DR34567", daysFromNow: -140, time: "15:30", totalOre: 44900, status: "completed" },
];

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
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-3xl font-bold">Min side</h1>
        <p className="mt-2 text-muted">
          Se kommende avtaler, historikk per bil og kvitteringer.
        </p>
        <Card className="mt-8 space-y-3">
          <Button variant="vipps" fullWidth onClick={() => setLoggedIn(true)}>
            Logg inn med Vipps
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setLoggedIn(true)}>
            Engangskode på SMS eller e-post
          </Button>
          <p className="text-center text-xs text-muted">
            Passordfritt og trygt. Demo: begge valg logger inn en testbruker.
          </p>
        </Card>
      </div>
    );
  }

  if (deleteRequested) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="text-center">
          <p className="text-lg font-semibold">Sletteforespørsel mottatt</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hei, Kari!</h1>
          <p className="mt-1 text-sm text-muted">
            Innlogget med Vipps · 912 34 567
          </p>
        </div>
        <Button variant="ghost" onClick={() => setLoggedIn(false)}>
          Logg ut
        </Button>
      </div>

      <nav aria-label="Min side-faner" className="mt-6 flex gap-2 overflow-x-auto pb-1">
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
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? "border-accent bg-accent/10 text-foreground"
                : "border-border text-muted hover:border-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "avtaler" && (
          <UpcomingBookings cancelled={cancelled} onCancel={(ref) => setCancelled([...cancelled, ref])} />
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
                <p className="font-semibold">{service?.name}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {formatIsoDate(isoDateFromOffset(booking.daysFromNow))} kl. {booking.time}
                </p>
                <p className="text-sm text-muted">
                  Handz On {location?.name} · <span className="font-mono">{booking.regNr}</span>
                </p>
              </div>
              <Badge>{isCancelled ? "Avbestilt" : "Bekreftet"}</Badge>
            </div>
            {!isCancelled && (
              <div className="mt-4 flex gap-2">
                <ButtonLink
                  href={`/booking?avdeling=${location?.slug}`}
                  variant="secondary"
                  className="!min-h-9 !px-3 text-sm"
                >
                  Endre tid
                </ButtonLink>
                <Button
                  variant="ghost"
                  className="!min-h-9 !px-3 text-sm text-danger"
                  onClick={() => onCancel(booking.reference)}
                >
                  Avbestill
                </Button>
              </div>
            )}
            {isCancelled && (
              <p className="mt-3 text-sm text-muted">
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
          <h2 className="font-mono text-sm font-semibold text-muted">{regNr}</h2>
          <div className="mt-2 space-y-2">
            {bookings.map((booking) => {
              const { location, service } = bookingDetails(booking);
              return (
                <Card key={booking.reference} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{service?.name}</p>
                    <p className="text-sm text-muted">
                      {formatIsoDate(isoDateFromOffset(booking.daysFromNow))} · Handz On {location?.name}
                    </p>
                  </div>
                  <p className="font-bold">{formatOre(booking.totalOre)}</p>
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
      <p className="text-sm text-muted">
        Kvitteringer utstedes av avdelingens juridiske enhet og oppbevares i 6 år.
      </p>
      {completed.map((booking) => {
        const { location, service } = bookingDetails(booking);
        const organization = location ? getOrganization(location.orgId) : undefined;
        return (
          <Card key={booking.reference} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">
                Kvittering {booking.reference}
              </p>
              <p className="text-sm text-muted">
                {formatIsoDate(isoDateFromOffset(booking.daysFromNow))} · {service?.name}
              </p>
              {organization && (
                <p className="text-xs text-muted">
                  {organization.legalName} · org.nr {formatOrgNr(organization.orgNr)}
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              className="!min-h-9 !px-3 text-sm"
              onClick={() => window.alert("Demo: PDF-kvittering lastes ned fra objektlageret i produksjon.")}
            >
              Last ned PDF
            </Button>
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
        <h2 className="font-semibold">Samtykker</h2>
        <ul className="mt-3 space-y-2 text-sm">
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
        <h2 className="font-semibold">Dine data</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Du kan når som helst eksportere dataene dine eller be om sletting.
          Sletting anonymiserer profilen umiddelbart; bokføringspliktige
          kvitteringer oppbevares i 6 år hos hver enkelt avdeling (egen juridisk
          enhet) i tråd med bokføringsloven.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            className="!min-h-9 !px-3 text-sm"
            onClick={() => window.alert("Demo: dataeksport (JSON) genereres og sendes på e-post i produksjon.")}
          >
            Eksporter data
          </Button>
          <Button variant="ghost" className="!min-h-9 !px-3 text-sm text-danger" onClick={onDelete}>
            Slett meg
          </Button>
        </div>
      </Card>
    </div>
  );
}
