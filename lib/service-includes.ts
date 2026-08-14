import type { ServiceCategory } from "./types";

/**
 * «Dette inngår» — fire punkter per kategori (SCREENS.md § Tjeneste-detalj).
 * Konkret håndverk, ikke superlativer: det er dette som skiller kjeden fra
 * en vaskehall.
 */
export const serviceIncludes: Record<ServiceCategory, string[]> = {
  Bilvask: [
    "Forvask og skumbad",
    "Håndvask med to-bøtte-metode",
    "Felgvask og dekkrens",
    "Skånsom tørk med mikrofiber",
  ],
  Polering: [
    "Lakkrens og avfetting",
    "Maskinpolering i flere trinn",
    "Fjerning av svirvelmerker",
    "Beskyttende voks til slutt",
  ],
  Lakkforsegling: [
    "Full lakkrens med leire",
    "Avfetting og IPA-tørk",
    "Graphene-basert coating",
    "Herding under kontrollerte forhold",
  ],
  "Full Shine": [
    "Komplett vask ute og inne",
    "Lakkrens og polering",
    "Innvendig dyprens av alle flater",
    "Klimadesinfisering",
  ],
  Interiør: [
    "Grundig støvsuging",
    "Rens av alle harde flater",
    "Tekstil- eller skinnrens av seter",
    "Rens av vinduer innvendig",
  ],
  "Dekk & Felg": [
    "Demontering og montering",
    "Momenttrekk etter spesifikasjon",
    "Kontroll av dekktrykk",
    "Visuell kontroll av dekk",
  ],
};
