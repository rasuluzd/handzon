"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Newspaper, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Chart } from "@/components/admin/Chart";
import { Kpi } from "@/components/admin/Kpi";
import { BranchPicker, Top } from "@/components/admin/Top";
import {
  AdButton,
  AdCard,
  AdCardHead,
  AdList,
  AdListItem,
  AdNote,
  AdSectionTitle,
  AdTable,
  AdTag,
  adMeta,
  adName,
  adNum,
  adTd,
  adTh,
} from "@/components/admin/ui";
import { formatDuration, formatKr } from "@/lib/format";
import { addDays, dayCapacity, ordersInRange, pct, report, today } from "@/lib/sales";
import { adviceFor } from "@/lib/weather-advice";
import type { WeatherAdvice } from "@/lib/weather-advice";
import type { Forecast } from "@/lib/weather";
import { addOns, locations, services } from "@/lib/mock-data";
import type { Region } from "@/lib/types";
import { AdminBody } from "./admin-shell";
import { countDirty, locationLabel, useAdmin } from "./admin-context";

/** Oversikt (ADMIN.md § 2): dagens drift for én avdeling eller hele kjeden. */
export function OversiktScreen({
  forecasts,
}: {
  /** Hentet i serverkomponenten — se app/admin/page.tsx. */
  forecasts: Record<Region, Forecast>;
}) {
  const { loc, setLoc, services: catalog, posts, setMenuOpen } = useAdmin();
  const now = today();

  const day = useMemo(() => report(loc, "dag", now), [loc, now]);
  const month = useMemo(() => report(loc, "maaned", now), [loc, now]);
  const trend = useMemo(() => {
    const out = [];
    for (let i = 13; i >= 0; i -= 1) {
      const date = addDays(now, -i);
      const orders = ordersInRange(loc, date, date);
      out.push({
        x: String(date.getDate()),
        full: date.toLocaleDateString("nb-NO", {
          weekday: "long",
          day: "numeric",
          month: "short",
        }),
        sumOre: orders.reduce((sum, order) => sum + order.totalOre, 0),
        count: orders.length,
        closed: date.getDay() === 0,
      });
    }
    return out;
  }, [loc, now]);

  const label = locationLabel(loc);
  const branch = locations.find((item) => item.slug === loc);
  /* Dagskapasitet fra åpningstidene, ikke et fast tall — se `dayCapacity`.
     `booked` er klemt til kapasiteten: et belegg over 100 % er ikke en
     tilstand denne skjermen skal kunne vise. */
  const capacity = branch
    ? dayCapacity(branch, now)
    : locations.reduce((sum, item) => sum + dayCapacity(item, now), 0);
  const booked = Math.min(day.now.count, capacity);
  const fill = capacity > 0 ? booked / capacity : 0;

  const upcoming = day.orders.filter((order) => order.hour >= new Date().getHours());
  const list = (upcoming.length > 0 ? upcoming : day.orders.slice(-6)).slice(0, 6);

  /* Værrådet gjelder ÉN avdeling. Ser man hele kjeden, vises det ikke:
     fjorten avdelinger i tre landsdeler har ikke ett felles vær, og et råd om
     å flytte lakkforsegling gir bare mening for den som faktisk står med
     bestillingen. Kjedeoversikten er uendret. */
  const advice = useMemo<WeatherAdvice | null>(() => {
    if (!branch) return null;
    const forecast = forecasts[branch.region];
    if (!forecast) return null;
    const horizon = ordersInRange(branch.slug, now, addDays(now, 4));
    return adviceFor(forecast, horizon, fill);
  }, [branch, forecasts, now, fill]);
  const forecastSource = branch ? forecasts[branch.region]?.source : undefined;
  const drafts = posts.filter((post) => !post.published).length;
  const dirty = countDirty(catalog);

  return (
    <>
      <Top
        title="Oversikt"
        sub={`${label} · ${now.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
        onBurger={() => setMenuOpen(true)}
        right={
          <>
            <BranchPicker value={loc} onChange={setLoc} />
            <Link href="/admin/rapport">
              <AdButton>
                <TrendingUp aria-hidden className="size-4" strokeWidth={1.75} />
                Full rapport
              </AdButton>
            </Link>
          </>
        }
      />

      <AdminBody>
        <div className="grid grid-cols-2 gap-2.5 admin-sm:gap-3.5 admin-lg:grid-cols-4">
          <Kpi
            navy
            label="Omsetning i dag"
            value={formatKr(day.now.sumOre)}
            delta={pct(day.now.sumOre, day.before.sumOre)}
            hint="mot samme dag i forrige uke"
          />
          <Kpi
            label="Ordrer i dag"
            value={String(day.now.count)}
            delta={pct(day.now.count, day.before.count)}
            hint="mot i går"
          />
          <Kpi
            label="Snittordre"
            value={formatKr(day.now.avgOre)}
            delta={pct(day.now.avgOre, day.before.avgOre)}
            hint="mot i går"
          />
          <Kpi
            label="Denne måneden"
            value={formatKr(month.now.sumOre)}
            delta={pct(month.now.sumOre, month.before.sumOre)}
            hint="mot forrige måned"
          />
        </div>

        <div className="grid items-start gap-4 admin-lg:grid-cols-[1.6fr_1fr]">
          {/* ÉN rad, to kolonner som hver er en sammenhengende stabel — ikke to
              rutenettrader. Med `items-start` og to rader ble det dødrom ved
              hver radgrense så snart kolonnene var ulikt høye: 135px tomt
              under «Neste inn i dag» fordi «Å gjøre» var høyere. Nå flyter
              hver kolonne uavbrutt, og eneste ubalanse havner nederst på
              siden der den ikke leses som et hull. */}
          <div className="flex flex-col gap-4">
            <AdCard>
              <AdCardHead
                title="Omsetning siste 14 dager"
                sub={`${label} · inkl. mva`}
                action={
                  <Link href="/admin/rapport">
                    <AdButton variant="ghost" size="sm">
                      Se rapport →
                    </AdButton>
                  </Link>
                }
              />
              <Chart data={trend} />
            </AdCard>
            <AdCard flush>
              <AdCardHead
                className="px-5 pt-5"
                title={upcoming.length > 0 ? "Neste inn i dag" : "Siste inn i dag"}
                sub={`${day.now.count} ordrer totalt · ${formatKr(day.now.sumOre)}`}
                action={
                  <Link href="/admin/bestillinger">
                    <AdButton variant="ghost" size="sm">
                      Alle bestillinger →
                    </AdButton>
                  </Link>
                }
              />
              <AdTable>
                <thead>
                  <tr>
                    <th className={adTh}>Tid</th>
                    <th className={adTh}>Tjeneste</th>
                    {loc === "alle" && <th className={adTh}>Avdeling</th>}
                    <th className={adTh}>Kanal</th>
                    <th className={`${adTh} text-right`}>Sum</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((order) => {
                    const service = services.find((item) => item.id === order.serviceId)!;
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
                          {order.member ? (
                            <AdTag variant="ok">Medlem</AdTag>
                          ) : (
                            <AdTag variant="off">
                              {order.channel === "nett"
                                ? "Nett"
                                : order.channel === "skranke"
                                  ? "Skranke"
                                  : "Telefon"}
                            </AdTag>
                          )}
                        </td>
                        <td className={`${adTd} ${adNum}`}>{formatKr(order.totalOre)}</td>
                      </tr>
                    );
                  })}
                  {list.length === 0 && (
                    <tr>
                      <td className={adTd} colSpan={loc === "alle" ? 5 : 4}>
                        <AdNote>Ingen ordrer i dag — søndager er stengt.</AdNote>
                      </td>
                    </tr>
                  )}
                </tbody>
              </AdTable>
            </AdCard>
          </div>

          <div className="flex flex-col gap-4">
            {/* Værrådet står øverst når det finnes, og forsvinner helt når ingen
                regel slår til. Et kort som alltid er der, slutter folk å lese —
                og da mister frostvarselet sin verdi den ene dagen det betyr noe. */}
            {advice && (
            <AdCard>
              <AdCardHead
                title="Vær og drift"
                sub={
                  forecastSource === "met.no"
                    ? "Varsel fra MET Norway"
                    : "Demovarsel — MET var ikke tilgjengelig"
                }
                action={
                  <AdTag variant={advice.level === "varsel" ? "warn" : "ok"} dot>
                    {advice.level === "varsel" ? "Krever handling" : "Mulighet"}
                  </AdTag>
                }
              />
              <p className="font-heading text-[17px] font-semibold leading-[1.25] text-ink">
                {advice.title}
              </p>
              <AdNote className="mt-1.5">{advice.body}</AdNote>
              {advice.affected != null && (
                <Link href="/admin/bestillinger" className="mt-3.5 inline-flex">
                  <AdButton variant="secondary" size="sm">
                    Se de {advice.affected} bestillingene
                  </AdButton>
                </Link>
              )}
            </AdCard>
            )}

            <AdCard>
            <AdCardHead title="Kapasitet i dag" />
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-[34px] font-bold leading-none tabular text-ink">
                {booked}
              </span>
              <span className="text-[15px] text-body-soft">av {capacity} plasser booket</span>
            </div>
            <div className="mt-3.5 h-2.5 overflow-hidden rounded-[3px] bg-surface-sunken">
              <span
                className={`block h-full rounded-[3px] ${fill > 0.9 ? "bg-red" : "bg-navy"}`}
                style={{ width: `${fill * 100}%` }}
              />
            </div>
            <AdNote className="mt-3">
              {fill > 0.9
                ? "Nesten fullt. Vurder å åpne kveldstider."
                : fill > 0.6
                  ? "God belegg. Ledige tider sent på dagen."
                  : "Ledig kapasitet — vurder å pushe dagens kampanje."}
            </AdNote>

            <AdSectionTitle className="mt-6">Fordeling i dag</AdSectionTitle>
            <AdList>
              {day.categories.slice(0, 5).map((row) => (
                <AdListItem
                  key={row.label}
                  title={row.label}
                  meta={`${row.count} ${row.count === 1 ? "ordre" : "ordrer"}`}
                  value={formatKr(row.sumOre)}
                />
              ))}
              {day.categories.length === 0 && (
                <AdNote>Ingen ordrer registrert i dag ennå.</AdNote>
              )}
            </AdList>
            </AdCard>
          <AdCard>
            <AdCardHead title="Å gjøre" />
            <AdList>
              <AdListItem
                icon={
                  <Newspaper
                    aria-hidden
                    className="size-5 shrink-0 text-status-closed"
                    strokeWidth={1.75}
                  />
                }
                title={`${drafts} blogginnlegg venter`}
                meta="Utkast som ikke er publisert"
                action={
                  <Link href="/admin/blogg">
                    <AdButton variant="secondary" size="sm">
                      Åpne
                    </AdButton>
                  </Link>
                }
              />
              <AdListItem
                icon={
                  <Sparkles aria-hidden className="size-5 shrink-0 text-navy" strokeWidth={1.75} />
                }
                title={`${dirty} prisendringer ulagret`}
                meta="Endringer i tjenestekatalogen"
                action={
                  <Link href="/admin/tjenester">
                    <AdButton variant="secondary" size="sm">
                      Åpne
                    </AdButton>
                  </Link>
                }
              />
              <AdListItem
                icon={
                  <ShieldCheck
                    aria-hidden
                    className="size-5 shrink-0 text-status-open"
                    strokeWidth={1.75}
                  />
                }
                title="Arbeidstilsynet — godkjenning gyldig"
                meta="Neste fornyelse 12.03.2027"
              />
            </AdList>

            <AdSectionTitle className="mt-6">Beste tjenester denne måneden</AdSectionTitle>
            <AdList>
              {month.services.slice(0, 4).map((row) => {
                const item = catalog.find((entry) => entry.id === row.service.id);
                return (
                  <AdListItem
                    key={row.service.id}
                    icon={
                      <Image
                        src={item?.image ?? "/tjenester/utvendig-handvask-thumb.webp"}
                        alt=""
                        width={44}
                        height={44}
                        className="size-11 shrink-0 rounded-control object-cover"
                      />
                    }
                    title={row.service.name}
                    meta={`${row.count} solgt`}
                    value={formatKr(row.sumOre)}
                  />
                );
              })}
            </AdList>
          </AdCard>
          </div>
        </div>
      </AdminBody>
    </>
  );
}
