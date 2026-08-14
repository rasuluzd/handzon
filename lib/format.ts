/**
 * Formatering for nb-NO (CONTENT.md § Tall, pris og tid).
 *
 *   Markedsføring      1 490,-
 *   Kvittering/tabell  1 490 kr
 *   Mva-linje          488,00 kr  (to desimaler)
 *   Varighet           30 min · 1 t 15 min
 *
 * Intl setter hardt mellomrom (U+00A0) som tusenskille; det byttes til vanlig
 * mellomrom slik at det brytes likt i alle nettlesere.
 */

const numberFormatter = new Intl.NumberFormat("nb-NO");
const decimalFormatter = new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function normalizeSpaces(value: string): string {
  return value.replace(/ /g, " ");
}

/** «1 490,-» — markedsføring, kort og priskolonner. */
export function formatKr(ore: number): string {
  return `${normalizeSpaces(numberFormatter.format(Math.round(ore / 100)))},-`;
}

/** «1 490 kr» — kvitteringer, tabeller og prisspesifikasjon. */
export function formatKrPlain(ore: number): string {
  return `${normalizeSpaces(numberFormatter.format(Math.round(ore / 100)))} kr`;
}

/** «488,00 kr» — mva-linjen, alltid to desimaler. */
export function formatKrExact(ore: number): string {
  return `${normalizeSpaces(decimalFormatter.format(ore / 100))} kr`;
}

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const shortDateFormatter = new Intl.DateTimeFormat("nb-NO", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function capitalizeFirst(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** «Lørdag 15. august» */
export function formatIsoDate(isoDate: string): string {
  return capitalizeFirst(dateFormatter.format(new Date(`${isoDate}T12:00:00`)));
}

/** «lørdag 15. august» — brukes midt i en setning. */
export function formatIsoDateLower(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T12:00:00`));
}

export function formatIsoDateShort(isoDate: string): string {
  return capitalizeFirst(shortDateFormatter.format(new Date(`${isoDate}T12:00:00`)));
}

/** «13.07.2026» — kvitteringslister. */
export function formatIsoDateNumeric(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

const weekdayShortFormatter = new Intl.DateTimeFormat("nb-NO", { weekday: "short" });
const monthShortFormatter = new Intl.DateTimeFormat("nb-NO", { month: "short" });

/**
 * Dag-chip-deler (ukedag / dato / måned). «I dag» og «I morgen» erstatter
 * ukedagen på de to første dagene — de to som konverterer best, og de som er
 * vanskeligst å plukke ut av en stripe med fjorten like chips.
 *
 * Kalles kun fra klientkode (dagsstripa bygges i en effekt), så et oppslag på
 * dagens dato gir ingen forskjell mellom server og hydrering.
 */
export function formatDayParts(isoDate: string): { wd: string; dd: number; mon: string } {
  const date = new Date(`${isoDate}T12:00:00`);
  const now = new Date();
  const dayDiff = Math.round(
    (date.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / 86_400_000,
  );
  const day = new Date(`${isoDate}T12:00:00`);
  const weekday =
    dayDiff === 0
      ? "I dag"
      : dayDiff === 1
        ? "I morgen"
        : capitalizeFirst(weekdayShortFormatter.format(day).replace(".", ""));
  return {
    wd: weekday,
    dd: day.getDate(),
    mon: monthShortFormatter.format(day).replace(".", ""),
  };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} t` : `${hours} t ${rest} min`;
}

export function formatOrgNr(orgNr: string): string {
  return `${orgNr.slice(0, 3)} ${orgNr.slice(3, 6)} ${orgNr.slice(6)}`;
}
