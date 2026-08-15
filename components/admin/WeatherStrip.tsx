import { formatDayParts } from "@/lib/format";
import type { Forecast } from "@/lib/weather";
import { AdCard, AdCardHead, AdNote } from "./ui";

/**
 * Sju dager vær, i den brede kolonnen under omsetningsgrafen.
 *
 * Kortet er BEVISET bak rådet i «Vær og drift». Rådet sier hva som bør gjøres,
 * men uten tallene er det en påstand man ikke kan etterprøve — og de dagene
 * ingen regel slår til, ville hele funksjonen vært usynlig. Her ser
 * avdelingslederen selv hvilke dager som er tørre og hvilke som er for kalde
 * til å herde lakk.
 *
 * Dagene som utløser regler er markert: under 5 °C får en gyllen tone (samme
 * som «Stengt»-statusen ellers i panelet), nedbørsdager får dempet tekst og mm
 * i stedet for et symbol. Ingen nye farger, ingen ikoner — tallet er poenget.
 */
const CURE_MIN_C = 5;

export function WeatherStrip({
  forecast,
  label,
}: {
  forecast: Forecast;
  /** Hvilket sted varselet gjelder, f.eks. «Handz On Moa · Vestlandet». */
  label: string;
}) {
  return (
    <AdCard>
      <AdCardHead
        title="Været framover"
        sub={`${label} · ${forecast.source === "met.no" ? "MET Norway" : "demovarsel"}`}
      />
      {/* Fem dager på telefon, sju fra 760px. Sju celler i en 322px kolonne
          blir 41px hver, og da klippes både «I dag» og millimeterne. Fem gir
          57px og er fortsatt lengre fram enn rådets fire-dagers horisont. */}
      <div className="grid grid-cols-5 gap-1.5 admin-sm:grid-cols-7 admin-sm:gap-2">
        {forecast.days.slice(0, 7).map((day, index) => {
          const parts = formatDayParts(day.date);
          const cold = day.minTempC < CURE_MIN_C;
          const wet = day.condition !== "tørt";
          return (
            <div
              key={day.date}
              className={`rounded-control border px-1 py-2 text-center admin-sm:px-2 admin-sm:py-2.5 ${
                cold ? "border-status-closed-bg bg-status-closed-bg" : "border-line bg-surface-alt"
              } ${index >= 5 ? "max-admin-sm:hidden" : ""}`}
            >
              <p className="truncate text-[10.5px] leading-none text-body-soft admin-sm:text-[11.5px]">
                {parts.rel === "I dag" ? "I dag" : parts.wd}
              </p>
              <p className="mt-1 font-heading text-[13px] font-semibold leading-none tabular text-ink admin-sm:text-[14px]">
                {parts.dd}
              </p>
              <p
                className={`mt-2 font-heading text-[15px] font-bold leading-none tabular admin-sm:text-[17px] ${
                  cold ? "text-status-closed" : "text-navy"
                }`}
              >
                {day.maxTempC}°
              </p>
              <p className="mt-0.5 text-[10.5px] leading-none tabular text-body-soft admin-sm:text-[11.5px]">
                {day.minTempC}°
              </p>
              <p
                className={`mt-1.5 truncate text-[10.5px] leading-none tabular admin-sm:text-[11px] ${
                  wet ? "text-body-soft" : "text-body-soft opacity-60"
                }`}
              >
                {wet ? `${day.precipMm.toString().replace(".", ",")} mm` : "tørt"}
              </p>
            </div>
          );
        })}
      </div>
      <AdNote className="mt-3">
        Dager under {CURE_MIN_C} °C er markert — lakkforsegling herder ikke der, og
        polering krever tørre forhold.
      </AdNote>
    </AdCard>
  );
}
