/**
 * Google Maps via Maps Embed API (FR-1.2).
 * - `search`-modus (standard): viser de ekte Handz On-avdelingene som pins.
 *   Hver pin er klikkbar og åpner stedet i Google Maps.
 * - `place`-modus: viser én bestemt avdeling (brukt på avdelingssiden).
 *
 * Nøkkelen leses fra NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (settes i .env.local lokalt
 * og som miljøvariabel på Vercel). Uten nøkkel brukes et nøkkelfritt Google
 * Maps-innbygg, så kartet alltid vises.
 */
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function GoogleBranchMap({
  query = "Handz On Auto Care",
  mode = "search",
}: {
  query?: string;
  mode?: "search" | "place";
}) {
  const encoded = encodeURIComponent(query);
  const src = MAPS_KEY
    ? `https://www.google.com/maps/embed/v1/${mode}?key=${MAPS_KEY}&q=${encoded}&language=nb&region=NO`
    : `https://maps.google.com/maps?q=${encoded}&z=5&hl=nb&output=embed`;

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
