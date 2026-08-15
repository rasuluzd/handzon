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

/**
 * Hvor mange søyler som får datoen sin under seg. Antallet søyler er det vi
 * har å gå på: en måned deler bredden på 31, en uke på 7. På et 390px
 * adminkort er søylen 6px bred, og da får bare hver femte plass til et
 * tosifret tall — på 1069px er annenhver rikelig.
 */
function labelStep(count: number, narrow: boolean): number {
  if (count > 20) return narrow ? 5 : 2;
  if (count >= 12) return narrow ? 2 : 1;
  return 1;
}

export function Chart({ data }: { data: Bucket[] }) {
  const peak = Math.max(...data.map((bucket) => bucket.sumOre), 0);
  const max = niceMax(peak);
  const lines = [1, 0.75, 0.5, 0.25, 0];
  const stepWide = labelStep(data.length, false);
  const stepNarrow = labelStep(data.length, true);
  /* Telles bakfra, så siste søyle ALLTID får datoen sin. Den er i dag på
     oversiktens fjortendagers, og siste dag i måneden på rapporten — telt
     forfra falt begge ut i en måned med tretti dager. */
  const fromEnd = (index: number) => data.length - 1 - index;

  return (
    <>
      {/* Skalaen har sin egen kolonne til høyre. Før lå tallene absolutt
          plassert INNE i søyleflaten, på `right-0`, uten at noe holdt av plass
          til dem — så siste søyle havnet under dem i hver eneste periode: «des»
          i året, «søn» i uken, 30. og 31. i måneden. Og siden søylene kommer
          etter etikettene i DOM-en, malte de seg dessuten over tallene.

          Bredden på renna kommer fra en usynlig kopi av det største beløpet, ikke
          fra et gjettet pikseltall. Da holder den like godt for «12 500,-» på én
          avdeling som for «5 000 000,-» på hele kjeden. */}
      <div className="flex h-[230px] max-admin-sm:h-[190px]">
        <div className="relative flex min-w-0 flex-1 items-end gap-0.5 pt-[26px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[22px] top-[26px]"
          >
            {lines.map((fraction) => (
              <span
                key={fraction}
                className={`absolute inset-x-0 block h-px ${fraction === 1 ? "bg-line-strong" : "bg-line"}`}
                style={{ bottom: `${fraction * 100}%` }}
              />
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
            {/* Sentrert på søyla og fri til å stikke ut over nabokolonnene,
                i stedet for `inset-x-0 truncate`. Med 6px kolonne klippet
                truncate hvert tosifret tall til første siffer, så andre
                halvdel av måneden sto som «1 1 1 1». Naboene er skjult når
                denne vises, så plassen er ledig. */}
            <span
              className={`pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-heading text-[10.5px] tabular text-body-soft ${
                fromEnd(index) % stepWide === 0 ? "" : "hidden"
              } ${fromEnd(index) % stepNarrow === 0 ? "max-admin-sm:block" : "max-admin-sm:hidden"}`}
            >
              {bucket.x}
            </span>
          </div>
          );
        })}
        </div>

        <div aria-hidden className="relative shrink-0 pb-[22px] pl-2 pt-[26px]">
          {/* Usynlig, men i flyten: den gir kolonnen bredden sin. */}
          <span className="invisible block font-heading text-[10.5px] tabular">
            {formatKr(max)}
          </span>
          <div className="absolute bottom-[22px] left-2 right-0 top-[26px]">
            {lines.map((fraction) => (
              <span
                key={fraction}
                className="absolute right-0 -translate-y-1/2 whitespace-nowrap font-heading text-[10.5px] tabular text-body-soft"
                style={{ bottom: `${fraction * 100}%` }}
              >
                {fraction === 0 ? "0" : formatKr(Math.round(max * fraction))}
              </span>
            ))}
          </div>
        </div>
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
