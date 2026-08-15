import { hoursForDay, weekdayIndex } from "./opening-hours";
import { hashString, mulberry32 } from "./prng";
import {
  addOnAffinity,
  addOns,
  getEffectivePrice,
  isServiceAvailable,
  locations,
  serviceCategories,
  services,
} from "./mock-data";
import type { AddOn, Location, Service } from "./types";

/**
 * Salgsdata for adminpanelet (ADMIN.md § 7).
 *
 * Ordrene genereres **deterministisk** — samme avdeling og dato gir alltid
 * samme tall, så tallene stemmer mellom skjermene og endrer seg ikke ved
 * omlasting. Erstatt `ordersForDay` med et kall mot det ekte datalaget
 * (kassesystem eller bookingbase); aggregeringene under er ren utregning over
 * `Order[]` og kan stå som de er.
 *
 * Modellen speiler driften: kjøpesenteravdelinger er travlest lørdag, søndag er
 * stengt, og sesongtoppene ligger i april–mai (pollen, dekkskift) og
 * september–oktober (vinterforberedelse).
 */

export type Channel = "nett" | "skranke" | "telefon";

export interface Order {
  id: string;
  /** ISO-dato, YYYY-MM-DD. */
  date: string;
  locationSlug: string;
  hour: number;
  serviceId: string;
  addOnIds: string[];
  member: boolean;
  channel: Channel;
  baseOre: number;
  addOre: number;
  discountOre: number;
  totalOre: number;
}

export const CHANNELS: Array<{ id: Channel; label: string; weight: number }> = [
  { id: "nett", label: "Nettbooking", weight: 0.58 },
  { id: "skranke", label: "Drop-in i skranken", weight: 0.27 },
  { id: "telefon", label: "Telefon", weight: 0.15 },
];

/** Relativ trafikkvekt per avdeling — Lambertseter og Lagunen er størst. */
const WEIGHT: Record<string, number> = {
  lambertseter: 1.35,
  lagunen: 1.3,
  sandvika: 1.15,
  metro: 1.0,
  strommen: 0.95,
  triaden: 0.9,
  asane: 0.9,
  forus: 1.05,
  sorlandssenteret: 0.95,
  skedsmo: 0.8,
  ski: 0.75,
  jessheim: 0.8,
  asker: 0.7,
  moa: 0.75,
};

/** Sesongfaktor per måned — 1,0 er snitt. */
const SEASON = [0.82, 0.85, 1.0, 1.28, 1.24, 1.05, 0.88, 0.95, 1.22, 1.3, 1.02, 0.9];
/** Ukerytme, mandag = 0. Søndag er stengt. */
const WEEKDAY = [0.92, 0.88, 0.95, 1.05, 1.18, 1.35, 0];

/** Tjenestemiks: vask veier tyngst, coating minst. */
const MIX: Array<{ upTo: number; category: string }> = [
  { upTo: 0.46, category: "Bilvask" },
  { upTo: 0.62, category: "Interiør" },
  { upTo: 0.76, category: "Polering" },
  { upTo: 0.86, category: "Dekk & Felg" },
  { upTo: 0.94, category: "Full Shine" },
  { upTo: 1.01, category: "Lakkforsegling" },
];

export const iso = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const parseIso = (value: string): Date => new Date(`${value}T12:00:00`);

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function today(): Date {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  return now;
}

/** Mandag som første dag i uka (norsk standard). */
function startOfWeek(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() - weekdayIndex(next));
  next.setHours(12, 0, 0, 0);
  return next;
}

/** Ukenummer etter ISO 8601. */
export function isoWeek(date: Date): number {
  const t = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - day + 3);
  const first = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const firstDay = (first.getUTCDay() + 6) % 7;
  first.setUTCDate(first.getUTCDate() - firstDay + 3);
  return 1 + Math.round((t.getTime() - first.getTime()) / 604800000);
}

const cache = new Map<string, Order[]>();

/** Alle ordrer for én avdeling på én dag. */
/**
 * Gjennomsnittlig jobbtid brukt i kapasitetsregnestykket. Katalogen spenner fra
 * 30 min (Basic-vask) til flere timer (lakkforsegling); 1,5 t er snittet en
 * plass faktisk omsetter gjennom en dag.
 */
const AVG_JOB_HOURS = 1.5;

/**
 * Hvor mange biler avdelingen rekker på én dag: plasser × hvor mange jobber
 * hver plass rekker innenfor åpningstiden.
 *
 * Tidligere var dette hardkodet til `maxConcurrentCars * 3`, som ikke fulgte
 * åpningstidene og lå under det ordregeneratoren faktisk produserer — derfor
 * kunne oversikten vise «12 av 9 plasser booket», altså flere biler enn
 * plasser. Stengt dag gir 0.
 */
export function dayCapacity(location: Location, date: Date): number {
  const hours = hoursForDay(location.openingHours, weekdayIndex(date));
  if (!hours || hours.closed) return 0;
  const open = Number(hours.open.slice(0, 2));
  const close = Number(hours.close.slice(0, 2));
  const perBay = Math.max(1, Math.floor((close - open) / AVG_JOB_HOURS));
  return location.maxConcurrentCars * perBay;
}

export function ordersForDay(location: Location, date: string): Order[] {
  const key = `${location.slug}|${date}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const day = parseIso(date);
  const out: Order[] = [];
  const hours = hoursForDay(location.openingHours, weekdayIndex(day));
  if (!hours || hours.closed) {
    cache.set(key, out);
    return out;
  }

  const random = mulberry32(hashString(key));
  const open = Number(hours.open.slice(0, 2));
  const close = Number(hours.close.slice(0, 2));
  const base =
    7.2 *
    (WEIGHT[location.slug] ?? 0.85) *
    SEASON[day.getMonth()] *
    WEEKDAY[weekdayIndex(day)];
  /* Ordremengden er klemt til ~90 % av dagens kapasitet. Uten dette tok
     generatoren ingen hensyn til hvor mange biler avdelingen faktisk rekker,
     og en lørdag med 10–15 åpent (9 plasser) kunne få 12 bestillinger — som
     ga «12 av 9 plasser booket» på oversikten. 90 % og ikke 100 %: en
     avdeling holder av litt slark til dropp-inn, og et belegg som treffer
     taket hver eneste dag er ikke troverdig. */
  const capacity = dayCapacity(location, day);
  const ceiling = Math.max(1, Math.floor(capacity * 0.9));
  const count = Math.min(
    ceiling,
    Math.max(1, Math.round(base + (random() - 0.5) * 3.2)),
  );
  const available = services.filter((service) =>
    isServiceAvailable(service.id, location.id),
  );

  for (let index = 0; index < count; index += 1) {
    const roll = random();
    const category = MIX.find((entry) => roll < entry.upTo)?.category ?? "Bilvask";
    let pool = available.filter((service) => service.category === category);
    if (pool.length === 0) pool = available;
    const service = pool[Math.floor(random() * pool.length)];
    const baseOre = getEffectivePrice(service.id, location.id);

    // Tillegg: affinitet først, ~38 % festerate.
    const chosen: string[] = [];
    const affinity = addOnAffinity[service.id] ?? addOns.map((addOn) => addOn.id);
    if (random() < 0.38) {
      chosen.push(affinity[Math.floor(random() * affinity.length)]);
      if (random() < 0.22 && affinity.length > 1) {
        const second = affinity[Math.floor(random() * affinity.length)];
        if (second !== chosen[0]) chosen.push(second);
      }
    }
    const addOre = chosen.reduce(
      (sum, id) => sum + (addOns.find((addOn) => addOn.id === id)?.priceOre ?? 0),
      0,
    );
    const member = random() < 0.41;
    const discountOre = member ? Math.round((baseOre * 0.1) / 100) * 100 : 0;

    let roll2 = random();
    let channel: Channel = "telefon";
    for (const entry of CHANNELS) {
      if (roll2 < entry.weight) {
        channel = entry.id;
        break;
      }
      roll2 -= entry.weight;
    }

    out.push({
      id: `${location.slug}-${date}-${index}`,
      date,
      locationSlug: location.slug,
      hour: open + Math.floor(random() * Math.max(1, close - open)),
      serviceId: service.id,
      addOnIds: chosen,
      member,
      channel,
      baseOre,
      addOre,
      discountOre,
      totalOre: baseOre + addOre - discountOre,
    });
  }

  out.sort((a, b) => a.hour - b.hour);
  cache.set(key, out);
  return out;
}

/** «alle» = hele kjeden. */
export function ordersInRange(slug: string, from: Date, to: Date): Order[] {
  const chosen = slug === "alle" ? locations : locations.filter((l) => l.slug === slug);
  const out: Order[] = [];
  for (let day = new Date(from); day <= to; day = addDays(day, 1)) {
    const date = iso(day);
    for (const location of chosen) out.push(...ordersForDay(location, date));
  }
  return out;
}

export type Period = "dag" | "uke" | "maaned" | "aar";

export interface PeriodRange {
  from: Date;
  to: Date;
  label: string;
}

export function range(period: Period, anchor: Date): PeriodRange {
  const a = new Date(anchor);
  if (period === "dag") {
    return {
      from: a,
      to: a,
      label: a.toLocaleDateString("nb-NO", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  }
  if (period === "uke") {
    const from = startOfWeek(a);
    const to = addDays(from, 6);
    return {
      from,
      to,
      label: `Uke ${isoWeek(from)} · ${from.getDate()}.–${to.getDate()}. ${to.toLocaleDateString("nb-NO", { month: "long", year: "numeric" })}`,
    };
  }
  if (period === "maaned") {
    const from = new Date(a.getFullYear(), a.getMonth(), 1, 12);
    const to = new Date(a.getFullYear(), a.getMonth() + 1, 0, 12);
    return {
      from,
      to,
      label: from.toLocaleDateString("nb-NO", { month: "long", year: "numeric" }),
    };
  }
  return {
    from: new Date(a.getFullYear(), 0, 1, 12),
    to: new Date(a.getFullYear(), 11, 31, 12),
    label: String(a.getFullYear()),
  };
}

export function shift(period: Period, anchor: Date, direction: number): Date {
  const a = new Date(anchor);
  if (period === "dag") return addDays(a, direction);
  if (period === "uke") return addDays(a, direction * 7);
  if (period === "maaned") return new Date(a.getFullYear(), a.getMonth() + direction, 1, 12);
  return new Date(a.getFullYear() + direction, a.getMonth(), 1, 12);
}

export interface Bucket {
  x: string;
  full: string;
  sumOre: number;
  count: number;
  closed?: boolean;
}

const WD = ["man", "tir", "ons", "tor", "fre", "lør", "søn"];
const MO = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];

export function buckets(period: Period, anchor: Date, orders: Order[]): Bucket[] {
  const r = range(period, anchor);

  if (period === "dag") {
    const out: Bucket[] = [];
    for (let hour = 8; hour <= 16; hour += 1) {
      const list = orders.filter((order) => order.hour === hour);
      out.push({
        x: String(hour).padStart(2, "0"),
        full: `Kl. ${String(hour).padStart(2, "0")}–${String(hour + 1).padStart(2, "0")}`,
        sumOre: list.reduce((n, o) => n + o.totalOre, 0),
        count: list.length,
      });
    }
    return out;
  }

  if (period === "uke") {
    const out: Bucket[] = [];
    for (let i = 0; i < 7; i += 1) {
      const day = addDays(r.from, i);
      const date = iso(day);
      const list = orders.filter((order) => order.date === date);
      out.push({
        x: WD[i],
        full: day.toLocaleDateString("nb-NO", {
          weekday: "long",
          day: "numeric",
          month: "short",
        }),
        sumOre: list.reduce((n, o) => n + o.totalOre, 0),
        count: list.length,
        closed: day.getDay() === 0,
      });
    }
    return out;
  }

  if (period === "maaned") {
    const out: Bucket[] = [];
    const days = r.to.getDate();
    for (let i = 1; i <= days; i += 1) {
      const day = new Date(r.from.getFullYear(), r.from.getMonth(), i, 12);
      const date = iso(day);
      const list = orders.filter((order) => order.date === date);
      out.push({
        /* Alle dagene får datoen sin. Hvor mange av dem som faktisk vises
           avgjøres i Chart.tsx, som er det eneste stedet som vet hvor bred
           søylen ble — her tynnet vi ut til annenhver uansett skjerm, og på
           390px ble kolonnen 6px og alt fra 11 og oppover klippet til «1». */
        x: String(i),
        full: day.toLocaleDateString("nb-NO", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
        sumOre: list.reduce((n, o) => n + o.totalOre, 0),
        count: list.length,
        closed: day.getDay() === 0,
      });
    }
    return out;
  }

  const out: Bucket[] = [];
  for (let month = 0; month < 12; month += 1) {
    const list = orders.filter((order) => parseIso(order.date).getMonth() === month);
    out.push({
      x: MO[month],
      full: new Date(r.from.getFullYear(), month, 1).toLocaleDateString("nb-NO", {
        month: "long",
        year: "numeric",
      }),
      sumOre: list.reduce((n, o) => n + o.totalOre, 0),
      count: list.length,
    });
  }
  return out;
}

export interface Summary {
  sumOre: number;
  count: number;
  avgOre: number;
  vatOre: number;
  addRevenueOre: number;
  discountOre: number;
  memberShare: number;
  attachRate: number;
}

export function summarize(orders: Order[]): Summary {
  const sumOre = orders.reduce((n, o) => n + o.totalOre, 0);
  const count = orders.length;
  return {
    sumOre,
    count,
    avgOre: count ? Math.round(sumOre / count) : 0,
    vatOre: Math.round(sumOre / 5),
    addRevenueOre: orders.reduce((n, o) => n + o.addOre, 0),
    discountOre: orders.reduce((n, o) => n + o.discountOre, 0),
    memberShare: count ? orders.filter((o) => o.member).length / count : 0,
    attachRate: count ? orders.filter((o) => o.addOnIds.length > 0).length / count : 0,
  };
}

export function byService(orders: Order[]): Array<{ service: Service; count: number; sumOre: number }> {
  const map = new Map<string, { count: number; sumOre: number }>();
  for (const order of orders) {
    const current = map.get(order.serviceId) ?? { count: 0, sumOre: 0 };
    current.count += 1;
    current.sumOre += order.baseOre - order.discountOre;
    map.set(order.serviceId, current);
  }
  return [...map.entries()]
    .map(([id, value]) => ({ service: services.find((s) => s.id === id)!, ...value }))
    .filter((row) => row.service)
    .sort((a, b) => b.sumOre - a.sumOre);
}

export function byCategory(orders: Order[]): Array<{ label: string; count: number; sumOre: number }> {
  const map = new Map<string, { count: number; sumOre: number }>();
  for (const order of orders) {
    const service = services.find((s) => s.id === order.serviceId);
    if (!service) continue;
    const current = map.get(service.category) ?? { count: 0, sumOre: 0 };
    current.count += 1;
    current.sumOre += order.totalOre;
    map.set(service.category, current);
  }
  return serviceCategories()
    .map((c) => ({ label: c.label, ...(map.get(c.label) ?? { count: 0, sumOre: 0 }) }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.sumOre - a.sumOre);
}

export function byAddOn(orders: Order[]): Array<{ addOn: AddOn; count: number; sumOre: number }> {
  const map = new Map<string, { count: number; sumOre: number }>();
  for (const order of orders) {
    for (const id of order.addOnIds) {
      const addOn = addOns.find((a) => a.id === id);
      if (!addOn) continue;
      const current = map.get(id) ?? { count: 0, sumOre: 0 };
      current.count += 1;
      current.sumOre += addOn.priceOre;
      map.set(id, current);
    }
  }
  return [...map.entries()]
    .map(([id, value]) => ({ addOn: addOns.find((a) => a.id === id)!, ...value }))
    .sort((a, b) => b.sumOre - a.sumOre);
}

export function byChannel(orders: Order[]) {
  return CHANNELS.map(({ id, label }) => {
    const list = orders.filter((order) => order.channel === id);
    return {
      id,
      label,
      count: list.length,
      sumOre: list.reduce((n, o) => n + o.totalOre, 0),
    };
  })
    .filter((row) => row.count > 0)
    .sort((a, b) => b.sumOre - a.sumOre);
}

export function byLocation(orders: Order[]): Array<{ location: Location; count: number; sumOre: number }> {
  const map = new Map<string, { count: number; sumOre: number }>();
  for (const order of orders) {
    const current = map.get(order.locationSlug) ?? { count: 0, sumOre: 0 };
    current.count += 1;
    current.sumOre += order.totalOre;
    map.set(order.locationSlug, current);
  }
  return [...map.entries()]
    .map(([slug, value]) => ({
      location: locations.find((l) => l.slug === slug)!,
      ...value,
    }))
    .filter((row) => row.location)
    .sort((a, b) => b.sumOre - a.sumOre);
}

export interface Report {
  range: PeriodRange;
  prevRange: PeriodRange;
  orders: Order[];
  now: Summary;
  before: Summary;
  buckets: Bucket[];
  services: ReturnType<typeof byService>;
  categories: ReturnType<typeof byCategory>;
  addOns: ReturnType<typeof byAddOn>;
  channels: ReturnType<typeof byChannel>;
  locations: ReturnType<typeof byLocation>;
}

/** Rapport for én periode, med sammenligning mot forrige tilsvarende periode. */
export function report(slug: string, period: Period, anchor: Date): Report {
  const r = range(period, anchor);
  const orders = ordersInRange(slug, r.from, r.to);
  const previous = range(period, shift(period, anchor, -1));
  const before = ordersInRange(slug, previous.from, previous.to);
  return {
    range: r,
    prevRange: previous,
    orders,
    now: summarize(orders),
    before: summarize(before),
    buckets: buckets(period, anchor, orders),
    services: byService(orders),
    categories: byCategory(orders),
    addOns: byAddOn(orders),
    channels: byChannel(orders),
    locations: byLocation(orders),
  };
}

/** Relativ endring, eller null når det ikke finnes et sammenligningsgrunnlag. */
export function pct(now: number, before: number): number | null {
  return before ? (now - before) / before : null;
}

/**
 * Én linje per ordre. Semikolon som skilletegn og BOM foran innholdet, slik at
 * norsk Excel åpner filen riktig (ADMIN.md § CSV-eksport).
 */
export function toCsv(rep: Report, locationLabel: string, periodLabel: string): string {
  const kr = (ore: number) => (ore / 100).toFixed(2).replace(".", ",");
  const rows: Array<Array<string | number>> = [
    ["Handz On Auto Care, salgsrapport"],
    ["Avdeling", locationLabel],
    ["Periode", periodLabel],
    ["Omsetning inkl. mva", kr(rep.now.sumOre)],
    ["Herav mva (25 %)", kr(rep.now.vatOre)],
    ["Antall ordrer", rep.now.count],
    ["Snittordre", kr(rep.now.avgOre)],
    [],
    ["Dato", "Tid", "Avdeling", "Tjeneste", "Tillegg", "Kanal", "Medlem", "Rabatt", "Sum inkl. mva"],
  ];
  for (const order of rep.orders) {
    const service = services.find((s) => s.id === order.serviceId);
    rows.push([
      order.date,
      `${String(order.hour).padStart(2, "0")}:00`,
      locations.find((l) => l.slug === order.locationSlug)?.name ?? "",
      service?.name ?? "",
      order.addOnIds
        .map((id) => addOns.find((a) => a.id === id)?.name ?? "")
        .join(" + "),
      order.channel,
      order.member ? "ja" : "nei",
      kr(order.discountOre),
      kr(order.totalOre),
    ]);
  }
  return rows
    .map((row) =>
      row
        .map((cell) =>
          typeof cell === "string" && /[;"\n]/.test(cell)
            ? `"${cell.replace(/"/g, '""')}"`
            : cell,
        )
        .join(";"),
    )
    .join("\n");
}
