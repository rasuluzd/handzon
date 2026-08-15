"use client";

import { formatKr } from "@/lib/format";
import type { Bucket } from "@/lib/sales";

/**
 * Stolpediagram (ADMIN.md § 4). Rene stolper, ingen SVG.
 * Høyeste stolpe i perioden er rød, resten navy, stengte dager navy-24.
 * **Ingen inn-animasjon** — data skal ikke vente på pynt (MOTION.md).
 */
function niceMax(value: number): number {
  if (value <= 0) return 100000;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]) {
    if (value <= step * magnitude) return step * magnitude;
  }
  return 10 * magnitude;
}

export function Chart({ data }: { data: Bucket[] }) {
  const peak = Math.max(...data.map((bucket) => bucket.sumOre), 0);
  const max = niceMax(peak);
  const lines = [1, 0.75, 0.5, 0.25, 0];

  return (
    <>
      <div className="relative flex h-[230px] items-end gap-0.5 pt-[26px] max-admin-sm:h-[190px]">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[22px] top-[26px]">
          {lines.map((fraction) => (
            <span
              key={fraction}
              className={`absolute inset-x-0 block h-px ${fraction === 1 ? "bg-line-strong" : "bg-line"}`}
              style={{ bottom: `${fraction * 100}%` }}
            >
              <span className="absolute right-0 -translate-y-1/2 bg-surface px-1 font-heading text-[10.5px] tabular text-body-soft">
                {fraction === 0 ? "0" : formatKr(Math.round(max * fraction))}
              </span>
            </span>
          ))}
        </div>

        {data.map((bucket, index) => {
          // Verktøytipset forankres innover i endene, ellers ville det stukket
          // ut av kortet og gitt siden en vannrett rullefelt.
          const anchor =
            index < 2
              ? "left-0"
              : index > data.length - 3
                ? "right-0"
                : "left-1/2 -translate-x-1/2";
          return (
          <div
            key={`${bucket.x}-${index}`}
            className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end pb-[22px]"
          >
            {/* Hover-forklaringen finnes ikke under 760px. Den er 213px bred
                og `whitespace-nowrap`, så på de siste søylene stakk den utenfor
                skjermkanten og utvidet dokumentet sidelengs — for en tilstand
                som aldri inntreffer på en touch-skjerm. */}
            <span
              className={`pointer-events-none absolute bottom-[calc(100%-18px)] z-[5] hidden whitespace-nowrap rounded-badge bg-ink px-2.5 py-[7px] font-heading text-[12px] tabular text-white opacity-0 shadow-pop transition-opacity duration-[120ms] group-hover:opacity-100 admin-sm:block ${anchor}`}
            >
              {bucket.full}: {formatKr(bucket.sumOre)}
              {` · ${bucket.count} ${bucket.count === 1 ? "ordre" : "ordrer"}`}
              {bucket.closed ? " · stengt" : ""}
            </span>
            <span
              className={`w-full max-w-[46px] rounded-t-[3px] transition-colors duration-[120ms] ${
                bucket.closed
                  ? "bg-navy-24"
                  : bucket.sumOre === peak && peak > 0
                    ? "bg-red"
                    : "bg-navy group-hover:bg-navy-hover"
              }`}
              style={{ height: `${(bucket.sumOre / max) * 100}%`, minHeight: 2 }}
            />
            <span className="absolute inset-x-0 bottom-0 truncate text-center font-heading text-[10.5px] tabular text-body-soft">
              {bucket.x}
            </span>
          </div>
          );
        })}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-[18px] border-t border-line pt-3.5 text-[13px] text-body-soft">
        <span className="inline-flex items-center gap-[7px]">
          <i aria-hidden className="block size-2.5 rounded-[2px] bg-navy" />
          Omsetning inkl. mva
        </span>
        <span className="inline-flex items-center gap-[7px]">
          <i aria-hidden className="block size-2.5 rounded-[2px] bg-red" />
          Beste bøtte i perioden
        </span>
        <span className="inline-flex items-center gap-[7px]">
          <i aria-hidden className="block size-2.5 rounded-[2px] bg-navy-24" />
          Stengt
        </span>
      </div>
    </>
  );
}
