"use client";

import { useEffect, useRef, useState } from "react";
import { locations } from "@/lib/mock-data";

/**
 * Ekte Google Maps-kart (FR-1.2) med markør for hver av de 15 avdelingene.
 * Klikk på en markør åpner et infovindu med lenke til avdelingssiden og booking.
 *
 * Krever `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (Maps JavaScript API). Uten nøkkel
 * (eller ved auth-feil) faller komponenten tilbake til et nøkkelfritt Google
 * Maps-innbygg av Norge, så det alltid vises et ekte kart. Avdelingslenkene i
 * lista dekker «linker til alle lokasjonene» uansett.
 */
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/* eslint-disable @typescript-eslint/no-explicit-any */
let mapsLoader: Promise<void> | null = null;
function loadGoogleMaps(key: string): Promise<void> {
  if (mapsLoader) return mapsLoader;
  mapsLoader = new Promise<void>((resolve, reject) => {
    const w = window as any;
    if (w.google?.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&language=nb&region=NO`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps kunne ikke lastes"));
    document.head.appendChild(script);
  });
  return mapsLoader;
}

export function GoogleBranchMap({ highlightedId }: { highlightedId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!MAPS_KEY || !containerRef.current) return;
    let cancelled = false;
    const markers: any[] = [];
    const w = window as any;
    // Google kaller denne globalt ved ugyldig nøkkel → vis fallback-innbygg.
    w.gm_authFailure = () => setFailed(true);

    loadGoogleMaps(MAPS_KEY)
      .then(() => {
        if (cancelled || !containerRef.current) return;
        const g = w.google;
        const map = new g.maps.Map(containerRef.current, {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        });
        const bounds = new g.maps.LatLngBounds();
        const info = new g.maps.InfoWindow();
        locations.forEach((location) => {
          const position = { lat: location.geo.lat, lng: location.geo.lng };
          const marker = new g.maps.Marker({
            position,
            map,
            title: `Handz On ${location.name}`,
          });
          bounds.extend(position);
          marker.addListener("click", () => {
            info.setContent(
              `<div style="font-family:system-ui,sans-serif;max-width:220px;line-height:1.4">
                 <div style="font-weight:700;color:#16223a;margin-bottom:2px">Handz On ${location.name}</div>
                 <div style="font-size:13px;color:#737b8a;margin-bottom:8px">${location.address}, ${location.postalCode} ${location.city}</div>
                 <a href="/avdelinger/${location.slug}" style="color:#1e3a70;font-weight:600;font-size:14px">Se avdeling</a>
                 &nbsp;·&nbsp;
                 <a href="/booking?avdeling=${location.slug}" style="color:#1e3a70;font-weight:600;font-size:14px">Book her</a>
               </div>`,
            );
            info.open({ map, anchor: marker });
          });
          markers.push(marker);
        });
        map.fitBounds(bounds, 40);

        if (highlightedId) {
          const match = locations.find((l) => l.id === highlightedId);
          if (match) {
            map.setCenter({ lat: match.geo.lat, lng: match.geo.lng });
            map.setZoom(11);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      markers.forEach((m) => m.setMap?.(null));
    };
  }, [highlightedId]);

  if (!MAPS_KEY || failed) {
    return (
      <iframe
        title="Kart over Handz On-avdelinger i Norge"
        src="https://maps.google.com/maps?q=Norge&z=4&hl=nb&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    );
  }

  return <div ref={containerRef} className="h-full w-full" aria-label="Google Maps-kart over avdelinger" />;
}
