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
 * 15–40 MB minne i en egen renderer-prosess. Det avgjørende er ikke om kartet
 * vises, men hvor det står, for `loading="lazy"` hjelper ingenting når iframen
 * allerede er i første viewport. Derfor er det ulikt per kaller:
 *
 *  - `/avdelinger` og forsiden: `hidden hz:block`. Kartet lå øverst i kritisk
 *    vei, og på touch finnes ingen hover å flytte utsnittet med — kartet var
 *    låst til første avdeling uansett hva man søkte på.
 *  - `/avdelinger/[slug]`: vises på mobil. Der ligger kartet under
 *    åpningstidene, altså godt under folden, og gjelder den ene avdelingen
 *    siden allerede handler om.
 *
 * Komponenten har derfor ingen egen mobilgren — den koster det kalleren lar
 * den koste. Kallere som viser den på touch bør sette `pointer-events-none`
 * og legge en lenke over: innbygget panorerer i stedet for å rulle siden.
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
