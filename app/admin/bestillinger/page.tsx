import type { Metadata } from "next";
import { BestillingerScreen } from "./bestillinger-screen";

export const metadata: Metadata = {
  title: "Bestillinger",
  description: "Dag for dag med statusflyt: ny, inne til behandling, klar til henting, levert.",
};

export default function AdminBestillingerPage() {
  return <BestillingerScreen />;
}
