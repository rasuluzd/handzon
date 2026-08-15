import { hashString, mulberry32 } from "./prng";
import { locations } from "./mock-data";
import type { Region } from "./types";

/**
 * Værvarsel per region (T-4). Vær er den sterkeste enkeltdriveren i bilpleie —
 * ikke først og fremst for etterspørselen, men for hva som i det hele tatt kan
 * leveres: lakkforsegling herder ikke i frost, og polering krever tørre
 * forhold. `weather-advice.ts` gjør varselet om til et konkret råd.
 *
 * ## Hvorfor region og ikke avdeling
 *
 * Vær er regionalt. De ni Østlandet-avdelingene deler varsel, Vestlandet og
 * Sørlandet har sine egne. Det gir tre API-kall i stedet for fjorten, og det
 * er dessuten riktigere: Lambertseter og Ski har ikke ulikt vær.
 *
 * ## Kilde og reserve
 *
 * `fetchForecast` henter fra MET Norways Locationforecast (api.met.no) — åpne
 * data, ingen nøkkel, men den KREVER en identifiserende User-Agent og at man
 * respekterer `Expires`. Derfor kjører den bare på serveren: en nettleser kan
 * ikke sette User-Agent, og kallet ville dessuten lekket ut på hver klient.
 *
 * Feiler kallet — nede, ratebegrenset, eller demoen kjøres uten nett — faller
 * vi tilbake på `mockForecast`, som er deterministisk seedet på samme måte som
 * resten av datalaget (`lib/prng.ts`). Demoen viser da fortsatt et troverdig
 * varsel og et råd, den bare slutter å være ekte. `source` sier hvilken av
 * delene som gjelder, og UI-et oppgir det.
 */
export type Condition = "tørt" | "regn" | "sludd" | "snø";

export interface WeatherDay {
  /** ISO-dato, YYYY-MM-DD, i norsk lokaltid. */
  date: string;
  /** Dagens høyeste temperatur i celsius. */
  maxTempC: number;
  /** Dagens laveste — det er denne som avgjør om lakk kan herde. */
  minTempC: number;
  /** Samlet nedbør i mm. */
  precipMm: number;
  condition: Condition;
}

export interface Forecast {
  region: Region;
  source: "met.no" | "demo";
  days: WeatherDay[];
}

/** Én representativ avdeling per region gir koordinaten vi spør på. */
const REGION_ANCHOR: Record<Region, string> = {
  Østlandet: "lambertseter",
  Vestlandet: "lagunen",
  Sørlandet: "sorlandssenteret",
};

export const REGIONS = Object.keys(REGION_ANCHOR) as Region[];

/**
 * MET krever en User-Agent som identifiserer applikasjonen med et kontaktpunkt;
 * generiske og nettleserlignende verdier blir blokkert.
 * Vilkår: https://api.met.no/doc/TermsOfService
 */
const USER_AGENT =
  process.env.MET_USER_AGENT ??
  "HandzOnAutoCare/1.0 (https://github.com/rasuluzd/handzon)";

const FORECAST_DAYS = 7;

/** «2026-08-15» i norsk lokaltid. `sv-SE` formaterer som ISO. */
function osloDate(value: Date): string {
  return value.toLocaleDateString("sv-SE", { timeZone: "Europe/Oslo" });
}

function conditionFrom(symbol: string, precipMm: number): Condition {
  if (symbol.includes("snow")) return "snø";
  if (symbol.includes("sleet")) return "sludd";
  if (symbol.includes("rain") || precipMm >= 0.5) return "regn";
  return "tørt";
}

interface MetTimeseries {
  time: string;
  data: {
    instant: { details: { air_temperature?: number } };
    next_1_hours?: { summary?: { symbol_code?: string }; details?: { precipitation_amount?: number } };
    next_6_hours?: { summary?: { symbol_code?: string }; details?: { precipitation_amount?: number } };
  };
}

/**
 * Slår sammen MET-punktene til én rad per dag.
 *
 * Nedbør telles fra `next_1_hours` der den finnes, ellers `next_6_hours`. De to
 * OVERLAPPER i den timesoppløste delen av varselet — tar man begge, dobler man
 * nedbøren for de to første døgnene.
 */
function toDays(timeseries: MetTimeseries[]): WeatherDay[] {
  const byDate = new Map<
    string,
    { temps: number[]; precip: number; symbols: string[] }
  >();

  for (const point of timeseries) {
    const date = osloDate(new Date(point.time));
    const bucket = byDate.get(date) ?? { temps: [], precip: 0, symbols: [] };
    const temp = point.data.instant.details.air_temperature;
    if (typeof temp === "number") bucket.temps.push(temp);

    const window = point.data.next_1_hours ?? point.data.next_6_hours;
    if (window) {
      bucket.precip += window.details?.precipitation_amount ?? 0;
      const symbol = window.summary?.symbol_code;
      if (symbol) bucket.symbols.push(symbol);
    }
    byDate.set(date, bucket);
  }

  return [...byDate.entries()]
    .filter(([, bucket]) => bucket.temps.length > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, FORECAST_DAYS)
    .map(([date, bucket]) => {
      const precipMm = Math.round(bucket.precip * 10) / 10;
      /* Symbolet for dagen er det som går igjen oftest — ett regnbyge-symbol
         midt i en ellers tørr dag skal ikke gjøre hele dagen til regnvær. */
      const tally = new Map<string, number>();
      for (const symbol of bucket.symbols) {
        tally.set(symbol, (tally.get(symbol) ?? 0) + 1);
      }
      const dominant =
        [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "clearsky_day";
      return {
        date,
        maxTempC: Math.round(Math.max(...bucket.temps)),
        minTempC: Math.round(Math.min(...bucket.temps)),
        precipMm,
        condition: conditionFrom(dominant, precipMm),
      };
    });
}

/**
 * Deterministisk reservevarsel. Samme seed-mønster som `lib/sales.ts`, så
 * tallene er stabile mellom server og klient og mellom hver last — ellers
 * ville rådet skiftet under føttene på den som demonstrerer.
 */
export function mockForecast(region: Region, from: Date): Forecast {
  const days: WeatherDay[] = [];
  for (let offset = 0; offset < FORECAST_DAYS; offset += 1) {
    const day = new Date(from);
    day.setDate(from.getDate() + offset);
    const date = osloDate(day);
    const random = mulberry32(hashString(`weather:${region}:${date}`));

    /* Grov årstidskurve: kaldest i januar, varmest i juli. Vestlandet er
       mildere og våtere, Sørlandet varmere om sommeren. */
    const dayOfYear = Math.floor(
      (day.getTime() - new Date(day.getFullYear(), 0, 0).getTime()) / 86_400_000,
    );
    const seasonal = -Math.cos((dayOfYear / 365) * Math.PI * 2);
    const base =
      region === "Vestlandet" ? 7.5 : region === "Sørlandet" ? 8 : 6.5;
    const amplitude = region === "Vestlandet" ? 8 : 10;
    const maxTempC = Math.round(base + seasonal * amplitude + (random() - 0.5) * 6);
    const wetness = region === "Vestlandet" ? 0.5 : 0.32;
    const wet = random() < wetness;
    const precipMm = wet ? Math.round(random() * 90) / 10 : 0;
    const condition: Condition = !wet
      ? "tørt"
      : maxTempC <= 0
        ? "snø"
        : maxTempC <= 2
          ? "sludd"
          : "regn";

    days.push({
      date,
      maxTempC,
      minTempC: maxTempC - Math.round(3 + random() * 4),
      precipMm,
      condition,
    });
  }
  return { region, source: "demo", days };
}

/**
 * Henter varselet for én region. **Kun server** — se filkommentaren.
 *
 * `revalidate: 1800` speiler `Expires`-headeren MET sender (~30 min) og holder
 * oss godt innenfor det de ber om. Feil svelges med vilje: et adminpanel som
 * ikke laster fordi et værkall feilet, er verre enn et adminpanel uten vær.
 */
export async function fetchForecast(region: Region, from: Date): Promise<Forecast> {
  const anchor = locations.find((item) => item.slug === REGION_ANCHOR[region]);
  if (!anchor) return mockForecast(region, from);

  try {
    const response = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${anchor.geo.lat.toFixed(4)}&lon=${anchor.geo.lng.toFixed(4)}`,
      { headers: { "User-Agent": USER_AGENT }, next: { revalidate: 1800 } },
    );
    if (!response.ok) return mockForecast(region, from);

    const payload = (await response.json()) as {
      properties?: { timeseries?: MetTimeseries[] };
    };
    const days = toDays(payload.properties?.timeseries ?? []);
    if (days.length === 0) return mockForecast(region, from);
    return { region, source: "met.no", days };
  } catch {
    return mockForecast(region, from);
  }
}

/** Varsel for alle tre regioner. Kalles fra serverkomponenten. */
export async function fetchAllForecasts(
  from: Date,
): Promise<Record<Region, Forecast>> {
  const results = await Promise.all(
    REGIONS.map((region) => fetchForecast(region, from)),
  );
  return Object.fromEntries(
    results.map((forecast) => [forecast.region, forecast]),
  ) as Record<Region, Forecast>;
}
