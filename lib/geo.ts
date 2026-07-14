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
