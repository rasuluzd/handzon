import type { Metadata } from "next";
import { today } from "@/lib/sales";
import { fetchAllForecasts } from "@/lib/weather";
import { OversiktScreen } from "./oversikt-screen";

export const metadata: Metadata = {
  title: "Oversikt",
  description: "Dagens drift: omsetning, ordrer, kapasitet og hva som venter.",
};

/**
 * Værvarselet hentes HER, i serverkomponenten, og sendes ned som prop.
 *
 * To grunner: api.met.no krever en identifiserende User-Agent, og den kan ikke
 * settes fra en nettleser. Og skjermen bytter avdeling i klienten, så et kall
 * per avdelingsbytte ville blitt fjorten kall for noe som bare finnes i tre
 * regionale varianter. Her hentes alle tre én gang, med 30 minutters
 * revalidering (se lib/weather.ts).
 */
export default async function AdminOversiktPage() {
  const forecasts = await fetchAllForecasts(today());
  return <OversiktScreen forecasts={forecasts} />;
}
