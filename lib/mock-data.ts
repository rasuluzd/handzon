import type {
  AddOn,
  Location,
  LocationServiceOverride,
  Organization,
  Service,
} from "./types";

/**
 * Mock-data for demoen: 15 avdelinger, hver drevet av egen juridisk enhet
 * (eget org.nummer) — franchisemodellen fra docs/IMPLEMENTASJONSPLAN.md kap. 3.
 * Org.numrene er fiktive.
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
  lat: number;
  lng: number;
  maxConcurrentCars: number;
  campaign?: string;
}

const locationSeeds: LocationSeed[] = [
  { slug: "oslo-alna", name: "Oslo Alna", orgNr: "923456781", address: "Strømsveien 245", postalCode: "0668", city: "Oslo", region: "Østlandet", lat: 59.9284, lng: 10.8465, maxConcurrentCars: 4, campaign: "Sommerkampanje: 20 % på keramisk coating ut juli" },
  { slug: "oslo-skoyen", name: "Oslo Skøyen", orgNr: "923456782", address: "Drammensveien 165", postalCode: "0277", city: "Oslo", region: "Østlandet", lat: 59.9195, lng: 10.6796, maxConcurrentCars: 3 },
  { slug: "sandvika", name: "Sandvika", orgNr: "923456783", address: "Industriveien 33", postalCode: "1337", city: "Sandvika", region: "Østlandet", lat: 59.8896, lng: 10.5262, maxConcurrentCars: 3, campaign: "Gratis felgrens ved komplett bilpleie i juli" },
  { slug: "lillestrom", name: "Lillestrøm", orgNr: "923456784", address: "Depotgata 20", postalCode: "2000", city: "Lillestrøm", region: "Østlandet", lat: 59.9566, lng: 11.0458, maxConcurrentCars: 3 },
  { slug: "ski", name: "Ski", orgNr: "923456785", address: "Kjeppestadveien 42", postalCode: "1400", city: "Ski", region: "Østlandet", lat: 59.7195, lng: 10.8351, maxConcurrentCars: 2 },
  { slug: "drammen", name: "Drammen", orgNr: "923456786", address: "Bjørnstjerne Bjørnsons gate 110", postalCode: "3044", city: "Drammen", region: "Østlandet", lat: 59.7378, lng: 10.2050, maxConcurrentCars: 3 },
  { slug: "fredrikstad", name: "Fredrikstad", orgNr: "923456787", address: "Dikeveien 28", postalCode: "1661", city: "Fredrikstad", region: "Østlandet", lat: 59.2431, lng: 10.9298, maxConcurrentCars: 2 },
  { slug: "tonsberg", name: "Tønsberg", orgNr: "923456788", address: "Kilengaten 15", postalCode: "3117", city: "Tønsberg", region: "Østlandet", lat: 59.2707, lng: 10.4210, maxConcurrentCars: 2 },
  { slug: "kristiansand", name: "Kristiansand", orgNr: "923456789", address: "Barstølveien 54", postalCode: "4636", city: "Kristiansand", region: "Sørlandet", lat: 58.1717, lng: 8.0763, maxConcurrentCars: 3 },
  { slug: "stavanger-forus", name: "Stavanger Forus", orgNr: "923456790", address: "Forusbeen 35", postalCode: "4033", city: "Stavanger", region: "Vestlandet", lat: 58.8908, lng: 5.7118, maxConcurrentCars: 4, campaign: "Ny avdeling: 15 % på første bestilling" },
  { slug: "bergen-asane", name: "Bergen Åsane", orgNr: "923456791", address: "Åsane Senter 40", postalCode: "5116", city: "Bergen", region: "Vestlandet", lat: 60.4650, lng: 5.3220, maxConcurrentCars: 3 },
  { slug: "bergen-kokstad", name: "Bergen Kokstad", orgNr: "923456792", address: "Kokstadflaten 5", postalCode: "5257", city: "Bergen", region: "Vestlandet", lat: 60.2917, lng: 5.2648, maxConcurrentCars: 2 },
  { slug: "alesund", name: "Ålesund", orgNr: "923456793", address: "Langelandsveien 25", postalCode: "6010", city: "Ålesund", region: "Vestlandet", lat: 62.4664, lng: 6.3462, maxConcurrentCars: 2 },
  { slug: "trondheim-lade", name: "Trondheim Lade", orgNr: "923456794", address: "Haakon VIIs gate 14", postalCode: "7041", city: "Trondheim", region: "Midt-Norge", lat: 63.4468, lng: 10.4568, maxConcurrentCars: 3 },
  { slug: "tromso", name: "Tromsø", orgNr: "923456795", address: "Stakkevollvegen 51", postalCode: "9010", city: "Tromsø", region: "Nord-Norge", lat: 69.6663, lng: 18.9722, maxConcurrentCars: 2 },
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
  phone: "40 00 00 00",
  email: `${seed.slug.replace(/-/g, ".")}@handzonautocare.no`,
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
  { locationId: "loc-oslo-skoyen", serviceId: "svc-komplett", priceOre: 239900 },
  { locationId: "loc-oslo-skoyen", serviceId: "svc-utvendig-vask", priceOre: 44900 },
  { locationId: "loc-tromso", serviceId: "svc-coating", unavailable: true },
  { locationId: "loc-ski", serviceId: "svc-polering", unavailable: true },
  { locationId: "loc-stavanger-forus", serviceId: "svc-komplett", priceOre: 199900 },
  { locationId: "loc-sandvika", serviceId: "svc-coating", priceOre: 749900 },
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
