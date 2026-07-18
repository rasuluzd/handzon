/**
 * Google Maps via Maps Embed API (FR-1.2).
 * - `search`-modus (standard): viser de ekte Handz On-avdelingene som pins.
 *   Hver pin er klikkbar og åpner stedet i Google Maps.
 * - `place`-modus: viser én bestemt avdeling (brukt på avdelingssiden).
 *
 * Nøkkel: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (Vercel env / .env.local). MED nøkkel
 * brukes Embed API — search-modus viser de ekte avdelingene som pins. UTEN nøkkel
 * brukes et nøkkelfritt Google-innbygg som alltid rendrer: avdelingssiden viser
 * adressen (place), oversikten viser kart over Norge (et bredt firmasøk uten
 * nøkkel rendrer ikke pins). Sett nøkkelen på Vercel for pins i oversikten.
 */
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function GoogleBranchMap({
  query = "Handz On Auto Care",
  mode = "search",
}: {
  query?: string;
  mode?: "search" | "place";
}) {
  // Nøkkelfritt innbygg rendrer ikke et bredt firmasøk — bruk adressen (place)
  // eller et geografisk søk (oversikt) som fallback.
  const keylessQuery = mode === "place" ? query : "Norge";
  const src = MAPS_KEY
    ? `https://www.google.com/maps/embed/v1/${mode}?key=${MAPS_KEY}&q=${encodeURIComponent(query)}&language=nb&region=NO`
    : `https://maps.google.com/maps?q=${encodeURIComponent(keylessQuery)}&z=${mode === "place" ? 15 : 5}&hl=nb&output=embed`;

  return (
    <iframe
      title="Google Maps – Handz On-avdelinger"
      src={src}
      loading="lazy"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="h-full w-full border-0"
    />
  );
}
