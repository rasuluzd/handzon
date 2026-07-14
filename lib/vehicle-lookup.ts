import type { Vehicle } from "./types";

/**
 * Mock av Statens vegvesens «Enkeltoppslag i motorvognregisteret» (FR-2.1 steg 2).
 * I produksjon byttes denne mot et kall til SVV REST-API med API-nøkkel,
 * cache og 2 s timeout med manuell fallback (NFR-3).
 */

/** Norske kjennemerker: to bokstaver (ikke I, M, O, Q, Æ, Ø, Å) + fem sifre. */
const REG_NR_PATTERN = /^[A-Z]{2}\d{5}$/;

export function normalizeRegNr(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, "").trim();
}

export function isValidRegNr(input: string): boolean {
  return REG_NR_PATTERN.test(normalizeRegNr(input));
}

const knownVehicles: Record<string, Omit<Vehicle, "regNr">> = {
  EB12345: { make: "Tesla", model: "Model Y", year: 2023, fuel: "Elektrisk", color: "Hvit" },
  DR34567: { make: "Volkswagen", model: "Golf", year: 2019, fuel: "Bensin", color: "Grå" },
  SU98765: { make: "Volvo", model: "XC60", year: 2021, fuel: "Diesel", color: "Svart" },
  EK55443: { make: "Hyundai", model: "Kona Electric", year: 2024, fuel: "Elektrisk", color: "Blå" },
};

const makesAndModels: Array<{ make: string; models: string[] }> = [
  { make: "Toyota", models: ["RAV4", "Corolla", "Yaris"] },
  { make: "Volkswagen", models: ["ID.4", "Tiguan", "Passat"] },
  { make: "Volvo", models: ["XC40", "V60", "XC90"] },
  { make: "Tesla", models: ["Model 3", "Model Y"] },
  { make: "Skoda", models: ["Octavia", "Enyaq", "Kodiaq"] },
  { make: "BMW", models: ["X3", "i4", "320d"] },
  { make: "Audi", models: ["Q4 e-tron", "A4", "Q5"] },
  { make: "Nissan", models: ["Leaf", "Qashqai"] },
];

const fuels = ["Elektrisk", "Bensin", "Diesel", "Hybrid"];
const colors = ["Svart", "Hvit", "Grå", "Blå", "Rød", "Sølv"];

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Slår opp et registreringsnummer. Deterministisk: samme regnr gir alltid
 * samme bil, så demoen oppleves som et ekte register.
 */
export async function lookupVehicle(input: string): Promise<Vehicle | null> {
  const regNr = normalizeRegNr(input);
  if (!isValidRegNr(regNr)) return null;

  // Simulert nettverkslatens som i et ekte API-kall.
  await new Promise((resolve) => setTimeout(resolve, 450));

  // Demonstrerer NFR-3: dette regnummeret simulerer at SVV ikke svarer,
  // slik at den manuelle fallback-flyten kan vises frem.
  if (regNr === "FE11111") return null;

  const known = knownVehicles[regNr];
  if (known) return { regNr, ...known };

  const hash = hashString(regNr);
  const makeEntry = makesAndModels[hash % makesAndModels.length];
  const model = makeEntry.models[(hash >>> 4) % makeEntry.models.length];
  return {
    regNr,
    make: makeEntry.make,
    model,
    year: 2015 + ((hash >>> 8) % 11),
    fuel: fuels[(hash >>> 12) % fuels.length],
    color: colors[(hash >>> 16) % colors.length],
  };
}
