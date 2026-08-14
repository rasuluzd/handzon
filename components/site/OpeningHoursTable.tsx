"use client";

import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import {
  DAY_NAMES,
  formatDayHours,
  formatWeekSummary,
  hoursForDay,
  weekdayIndex,
} from "@/lib/opening-hours";
import type { OpeningHours } from "@/lib/types";

/**
 * Åpningstidstabell (SCREENS.md § Avdelingsside). Dagen i dag markeres med navy
 * og « (i dag)» bak dagsnavnet. Datoen leses fra klokka etter hydrering, så en
 * statisk generert side ikke låser «i dag» til byggedagen.
 *
 * MOBIL: sju rader à 41px er 287px — en tredjedel av skjermen, rett under H2-en,
 * før brukeren i det hele tatt kommer til pris og booking. Under 900px vises
 * derfor ukesammendraget på to linjer, med hele tabellen bak et <details>.
 * Sammendraget er valgt framfor «dagens rad» med vilje: hvilken dag det er vet
 * vi først etter hydrering, så en dagsbasert sammenklapping ville hoppet i
 * layouten et halvsekund etter at siden var malt. Sammendraget er identisk på
 * server og klient.
 */
function subscribe(onStoreChange: () => void) {
  const timer = setInterval(onStoreChange, 60 * 60_000);
  return () => clearInterval(timer);
}

export function OpeningHoursTable({ hours }: { hours: OpeningHours[] }) {
  const today = useSyncExternalStore<number | null>(
    subscribe,
    () => weekdayIndex(new Date()),
    () => null,
  );

  /* Samme element rendres to steder (inne i <details> på mobil, direkte på
     desktop). Et React-element er en beskrivelse, ikke en instans, så dette
     koster ingen ekstra beregning — og alternativet, å tvinge <details> åpen
     fra CSS på desktop, er ikke pålitelig på tvers av nettlesere. */
  const table = (
    <table className="w-full border-collapse tabular">
      <caption className="sr-only">Åpningstider</caption>
      <tbody>
        {DAY_NAMES.map((day, index) => {
          const isToday = today === index;
          return (
            <tr key={day}>
              <td
                className={`border-t border-line py-2 text-[14.5px] hz:py-[9px] hz:text-[15px] ${isToday ? "text-navy" : "text-body"}`}
              >
                {day}
                {isToday ? " (i dag)" : ""}
              </td>
              <td
                className={`border-t border-line py-2 text-right font-heading text-[14.5px] font-semibold hz:py-[9px] hz:text-[15px] ${isToday ? "text-navy" : "text-ink"}`}
              >
                {formatDayHours(hoursForDay(hours, index))}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <>
      <details className="group rounded-card border border-line-strong hz:hidden">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-2.5 [&::-webkit-details-marker]:hidden">
          <span className="text-[13.5px] leading-[1.5] tabular text-body-soft">
            {formatWeekSummary(hours)}
          </span>
          <ChevronDown
            aria-hidden
            className="size-[18px] shrink-0 text-navy transition-transform duration-150 group-open:rotate-180"
            strokeWidth={2}
          />
        </summary>
        <div className="px-3.5 pb-2.5">{table}</div>
      </details>

      <div className="max-hz:hidden">{table}</div>
    </>
  );
}
