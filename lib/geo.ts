import type { Location } from "./types";

/**
 * Geolokasjon og avdelingssøk (FR-1.2 / FR-2.1 steg 1).
 * Haversine er mer enn presist nok på by-nivå.
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Standardanker når brukeren ikke har delt posisjon (SCREENS.md § Avdelinger). */
export const OSLO_CENTER: GeoPoint = { lat: 59.9139, lng: 10.7522 };

export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function sortByDistance(
  locations: Location[],
  from: GeoPoint,
): Array<Location & { distanceKm: number }> {
  return locations
    .map((location) => ({ ...location, distanceKm: distanceKm(from, location.geo) }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function formatDistance(km: number): string {
  return km < 10 ? `${km.toFixed(1).replace(".", ",")} km` : `${Math.round(km)} km`;
}

/** Ber om nettleserposisjon; resolver null ved avslag/feil (siden fungerer uten). */
export function getBrowserPosition(): Promise<GeoPoint | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => resolve(null),
      { timeout: 5000, maximumAge: 300000 },
    );
  });
}

export interface LocationRanking {
  /** Avdelinger i visningsrekkefølge — aldri en tom liste. */
  results: Array<Location & { distanceKm?: number }>;
  /** True bare når lista er sortert etter reell nettleserposisjon (km vises da). */
  showDistance: boolean;
  /** Statuslinja over lista. */
  note: string;
}

function matches(location: Location, term: string): boolean {
  return [
    location.name,
    location.city,
    location.postalCode,
    location.region,
    location.center,
  ]
    .join(" ")
    .toLowerCase()
    .includes(term);
}

/**
 * Søk og sortering av avdelinger (SCREENS.md § Avdelinger).
 * Søket treffer navn, by, postnummer, region og senternavn. Et søk uten treff
 * viser alle avdelinger med forklarende linje — aldri en tom liste.
 */
export function rankLocations(
  locations: Location[],
  query: string,
  position: GeoPoint | null,
): LocationRanking {
  const term = query.trim().toLowerCase();

  if (position) {
    return {
      results: sortByDistance(locations, position),
      showDistance: true,
      note: "Sortert etter avstand fra posisjonen din.",
    };
  }

  const byOslo = sortByDistance(locations, OSLO_CENTER);

  if (!term) {
    return {
      results: byOslo,
      showDistance: false,
      note: `${locations.length} avdelinger, sortert etter avstand fra Oslo sentrum.`,
    };
  }

  const hits = byOslo.filter((location) => matches(location, term));
  if (hits.length === 0) {
    return {
      results: byOslo,
      showDistance: false,
      note: `Ingen treff på «${query.trim()}» — viser alle avdelinger.`,
    };
  }

  return {
    results: hits,
    showDistance: false,
    note: `${hits.length} treff på «${query.trim()}».`,
  };
}
