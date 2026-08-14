import type { Review } from "./types";

/**
 * Kundeanmeldelser (sosialt bevis). Ekte kundeinnhold fra designpakken — navn,
 * sted, dato og sitat skal ikke byttes mot lorem eller generiske sitater.
 * Avatarfargene ligger alle på ≥ 4,6:1 mot hvit tekst; #00a8e4 er bevisst utelatt
 * (2,7:1).
 */
export const reviews: Review[] = [
  {
    initials: "MR",
    name: "Marius R.",
    where: "Lambertseter · aug. 2026",
    color: "#1e3a70",
    quote:
      "Leverte bilen før frokost og hentet den etter handleturen. De fant tjæreflekkene jeg hadde gitt opp.",
    service: "Vask ut-/innvendig – Premium",
    locationSlug: "lambertseter",
  },
  {
    initials: "IT",
    name: "Ingvild T.",
    where: "Lagunen · juli 2026",
    color: "#236b45",
    quote:
      "De tok bilder underveis og forklarte hva som var svirvelmerker og hva som var riper. Ærlig råd, null press.",
    service: "Full Shine – Pro",
    locationSlug: "lagunen",
  },
  {
    initials: "HB",
    name: "Håkon B.",
    where: "Forus · juni 2026",
    color: "#e41830",
    quote: "Seks års garanti, og bilen er selvrensende i regnet. Verdt hver krone.",
    service: "Keramisk lakkforsegling",
    locationSlug: "forus",
  },
  {
    initials: "NS",
    name: "Nina S.",
    where: "Sørlandssenteret · mai 2026",
    color: "#0c6f96",
    quote: "To barn og en hund. De fikk bort ting jeg trodde var permanent.",
    service: "Rens innvendig",
    locationSlug: "sorlandssenteret",
  },
];

/** Kilder til totalscoren, som vist i ratingkortet. */
export const ratingSources = [
  { name: "Google", score: "4,8", count: "1 612" },
  { name: "Trustpilot", score: "4,7", count: "421" },
  { name: "Gjestebok", score: "4,9", count: "107" },
];

export const ratingAverage = "4,8";
export const ratingTotal = "2 140";
