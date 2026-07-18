"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GoogleBranchMap } from "@/components/site/GoogleBranchMap";
import { formatDistance, getBrowserPosition, rankLocations } from "@/lib/geo";
import type { GeoPoint } from "@/lib/geo";
import { locations } from "@/lib/mock-data";

/**
 * Avdelingsoversikt (FR-1.2): kart + søk + «Nær meg». Et søk sorterer etter
 * nærhet i stedet for å tømme listen (rankLocations i lib/geo).
 */
export function LocationList() {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [locating, setLocating] = useState(false);

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
    <div>
      <div className="mb-[18px] h-[clamp(260px,30vw,440px)] overflow-hidden rounded-[12px] border border-line-strong bg-[#eef1f5]">
        <GoogleBranchMap />
      </div>

      <div className="mb-2 flex gap-2.5">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPosition(null);
          }}
          placeholder="By eller postnummer, f.eks. Bergen"
          className="min-w-0 flex-1 rounded-[8px] border border-[rgba(20,32,58,0.16)] bg-surface px-4 py-3.5 text-[16px] text-ink outline-none placeholder:text-muted-light focus:border-navy"
        />
        <button
          type="button"
          onClick={handleLocate}
          disabled={locating}
          className="shrink-0 rounded-[8px] border border-navy/30 bg-surface px-4 font-heading text-[15px] font-semibold text-navy hover:bg-surface-alt disabled:opacity-60"
        >
          {locating ? "Finner…" : "📍 Nær meg"}
        </button>
      </div>
      {ranking.note && (
        <p className="mx-0.5 mt-1.5 text-[14px] text-muted">{ranking.note}</p>
      )}

      <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-3.5">
        {ranking.results.map((location) => (
          <div
            key={location.id}
            className="rounded-[11px] border border-line-strong bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/avdelinger/${location.slug}`}
                  className="font-heading text-[20px] font-semibold text-ink hover:text-navy"
                >
                  Handz On {location.name}
                  {ranking.showDistance && "distanceKm" in location && (
                    <span className="ml-2 text-[14px] font-normal text-navy">
                      {formatDistance(location.distanceKm as number)}
                    </span>
                  )}
                </Link>
                <div className="mt-1 text-[14.5px] text-muted">
                  {location.address}, {location.postalCode} {location.city}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `Handz On Auto Care ${location.name}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-[13px] font-semibold text-navy hover:text-navy-hover"
                >
                  Åpne i Google Maps →
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-[6px] bg-navy/8 px-[11px] py-1.5">
                <span className="h-[7px] w-[7px] rounded-full bg-navy" />
                <span className="whitespace-nowrap text-[13px] font-semibold text-navy">
                  Åpen nå
                </span>
              </div>
            </div>

            {location.campaign && (
              <div className="mt-3 rounded-[8px] bg-navy/6 px-3 py-2.5 text-[13.5px] font-semibold text-navy">
                {location.campaign}
              </div>
            )}

            <div className="my-4 flex gap-7 border-y border-line py-4">
              <div>
                <div className="mb-1 text-[13px] text-muted-light">Man–fre</div>
                <div className="font-heading text-[16px] font-medium text-body-strong">
                  08–17{" "}
                  <span className="font-normal text-muted-light">(tors. 18)</span>
                </div>
              </div>
              <div>
                <div className="mb-1 text-[13px] text-muted-light">Lør / søn</div>
                <div className="font-heading text-[16px] font-medium text-body-strong">
                  10–15 / stengt
                </div>
              </div>
            </div>

            <Link
              href={`/booking?avdeling=${location.slug}`}
              className="block w-full rounded-[8px] bg-navy py-[15px] text-center font-heading text-[16px] font-semibold text-white transition-colors hover:bg-navy-hover"
            >
              Book her
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
