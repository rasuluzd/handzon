import type { Location } from "./types";

/**
 * Geolokasjon (FR-1.2 / FR-2.1 steg 1): sorter avdelinger etter nærhet til
 * brukerens posisjon. Haversine er mer enn presist nok for by-nivå.
 */

export interface GeoPoint {
  lat: number;
  lng: number;
}

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
    .map((location) => ({
      ...location,
      distanceKm: distanceKm(from, location.geo),
    }))
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

/**
 * Estimerer en koordinat for et (evt. delvis) norsk postnummer ved å «snappe»
 * til avdelingen med numerisk nærmeste postnummer. Norske postnummer er tildelt
 * geografisk, så nærmeste kjente postnummer er et godt anker uten et eget
 * postnummerregister. I produksjon geokodes postnummeret presist (Kartverket /
 * postnummerdatasett).
 */
export function estimatePointFromPostalCode(
  postalDigits: string,
  locations: Location[],
): GeoPoint | null {
  if (postalDigits.length === 0) return null;
  const target = Number(postalDigits.padEnd(4, "0").slice(0, 4));
  if (!Number.isFinite(target)) return null;
  let best: Location | null = null;
  let bestDelta = Infinity;
  for (const location of locations) {
    const delta = Math.abs(Number(location.postalCode) - target);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = location;
    }
  }
  return best ? best.geo : null;
}

export interface LocationRanking {
  /** Avdelinger i visningsrekkefølge — alltid hele lista, aldri tom. */
  results: Array<Location & { distanceKm?: number }>;
  /** Id-ene som traff søketeksten direkte (til kartmarkering). */
  matchedIds: Set<string>;
  /** True bare når lista er sortert etter reell nettleserposisjon (km vises da). */
  showDistance: boolean;
  /** Kort forklaring på sorteringen, eller null i standardrekkefølge. */
  note: string | null;
}

function matchingIds(locations: Location[], term: string): Set<string> {
  return new Set(
    locations
      .filter(
        (location) =>
          location.name.toLowerCase().includes(term) ||
          location.city.toLowerCase().includes(term) ||
          location.region.toLowerCase().includes(term) ||
          location.postalCode.startsWith(term),
      )
      .map((location) => location.id),
  );
}

/**
 * Rangerer avdelinger for søk (FR-1.2 / FR-2.1 steg 1) slik at lista aldri blir
 * tom — et søk uten direkte treff sorterer etter nærhet i stedet:
 *   1. Nettleserposisjon → faktisk avstand (km vises).
 *   2. Postnummer → nærhet til postnummeret.
 *   3. By/navn/region som treffer → treffet først, deretter nærmeste rundt.
 *   4. Tekst uten treff → hele lista (fallback), aldri tomt.
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
      matchedIds: term ? matchingIds(locations, term) : new Set<string>(),
      showDistance: true,
      note: "Sortert etter avstand fra posisjonen din.",
    };
  }

  if (!term) {
    return {
      results: locations,
      matchedIds: new Set<string>(),
      showDistance: false,
      note: null,
    };
  }

  const matched = matchingIds(locations, term);
  const digits = term.replace(/\D/g, "");

  // Postnummer: sorter etter nærhet til postnummeret, filtrer aldri bort.
  if (digits.length > 0) {
    const point = estimatePointFromPostalCode(digits, locations);
    if (point) {
      return {
        results: sortByDistance(locations, point),
        matchedIds: matched,
        showDistance: false,
        note: `Sortert etter nærmeste avdeling til postnummer ${digits}.`,
      };
    }
  }

  // By/navn/region som treffer: bruk treffet som anker, vis nærmeste rundt.
  const anchor = locations.find((location) => matched.has(location.id));
  if (anchor) {
    return {
      results: sortByDistance(locations, anchor.geo),
      matchedIds: matched,
      showDistance: false,
      note: `Nærmeste avdelinger til «${query.trim()}».`,
    };
  }

  // Ingen treff: vis alle avdelinger i stedet for en tom liste.
  return {
    results: locations,
    matchedIds: new Set<string>(),
    showDistance: false,
    note: `Fant ingen avdeling som matcher «${query.trim()}» – viser alle avdelinger.`,
  };
}
