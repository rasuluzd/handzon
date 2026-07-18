import type { Metadata } from "next";
import { LocationList } from "./location-list";

export const metadata: Metadata = {
  title: "Avdelinger",
  description:
    "Finn din nærmeste Handz On Auto Care-avdeling. 14 avdelinger fra Kristiansand til Ålesund – søk på by eller postnummer, eller bruk posisjonen din.",
};

export default function LocationsPage() {
  return (
    <div className="mx-auto max-w-[1160px] px-[clamp(24px,4vw,48px)] pb-10 pt-7">
      <p className="mb-2.5 font-heading text-[14px] font-semibold uppercase tracking-[0.1em] text-navy">
        Avdelinger
      </p>
      <h1 className="mb-5 font-heading text-[32px] font-bold leading-[1.1] text-ink">
        14 avdelinger i Norge
      </h1>
      <LocationList />
    </div>
  );
}
