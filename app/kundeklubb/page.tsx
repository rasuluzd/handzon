import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHead, Section } from "@/components/site/Section";
import { StampCard } from "@/components/site/StampCard";

export const metadata: Metadata = {
  title: "Kundeklubb",
  description:
    "Bli medlem gratis: hver 6. utvendige Basic-vask er gratis etter 5 betalte, og du får gratis påfyll av spylervæske ved hvert kjøp av en bilpleietjeneste.",
};

const steps = [
  {
    title: "Bli medlem — gratis",
    text: "Registrer deg med Vipps på Min side. Ingen kostnad, ingen binding.",
  },
  {
    title: "Book en tjeneste",
    text: "Velg avdeling og tjeneste som vanlig. Medlemskapet er koblet til deg.",
  },
  {
    title: "Vi stempler automatisk",
    text: "Hvert besøk teller. Etter 5 betalte er din neste Basic-vask gratis.",
  },
];

const perks = [
  {
    title: "Hver 6. vask gratis",
    text: "Etter 5 betalte utvendige Basic-vasker (eller behandlinger) er den 6. helt gratis. Stemplene følger deg på tvers av alle 14 avdelinger.",
  },
  {
    title: "Gratis spylervæske",
    text: "Ved hvert besøk der du kjøper en bilpleietjeneste, fyller vi spylervæske gratis. En liten ting som gjør hverdagen enklere.",
  },
];

export default function KundeklubbPage() {
  return (
    <>
      <PageHead
        eyebrow="Kundeklubb"
        title="Bli medlem — helt gratis"
        lead={
          <>
            Fast kunde? Da lønner det seg. Som medlem samler du opp gratis vasker og får
            gratis spylervæske ved hvert kjøp.
            {/* Forbeholdet står igjen på desktop; på mobil er det to ekstra
                linjer foran verveknappen, og h1 sier allerede «helt gratis». */}
            <span className="max-hz:hidden"> Uten kostnad og uten binding.</span>
          </>
        }
      >
        {/* Sidens eneste formål er å verve medlemmer, men første knapp lå
            ~1 550px nede — to skjermhøyder forbi hele salgsargumentet.
            Verveknappen hører hjemme i første skjerm. */}
        <ButtonLink href="/min-side" size="lg" className="mt-5 max-hz:w-full hz:mt-6">
          Bli medlem — gratis
        </ButtonLink>
      </PageHead>

      <Section className="!pt-5 hz:!pt-8">
        {/* gap-10 er desktop-luft mellom to kolonner. På mobil er det én
            kolonne, og 40px + StampCards egen toppmarg ble ~48px tomrom midt
            i et navy-panel som allerede har padding. */}
        <div className="on-dark grid items-center gap-5 rounded-card-lg bg-navy p-[clamp(20px,3vw,44px)] hz:grid-cols-[1fr_auto] hz:gap-10">
          <div>
            <p className="mb-2.5 font-heading text-[12px] font-semibold uppercase tracking-[.2em] text-on-navy-eyebrow hz:mb-3">
              Stempelkort
            </p>
            <h2 className="mb-2.5 font-heading text-[clamp(24px,3.2vw,38px)] font-bold leading-[1.08] tracking-[-.024em] text-white hz:mb-3 hz:leading-[1.06]">
              5 betalte → den 6. er gratis
            </h2>
            <p className="max-w-[52ch] text-[16.5px] leading-[1.5] text-on-navy hz:leading-[1.55]">
              Vi stempler automatisk ved hvert besøk. Når fem felt er fylt, er din neste
              utvendige Basic-vask gratis.
            </p>
          </div>
          <StampCard />
        </div>

        <div className="mt-6 grid gap-4 hz:mt-10 hz:grid-cols-2">
          {perks.map((perk) => (
            <Card key={perk.title} elevated>
              <h3 className="mb-1.5 font-heading text-[17px] font-semibold text-ink hz:mb-2 hz:text-[19px]">
                {perk.title}
              </h3>
              <p className="text-[15px] leading-[1.5] text-body-soft hz:text-[16px] hz:leading-[1.55]">
                {perk.text}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section alt>
        <h2 className="mb-4 font-heading text-[clamp(24px,3.2vw,38px)] font-bold leading-[1.08] tracking-[-.024em] text-ink hz:mb-6 hz:leading-[1.06]">
          Slik blir du medlem
        </h2>
        <ol className="grid gap-x-10 hz:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-3.5 border-t border-line py-4 hz:gap-[18px] hz:py-[22px]"
            >
              <span className="min-w-[20px] font-heading text-[20px] font-bold tabular text-navy hz:min-w-[22px] hz:text-[22px]">
                {index + 1}
              </span>
              <div>
                <h3 className="font-heading text-[17px] font-semibold text-ink hz:text-[19px]">
                  {step.title}
                </h3>
                <p className="mt-1 text-[15px] leading-[1.5] text-body-soft hz:mt-1.5 hz:text-[16px] hz:leading-[1.55]">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tight>
        {/* To knapper med ulik autobredde brakk til to ragget venstrestilte
            rader på 390px. Stablet i full bredde leser de som ett valgpar. */}
        <div className="flex flex-col gap-3 hz:flex-row hz:flex-wrap">
          <ButtonLink href="/min-side" size="lg" className="max-hz:w-full">
            Bli medlem — gratis
          </ButtonLink>
          <ButtonLink
            href="/booking"
            variant="secondary"
            size="lg"
            className="max-hz:w-full"
          >
            Bestill en tjeneste
          </ButtonLink>
        </div>
        <p className="mt-4 text-[13.5px] leading-[1.5] text-body-soft">
          Gjelder kun medlemmer. Gratisvasken tilsvarer «Vask utvendig – Basic».
        </p>
      </Section>
    </>
  );
}
