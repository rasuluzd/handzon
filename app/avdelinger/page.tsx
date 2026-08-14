import type { Metadata } from "next";
import { PageHead, Section } from "@/components/site/Section";
import { LocationList } from "./location-list";

export const metadata: Metadata = {
  title: "Avdelinger",
  description:
    "Finn din nærmeste Handz On Auto Care-avdeling. 14 avdelinger fra Kristiansand til Ålesund – søk på by eller postnummer, eller bruk posisjonen din.",
};

export default function LocationsPage() {
  return (
    <>
      {/* Ingressen var fire linjer på 390px og dyttet søkefeltet ned. Geografien
          («fra Sørlandssenteret til Moa») står allerede i H1-ens «14 avdelinger»
          — det som selger er at du slipper å vente. */}
      <PageHead
        eyebrow="Avdelinger"
        title="14 avdelinger i Norge"
        lead="De fleste ligger på et kjøpesenter, så du gjør ærendene mens vi vasker bilen."
      />
      <Section className="!pt-5 hz:!pt-7">
        <LocationList />
      </Section>
    </>
  );
}
