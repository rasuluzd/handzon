import { formatDayParts, formatIsoDateLower } from "./format";
import { services } from "./mock-data";
import type { Order } from "./sales";
import type { Forecast, WeatherDay } from "./weather";
import type { Region } from "./types";

/**
 * Gjør et værvarsel om til ETT konkret råd (T-4).
 *
 * Skillet mot en værwidget er hele poenget: avdelingslederen har telefon og vet
 * at det regner. Verdien ligger i å koble været til bestillingene som allerede
 * står i boka, og si hva som bør gjøres med dem.
 *
 * Modulen returnerer `null` når ingen regel slår til. Et råd som alltid står
 * der, slutter folk å lese — da er det bedre at kortet forsvinner.
 */

/**
 * Tjenester som ikke kan leveres forsvarlig i frost eller regn.
 *
 * Lakkforsegling herder ikke under ~5 °C, og både polering og Full Shine
 * krever tørre, tempererte forhold. Utføres de likevel, får kunden et resultat
 * som svikter etter noen uker — og avdelingen gjør jobben om igjen gratis.
 * Det er denne kostnaden funksjonen finnes for å hindre.
 */
const WEATHER_SENSITIVE = ["Lakkforsegling", "Polering", "Full Shine"];

/** Under denne temperaturen herder ikke lakkforsegling. */
const CURE_MIN_C = 5;

/** «18–24 °C», eller «22 °C» når dagene har samme maksimum. */
function tempSpan(days: WeatherDay[]): string {
  const maxima = days.map((day) => day.maxTempC);
  const low = Math.min(...maxima);
  const high = Math.max(...maxima);
  return low === high ? `${high} °C` : `${low}–${high} °C`;
}

export type AdviceLevel = "varsel" | "mulighet";

export interface WeatherAdvice {
  level: AdviceLevel;
  /** Kort overskrift — værforholdet. */
  title: string;
  /** Hva det betyr, og hva som bør gjøres. */
  body: string;
  /** Antall berørte bestillinger, når rådet gjelder konkrete ordrer. */
  affected?: number;
  /** Regionen rådet gjelder. Vises kun når man ser hele kjeden. */
  region?: Region;
}

/*
 * Datoene: `sales.ts` bygger ISO-datoer fra lokale datofelt, `weather.ts`
 * bøttesorterer MET-punktene eksplisitt i Europe/Oslo. For brukere i Norge er
 * det samme dato. Kjøres koden i en annen sone kan de sprike med ett døgn — da
 * finner `order.date === coldDay.date` ingen treff, og regelen tier. Det er den
 * riktige feilmåten: heller ingen advarsel enn en advarsel om feil dag.
 */
function isSensitive(order: Order): boolean {
  const service = services.find((item) => item.id === order.serviceId);
  return service ? WEATHER_SENSITIVE.includes(service.category) : false;
}

function isWet(day: WeatherDay): boolean {
  return day.condition !== "tørt";
}

/** «i dag» / «i morgen» der det passer, ellers «torsdag 20. august». */
function dayName(isoDate: string): string {
  const rel = formatDayParts(isoDate).rel;
  return rel ? rel.toLowerCase() : formatIsoDateLower(isoDate);
}

/**
 * Regelsettet, i prioritert rekkefølge. Første treff vinner — flere råd
 * samtidig er støy, og den øverste regelen er den eneste som forhindrer en
 * faktisk kostnad.
 */
export function adviceFor(
  forecast: Forecast,
  /** Bestillinger for de neste dagene, i regionen rådet gjelder. */
  upcoming: Order[],
  /** Belegg i dag, 0–1. */
  fill: number,
): WeatherAdvice | null {
  const [today, ...rest] = forecast.days;
  if (!today) return null;
  const next = forecast.days.slice(0, 4);

  /* 1. Frost + værutsatt tjeneste booket. Den eneste regelen som peker på
        penger som allerede er tapt hvis ingen gjør noe.

        Alle kalde dager i horisonten sjekkes, ikke bare den første. Med
        `find` traff regelen første dag under grensen og lette etter
        bestillinger BARE der — lå jobben på dag to i kuldeperioden, tidde
        varselet. Første kalde dag som faktisk har en utsatt bestilling er den
        mest presserende, og den vinner. */
  for (const day of next) {
    if (day.minTempC >= CURE_MIN_C) continue;
    const atRisk = upcoming.filter(
      (order) => order.date === day.date && isSensitive(order),
    );
    if (atRisk.length === 0) continue;
    return {
      level: "varsel",
      title: `${day.minTempC} °C ${dayName(day.date)}`,
      body: `Du har ${atRisk.length} ${atRisk.length === 1 ? "bestilling" : "bestillinger"} på lakkforsegling, polering eller Full Shine den dagen. Lakkforsegling herder ikke under ${CURE_MIN_C} °C. Flytt dem til en mildere dag før kunden får et resultat som svikter.`,
      affected: atRisk.length,
      region: forecast.region,
    };
  }

  /* 2. Regn i dag og ledig kapasitet. Vaskeordrene kommer ikke — selg det som
        ikke er værutsatt i stedet for å vente. */
  if (isWet(today) && fill < 0.6) {
    return {
      level: "mulighet",
      title: `${today.condition === "regn" ? "Regn" : today.condition} i dag, ${today.precipMm} mm`,
      body: `Belegget er ${Math.round(fill * 100)} %. Utvendig vask faller alltid i regn. Push interiørrens og dekkskift i dag, de er ikke værutsatte.`,
      region: forecast.region,
    };
  }

  /* 3. Første tørre dag etter minst to våte. Etterspørselstoppen kommer, og
        den kommer uten forvarsel hvis ingen ser på varselet. */
  const dryAhead = rest.findIndex((day) => !isWet(day));
  if (dryAhead >= 0) {
    const wetBefore = [today, ...rest.slice(0, dryAhead)].filter(isWet).length;
    const dryDay = rest[dryAhead];
    if (wetBefore >= 2 && dryDay) {
      return {
        level: "mulighet",
        title: `Første tørre dag ${dayName(dryDay.date)}`,
        body: `Etter ${wetBefore} dager med nedbør. Vaskepågangen tar seg opp på den første tørre dagen. Vurder ekstra bemanning eller flere plasser.`,
        region: forecast.region,
      };
    }
  }

  /* 4. Sammenhengende tørt vindu i riktig temperatursjikt. Det er her de dyre
        behandlingene kan selges. */
  const window = next.slice(0, 3);
  if (
    window.length === 3 &&
    window.every((day) => !isWet(day) && day.minTempC >= CURE_MIN_C && day.maxTempC <= 28)
  ) {
    return {
      level: "mulighet",
      title: `Tre tørre dager framover, ${tempSpan(window)}`,
      body: "Beste vinduet for polering og lakkforsegling. Ring kunder som har utsatt en behandling, og push poleringspakkene i dag.",
      region: forecast.region,
    };
  }

  return null;
}
