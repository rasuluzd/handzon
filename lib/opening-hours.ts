import type { OpeningHours } from "./types";

/**
 * Åpningstider. «Åpen nå» BEREGNES fra åpningstidene (COMPONENTS.md § BranchCard)
 * — den hardkodes aldri. Beregningen kjøres på klienten, fordi statisk
 * genererte sider ellers ville frosset statusen på byggetidspunktet.
 */

export const DAY_NAMES = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag",
] as const;

const DAY_SHORT = ["Man", "Tirs", "Ons", "Tors", "Fre", "Lør", "Søn"] as const;

/** 0 = mandag … 6 = søndag (samme indeks som OpeningHours.day). */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** «08:00» → «08», «08:30» → «08:30». */
function shortTime(time: string): string {
  return time.endsWith(":00") ? time.slice(0, 2) : time;
}

export function hoursForDay(hours: OpeningHours[], dayIndex: number): OpeningHours | undefined {
  return hours.find((entry) => entry.day === dayIndex) ?? hours[dayIndex];
}

export function isOpenNow(hours: OpeningHours[], now = new Date()): boolean {
  const today = hoursForDay(hours, weekdayIndex(now));
  if (!today || today.closed) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= toMinutes(today.open) && minutes < toMinutes(today.close);
}

/** «08–17» eller «Stengt». */
export function formatDayHours(entry: OpeningHours | undefined): string {
  if (!entry || entry.closed) return "Stengt";
  return `${shortTime(entry.open)}–${shortTime(entry.close)}`;
}

/**
 * «Man–ons 08–17 · Tors 08–18 · Fre 08–17 · Lør 10–15 · Søn stengt» — like dager
 * slås sammen, så linja følger med når en avdeling endrer tidene sine.
 */
export function formatWeekSummary(hours: OpeningHours[]): string {
  const parts: string[] = [];
  let start = 0;
  for (let day = 0; day <= 6; day += 1) {
    const current = formatDayHours(hoursForDay(hours, day));
    const next = day < 6 ? formatDayHours(hoursForDay(hours, day + 1)) : null;
    if (current === next) continue;
    const label =
      start === day
        ? DAY_SHORT[day]
        : `${DAY_SHORT[start]}–${DAY_SHORT[day].toLowerCase()}`;
    parts.push(`${label} ${current === "Stengt" ? "stengt" : current}`);
    start = day + 1;
  }
  return parts.join(" · ");
}
