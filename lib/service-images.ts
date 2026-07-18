/**
 * Bilder for tjenester (erstatter ImagePlaceholder). Rolige, cinematiske
 * bilpleiebilder valgt per tjeneste. Filene ligger i /public/tjenester.
 * `thumb` = kvadratisk miniatyr (kort/liste), `hero` = bredt toppbilde
 * (tjeneste-detalj).
 */
export type ServiceImage = { thumb: string; hero: string };

export const serviceImages: Record<string, ServiceImage> = {
  "utvendig-handvask": {
    thumb: "/tjenester/utvendig-handvask-thumb.webp",
    hero: "/tjenester/utvendig-handvask.webp",
  },
  "utvendig-vask-og-voks": {
    thumb: "/tjenester/utvendig-vask-og-voks-thumb.webp",
    hero: "/tjenester/utvendig-vask-og-voks.webp",
  },
  "innvendig-rens": {
    thumb: "/tjenester/innvendig-rens-thumb.webp",
    hero: "/tjenester/innvendig-rens.webp",
  },
  "komplett-bilpleie": {
    thumb: "/tjenester/komplett-bilpleie-thumb.webp",
    hero: "/tjenester/komplett-bilpleie.webp",
  },
  polering: {
    thumb: "/tjenester/polering-thumb.webp",
    hero: "/tjenester/polering.webp",
  },
  "keramisk-coating": {
    thumb: "/tjenester/keramisk-coating-thumb.webp",
    hero: "/tjenester/keramisk-coating.webp",
  },
  motorvask: {
    thumb: "/tjenester/motorvask-thumb.webp",
    hero: "/tjenester/motorvask.webp",
  },
  lyktesliping: {
    thumb: "/tjenester/lyktesliping-thumb.webp",
    hero: "/tjenester/lyktesliping.webp",
  },
};

/** Toppbilde for Om oss-siden. */
export const aboutHeroImage = "/om-oss/detaljering.webp";

export function getServiceImage(slug: string): ServiceImage | undefined {
  return serviceImages[slug];
}
