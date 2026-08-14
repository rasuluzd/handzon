import type { Metadata } from "next";
import { RapportScreen } from "./rapport-screen";

export const metadata: Metadata = {
  title: "Salgsrapport",
  description:
    "Dag, uke, måned og år for én avdeling eller hele kjeden, med sammenligning mot forrige periode og CSV-eksport.",
};

export default function AdminRapportPage() {
  return <RapportScreen />;
}
