import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageHead, Section } from "@/components/site/Section";
import { KontaktForm } from "./kontakt-form";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Ta kontakt med Handz On — endring av booking, generelle spørsmål, reklamasjon eller samarbeid. Vi svarer vanligvis innen én til to virkedager.",
};

const infoCards = [
  {
    title: "Finn din avdeling",
    text: "Åpningstider, adresse og telefon til hver av de 14 avdelingene.",
    href: "/avdelinger",
    cta: "Se avdelinger →",
  },
  {
    title: "Endre en booking",
    text: "Skal du flytte eller avbestille en time? Logg inn på Min side.",
    href: "/min-side",
    cta: "Til Min side →",
  },
  {
    title: "Bestille en tjeneste",
    text: "Book bilpleie på senteret — velg avdeling, tjeneste og tidspunkt.",
    href: "/booking",
    cta: "Bestill time →",
  },
];

export default function KontaktPage() {
  return (
    <>
      <PageHead
        eyebrow="Kontakt"
        title="Ta kontakt med oss"
        lead={
          <>
            Har du et spørsmål, ønsker å endre en booking, eller vil melde fra om noe?
            Fyll ut skjemaet, så tar riktig avdeling kontakt.
            {/* Løftet om å «ringe direkte» krevde et telefonnummer siden ikke
                har — hver avdeling har sitt eget. Vi peker på avdelingssiden i
                stedet, og på mobil kutter vi setningen helt: snarveien over
                skjemaet gjør den samme jobben med ett trykk. */}
            <span className="max-hz:hidden">
              {" "}
              Gjelder det en konkret time, står telefonnummeret til avdelingen på
              avdelingssiden.
            </span>
          </>
        }
      />

      <Section className="!pt-5 hz:!pt-8">
        <div className="grid items-start gap-5 hz:grid-cols-[1.35fr_0.65fr] hz:gap-6">
          {/* Snarveiene står FØR skjemaet i kildekoden. Den som kom hit for å
              bestille eller flytte en time skal slippe å rulle forbi et
              750px skjema for å finne den raske veien. Fra 900px flyttes de
              tilbake til høyrekolonnen med `hz:order-last`. */}
          <nav aria-label="Snarveier" className="grid gap-2.5 hz:order-last hz:gap-3">
            {infoCards.map((card) => (
              <Link key={card.title} href={card.href} className="group block">
                <Card
                  interactive
                  className="flex h-full items-center gap-3 bg-surface-alt max-hz:py-3 hz:block"
                >
                  <div className="min-w-0">
                    <h2 className="font-heading text-[16px] font-semibold text-ink group-hover:text-navy hz:mb-1.5 hz:text-[17px]">
                      {card.title}
                    </h2>
                    {/* Brødteksten utdyper en tittel som allerede sier hva
                        lenken gjør. På mobil koster hver linje rulling foran
                        skjemaet, så raden reduseres til tittel og pil. */}
                    <p className="text-[14.5px] leading-[1.5] text-body-soft max-hz:hidden hz:mb-2.5">
                      {card.text}
                    </p>
                    <span className="font-heading text-[13.5px] font-semibold text-navy max-hz:hidden">
                      {card.cta}
                    </span>
                  </div>
                  <ChevronRight
                    aria-hidden
                    className="ml-auto size-5 shrink-0 text-navy hz:hidden"
                    strokeWidth={2}
                  />
                </Card>
              </Link>
            ))}
          </nav>

          <KontaktForm />
        </div>

        {/* Franchiseopplysningen er fotnote, ikke snarvei. Den lå sist i
            asiden og ville havnet foran skjemaet da snarveiene flyttet opp. */}
        <p className="mt-5 max-w-[62ch] rounded-card bg-navy px-5 py-4 text-[13.5px] leading-[1.55] text-on-navy hz:mt-6">
          Handz On er en franchisekjede med 14 lokale avdelinger. Hver avdeling drives av
          egen juridisk enhet med eget organisasjonsnummer.
        </p>
      </Section>
    </>
  );
}
