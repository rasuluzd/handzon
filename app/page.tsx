import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { BranchCard } from "@/components/site/BranchCard";
import { GoogleBranchMap } from "@/components/site/GoogleBranchMap";
import { Hero } from "@/components/site/Hero";
import { Reveal } from "@/components/site/Reveal";
import { Eyebrow, Section, SectionHead } from "@/components/site/Section";
import { ServiceTile } from "@/components/site/ServiceTile";
import { SocialProof } from "@/components/site/SocialProof";
import { StampCard } from "@/components/site/StampCard";
import { StatStrip } from "@/components/site/StatStrip";
import { TrustBand } from "@/components/site/TrustBand";
import { locations, services } from "@/lib/mock-data";
import { aboutHeroImage } from "@/lib/service-images";

export const metadata: Metadata = {
  description:
    "Lever nøkkelen, gjør ærendene dine, hent en skinnende ren bil. Bilpleie på senteret hos 14 avdelinger i Norge, alt gjort for hånd.",
};

const how = [
  [
    "Lever nøkkelen",
    "Kom innom avdelingen på senteret og gi fra deg nøkkelen i skranken. Det er hele seremonien.",
  ],
  [
    "Gjør ærendene dine",
    "Handle, spis lunsj, ta en kaffe. Du får melding på SMS når bilen er klar.",
  ],
  [
    "Hent en ren bil",
    "Bilen står klar, vasket for hånd og tørket. Du betaler når du henter.",
  ],
] as const;

const seasonPoints = [
  "Håndvask med to bøtter, så lakken slipper mikroriper.",
  "Insektrester og kvae løses opp før de eter seg inn i klarlakken.",
  "Ferdig mens du handler. Vi sender SMS når bilen er klar.",
];

const clubPoints = [
  "Hver sjette utvendige Basic-vask er gratis, etter fem betalte vasker eller behandlinger.",
  "Gratis påfyll av spylervæske hver gang du kjøper en bilpleietjeneste.",
];

const featuredSlugs = [
  "vask-ut-innvendig-premium",
  "polering-basic",
  "keramisk-lakkforsegling",
];

export default function HomePage() {
  const featured = featuredSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const topBranches = locations.slice(0, 4);

  return (
    <>
      <Hero />

      <StatStrip
        items={[
          ["14", "avdelinger"],
          ["120 000+", "biler behandlet"],
          ["4,8", "av 5 i score"],
          ["20 år", "siden 2005"],
        ]}
      />

      {/* SLIK GJØR DU — én av kun to reveal-blokker på hele nettstedet */}
      <Reveal>
      <Section>
        <Eyebrow className="mb-3 hz:mb-[18px]">Slik gjør du</Eyebrow>
        <div className="grid gap-x-10 hz:grid-cols-3">
          {how.map(([title, text], index) => (
            <div
              key={title}
              className="flex gap-3.5 border-t border-line py-3.5 hz:gap-[18px] hz:py-[22px]"
            >
              <span className="min-w-[20px] font-heading text-[19px] font-bold tabular text-navy hz:min-w-[22px] hz:text-[22px]">
                {index + 1}
              </span>
              <div>
                <h3 className="font-heading text-[18px] font-semibold leading-[1.2] text-ink hz:text-[21px] hz:leading-[1.25]">
                  {title}
                </h3>
                <p className="mt-1 text-[15px] leading-[1.45] text-body-soft hz:mt-1.5 hz:text-[16px] hz:leading-[1.55]">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      </Reveal>

      {/* POPULÆRE TJENESTER */}
      <Reveal delay={70}>
      <Section tight>
        <SectionHead
          title="Populære tjenester"
          moreHref="/tjenester"
          moreLabel="Se hele katalogen →"
        />
        <div className="grid gap-4 hz:grid-cols-3">
          {featured.map((service, index) => (
            <ServiceTile
              key={service.id}
              service={service}
              tall
              flag={index === 0 ? "Mest booket" : undefined}
            />
          ))}
        </div>
      </Section>
      </Reveal>

      {/* SESONGKAMPANJE */}
      <Section tight>
        <div className="grid overflow-hidden rounded-card-lg border border-line-strong hz:grid-cols-[0.95fr_1fr]">
          {/* Bildet står etter teksten på mobil: 150px pynt foran overskriften
              dyttet «Book sommervask» rett ned uten å si noe om tilbudet. */}
          <div className="relative h-[150px] max-hz:order-2 hz:h-auto hz:min-h-[300px]">
            <Image
              src={aboutHeroImage}
              alt="Polering av panser hos Handz On"
              fill
              sizes="(min-width: 900px) 480px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-4 hz:p-[clamp(26px,3vw,42px)]">
            <Eyebrow>Sesongtilbud · Sommer</Eyebrow>
            <h2 className="my-2.5 font-heading text-[clamp(21px,2.6vw,30px)] font-bold leading-[1.15] tracking-[-.024em] text-ink hz:my-4 hz:leading-[1.1]">
              Pollen, insekter og kvae: vekk før høsten
            </h2>
            {/* Luftigere rytme på mobil: hårlinja delte punktene, men 8px
                over og 8px under gjorde at teksten klistret seg til streken. */}
            <ul className="mb-5 flex flex-col gap-3 hz:mb-6 hz:gap-2.5">
              {seasonPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 border-t border-line pt-3 text-[15px] leading-[1.55] text-body hz:gap-2.5 hz:pt-[11px] hz:text-[16px] hz:leading-[1.5]"
                >
                  <Check
                    aria-hidden
                    className="mt-0.5 size-[18px] shrink-0 text-status-open"
                    strokeWidth={1.75}
                  />
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2 hz:gap-3">
              <ButtonLink
                href="/booking?tjeneste=vask-utvendig-premium"
                className="max-hz:flex-1"
              >
                Book sommervask
              </ButtonLink>
              <ButtonLink href="/tjenester?kategori=Polering" variant="ghost">
                Se poleringspakker →
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* FINN DIN AVDELING */}
      <Section tight>
        <SectionHead
          title="Finn din avdeling"
          moreHref="/avdelinger"
          moreLabel="Se alle 14 →"
        />
        {/* Kartet er desktop-only. På mobil lå et 220px Google Maps-iframe
            øverst i rullebanen — et helt eget dokument med egne tiles, uten
            pins og uten interaksjonsverdi i den høyden. Den rangerte listen
            og «Nær meg» på /avdelinger gjør jobben bedre og gratis. */}
        <div className="hz-map mb-4 h-[clamp(220px,26vw,320px)] overflow-hidden rounded-card-lg border border-line-strong bg-map-bg max-hz:hidden">
          <GoogleBranchMap />
        </div>
        {/* To avdelinger på mobil, fire på desktop. Fire kort à ~190px er 800px
            Oslo-avdelinger for en leser i Bergen — «Se alle 14 →» i
            seksjonshodet er den raskere veien for alle andre. */}
        <div className="grid gap-3 hz:grid-cols-2 hz:gap-4">
          {topBranches.map((branch, index) => (
            <BranchCard
              key={branch.id}
              location={branch}
              showHours={false}
              className={index >= 2 ? "max-hz:hidden" : undefined}
            />
          ))}
        </div>
      </Section>

      <SocialProof />
      <TrustBand />

      {/* KUNDEKLUBB */}
      <Section tight>
        <div className="on-dark grid items-center gap-5 rounded-card-lg bg-navy p-4 hz:gap-10 hz:grid-cols-[1fr_auto] hz:p-[clamp(26px,3vw,44px)]">
          <div>
            <p className="font-heading text-[11.5px] font-semibold uppercase tracking-[.18em] text-on-navy-eyebrow hz:text-[12px] hz:tracking-[.2em]">
              Kundeklubb
            </p>
            <h2 className="my-2.5 font-heading text-[clamp(23px,3.2vw,38px)] font-bold leading-[1.1] tracking-[-.024em] text-white hz:my-4 hz:leading-[1.06]">
              Få hver 6. vask gratis
            </h2>
            {/* Stempelkortet står nå også på mobil — det er selve argumentet.
                Det ble skjult fordi raden brøt på 390px; nå er stemplene 36px
                og raden får plass (se StampCard). */}
            <StampCard className="mb-4 hz:hidden" />
            <ul className="mb-5 flex flex-col gap-3.5 hz:mb-6 hz:gap-2.5">
              {clubPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[15px] leading-[1.55] text-on-navy hz:gap-2.5 hz:text-[16.5px] hz:leading-[1.5]"
                >
                  <Check
                    aria-hidden
                    className="mt-0.5 size-[18px] shrink-0 text-white hz:mt-1"
                    strokeWidth={1.75}
                  />
                  {point}
                </li>
              ))}
            </ul>
            {/* `onNavy`, ikke `secondary`: dette er varianten som er laget for
                navy flater (hvit knapp, navy tekst, hover mot on-navy-bright). */}
            <ButtonLink href="/kundeklubb" variant="onNavy" block className="hz:w-auto">
              Bli gratis medlem
            </ButtonLink>
          </div>
          <StampCard className="hidden hz:block" />
        </div>
      </Section>
    </>
  );
}
