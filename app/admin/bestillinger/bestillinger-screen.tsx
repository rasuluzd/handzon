"use client";

import { useMemo, useState } from "react";
import { Calendar, Search } from "lucide-react";
import { BranchPicker, Top } from "@/components/admin/Top";
import {
  AdArrow,
  AdButton,
  AdCard,
  AdEmpty,
  AdNote,
  AdTable,
  AdTag,
  adInput,
  adMeta,
  adName,
  adNum,
  adTd,
  adTh,
} from "@/components/admin/ui";
import { formatDuration, formatKr } from "@/lib/format";
import { addDays, ordersInRange, today } from "@/lib/sales";
import type { Order } from "@/lib/sales";
import { addOns, locations, services } from "@/lib/mock-data";
import { AdminBody } from "../admin-shell";
import { locationLabel, useAdmin } from "../admin-context";

/**
 * Bestillinger (ADMIN.md § 3). Statusflyten er fire trinn i låst rekkefølge:
 * Ny → Inne til behandling → Klar til henting (sender SMS) → Levert.
 * Startstatus utledes av klokketiden.
 */
type Status = "ny" | "inne" | "klar" | "levert";

const FLOW: Status[] = ["ny", "inne", "klar", "levert"];

const STATUS: Record<Status, { label: string; variant: "navy" | "warn" | "ok" | "off" }> = {
  ny: { label: "Ny", variant: "navy" },
  inne: { label: "Inne til behandling", variant: "warn" },
  klar: { label: "Klar til henting", variant: "ok" },
  levert: { label: "Levert", variant: "off" },
};

const ACTION: Record<Status, string> = {
  ny: "Ta inn",
  inne: "Meld klar",
  klar: "Registrer levert",
  levert: "",
};

export function BestillingerScreen() {
  const { loc, setLoc, setMenuOpen, toast } = useAdmin();
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState("");
  const [moved, setMoved] = useState<Record<string, Status>>({});

  const day = addDays(today(), offset);
  const orders = useMemo(() => ordersInRange(loc, day, day), [loc, day]);

  const statusFor = (order: Order): Status => {
    if (moved[order.id]) return moved[order.id];
    if (offset > 0) return "ny";
    if (offset < 0) return "levert";
    const hour = new Date().getHours();
    if (order.hour + 2 <= hour) return "levert";
    if (order.hour <= hour) return "inne";
    return "ny";
  };

  const term = query.trim().toLowerCase();
  const shown = term
    ? orders.filter((order) => {
        const service = services.find((item) => item.id === order.serviceId);
        const location = locations.find((item) => item.slug === order.locationSlug);
        return `${service?.name ?? ""} ${order.id} ${location?.name ?? ""}`
          .toLowerCase()
          .includes(term);
      })
    : orders;

  const sumOre = orders.reduce((sum, order) => sum + order.totalOre, 0);
  const label = locationLabel(loc);

  function advance(order: Order) {
    const current = statusFor(order);
    const next = FLOW[Math.min(FLOW.length - 1, FLOW.indexOf(current) + 1)];
    setMoved((previous) => ({ ...previous, [order.id]: next }));
    if (next === "klar") {
      toast({
        title: "SMS sendt til kunden",
        text: "«Bilen din er klar til henting hos Handz On.»",
      });
    } else if (next === "levert") {
      toast({
        variant: "info",
        title: "Ordren er avsluttet",
        text: `${formatKr(order.totalOre)} registrert som betalt ved henting.`,
      });
    }
  }

  const dayLabel =
    offset === 0
      ? "I dag"
      : offset === 1
        ? "I morgen"
        : offset === -1
          ? "I går"
          : day.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });

  return (
    <>
      <Top
        title="Bestillinger"
        sub={`${label} · ${day.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}`}
        onBurger={() => setMenuOpen(true)}
        right={
          <>
            <BranchPicker value={loc} onChange={setLoc} />
            <div className="flex items-center gap-1.5">
              <AdArrow label="Forrige dag" onClick={() => setOffset(offset - 1)}>
                ←
              </AdArrow>
              <span className="min-w-[120px] text-center font-heading text-[14.5px] font-semibold tabular text-ink">
                {dayLabel}
              </span>
              <AdArrow label="Neste dag" onClick={() => setOffset(offset + 1)}>
                →
              </AdArrow>
            </div>
          </>
        }
      />

      <AdminBody>
        <div className="grid gap-3.5 admin-lg:grid-cols-4 admin-sm:grid-cols-2">
          {[
            ["Ordrer", String(orders.length), "booket denne dagen"],
            ["Forventet omsetning", formatKr(sumOre), "inkl. mva"],
            [
              "Inne nå",
              String(orders.filter((order) => statusFor(order) === "inne").length),
              "biler under behandling",
            ],
            [
              "Klar til henting",
              String(orders.filter((order) => statusFor(order) === "klar").length),
              "kunden er varslet",
            ],
          ].map(([kpiLabel, value, hint]) => (
            <div
              key={kpiLabel}
              className="rounded-card-lg border border-line-strong bg-surface px-5 py-[18px]"
            >
              <p className="font-heading text-[11px] font-semibold uppercase tracking-[.16em] text-body-soft">
                {kpiLabel}
              </p>
              <p className="mt-2.5 font-heading text-[30px] font-bold leading-none tabular text-ink">
                {value}
              </p>
              <p className="mt-2 text-[13px] text-body-soft">{hint}</p>
            </div>
          ))}
        </div>

        <AdCard className="!p-3.5">
          <label className="relative block">
            <span className="sr-only">Søk i bestillinger</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-[17px] -translate-y-1/2 text-body-soft"
              strokeWidth={2}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Søk på tjeneste, referanse eller avdeling"
              className={`${adInput} pl-[38px]`}
            />
          </label>
        </AdCard>

        {shown.length === 0 ? (
          <AdEmpty
            icon={<Calendar aria-hidden className="size-9" strokeWidth={1.75} />}
            title={
              day.getDay() === 0 ? "Stengt på søndager" : "Ingen bestillinger denne dagen"
            }
            text="Velg en annen dag, eller sjekk om avdelingen har stengt."
            action={
              <AdButton variant="secondary" onClick={() => setOffset(0)}>
                Tilbake til i dag
              </AdButton>
            }
          />
        ) : (
          <AdCard flush>
            <AdTable>
              <thead>
                <tr>
                  <th className={adTh}>Tid</th>
                  <th className={adTh}>Tjeneste og tillegg</th>
                  {loc === "alle" && <th className={adTh}>Avdeling</th>}
                  <th className={adTh}>Kanal</th>
                  <th className={`${adTh} text-right`}>Sum</th>
                  <th className={adTh}>Status</th>
                  <th className={`${adTh} text-right`} />
                </tr>
              </thead>
              <tbody>
                {shown.map((order) => {
                  const service = services.find((item) => item.id === order.serviceId)!;
                  const status = statusFor(order);
                  return (
                    <tr key={order.id}>
                      <td className={`${adTd} font-heading font-semibold tabular text-ink`}>
                        {String(order.hour).padStart(2, "0")}:00
                      </td>
                      <td className={adTd}>
                        <p className={adName}>{service.name}</p>
                        <p className={adMeta}>
                          ca. {formatDuration(service.durationMin)}
                          {order.addOnIds.length > 0
                            ? ` · ${order.addOnIds.map((id) => addOns.find((a) => a.id === id)?.name).join(", ")}`
                            : ""}
                        </p>
                      </td>
                      {loc === "alle" && (
                        <td className={adTd}>
                          {locations.find((item) => item.slug === order.locationSlug)?.name}
                        </td>
                      )}
                      <td className={adTd}>
                        <div className="flex flex-wrap gap-1.5">
                          <AdTag variant="off">
                            {order.channel === "nett"
                              ? "Nett"
                              : order.channel === "skranke"
                                ? "Skranke"
                                : "Telefon"}
                          </AdTag>
                          {order.member && <AdTag>Medlem</AdTag>}
                        </div>
                      </td>
                      <td className={`${adTd} ${adNum}`}>{formatKr(order.totalOre)}</td>
                      <td className={adTd}>
                        <AdTag variant={STATUS[status].variant} dot={status === "klar"}>
                          {STATUS[status].label}
                        </AdTag>
                      </td>
                      <td className={`${adTd} whitespace-nowrap text-right`}>
                        {status === "levert" ? (
                          <span className={adMeta}>Fullført</span>
                        ) : (
                          <AdButton
                            variant="secondary"
                            size="sm"
                            onClick={() => advance(order)}
                          >
                            {ACTION[status]}
                          </AdButton>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    className={`${adTd} border-t border-line-strong bg-surface-alt font-heading font-bold text-ink`}
                    colSpan={loc === "alle" ? 4 : 3}
                  >
                    Sum {day.toLocaleDateString("nb-NO", { day: "numeric", month: "long" })}
                  </td>
                  <td
                    className={`${adTd} ${adNum} border-t border-line-strong bg-surface-alt font-bold`}
                  >
                    {formatKr(sumOre)}
                  </td>
                  <td
                    className={`${adTd} border-t border-line-strong bg-surface-alt`}
                    colSpan={2}
                  />
                </tr>
              </tfoot>
            </AdTable>
          </AdCard>
        )}

        <AdNote>
          «Meld klar» sender SMS til kunden. Betaling registreres ved henting i avdelingen —
          bookingen tar ikke betalt på nett.
        </AdNote>
      </AdminBody>
    </>
  );
}
