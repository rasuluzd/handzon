import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { GoogleBranchMap } from "@/components/site/GoogleBranchMap";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { formatDuration, formatOre } from "@/lib/format";
import { locations, services } from "@/lib/mock-data";
import heroImage from "@/public/hero-hjulskift.webp";

export const metadata: Metadata = {
  description:
    "Lever nøkkelen, gjør ærendene dine, hent en skinnende ren bil. Book bilpleie på senteret hos 14 avdelinger over hele Norge — grundig, gjort for hånd.",
};

const steps = [
  {
    title: "Lever nøkkelen",
    text: "Kom innom avdelingen på senteret. Vi tar imot bilen — ingen kø, ingen stress.",
  },
  {
    title: "Gjør ærendene dine",
    text: "Handle, spis lunsj, ta en kaffe. Vi sender deg en melding når bilen er klar.",
  },
  {
    title: "Hent en ren bil",
    text: "Bilen står klar, vasket for hånd og tørket. Du betaler når du henter.",
  },
];

export default function HomePage() {
  const popularServices = services.filter((service) => service.popular).slice(0, 4);
  const topBranches = locations.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section>
        <div className="flex flex-col hz:grid hz:grid-cols-[1.05fr_0.95fr] hz:items-stretch">
          {/* Bilde */}
          <div className="relative order-1 h-[300px] hz:order-2 hz:h-auto hz:min-h-[clamp(440px,40vw,580px)]">
            <Image
              src={heroImage}
              alt="Hjul- og dekkskift hos Handz On Auto Care"
              fill
              priority
              sizes="(min-width: 900px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          {/* Marineblått panel */}
          <div className="order-2 flex flex-col justify-center bg-navy px-6 py-[30px] text-white hz:order-1 hz:px-[clamp(36px,4vw,60px)] hz:py-[clamp(48px,4vw,76px)]">
            <h1 className="font-heading text-[38px] font-bold leading-[1.08] hz:text-[clamp(42px,3.6vw,58px)] hz:leading-[1.04]">
              Lever nøkkelen.
              <br />
              Hent bilen ren.
            </h1>
            <p className="mt-4 max-w-[440px] text-[18px] leading-[1.55] text-on-navy hz:text-[19px]">
              Vi tar bilen mens du gjør ærendene dine på senteret. Grundig
              bilpleie, gjort for hånd — klar når du er ferdig.
            </p>
            <div className="mt-7 flex flex-col gap-3 hz:flex-row">
              <ButtonLink href="/booking" variant="onNavy" className="w-full hz:w-auto">
                Bestill time
              </ButtonLink>
              <ButtonLink
                href="/avdelinger"
                variant="heroOutline"
                className="w-full hz:w-auto"
              >
                Finn din avdeling
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Statstripe */}
        <div className="flex border-b border-line">
          {[
            ["14", "avdelinger"],
            ["120 000+", "biler behandlet"],
            ["4,8", "av 5 i score"],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={`flex-1 px-1.5 py-[18px] text-center ${index < 2 ? "border-r border-line" : ""}`}
            >
              <div className="font-heading text-[22px] font-bold text-navy">
                {value}
              </div>
              <div className="mt-0.5 text-[12.5px] text-muted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px]">
      {/* SLIK GJØR DU */}
      <section data-reveal className="px-6 pb-2 pt-11">
        <p className="mb-[22px] font-heading text-[14px] font-semibold uppercase tracking-[0.1em] text-navy">
          Slik gjør du
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-10">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex gap-[18px] border-t border-line py-[22px] ${index === steps.length - 1 ? "border-b" : ""}`}
            >
              <span className="min-w-8 font-heading text-[22px] font-bold text-navy">
                {index + 1}
              </span>
              <div>
                <h3 className="mb-1.5 font-heading text-[21px] font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="text-[16.5px] leading-[1.55] text-body-soft">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULÆRE TJENESTER */}
      <section data-reveal className="px-6 pb-2 pt-[42px]">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-heading text-[28px] font-bold text-ink">
            Populære tjenester
          </h2>
          <Link
            href="/tjenester"
            className="text-[16px] font-semibold text-navy hover:text-navy-hover"
          >
            Se alle →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3.5">
          {popularServices.map((service) => (
            <Link
              key={service.id}
              href={`/tjenester/${service.slug}`}
              className="flex items-center gap-4 rounded-[10px] border border-line-strong bg-surface p-4 transition-colors hover:border-navy"
            >
              <ImagePlaceholder className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[8px]" />
              <div className="min-w-0 flex-1">
                <div className="font-heading text-[18px] font-semibold text-ink">
                  {service.name}
                </div>
                <div className="mt-[3px] text-[14px] text-muted">
                  {service.category} · {formatDuration(service.durationMin)}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-heading text-[16px] font-bold text-navy">
                  fra {formatOre(service.priceOre)}
                </div>
                <div className="mt-0.5 text-[12px] text-muted-light">
                  Bestill →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FINN AVDELING */}
      <section data-reveal className="px-6 pb-2 pt-11">
        <h2 className="mb-2 font-heading text-[28px] font-bold text-ink">
          Finn din avdeling
        </h2>
        <p className="mb-5 text-[16.5px] text-body-soft">
          14 avdelinger fra Kristiansand i sør til Ålesund i nord.
        </p>
        <div className="mb-4 h-[clamp(220px,26vw,380px)] overflow-hidden rounded-[12px] border border-line-strong bg-[#eef1f5]">
          <GoogleBranchMap />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
          {topBranches.map((branch) => (
            <Link
              key={branch.id}
              href={`/booking?avdeling=${branch.slug}`}
              className="flex items-center justify-between gap-3 rounded-[10px] border border-line-strong bg-surface px-[18px] py-[17px] transition-colors hover:border-navy"
            >
              <div>
                <div className="font-heading text-[17px] font-semibold text-ink">
                  Handz On {branch.name}
                </div>
                <div className="mt-0.5 text-[14px] text-muted">
                  {branch.city} · {branch.region}
                </div>
              </div>
              <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold text-navy">
                Book →
              </span>
            </Link>
          ))}
        </div>
        <ButtonLink
          href="/avdelinger"
          variant="secondary"
          fullWidth
          className="mt-4"
        >
          Se alle 14 avdelinger
        </ButtonLink>
      </section>

      {/* TRYGGHET */}
      <section data-reveal className="px-6 pb-2 pt-10">
        <div className="flex items-start gap-3 rounded-[10px] border border-line-strong bg-surface-alt px-[18px] py-4">
          <span className="text-[18px] leading-[1.4] text-navy">✓</span>
          <p className="text-[15px] leading-[1.5] text-body">
            Alle avdelinger er registrert i Arbeidstilsynets godkjenningsordning
            for bilpleie.
          </p>
        </div>
      </section>

      {/* KUNDEKLUBB CTA */}
      <section data-reveal className="px-6 pb-4 pt-10">
        <div className="rounded-[12px] bg-navy px-[26px] py-8">
          <p className="mb-3.5 font-heading text-[14px] font-semibold uppercase tracking-[0.1em] text-on-navy-eyebrow">
            Kundeklubb
          </p>
          <h2 className="mb-3 font-heading text-[27px] font-bold leading-[1.15] text-white">
            10 % på hovedvasken — hver gang
          </h2>
          <p className="mb-6 text-[16.5px] leading-[1.55] text-on-navy">
            Bli medlem gratis. Logg inn med Vipps i bestillingen, så trekkes
            medlemsprisen automatisk.
          </p>
          <ButtonLink href="/booking" variant="onNavy" fullWidth>
            Bli medlem — gratis
          </ButtonLink>
        </div>
      </section>
      </div>
    </div>
  );
}
