"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { Chart } from "@/components/admin/Chart";
import { Kpi } from "@/components/admin/Kpi";
import { BranchPicker, Top } from "@/components/admin/Top";
import {
  AdArrow,
  AdButton,
  AdCard,
  AdCardHead,
  AdList,
  AdListItem,
  AdNote,
  AdSectionTitle,
  AdSeg,
  AdShare,
  AdTable,
  adMeta,
  adName,
  adNum,
  adTd,
  adTh,
} from "@/components/admin/ui";
import { formatDuration, formatKr, formatKrExact } from "@/lib/format";
import { iso, pct, report, shift, toCsv, today } from "@/lib/sales";
import type { Period } from "@/lib/sales";
import { AdminBody } from "../admin-shell";
import { locationLabel, useAdmin } from "../admin-context";

const PERIODS: Array<[Period, string]> = [
  ["dag", "Dag"],
  ["uke", "Uke"],
  ["maaned", "Måned"],
  ["aar", "År"],
];

const PREV_LABEL: Record<Period, string> = {
  dag: "mot dagen før",
  uke: "mot forrige uke",
  maaned: "mot forrige måned",
  aar: "mot i fjor",
};

const CHART_TITLE: Record<Period, string> = {
  dag: "Omsetning per time",
  uke: "Omsetning per dag",
  maaned: "Omsetning per dag",
  aar: "Omsetning per måned",
};

/** Salgsrapporten (ADMIN.md § 4) — kjernen i panelet. */
export function RapportScreen() {
  const { loc, setLoc, services: catalog, setMenuOpen, toast } = useAdmin();
  const [period, setPeriod] = useState<Period>("maaned");
  const [anchor, setAnchor] = useState(() => today());

  const rep = useMemo(() => report(loc, period, anchor), [loc, period, anchor]);
  const label = locationLabel(loc);
  const atEnd = rep.range.to >= today();
  const maxCategory = Math.max(...rep.categories.map((row) => row.sumOre), 1);
  const topService = rep.services[0]?.sumOre ?? 1;
  const serviceTotal = rep.services.reduce((sum, row) => sum + row.sumOre, 0);

  function exportCsv() {
    const text = toCsv(rep, label, rep.range.label);
    // BOM foran innholdet, så norsk Excel åpner filen riktig.
    const blob = new Blob([`﻿${text}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchorEl = document.createElement("a");
    anchorEl.href = url;
    anchorEl.download = `handzon-salg-${loc}-${period}-${iso(rep.range.from)}.csv`;
    document.body.appendChild(anchorEl);
    anchorEl.click();
    anchorEl.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({
      title: "Rapport lastet ned",
      text: `${rep.orders.length} ordrelinjer som CSV, klar for regnskap.`,
    });
  }

  return (
    <>
      <Top
        title="Salgsrapport"
        sub={`${label} · ${rep.range.label}`}
        onBurger={() => setMenuOpen(true)}
        right={
          <>
            <BranchPicker value={loc} onChange={setLoc} />
            <AdButton variant="secondary" onClick={exportCsv}>
              <Download aria-hidden className="size-4" strokeWidth={1.75} />
              Eksporter CSV
            </AdButton>
          </>
        }
      />

      <AdminBody>
        <AdCard className="!flex !flex-wrap !items-center !gap-4 !p-3.5">
          <AdSeg label="Periode" options={PERIODS} value={period} onChange={setPeriod} />
          <div className="flex items-center gap-1.5">
            <AdArrow
              label="Forrige periode"
              onClick={() => setAnchor(shift(period, anchor, -1))}
            >
              ←
            </AdArrow>
            <span className="min-w-[186px] text-center font-heading text-[14.5px] font-semibold tabular text-ink max-admin-sm:min-w-[120px] max-admin-sm:text-[13.5px]">
              {rep.range.label}
            </span>
            <AdArrow
              label="Neste periode"
              disabled={atEnd}
              onClick={() => setAnchor(shift(period, anchor, 1))}
            >
              →
            </AdArrow>
          </div>
          <AdButton
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => setAnchor(today())}
          >
            Hopp til i dag
          </AdButton>
        </AdCard>

        <div className="grid grid-cols-2 gap-2.5 admin-sm:gap-3.5 admin-lg:grid-cols-4">
          <Kpi
            navy
            label="Omsetning inkl. mva"
            value={formatKr(rep.now.sumOre)}
            delta={pct(rep.now.sumOre, rep.before.sumOre)}
            hint={PREV_LABEL[period]}
          />
          <Kpi
            label="Antall ordrer"
            value={String(rep.now.count)}
            delta={pct(rep.now.count, rep.before.count)}
            hint={PREV_LABEL[period]}
          />
          <Kpi
            label="Snittordre"
            value={formatKr(rep.now.avgOre)}
            delta={pct(rep.now.avgOre, rep.before.avgOre)}
            hint={PREV_LABEL[period]}
          />
          <Kpi
            label="Medlemsandel"
            value={`${Math.round(rep.now.memberShare * 100)} %`}
            delta={pct(rep.now.memberShare, rep.before.memberShare)}
            hint={PREV_LABEL[period]}
          />
        </div>

        <AdCard>
          <AdCardHead
            title={CHART_TITLE[period]}
            sub={`${label} · ${rep.range.label} · sammenlignet med ${rep.prevRange.label}`}
            action={
              <div className="text-right">
                <p className="font-heading text-[22px] font-bold tabular text-ink">
                  {formatKr(rep.now.sumOre)}
                </p>
                <p className="text-[12.5px] text-body-soft">
                  herav mva. {formatKrExact(rep.now.vatOre)}
                </p>
              </div>
            }
          />
          <Chart data={rep.buckets} />
        </AdCard>

        <div className="grid items-start gap-4 admin-lg:grid-cols-[1.6fr_1fr]">
          <AdCard flush>
            <AdCardHead
              className="px-5 pt-5"
              title="Tjenester i perioden"
              sub="Rangert etter omsetning. Tilleggssalg vises for seg."
            />
            <AdTable>
              <thead>
                <tr>
                  <th className={adTh}>Tjeneste</th>
                  <th className={`${adTh} text-right`}>Antall</th>
                  <th className={`${adTh} text-right`}>Omsetning</th>
                  {/* Andelsstolpen er dekor med 110px fast bredde — desktop-only. */}
                  <th className={`${adTh} w-[110px] max-admin-sm:hidden`}>Andel</th>
                </tr>
              </thead>
              <tbody>
                {rep.services.map((row) => {
                  const item = catalog.find((entry) => entry.id === row.service.id);
                  return (
                    <tr key={row.service.id}>
                      <td className={adTd}>
                        <div className="flex items-center gap-3">
                          <Image
                            src={item?.image ?? "/tjenester/utvendig-handvask-thumb.webp"}
                            alt=""
                            width={44}
                            height={44}
                            className="size-11 shrink-0 rounded-control object-cover max-admin-sm:hidden"
                          />
                          <div className="min-w-0">
                            <p className={adName}>{row.service.name}</p>
                            <p className={adMeta}>
                              {row.service.category} · ca.{" "}
                              {formatDuration(row.service.durationMin)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`${adTd} ${adNum}`}>{row.count}</td>
                      <td className={`${adTd} ${adNum}`}>{formatKr(row.sumOre)}</td>
                      <td className={`${adTd} max-admin-sm:hidden`}>
                        <AdShare value={row.sumOre / topService} />
                        <p className={adMeta}>
                          {Math.round((row.sumOre / (rep.now.sumOre || 1)) * 100)} %
                        </p>
                      </td>
                    </tr>
                  );
                })}
                {rep.services.length === 0 && (
                  <tr>
                    <td className={adTd} colSpan={4}>
                      <AdNote>Ingen salg i denne perioden.</AdNote>
                    </td>
                  </tr>
                )}
              </tbody>
              {rep.services.length > 0 && (
                <tfoot>
                  <tr>
                    <td
                      className={`${adTd} border-t border-line-strong bg-surface-alt font-heading font-bold text-ink`}
                    >
                      Sum tjenester
                    </td>
                    <td
                      className={`${adTd} ${adNum} border-t border-line-strong bg-surface-alt font-bold`}
                    >
                      {rep.now.count}
                    </td>
                    <td
                      className={`${adTd} ${adNum} border-t border-line-strong bg-surface-alt font-bold`}
                    >
                      {formatKr(serviceTotal)}
                    </td>
                    <td
                      className={`${adTd} border-t border-line-strong bg-surface-alt max-admin-sm:hidden`}
                    />
                  </tr>
                </tfoot>
              )}
            </AdTable>
          </AdCard>

          <div className="flex flex-col gap-4">
            <AdCard>
              <AdCardHead title="Kategorier" />
              <AdList>
                {rep.categories.map((row) => (
                  <AdListItem key={row.label}>
                    <div className="flex justify-between gap-3">
                      <span className="font-heading text-[15px] font-semibold text-ink">
                        {row.label}
                      </span>
                      <span className="font-heading font-bold tabular text-ink">
                        {formatKr(row.sumOre)}
                      </span>
                    </div>
                    <AdShare className="mt-2" value={row.sumOre / maxCategory} />
                    <p className="mt-1.5 text-[13px] text-body-soft">
                      {row.count} ordrer ·{" "}
                      {Math.round((row.sumOre / (rep.now.sumOre || 1)) * 100)} % av omsetningen
                    </p>
                  </AdListItem>
                ))}
                {rep.categories.length === 0 && <AdNote>Ingen data.</AdNote>}
              </AdList>
            </AdCard>

            <AdCard>
              <AdCardHead
                title="Tilleggssalg"
                sub={`Festerate ${Math.round(rep.now.attachRate * 100)} % · ${formatKr(rep.now.addRevenueOre)} i perioden`}
              />
              <AdList>
                {rep.addOns.map((row) => (
                  <AdListItem
                    key={row.addOn.id}
                    title={row.addOn.name}
                    meta={`${row.count} solgt · ${formatKr(row.addOn.priceOre)} per stk.`}
                    value={formatKr(row.sumOre)}
                  />
                ))}
                {rep.addOns.length === 0 && (
                  <AdNote>Ingen tillegg solgt i perioden.</AdNote>
                )}
              </AdList>
            </AdCard>

            <AdCard>
              <AdCardHead title="Bestillingskanal" />
              <AdList>
                {rep.channels.map((row) => (
                  <AdListItem
                    key={row.id}
                    title={row.label}
                    meta={`${Math.round((row.count / (rep.now.count || 1)) * 100)} % av ordrene`}
                    value={formatKr(row.sumOre)}
                  />
                ))}
              </AdList>
            </AdCard>
          </div>
        </div>

        {loc === "alle" && rep.locations.length > 1 && (
          <AdCard flush>
            <AdCardHead
              className="px-5 pt-5"
              title="Avdelinger i perioden"
              sub="Klikk en avdeling for å filtrere hele rapporten."
            />
            <AdTable>
              <thead>
                <tr>
                  <th className={adTh}>Avdeling</th>
                  {/* Region og snittordre er desktop-only: seks kolonner
                      sprengte bredden, og begge leses uansett ut av
                      avdelingsnavnet og de to andre tallene. */}
                  <th className={`${adTh} max-admin-sm:hidden`}>Region</th>
                  <th className={`${adTh} text-right max-admin-sm:hidden`}>Ordrer</th>
                  <th className={`${adTh} text-right max-admin-sm:hidden`}>Snittordre</th>
                  <th className={`${adTh} text-right`}>Omsetning</th>
                  <th className={`${adTh} text-right`} />
                </tr>
              </thead>
              <tbody>
                {rep.locations.map((row) => (
                  <tr key={row.location.slug}>
                    <td className={adTd}>
                      {/* «Handz On» er likt for alle fjorten og er det eneste
                          som gjør navnet for bredt for en telefon. */}
                      <p className={adName}>
                        <span className="max-admin-sm:hidden">Handz On </span>
                        {row.location.name}
                      </p>
                      <p className={adMeta}>{row.location.center}</p>
                      <p className={`${adMeta} tabular admin-sm:hidden`}>
                        {row.count} ordrer · snitt{" "}
                        {formatKr(Math.round(row.sumOre / row.count))}
                      </p>
                    </td>
                    <td className={`${adTd} max-admin-sm:hidden`}>{row.location.region}</td>
                    <td className={`${adTd} ${adNum} max-admin-sm:hidden`}>{row.count}</td>
                    <td className={`${adTd} ${adNum} max-admin-sm:hidden`}>
                      {formatKr(Math.round(row.sumOre / row.count))}
                    </td>
                    <td className={`${adTd} ${adNum}`}>{formatKr(row.sumOre)}</td>
                    <td className={`${adTd} text-right`}>
                      <AdButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setLoc(row.location.slug)}
                      >
                        Vis →
                      </AdButton>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {/* Egen mobilrad: ordre- og snittcellene er skjult under 760px,
                    så uten denne mistet kjedesummen sin sammenheng. */}
                <tr className="admin-sm:hidden">
                  <td
                    className={`${adTd} border-t border-line-strong bg-surface-alt`}
                    colSpan={6}
                  >
                    <span className="flex items-center justify-between gap-3 font-heading font-bold text-ink">
                      <span>Sum hele kjeden</span>
                      <span className="tabular">{formatKr(rep.now.sumOre)}</span>
                    </span>
                    <span className="mt-0.5 block text-[12.5px] tabular text-body-soft">
                      {rep.now.count} ordrer · snitt {formatKr(rep.now.avgOre)}
                    </span>
                  </td>
                </tr>
                <tr className="max-admin-sm:hidden">
                  <td
                    className={`${adTd} border-t border-line-strong bg-surface-alt font-heading font-bold text-ink`}
                    colSpan={2}
                  >
                    Sum hele kjeden
                  </td>
                  <td
                    className={`${adTd} ${adNum} border-t border-line-strong bg-surface-alt font-bold`}
                  >
                    {rep.now.count}
                  </td>
                  <td
                    className={`${adTd} ${adNum} border-t border-line-strong bg-surface-alt font-bold`}
                  >
                    {formatKr(rep.now.avgOre)}
                  </td>
                  <td
                    className={`${adTd} ${adNum} border-t border-line-strong bg-surface-alt font-bold`}
                  >
                    {formatKr(rep.now.sumOre)}
                  </td>
                  <td className={`${adTd} border-t border-line-strong bg-surface-alt`} />
                </tr>
              </tfoot>
            </AdTable>
          </AdCard>
        )}

        <AdCard>
          <AdCardHead title="Regnskapslinjer" />
          <div className="grid gap-3.5 admin-lg:grid-cols-3">
            <div>
              <AdSectionTitle>Omsetning</AdSectionTitle>
              <AdList>
                <AdListItem title="Tjenester" value={formatKr(serviceTotal)} />
                <AdListItem title="Tillegg" value={formatKr(rep.now.addRevenueOre)} />
                <AdListItem>
                  <div className="flex justify-between gap-3">
                    <span className="font-heading text-[15px] font-semibold text-navy">
                      Kundeklubb-rabatt
                    </span>
                    <span className="font-heading font-bold tabular text-navy">
                      −{formatKr(rep.now.discountOre)}
                    </span>
                  </div>
                </AdListItem>
              </AdList>
            </div>
            <div>
              <AdSectionTitle>Merverdiavgift</AdSectionTitle>
              <AdList>
                <AdListItem title="Sum inkl. mva" value={formatKr(rep.now.sumOre)} />
                <AdListItem
                  title="Herav mva. (25 %)"
                  value={formatKrExact(rep.now.vatOre)}
                />
                <AdListItem
                  title="Grunnlag eks. mva"
                  value={formatKr(rep.now.sumOre - rep.now.vatOre)}
                />
              </AdList>
            </div>
            <div>
              <AdSectionTitle>Nøkkeltall</AdSectionTitle>
              <AdList>
                <AdListItem title="Snittordre" value={formatKr(rep.now.avgOre)} />
                <AdListItem
                  title="Medlemsandel"
                  value={`${Math.round(rep.now.memberShare * 100)} %`}
                />
                <AdListItem
                  title="Festerate tillegg"
                  value={`${Math.round(rep.now.attachRate * 100)} %`}
                />
              </AdList>
            </div>
          </div>
          <AdNote className="mt-4">
            Alle beløp er inkl. mva. hvis ikke annet er oppgitt. Hver avdeling er en egen
            juridisk enhet med eget regnskap. Eksporten inneholder én linje per ordre og kan
            leses rett inn i regnskapssystemet.
          </AdNote>
        </AdCard>
      </AdminBody>
    </>
  );
}
