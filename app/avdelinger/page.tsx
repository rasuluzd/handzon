import type { Metadata } from "next";
import { LocationList } from "./location-list";

export const metadata: Metadata = {
  title: "Avdelinger",
  description:
    "Finn din nærmeste Handz On Auto Care-avdeling. 15 avdelinger fra Kristiansand til Tromsø – søk på by eller postnummer.",
};

export default function LocationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Våre avdelinger</h1>
      <p className="mt-2 max-w-xl text-muted">
        15 avdelinger over hele Norge, hver drevet av en lokal franchisetaker.
        Søk på by eller postnummer for å finne din nærmeste.
      </p>
      <LocationList />
    </div>
  );
}
