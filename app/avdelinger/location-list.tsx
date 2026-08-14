"use client";

import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BranchCard } from "@/components/site/BranchCard";
import { GoogleBranchMap } from "@/components/site/GoogleBranchMap";
import { rankLocations } from "@/lib/geo";
import type { GeoPoint } from "@/lib/geo";
import { locations } from "@/lib/mock-data";

/**
 * Avdelingsoversikt (SCREENS.md § Avdelinger).
 *
 * DESKTOP: sticky kart til venstre, søk og liste til høyre. Hover eller
 * tastaturfokus på et kort flytter kartet.
 *
 * MOBIL: ingen kart. Hover finnes ikke på touch, så kartet var låst til den
 * første avdelingen for alltid — en bruker som søkte «Bergen» fikk fem
 * Bergens-kort over et kart som viste Lambertseter. Samtidig lå iframen øverst
 * i viewporten og gjorde `loading="lazy"` til en no-op, midt i kritisk vei.
 * Mobilopplevelsen er derfor søk + «Nær meg» + rangert liste, og hvert kort
 * lenker uansett videre til avdelingssiden sin, som har både kart og
 * «Veibeskrivelse ↗». Et søk uten treff viser alle avdelinger med forklarende
 * linje — aldri en tom liste.
 */

/** Antall kort før «Vis alle avdelinger» på mobil. Fjorten kort på rad er ~3 700px. */
const MOBILE_PREVIEW = 6;

export function LocationList() {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoFailed, setGeoFailed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  /** null = kartet følger toppen av trefflista. Settes kun av hover/fokus (desktop). */
  const [pinnedSlug, setPinnedSlug] = useState<string | null>(null);

  const ranking = useMemo(
    () => rankLocations(locations, query, position),
    [query, position],
  );

  /* Kartutsnittet UTLEDES i stedet for å lagres: uten pin følger det første
     treff i lista, slik at et søk på «Bergen» faktisk flytter kartet til
     Bergen. Tidligere kunne bare hover endre det, og søket lot kartet stå
     igjen på feil by. */
  const focus =
    (pinnedSlug ? locations.find((item) => item.slug === pinnedSlug) : undefined) ??
    ranking.results[0] ??
    locations[0];

  /* Kartet dempes mens nytt utsnitt lastes, i stedet for å blinke
     (MOTION.md § Kartet). Signalet er iframens egen load-hendelse, ikke en
     timer i en effekt — react-hooks/set-state-in-effect er på, og en fast
     240ms gjettet uansett feil. Byttes mot panTo() når Maps JS API-nøkkelen
     er inne. */
  const [mapLoading, setMapLoading] = useState(false);

  function focusBranch(slug: string) {
    if (slug === focus.slug) return;
    setPinnedSlug(slug);
    setMapLoading(true);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setPosition(null);
    setPinnedSlug(null);
    setGeoFailed(false);
  }

  async function handleLocate() {
    setLocating(true);
    setGeoFailed(false);
    const { getBrowserPosition } = await import("@/lib/geo");
    const point = await getBrowserPosition();
    setLocating(false);
    /* Avslag, timeout og usikker kontekst resolver alle null. Før nullstilte vi
       søket uansett, uten feilmelding — knappen så rett og slett ødelagt ut, og
       det brukeren hadde skrevet forsvant. Nå røres verken søk eller liste. */
    if (!point) {
      setGeoFailed(true);
      return;
    }
    setPosition(point);
    setQuery("");
    setPinnedSlug(null);
    setShowAll(false);
  }

  return (
    <div className="grid items-start gap-6 hz:grid-cols-2">
      {/* display:none under 900px — ikke `visibility`. Det er det som gjør at
          den lazy-lastede iframen aldri lastes på mobil. */}
      <div className="hidden hz:sticky hz:top-[95px] hz:block">
        <div
          className={`hz-map h-[clamp(280px,40vw,500px)] overflow-hidden rounded-card-lg border border-line-strong bg-map-bg${mapLoading ? " is-loading" : ""}`}
        >
          <GoogleBranchMap
            mode="place"
            query={`Handz On ${focus.name}, ${focus.address}, ${focus.postalCode} ${focus.city}`}
            title={`Kart – Handz On ${focus.name}`}
            onLoad={() => setMapLoading(false)}
          />
        </div>
        <p className="mt-3 flex items-center gap-2.5 text-[13.5px] text-body-soft">
          <MapPin aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
          <span>
            Viser <strong className="font-semibold text-ink">Handz On {focus.name}</strong> ·{" "}
            {focus.center}
          </span>
        </p>
      </div>

      <div>
        {/* Én rad på 390px ga søkefeltet ca. 150px synlig tekst — placeholderen
            ble kuttet midt i ordet. Under 900px stables de i stedet, og begge
            får full bredde som trykkflate. */}
        <div className="mb-3 flex flex-col gap-2.5 hz:flex-row">
          <label className="relative block hz:flex-1">
            <span className="sr-only">Søk etter avdeling</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-[14px] top-1/2 size-[18px] -translate-y-1/2 text-muted"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="By eller postnummer"
              className="min-h-[46px] w-full rounded-control border border-line-heavy bg-surface py-[11px] pl-11 pr-3.5 text-[16px] text-ink outline-none transition-[border-color,box-shadow] hover:border-body-soft focus:border-navy focus:shadow-[0_0_0_3px_var(--color-navy-14)]"
            />
          </label>
          <Button
            variant="secondary"
            onClick={handleLocate}
            loading={locating}
            className="max-hz:w-full"
          >
            <MapPin aria-hidden className="size-4" strokeWidth={1.75} />
            Nær meg
          </Button>
        </div>

        <p aria-live="polite" className="mb-3 text-[13.5px] leading-[1.5] text-body-soft">
          {geoFailed
            ? "Fant ikke posisjonen din. Søk på by eller postnummer i stedet."
            : ranking.note}
        </p>

        <div className="flex flex-col gap-2.5">
          {ranking.results.map((location, index) => (
            /* Wrapperen bærer to ting kortet ikke kan bære selv: den klipper
               visningen på mobil (alle kortene blir i DOM, så søket treffer
               fortsatt alle fjorten), og den gir kartet et tastaturspor —
               onFocus bobler opp fra lenkene inne i kortet. */
            <div
              key={location.id}
              onMouseEnter={() => focusBranch(location.slug)}
              onFocus={() => focusBranch(location.slug)}
              className={!showAll && index >= MOBILE_PREVIEW ? "max-hz:hidden" : undefined}
            >
              <BranchCard
                location={location}
                elevated
                active={focus.slug === location.slug}
                distanceKm={ranking.showDistance ? location.distanceKm : undefined}
              />
            </div>
          ))}
        </div>

        {!showAll && ranking.results.length > MOBILE_PREVIEW && (
          <Button
            variant="secondary"
            block
            onClick={() => setShowAll(true)}
            className="mt-2.5 hz:hidden"
          >
            Vis alle {ranking.results.length} avdelinger
          </Button>
        )}
      </div>
    </div>
  );
}
