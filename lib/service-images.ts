/**
 * Foto per tjeneste. `thumb` = kvadratisk miniatyr (kort, bookingrader),
 * `hero` = bredt toppbilde (tjeneste-detalj og forsidens trio).
 * Filene ligger i /public og byttes til Cowork-bilder når de er klare —
 * behold filnavnene, så følger alt annet med (README § Assets).
 */
export type ServiceImage = { thumb: string; hero: string };

const wash = {
  thumb: "/tjenester/utvendig-handvask-thumb.webp",
  hero: "/tjenester/utvendig-handvask.webp",
};
const washFull = {
  thumb: "/tjenester/utvendig-vask-og-voks-thumb.webp",
  hero: "/tjenester/utvendig-vask-og-voks.webp",
};
const polish = {
  thumb: "/tjenester/polering-thumb.webp",
  hero: "/tjenester/polering.webp",
};
const detailing = {
  thumb: "/om-oss/detaljering.webp",
  hero: "/om-oss/detaljering.webp",
};
const coating = {
  thumb: "/tjenester/keramisk-coating-thumb.webp",
  hero: "/tjenester/keramisk-coating.webp",
};
const fullShine = {
  thumb: "/tjenester/komplett-bilpleie-thumb.webp",
  hero: "/tjenester/komplett-bilpleie.webp",
};
const interior = {
  thumb: "/tjenester/innvendig-rens-thumb.webp",
  hero: "/tjenester/innvendig-rens.webp",
};
// Dekk & Felg: samme fil for thumb og hero (object-cover beskjærer til kvadrat).
const wheels = { thumb: "/hero-hjulskift.webp", hero: "/hero-hjulskift.webp" };

export const serviceImages: Record<string, ServiceImage> = {
  // Bilvask
  "vask-utvendig-basic": wash,
  "vask-utvendig-premium": wash,
  "vask-innvendig-premium": interior,
  "vask-ut-innvendig-premium": washFull,
  // Polering
  "polering-basic": polish,
  "polering-pro": polish,
  "lakkrens-polering-pro": detailing,
  // Lakkforsegling
  "keramisk-lakkforsegling": coating,
  "kontrollvask-rebehandling": coating,
  // Full Shine
  "full-shine-basic": fullShine,
  "full-shine-pro": fullShine,
  // Interiør
  "rens-innvendig": interior,
  "skinn-rens-behandling": interior,
  "rens-enkelt-sete": interior,
  "ozon-desinfisering": interior,
  // Dekk & Felg
  "omlegg-balansering": wheels,
  "skift-av-hjul": wheels,
  "vask-av-hjul": wheels,
};

/** Toppbilder for øvrige flater. */
export const aboutHeroImage = "/om-oss/detaljering.webp";
export const branchHeroImage = "/tjenester/utvendig-handvask.webp";
export const heroImage = "/tjenester/komplett-bilpleie.webp";
export const sustainabilityImage = "/tjenester/utvendig-vask-og-voks.webp";

const fallback: ServiceImage = wash;

export function getServiceImage(slug: string): ServiceImage {
  return serviceImages[slug] ?? fallback;
}
