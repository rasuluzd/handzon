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
 *
 * MOBIL: kartet er en dyr passasjer — et eget dokument med egen JS, fliser og
 * 15–40 MB minne i en egen renderer-prosess. `loading="lazy"` hjelper ikke når
 * iframen står i første viewport, slik den gjorde på /avdelinger. Derfor er
 * kartkolonnene nå `hidden hz:block` hos kallerne: en lazy iframe inne i et
 * `display:none`-subtre kommer aldri inn i viewporten og lastes dermed aldri
 * under 900px. Det er grunnen til at komponenten ikke selv har en mobilgren —
 * den koster ingenting så lenge kalleren skjuler den.
 */
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function GoogleBranchMap({
  query = "Handz On",
  mode = "search",
  title = "Google Maps – Handz On-avdelinger",
  className,
  onLoad,
}: {
  query?: string;
  mode?: "search" | "place";
  /** Egen tittel per kart — en side kan ha flere, og de trenger hvert sitt navn. */
  title?: string;
  className?: string;
  onLoad?: () => void;
}) {
  // Nøkkelfritt innbygg rendrer ikke et bredt firmasøk — bruk adressen (place)
  // eller et geografisk søk (oversikt) som fallback.
  const keylessQuery = mode === "place" ? query : "Norge";
  const src = MAPS_KEY
    ? `https://www.google.com/maps/embed/v1/${mode}?key=${MAPS_KEY}&q=${encodeURIComponent(query)}&language=nb&region=NO`
    : `https://maps.google.com/maps?q=${encodeURIComponent(keylessQuery)}&z=${mode === "place" ? 15 : 5}&hl=nb&output=embed`;

  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      /* width/height gjør at nettleseren kan legge ut rammen før CSS-en
         treffer, i stedet for å reflowe når iframen får sin faktiske boks. */
      width={640}
      height={480}
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={onLoad}
      className={["h-full w-full border-0", className].filter(Boolean).join(" ")}
    />
  );
}
