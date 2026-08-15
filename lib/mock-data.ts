import type {
  AddOn,
  Location,
  LocationServiceOverride,
  Organization,
  Region,
  Service,
} from "./types";

/**
 * Avdelingsdata for de 14 ekte Handz On-avdelingene (kilde: handzon.no/avdelinger).
 * Navn, senter, adresse, postnr, by og telefon er reelle. Org.numrene er fiktive
 * plassholdere som demonstrerer franchisemodellen (egen juridisk enhet per
 * avdeling, jf. docs/IMPLEMENTASJONSPLAN.md kap. 3) — fyll inn ekte org.nr per
 * franchisetaker fra Brønnøysund i produksjon. Koordinatene er på by-/senternivå
 * (nok for «Nær meg»-sortering); selve kartet henter eksakte pins fra Google via
 * Maps Embed API.
 *
 * Rekkefølgen er den kjeden selv bruker: nærmest Oslo sentrum først.
 */

const standardHours = [
  { day: 0, open: "08:00", close: "17:00" },
  { day: 1, open: "08:00", close: "17:00" },
  { day: 2, open: "08:00", close: "17:00" },
  { day: 3, open: "08:00", close: "18:00" },
  { day: 4, open: "08:00", close: "17:00" },
  { day: 5, open: "10:00", close: "15:00" },
  { day: 6, open: "00:00", close: "00:00", closed: true },
];

interface LocationSeed {
  slug: string;
  name: string;
  center: string;
  orgNr: string;
  address: string;
  postalCode: string;
  city: string;
  region: Region;
  phone: string;
  lat: number;
  lng: number;
  maxConcurrentCars: number;
  campaign?: string;
}

const locationSeeds: LocationSeed[] = [
  { slug: "lambertseter", name: "Lambertseter", center: "Lambertseter senter", orgNr: "923456787", address: "Cecilie Thoresens vei 17–21", postalCode: "1153", city: "Oslo", region: "Østlandet", phone: "479 20 609", lat: 59.8760, lng: 10.8060, maxConcurrentCars: 3 },
  { slug: "sandvika", name: "Sandvika", center: "Sandvika Storsenter", orgNr: "923456790", address: "Brodtkorbs gate 7", postalCode: "1338", city: "Sandvika", region: "Østlandet", phone: "479 27 724", lat: 59.8883, lng: 10.5210, maxConcurrentCars: 3 },
  { slug: "metro", name: "Metro", center: "Metro Senter", orgNr: "923456788", address: "Bibliotekgata 30", postalCode: "1473", city: "Lørenskog", region: "Østlandet", phone: "980 53 599", lat: 59.9281, lng: 10.9620, maxConcurrentCars: 3 },
  { slug: "ski", name: "Ski", center: "Ski Storsenter", orgNr: "923456792", address: "Jernbanesvingen 6", postalCode: "1401", city: "Ski", region: "Østlandet", phone: "479 27 723", lat: 59.7195, lng: 10.8360, maxConcurrentCars: 2 },
  { slug: "triaden", name: "Triaden", center: "Triaden Lørenskog", orgNr: "923456789", address: "Gamleveien 88", postalCode: "1461", city: "Lørenskog", region: "Østlandet", phone: "467 09 966", lat: 59.9500, lng: 11.0010, maxConcurrentCars: 2 },
  { slug: "strommen", name: "Strømmen", center: "Strømmen Storsenter", orgNr: "923456793", address: "Stasjonsveien 6", postalCode: "2010", city: "Strømmen", region: "Østlandet", phone: "941 77 814", lat: 59.9457, lng: 11.0060, maxConcurrentCars: 3 },
  { slug: "asker", name: "Asker", center: "Trekanten", orgNr: "923456781", address: "Knud Askers vei 26", postalCode: "1383", city: "Asker", region: "Østlandet", phone: "488 43 795", lat: 59.8337, lng: 10.4352, maxConcurrentCars: 3, campaign: "Ny avdeling: 15 % på første bestilling" },
  { slug: "skedsmo", name: "Skedsmo", center: "Skedsmokorset", orgNr: "923456791", address: "Furuholtet 1", postalCode: "2020", city: "Skedsmokorset", region: "Østlandet", phone: "484 34 321", lat: 59.9772, lng: 11.0330, maxConcurrentCars: 2 },
  { slug: "jessheim", name: "Jessheim", center: "Jessheim Storsenter", orgNr: "923456785", address: "Ringenveien 4", postalCode: "2050", city: "Jessheim", region: "Østlandet", phone: "456 52 461", lat: 60.1533, lng: 11.1730, maxConcurrentCars: 3 },
  { slug: "sorlandssenteret", name: "Sørlandssenteret", center: "Sørlandssenteret", orgNr: "923456786", address: "Barstølveien 35", postalCode: "4636", city: "Kristiansand", region: "Sørlandet", phone: "469 86 698", lat: 58.1868, lng: 8.0793, maxConcurrentCars: 3, campaign: "Gratis felgrens ved Full Shine i august" },
  { slug: "forus", name: "Forus", center: "Forus Handelspark", orgNr: "923456784", address: "Fabrikkveien 2", postalCode: "4033", city: "Stavanger", region: "Vestlandet", phone: "457 39 525", lat: 58.8918, lng: 5.7195, maxConcurrentCars: 4 },
  { slug: "lagunen", name: "Lagunen", center: "Lagunen Storsenter", orgNr: "923456782", address: "Laguneveien 1", postalCode: "5239", city: "Rådal", region: "Vestlandet", phone: "479 27 731", lat: 60.2966, lng: 5.3299, maxConcurrentCars: 4, campaign: "Sommerkampanje: 20 % på keramisk coating" },
  { slug: "asane", name: "Åsane", center: "Åsane Storsenter", orgNr: "923456783", address: "Åsane Storsenter 42, bygg A", postalCode: "5116", city: "Ulset", region: "Vestlandet", phone: "916 74 554", lat: 60.4690, lng: 5.3235, maxConcurrentCars: 3 },
  { slug: "moa", name: "Moa", center: "Moa Syd", orgNr: "923456794", address: "Moaveien 1", postalCode: "6018", city: "Ålesund", region: "Vestlandet", phone: "920 72 829", lat: 62.4665, lng: 6.2430, maxConcurrentCars: 2 },
];

export const organizations: Organization[] = locationSeeds.map((seed) => ({
  id: `org-${seed.slug}`,
  orgNr: seed.orgNr,
  legalName: `Handz On ${seed.name} AS`,
}));

export const locations: Location[] = locationSeeds.map((seed) => ({
  id: `loc-${seed.slug}`,
  orgId: `org-${seed.slug}`,
  slug: seed.slug,
  name: seed.name,
  center: seed.center,
  address: seed.address,
  postalCode: seed.postalCode,
  city: seed.city,
  region: seed.region,
  phone: seed.phone,
  email: "post@handzon.no",
  openingHours: standardHours,
  maxConcurrentCars: seed.maxConcurrentCars,
  geo: { lat: seed.lat, lng: seed.lng },
  campaign: seed.campaign,
}));

/**
 * Tjenestekatalogen — 18 tjenester i seks kategorier (Bilvask 4 · Polering 3 ·
 * Lakkforsegling 2 · Full Shine 2 · Interiør 4 · Dekk & Felg 3). Priser i øre,
 * inkl. 25 % mva. Rekkefølgen styrer visningen i katalog og bookingsteg 3.
 */
export const services: Service[] = [
  // ---------- Bilvask ----------
  {
    id: "svc-vask-utvendig-basic",
    slug: "vask-utvendig-basic",
    name: "Vask utvendig – Basic",
    category: "Bilvask",
    description:
      "Håndvask utvendig med felgvask, skum og tørk.",
    priceOre: 54000,
    durationMin: 30,
    level: "Basic",
  },
  {
    id: "svc-vask-utvendig-premium",
    slug: "vask-utvendig-premium",
    name: "Vask utvendig – Premium",
    category: "Bilvask",
    description:
      "To bøtter, ren klut per panel, tørk uten trykk.",
    priceOre: 79000,
    durationMin: 50,
    level: "Premium",
  },
  {
    id: "svc-vask-innvendig-premium",
    slug: "vask-innvendig-premium",
    name: "Vask innvendig – Premium",
    category: "Bilvask",
    description:
      "Støvsuging, alle flater tørket av, ruter pusset.",
    priceOre: 79000,
    durationMin: 50,
    level: "Premium",
  },
  {
    id: "svc-vask-ut-innvendig-premium",
    slug: "vask-ut-innvendig-premium",
    name: "Vask ut-/innvendig – Premium",
    category: "Bilvask",
    description:
      "Begge Premium-vaskene i ett besøk, ute og inne.",
    priceOre: 149000,
    durationMin: 75,
    level: "Premium",
    popular: true,
  },
  // ---------- Polering ----------
  {
    id: "svc-polering-basic",
    slug: "polering-basic",
    name: "Polering – Basic",
    category: "Polering",
    description:
      "Maskinpolering mot lette riper og matthet.",
    priceOre: 199000,
    durationMin: 180,
    level: "Basic",
    popular: true,
  },
  {
    id: "svc-polering-pro",
    slug: "polering-pro",
    name: "Polering – Pro",
    category: "Polering",
    description:
      "Flertrinns polering mot dypere riper og oksidering.",
    priceOre: 299000,
    durationMin: 240,
    level: "Pro",
    popular: true,
  },
  {
    id: "svc-lakkrens-polering-pro",
    slug: "lakkrens-polering-pro",
    name: "Lakkrens + Polering – Pro",
    category: "Polering",
    description:
      "Leire og avfetting først, så flertrinns polering.",
    priceOre: 449000,
    durationMin: 390,
    level: "Pro",
    guarantee: "NANO ~12 mnd",
  },
  // ---------- Lakkforsegling ----------
  {
    id: "svc-keramisk-lakkforsegling",
    slug: "keramisk-lakkforsegling",
    name: "Keramisk lakkforsegling",
    category: "Lakkforsegling",
    description:
      "Graphene-forsegling med seks års garanti på lakken.",
    priceOre: 999000,
    durationMin: 480,
    popular: true,
    guarantee: "6 års garanti",
  },
  {
    id: "svc-kontrollvask-rebehandling",
    slug: "kontrollvask-rebehandling",
    name: "Kontrollvask & rebehandling",
    category: "Lakkforsegling",
    description:
      "Vask og oppfrisking av forseglingen du alt har.",
    priceOre: 169000,
    durationMin: 150,
  },
  // ---------- Full Shine ----------
  {
    id: "svc-full-shine-basic",
    slug: "full-shine-basic",
    name: "Full Shine – Basic",
    category: "Full Shine",
    description:
      "Vask, lakkrens, polering og dyprens på én dag.",
    priceOre: 649000,
    durationMin: 480,
    level: "Basic",
  },
  {
    id: "svc-full-shine-pro",
    slug: "full-shine-pro",
    name: "Full Shine – Pro",
    category: "Full Shine",
    description:
      "Alt i Basic, pluss klimarens og NANO-beskyttelse.",
    priceOre: 749000,
    durationMin: 570,
    level: "Pro",
    popular: true,
    guarantee: "NANO ~12 mnd",
  },
  // ---------- Interiør ----------
  {
    id: "svc-rens-innvendig",
    slug: "rens-innvendig",
    name: "Rens innvendig (dyprens)",
    category: "Interiør",
    description:
      "Setene renses i tekstil eller skinn, flatene vaskes.",
    priceOre: 399000,
    durationMin: 330,
    popular: true,
  },
  {
    id: "svc-skinn-rens-behandling",
    slug: "skinn-rens-behandling",
    name: "Skinn rens og behandling",
    category: "Interiør",
    description:
      "Skinnet renses og gis næring, så det ikke sprekker.",
    priceOre: 199000,
    durationMin: 120,
  },
  {
    id: "svc-rens-enkelt-sete",
    slug: "rens-enkelt-sete",
    name: "Rens av enkelt sete",
    category: "Interiør",
    description:
      "Ett sete, dyprenset. Kaffesølet eller hva det var.",
    priceOre: 59000,
    durationMin: 45,
    popular: true,
  },
  {
    id: "svc-ozon-desinfisering",
    slug: "ozon-desinfisering",
    name: "Ozon / desinfisering",
    category: "Interiør",
    description:
      "Mot lukt som har satt seg: røyk, våt hund, gammel mat.",
    priceOre: 169000,
    durationMin: 60,
  },
  // ---------- Dekk & Felg ----------
  {
    id: "svc-omlegg-balansering",
    slug: "omlegg-balansering",
    name: "Omlegg og balansering",
    category: "Dekk & Felg",
    description:
      "Omlegging og balansering, så dekkene slites jevnt.",
    priceOre: 130000,
    durationMin: 75,
  },
  {
    id: "svc-skift-av-hjul",
    slug: "skift-av-hjul",
    name: "Skift av hjul",
    category: "Dekk & Felg",
    description:
      "Bytte mellom sommer- og vinterhjul mens du er innom.",
    priceOre: 50000,
    durationMin: 30,
  },
  {
    id: "svc-vask-av-hjul",
    slug: "vask-av-hjul",
    name: "Vask av hjul (løse)",
    category: "Dekk & Felg",
    description:
      "Rene felger og dekk før settet settes bort.",
    priceOre: 25000,
    durationMin: 20,
  },
];

export const addOns: AddOn[] = [
  {
    id: "add-asfalt",
    name: "Asfaltfjerning",
    description: "Løser opp asfaltsprut og tjæreflekker på lakk og terskler.",
    priceOre: 45000,
    durationMin: 30,
  },
  {
    id: "add-seterens",
    name: "Seterens (ett sete)",
    description: "Dyprens og flekkfjerning av ett sete i tekstil eller skinn.",
    priceOre: 50000,
    durationMin: 45,
  },
  {
    id: "add-rute",
    name: "Ruteforsegling",
    description: "Regnavvisende behandling av frontrute og sideruter.",
    priceOre: 34900,
    durationMin: 20,
  },
  {
    id: "add-dekkrens",
    name: "Dekkrensing og felgforsegling",
    description: "Syrefri felgrens med beskyttende forsegling og dekkglans.",
    priceOre: 29900,
    durationMin: 20,
  },
  {
    id: "add-ozon",
    name: "Luktfjerning (ozon)",
    description: "Fjerner røyk-, dyre- og matlukt permanent.",
    priceOre: 59900,
    durationMin: 45,
  },
  {
    id: "add-dyrehaar",
    name: "Fjerning av dyrehår",
    description: "Spesialrens for hundeeiere — fjerner hår fra seter og tepper.",
    priceOre: 39900,
    durationMin: 30,
  },
];

/**
 * «Ofte valgt sammen» — mersalgsmatrise (FR-3.2): tilleggstjenester i anbefalt
 * rekkefølge per hovedtjeneste. I produksjon beregnes denne fra ordrehistorikk.
 */
export const addOnAffinity: Record<string, string[]> = {
  "svc-vask-ut-innvendig-premium": ["add-dekkrens", "add-seterens", "add-rute"],
  "svc-vask-utvendig-premium": ["add-dekkrens", "add-rute", "add-asfalt"],
  "svc-vask-innvendig-premium": ["add-seterens", "add-ozon", "add-dyrehaar"],
  "svc-polering-basic": ["add-asfalt", "add-dekkrens", "add-rute"],
  "svc-polering-pro": ["add-asfalt", "add-dekkrens", "add-rute"],
  "svc-lakkrens-polering-pro": ["add-asfalt", "add-rute", "add-dekkrens"],
  "svc-keramisk-lakkforsegling": ["add-rute", "add-dekkrens", "add-asfalt"],
  "svc-full-shine-basic": ["add-dekkrens", "add-ozon", "add-seterens"],
  "svc-full-shine-pro": ["add-dekkrens", "add-ozon", "add-seterens"],
  "svc-rens-innvendig": ["add-ozon", "add-seterens", "add-dyrehaar"],
  "svc-skinn-rens-behandling": ["add-seterens", "add-ozon"],
  "svc-rens-enkelt-sete": ["add-dyrehaar", "add-ozon"],
};

/** Fallback når en tjeneste ikke står i affinitetsmatrisen. */
export const defaultAddOnIds = ["add-dekkrens", "add-rute", "add-asfalt"];

/**
 * Lokale prisoverstyringer (FR-5.2): franchise-admin kan justere pris og
 * tilgjengelighet for egen avdeling. Utvalg for demoen:
 */
export const locationServiceOverrides: LocationServiceOverride[] = [
  { locationId: "loc-lambertseter", serviceId: "svc-full-shine-pro", priceOre: 799000 },
  { locationId: "loc-lambertseter", serviceId: "svc-vask-utvendig-premium", priceOre: 84900 },
  { locationId: "loc-forus", serviceId: "svc-full-shine-pro", priceOre: 699000 },
  { locationId: "loc-sandvika", serviceId: "svc-keramisk-lakkforsegling", priceOre: 949000 },
  { locationId: "loc-moa", serviceId: "svc-keramisk-lakkforsegling", unavailable: true },
  { locationId: "loc-ski", serviceId: "svc-polering-pro", unavailable: true },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((location) => location.slug === slug);
}

export function getOrganization(orgId: string): Organization | undefined {
  return organizations.find((org) => org.id === orgId);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getAddOn(id: string): AddOn | undefined {
  return addOns.find((addOn) => addOn.id === id);
}

/** Anbefalte tillegg for en tjeneste, i rekkefølge. */
export function getAffinityAddOns(serviceId: string, limit = 3): AddOn[] {
  const ids = addOnAffinity[serviceId] ?? defaultAddOnIds;
  return ids
    .slice(0, limit)
    .map((id) => getAddOn(id))
    .filter((addOn): addOn is AddOn => Boolean(addOn));
}

/** Effektiv pris for en tjeneste ved en avdeling, med lokal overstyring. */
export function getEffectivePrice(serviceId: string, locationId: string): number {
  const override = locationServiceOverrides.find(
    (item) => item.locationId === locationId && item.serviceId === serviceId,
  );
  const service = services.find((item) => item.id === serviceId);
  return override?.priceOre ?? service?.priceOre ?? 0;
}

export function isServiceAvailable(serviceId: string, locationId: string): boolean {
  const override = locationServiceOverrides.find(
    (item) => item.locationId === locationId && item.serviceId === serviceId,
  );
  return !override?.unavailable;
}

/** Kategoriene i visningsrekkefølge, med antall tjenester. */
export function serviceCategories(): Array<{ label: string; count: number }> {
  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const service of services) {
    if (!counts.has(service.category)) order.push(service.category);
    counts.set(service.category, (counts.get(service.category) ?? 0) + 1);
  }
  return order.map((label) => ({ label, count: counts.get(label) ?? 0 }));
}
