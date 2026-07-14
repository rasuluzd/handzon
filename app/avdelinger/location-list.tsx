"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { locations } from "@/lib/mock-data";

/**
 * Forenklet «kartvisning» (FR-1.2): avdelingene plottes som punkter i et
 * stilisert koordinatsystem basert på reelle lat/lng. I produksjon byttes
 * dette mot Google Maps.
 */
function MiniMap({ highlighted }: { highlighted: Set<string> }) {
  const lats = locations.map((location) => location.geo.lat);
  const lngs = locations.map((location) => location.geo.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return (
    <svg
      viewBox="0 0 100 130"
      role="img"
      aria-label="Kart over Norge med avdelingene markert"
      className="h-full w-full"
    >
      <rect width="100" height="130" rx="8" className="fill-surface-raised" />
      {locations.map((location) => {
        const x = 12 + ((location.geo.lng - minLng) / (maxLng - minLng)) * 76;
        const y = 118 - ((location.geo.lat - minLat) / (maxLat - minLat)) * 106;
        const active = highlighted.has(location.id);
        return (
          <g key={location.id}>
            <circle
              cx={x}
              cy={y}
              r={active ? 3 : 1.8}
              className={active ? "fill-accent" : "fill-muted/50"}
            />
            {active && (
              <text
                x={x}
                y={y - 4.5}
                textAnchor="middle"
                className="fill-foreground text-[4px] font-semibold"
              >
                {location.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function LocationList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return locations;
    return locations.filter(
      (location) =>
        location.name.toLowerCase().includes(term) ||
        location.city.toLowerCase().includes(term) ||
        location.postalCode.startsWith(term) ||
        location.region.toLowerCase().includes(term),
    );
  }, [query]);

  const highlighted = useMemo(
    () => new Set(query.trim() ? filtered.map((location) => location.id) : []),
    [filtered, query],
  );

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
      <div>
        <label className="block">
          <span className="text-sm font-semibold">Søk etter avdeling</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="By eller postnummer, f.eks. Bergen eller 0668"
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-base placeholder:text-muted/60 focus:border-accent focus:outline-none"
          />
        </label>

        <ul className="mt-6 space-y-3">
          {filtered.map((location) => (
            <li key={location.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    href={`/avdelinger/${location.slug}`}
                    className="text-lg font-semibold hover:text-accent"
                  >
                    Handz On {location.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-muted">
                    {location.address}, {location.postalCode} {location.city}
                  </p>
                  {location.campaign && (
                    <p className="mt-1 text-sm font-medium text-accent">
                      {location.campaign}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <ButtonLink
                    href={`/avdelinger/${location.slug}`}
                    variant="secondary"
                    className="!min-h-10 !px-4 text-sm"
                  >
                    Se avdeling
                  </ButtonLink>
                  <ButtonLink
                    href={`/booking?avdeling=${location.slug}`}
                    className="!min-h-10 !px-4 text-sm"
                  >
                    Bestill
                  </ButtonLink>
                </div>
              </Card>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="rounded-2xl border border-border p-6 text-muted">
              Ingen avdelinger matcher «{query}». Prøv et annet søk.
            </li>
          )}
        </ul>
      </div>

      <div className="order-first h-64 lg:order-none lg:h-auto lg:max-h-[520px]">
        <MiniMap highlighted={highlighted} />
      </div>
    </div>
  );
}
