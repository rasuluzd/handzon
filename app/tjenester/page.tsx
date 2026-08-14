import type { Metadata } from "next";
import { PageHead } from "@/components/site/Section";
import { ServiceCatalog } from "./service-catalog";

export const metadata: Metadata = {
  title: "Tjenester",
  description:
    "Alt innen bilpleie: utvendig og innvendig vask, polering, keramisk lakkforsegling, interiørrens og hjul. Faste priser inkl. mva. Lokale avvik vises per avdeling.",
};

export default async function ServicesPage({ searchParams }: PageProps<"/tjenester">) {
  const query = await searchParams;
  const category = typeof query.kategori === "string" ? query.kategori : null;

  return (
    <>
      <PageHead
        eyebrow="Tjenester"
        title="Alt innen bilpleie"
        lead={
          /* Ingressen er kortet ned på mobil. Toppen av denne siden er ren
             ventetid før man ser en pris, og setningen om lokale avvik står
             uansett på hver tjenesteside og i bookingen — der den er relevant.
             Løftet som selger, «faste priser», beholdes på alle bredder. */
          <>
            Faste priser inkl. mva. Endelig pris får du i bookingen.
            <span className="max-hz:hidden"> Lokale avvik vises per avdeling.</span>
          </>
        }
      >
        {/* Luft ned mot den sticky filterbaren: 10px på mobil, 24px fra 900px. */}
        <div className="h-2.5 hz:h-6" />
      </PageHead>
      <ServiceCatalog initialCategory={category} />
    </>
  );
}
