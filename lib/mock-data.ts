import type {
  AddOn,
  Location,
  LocationServiceOverride,
  Organization,
  Service,
} from "./types";

/**
 * Avdelingsdata for de 14 ekte Handz On-avdelingene (kilde: handzon.no/avdelinger,
 * juli 2026). Navn, adresse, postnr, by og telefon er reelle. Org.numrene er
 * fiktive plassholdere som demonstrerer franchisemodellen (egen juridisk enhet
 * per avdeling, jf. docs/IMPLEMENTASJONSPLAN.md kap. 3) — fyll inn ekte org.nr
 * per franchisetaker fra Brønnøysund i produksjon. Koordinatene er på by-/
 * senternivå (nok for «Nær meg»-sortering); selve kartet henter eksakte pins
 * fra Google via Maps Embed API.
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
  orgNr: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  phone: string;
  lat: number;
  lng: number;
  maxConcurrentCars: number;
  campaign?: string;
}

const locationSeeds: LocationSeed[] = [
  { slug: "asker", name: "Asker", orgNr: "923456781", address: "Knud Askers vei 26", postalCode: "1383", city: "Asker", region: "Østlandet", phone: "488 43 795", lat: 59.8337, lng: 10.4352, maxConcurrentCars: 3, campaign: "Ny avdeling: 15 % på første bestilling" },
  { slug: "lagunen", name: "Lagunen", orgNr: "923456782", address: "Laguneveien 1", postalCode: "5239", city: "Rådal", region: "Vestlandet", phone: "479 27 731", lat: 60.2966, lng: 5.3299, maxConcurrentCars: 4, campaign: "Sommerkampanje: 20 % på keramisk coating ut juli" },
  { slug: "asane", name: "Åsane", orgNr: "923456783", address: "Åsane Storsenter 42, bygg A", postalCode: "5116", city: "Ulset", region: "Vestlandet", phone: "916 74 554", lat: 60.4690, lng: 5.3235, maxConcurrentCars: 3 },
  { slug: "forus", name: "Forus", orgNr: "923456784", address: "Fabrikkveien 2", postalCode: "4033", city: "Stavanger", region: "Vestlandet", phone: "457 39 525", lat: 58.8918, lng: 5.7195, maxConcurrentCars: 4 },
  { slug: "jessheim", name: "Jessheim", orgNr: "923456785", address: "Ringenveien 4", postalCode: "2050", city: "Jessheim", region: "Østlandet", phone: "456 52 461", lat: 60.1533, lng: 11.1730, maxConcurrentCars: 3 },
  { slug: "sorlandssenteret", name: "Sørlandssenteret", orgNr: "923456786", address: "Barstølveien 35", postalCode: "4636", city: "Kristiansand", region: "Sørlandet", phone: "469 86 698", lat: 58.1868, lng: 8.0793, maxConcurrentCars: 3, campaign: "Gratis felgrens ved komplett bilpleie i juli" },
  { slug: "lambertseter", name: "Lambertseter", orgNr: "923456787", address: "Cecilie Thoresens vei 17–21", postalCode: "1153", city: "Oslo", region: "Østlandet", phone: "479 20 609", lat: 59.8760, lng: 10.8060, maxConcurrentCars: 3 },
  { slug: "metro", name: "Metro", orgNr: "923456788", address: "Bibliotekgata 30", postalCode: "1473", city: "Lørenskog", region: "Østlandet", phone: "980 53 599", lat: 59.9281, lng: 10.9620, maxConcurrentCars: 3 },
  { slug: "triaden", name: "Triaden", orgNr: "923456789", address: "Gamleveien 88", postalCode: "1461", city: "Lørenskog", region: "Østlandet", phone: "467 09 966", lat: 59.9500, lng: 11.0010, maxConcurrentCars: 2 },
  { slug: "sandvika", name: "Sandvika", orgNr: "923456790", address: "Brodtkorbs gate 7", postalCode: "1338", city: "Sandvika", region: "Østlandet", phone: "479 27 724", lat: 59.8883, lng: 10.5210, maxConcurrentCars: 3 },
  { slug: "skedsmo", name: "Skedsmo", orgNr: "923456791", address: "Furuholtet 1", postalCode: "2020", city: "Skedsmokorset", region: "Østlandet", phone: "484 34 321", lat: 59.9772, lng: 11.0330, maxConcurrentCars: 2 },
  { slug: "ski", name: "Ski", orgNr: "923456792", address: "Jernbanesvingen 6", postalCode: "1401", city: "Ski", region: "Østlandet", phone: "479 27 723", lat: 59.7195, lng: 10.8360, maxConcurrentCars: 2 },
  { slug: "strommen", name: "Strømmen", orgNr: "923456793", address: "Stasjonsveien 6", postalCode: "2010", city: "Strømmen", region: "Østlandet", phone: "941 77 814", lat: 59.9457, lng: 11.0060, maxConcurrentCars: 3 },
  { slug: "moa", name: "Moa", orgNr: "923456794", address: "Moaveien 1", postalCode: "6018", city: "Ålesund", region: "Vestlandet", phone: "920 72 829", lat: 62.4665, lng: 6.2430, maxConcurrentCars: 2 },
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

export const services: Service[] = [
  {
    id: "svc-utvendig-vask",
    slug: "utvendig-handvask",
    name: "Utvendig håndvask",
    category: "Utvendig",
    description:
      "Skånsom håndvask med to-bøtte-metode, felgvask og tørking med mikrofiber. Bilen skinner uten svirvelmerker.",
    priceOre: 39900,
    durationMin: 45,
    popular: true,
  },
  {
    id: "svc-utvendig-voks",
    slug: "utvendig-vask-og-voks",
    name: "Utvendig vask og voks",
    category: "Utvendig",
    description:
      "Komplett håndvask etterfulgt av hardvoks som gir dyp glans og beskyttelse i opptil 3 måneder.",
    priceOre: 89900,
    durationMin: 90,
    popular: true,
  },
  {
    id: "svc-innvendig-rens",
    slug: "innvendig-rens",
    name: "Innvendig dyprens",
    category: "Innvendig",
    description:
      "Grundig støvsuging, rens av alle flater, vinduspuss innvendig og tekstil-/skinnrens av seter.",
    priceOre: 149900,
    durationMin: 150,
    popular: true,
  },
  {
    id: "svc-komplett",
    slug: "komplett-bilpleie",
    name: "Komplett bilpleie",
    category: "Komplett",
    description:
      "Vår bestselger: utvendig håndvask og voks kombinert med innvendig dyprens. Bilen leveres som ny.",
    priceOre: 219900,
    durationMin: 240,
    popular: true,
  },
  {
    id: "svc-polering",
    slug: "polering",
    name: "Maskinpolering",
    category: "Lakk og beskyttelse",
    description:
      "Fjerner riper, svirvelmerker og oksidering i lakken. Inkluderer avfetting, leirbehandling og finish-voks.",
    priceOre: 349900,
    durationMin: 360,
  },
  {
    id: "svc-coating",
    slug: "keramisk-coating",
    name: "Keramisk coating",
    category: "Lakk og beskyttelse",
    description:
      "Langtidsbeskyttelse med keramisk belegg som holder i årevis. Inkluderer full polering og forbehandling.",
    priceOre: 799900,
    durationMin: 480,
  },
  {
    id: "svc-motorvask",
    slug: "motorvask",
    name: "Motorvask",
    category: "Utvendig",
    description:
      "Skånsom rengjøring av motorrom med avfetting og konservering. Trygt for elektronikk.",
    priceOre: 49900,
    durationMin: 45,
  },
  {
    id: "svc-lyktesliping",
    slug: "lyktesliping",
    name: "Lyktesliping",
    category: "Lakk og beskyttelse",
    description:
      "Sliping og polering av matte frontlykter — bedre lys og bestått EU-kontroll.",
    priceOre: 99900,
    durationMin: 60,
  },
];

export const addOns: AddOn[] = [
  {
    id: "add-felgrens",
    name: "Felgrens og felgforsegling",
    description: "Dyprens av felger med syrefri felgrens og beskyttende forsegling.",
    priceOre: 29900,
    durationMin: 20,
  },
  {
    id: "add-ozon",
    name: "Luktfjerning (ozon)",
    description: "Ozonbehandling som fjerner røyk-, dyre- og matlukt permanent.",
    priceOre: 59900,
    durationMin: 45,
  },
  {
    id: "add-skinn",
    name: "Skinnpleie",
    description: "Rens og impregnering av skinnseter — hindrer sprekker og slitasje.",
    priceOre: 49900,
    durationMin: 30,
  },
  {
    id: "add-vindu",
    name: "Vindusforsegling",
    description: "Regnavvisende behandling av frontrute og sideruter.",
    priceOre: 34900,
    durationMin: 20,
  },
  {
    id: "add-dyrehaar",
    name: "Fjerning av dyrehår",
    description: "Spesialrens for hundeeiere — fjerner hår fra seter og tepper.",
    priceOre: 39900,
    durationMin: 30,
  },
  {
    id: "add-interior-voks",
    name: "Interiørbehandling",
    description: "Pleie og UV-beskyttelse av dashbord og plastdetaljer.",
    priceOre: 29900,
    durationMin: 20,
  },
];

/**
 * «Ofte valgt sammen» — mersalgsmatrise (FR-3.2): tilleggstjenester i anbefalt
 * rekkefølge per hovedtjeneste. I produksjon beregnes denne fra ordrehistorikk.
 */
export const addOnAffinity: Record<string, string[]> = {
  "svc-utvendig-vask": ["add-felgrens", "add-vindu", "add-interior-voks"],
  "svc-utvendig-voks": ["add-felgrens", "add-vindu", "add-interior-voks"],
  "svc-innvendig-rens": ["add-ozon", "add-skinn", "add-dyrehaar"],
  "svc-komplett": ["add-felgrens", "add-skinn", "add-ozon"],
  "svc-polering": ["add-felgrens", "add-vindu"],
  "svc-coating": ["add-vindu", "add-felgrens"],
  "svc-motorvask": ["add-felgrens", "add-interior-voks"],
  "svc-lyktesliping": ["add-vindu", "add-felgrens"],
};

/**
 * Lokale prisoverstyringer (FR-5.2): franchise-admin kan justere pris og
 * tilgjengelighet for egen avdeling. Utvalg for demoen:
 */
export const locationServiceOverrides: LocationServiceOverride[] = [
  { locationId: "loc-lambertseter", serviceId: "svc-komplett", priceOre: 239900 },
  { locationId: "loc-lambertseter", serviceId: "svc-utvendig-vask", priceOre: 44900 },
  { locationId: "loc-moa", serviceId: "svc-coating", unavailable: true },
  { locationId: "loc-ski", serviceId: "svc-polering", unavailable: true },
  { locationId: "loc-forus", serviceId: "svc-komplett", priceOre: 199900 },
  { locationId: "loc-lagunen", serviceId: "svc-coating", priceOre: 749900 },
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
