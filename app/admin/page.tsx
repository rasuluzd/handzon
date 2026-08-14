import type { Metadata } from "next";
import { OversiktScreen } from "./oversikt-screen";

export const metadata: Metadata = {
  title: "Oversikt",
  description: "Dagens drift: omsetning, ordrer, kapasitet og hva som venter.",
};

export default function AdminOversiktPage() {
  return <OversiktScreen />;
}
