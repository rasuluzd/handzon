import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, PageHead, Section, SectionHead } from "@/components/site/Section";
import { StatStrip } from "@/components/site/StatStrip";
import { TrustBand } from "@/components/site/TrustBand";
import { aboutHeroImage, sustainabilityImage } from "@/lib/service-images";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Norges største bilpleiekjede. 14 avdelinger drevet av lokale fagfolk, med godkjente prosesser og folk som bryr seg om detaljene.",
};

const values = [
  ["H", "Handlekraft", "Vi tar bilen inn med en gang — ikke om tre uker."],
  [
    "A",
    "Ansvarlig",
    "Godkjent gjennom Arbeidstilsynets ordning. Ryddige lønns- og arbeidsvilkår.",
  ],
  [
    "N",
    "Nyskapende",
    "Renseanlegg som gjenbruker vann, og produkter vi tester før de rører lakken din.",
  ],
  ["D", "Direkte", "Faste priser og ærlig råd. Trenger bilen ikke polering, sier vi det."],
  ["Z", "Zen", "Rolig håndverk. Ingen hastverk, ingen roterende børster."],
  ["O", "Oppmerksom", "Vi ser dørkarmen, terskelen og baksiden av felgen."],
  ["N", "Nøye", "To bøtter, ren klut per panel, kontroll i lys før levering."],
] as const;

const timeline = [
  ["2005", "Ove Hagen åpner den første avdelingen — bilpleie inne på kjøpesenteret."],
  ["2014", "Franchisemodellen settes: hver avdeling er en egen lokal bedrift."],
  ["2021", "Renseanlegget settes i drift og gjenbruker vaskevannet."],
  ["2025", "20 år. 120 000 biler. 14 avdelinger fra Kristiansand til Ålesund."],
] as const;

const sustainability = [
  "Renseanlegg som gjenbruker vaskevannet — vi bruker en brøkdel av en hjemmevask med hageslange.",
  "Miljømerkede produkter, doserte i stedet for øst på.",
  "Egne dekkposer i resirkulert plast, og færre engangsprodukter for hvert år.",
];

export default function AboutPage() {
  return (
    <>
      {/* Toppfotoet er rent dekorativt. På mobil kostet det 200px rulling før
          h1 i det hele tatt startet — kuttet til 140px, full høyde fra 900px. */}
      <div className="relative h-[140px] overflow-hidden bg-surface-sunken hz:h-[clamp(200px,26vw,320px)]">
        <Image
          src={aboutHeroImage}
          alt="Detaljering av lakk hos Handz On"
          fill
          preload
          sizes="(min-width: 900px) 1180px, 100vw"
          className="object-cover"
        />
      </div>

      <PageHead
        eyebrow="Om oss"
        title="Kvalitet du kan stole på"
        lead={
          <>
            Handz On startet med én idé: at bilpleie skal passe inn i dagen din, ikke
            stjele den. I dag er vi Norges største kjede innen bilpleie, med 14 lokale
            avdelinger drevet av folk som bor i nabolaget.
            {/* Visjonssetningen står igjen på desktop og i kildekoden for søk,
                men på mobil er den to ekstra linjer foran første knapp. */}
            <span className="max-hz:hidden">
              {" "}
              Visjonen er å samle alt innen bilpleie under ett tak — på Europas største
              kjøpesentre og lufthavner.
            </span>
          </>
        }
      >
        {/* Første CTA lå tidligere nederst på siden. Om oss er en tillitsside,
            og tilliten må kunne veksles inn med én gang den er bygget. */}
        <ButtonLink href="/booking" size="lg" className="mt-5 max-hz:w-full hz:mt-6">
          Bestill time
        </ButtonLink>
      </PageHead>

      <Section className="!pt-6 !pb-0 hz:!pt-[34px]">
        <StatStrip
          className="-mx-[clamp(16px,4vw,64px)] border-t border-line"
          items={[
            ["14", "avdelinger"],
            ["120 000+", "biler behandlet"],
            ["20 år", "siden 2005"],
            ["4,8", "av 5 i score"],
          ]}
        />
      </Section>

      <Section tight>
        <SectionHead
          eyebrow="Verdier"
          title="HANDZON"
          lead="Sju bokstaver, sju krav vi stiller til hver eneste bil som kommer inn."
        />
        {/* Sju verdier står side ved side på desktop, men stables på mobil.
            Med desktop-tettheten kostet akronymet ~930px — merkevarepoesi
            målt i rulling. Bokstav og padding er derfor krympet under 900px. */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-x-8">
          {values.map(([letter, title, text]) => (
            <div key={title} className="flex gap-3 border-t border-line py-3.5 hz:gap-4 hz:py-5">
              <span className="w-[20px] shrink-0 font-heading text-[24px] font-bold leading-none text-navy hz:w-[26px] hz:text-[32px]">
                {letter}
              </span>
              <div>
                <p className="mb-0.5 font-heading text-[17px] font-semibold text-ink hz:mb-1">
                  {title}
                </p>
                <p className="text-[15px] leading-[1.5] text-body-soft">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section alt>
        <Eyebrow className="mb-2.5 hz:mb-3">Historie</Eyebrow>
        <h2 className="mb-5 font-heading text-[clamp(24px,3.2vw,38px)] font-bold leading-[1.08] tracking-[-.024em] text-ink hz:mb-[26px] hz:leading-[1.06]">
          Fra én avdeling til fjorten
        </h2>
        {/* Gridet kollapser til én kolonne under 900px. Uten vertikal gap la
            neste posts 2px navy-strek seg rett inntil forrige posts siste
            tekstlinje — fire poster smeltet til én klump. */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-y-5 hz:gap-y-0">
          {timeline.map(([year, text]) => (
            <div key={year} className="border-t-2 border-navy pr-5 pt-3 hz:pt-3.5">
              <span className="font-heading text-[22px] font-bold tabular text-navy">
                {year}
              </span>
              <p className="mt-1.5 text-[15px] leading-[1.5] text-body-soft">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-5 hz:grid-cols-2 hz:gap-6">
          <div>
            <Eyebrow className="mb-2.5 hz:mb-3">Bærekraft</Eyebrow>
            <h2 className="mb-4 font-heading text-[clamp(24px,3.2vw,38px)] font-bold leading-[1.08] tracking-[-.024em] text-ink hz:mb-5 hz:leading-[1.06]">
              Mindre vann, mindre plast
            </h2>
            <ul className="flex flex-col gap-2.5">
              {sustainability.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 border-t border-line pt-[11px] text-[16px] leading-[1.5] text-body"
                >
                  <Check
                    aria-hidden
                    className="mt-0.5 size-[18px] shrink-0 text-status-open"
                    strokeWidth={1.75}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Uten `sizes` antar nettleseren 100vw og henter en 1200px-variant
              til en 350px bred plass. Høyden er dessuten halvert på mobil —
              300px var 36 % av skjermen for et rent illustrasjonsfoto. */}
          <Image
            src={sustainabilityImage}
            alt="Håndtørking av svart lakk"
            width={640}
            height={300}
            sizes="(min-width: 900px) 560px, 400px"
            className="h-[170px] w-full rounded-card-lg object-cover hz:h-[300px]"
          />
        </div>
      </Section>

      <TrustBand />

      <Section tight>
        {/* Avslutningen var to nakne knapper uten anledning. Den som har lest
            hele tillitssiden fortjener en tydelig invitasjon — og på mobil
            stables knappene i full bredde, ellers brekker de til to ragget
            venstrestilte rader med hver sin bredde. */}
        <SectionHead
          title="Kjør innom nærmeste avdeling"
          lead="Fast pris, og bilen er ferdig mens du handler. Velg avdeling, tjeneste og tidspunkt."
        />
        <div className="flex flex-col gap-3 hz:flex-row hz:flex-wrap">
          <ButtonLink href="/booking" size="lg" className="max-hz:w-full">
            Bestill time
          </ButtonLink>
          <ButtonLink
            href="/avdelinger"
            variant="secondary"
            size="lg"
            className="max-hz:w-full"
          >
            Se alle avdelinger
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
