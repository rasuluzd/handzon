import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { aboutHeroImage } from "@/lib/service-images";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Norges største bilpleiekjede. 14 avdelinger drevet av lokale fagfolk, med godkjente prosesser og folk som bryr seg om detaljene.",
};

const principles = [
  {
    title: "Vasket for hånd",
    text: "Ingen harde børster. Vi skummer, vasker og tørker for hånd — skånsomt mot lakken.",
  },
  {
    title: "Godkjent og seriøs",
    text: "Alle avdelinger er registrert i Arbeidstilsynets godkjenningsordning for bilpleie. Ryddige forhold, ordnede lønninger.",
  },
  {
    title: "Tid tilbake til deg",
    text: "Du trenger ikke vente. Lever bilen, gjør ærendene dine, og hent den ren.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="relative h-[240px]">
        <Image
          src={aboutHeroImage}
          alt="Detaljering i arbeid hos Handz On Auto Care"
          fill
          priority
          sizes="(min-width: 900px) 1180px, 100vw"
          className="object-cover"
        />
      </div>

      <section className="bg-navy px-6 py-[30px] text-white">
        <p className="mb-3.5 font-heading text-[14px] font-semibold uppercase tracking-[0.1em] text-on-navy-eyebrow">
          Om oss
        </p>
        <h1 className="mb-3.5 font-heading text-[34px] font-bold leading-[1.1] text-white">
          Kvalitet du kan stole på
        </h1>
        <p className="text-[17px] leading-[1.5] text-on-navy">
          Norges største bilpleiekjede. 14 avdelinger drevet av lokale fagfolk,
          med godkjente prosesser og folk som bryr seg om detaljene.
        </p>
      </section>

      <section data-reveal className="px-6 pb-2 pt-8">
        <div className="flex gap-3.5">
          <div className="flex-1 rounded-[11px] bg-surface-alt px-[18px] py-[22px]">
            <div className="font-heading text-[34px] font-bold text-navy">14</div>
            <div className="mt-[5px] text-[14.5px] text-body-soft">
              avdelinger i Norge
            </div>
          </div>
          <div className="flex-1 rounded-[11px] bg-surface-alt px-[18px] py-[22px]">
            <div className="font-heading text-[34px] font-bold text-navy">
              120k+
            </div>
            <div className="mt-[5px] text-[14.5px] text-body-soft">
              biler behandlet
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="px-6 pb-2 pt-[26px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-10">
          {principles.map((principle, index) => (
            <div
              key={principle.title}
              className={`border-t border-line py-[22px] ${index === principles.length - 1 ? "border-b" : ""}`}
            >
              <h3 className="mb-[7px] font-heading text-[21px] font-semibold text-ink">
                {principle.title}
              </h3>
              <p className="text-[16.5px] leading-[1.55] text-body-soft">
                {principle.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="px-6 pb-3 pt-8">
        <ButtonLink href="/booking" fullWidth>
          Bestill time
        </ButtonLink>
      </section>
    </div>
  );
}
