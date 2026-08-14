import type { Metadata } from "next";
import { TjenesterScreen } from "./tjenester-screen";

export const metadata: Metadata = {
  title: "Tjenester og priser",
  description:
    "Rediger navn, beskrivelse, kjedepris, varighet og synlighet. Lokalpris per avdeling med utkast-flyt.",
};

export default function AdminTjenesterPage() {
  return <TjenesterScreen />;
}
