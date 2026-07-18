/** Formatering for nb-NO — brukes overalt så tall og datoer er konsistente. */

const nokFormatter = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const nokDecimalFormatter = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatOre(ore: number): string {
  return ore % 100 === 0
    ? nokFormatter.format(ore / 100)
    : nokDecimalFormatter.format(ore / 100);
}

export function formatOreExact(ore: number): string {
  return nokDecimalFormatter.format(ore / 100);
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

export function formatIsoDate(isoDate: string): string {
  return capitalizeFirst(dateFormatter.format(new Date(`${isoDate}T12:00:00`)));
}

export function formatIsoDateShort(isoDate: string): string {
  return capitalizeFirst(shortDateFormatter.format(new Date(`${isoDate}T12:00:00`)));
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
