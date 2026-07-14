import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { formatDuration, formatOre } from "@/lib/format";
import { locations, services } from "@/lib/mock-data";

export const metadata: Metadata = {
  description:
    "Bestill profesjonell bilpleie på under ett minutt. Utvendig og innvendig bilpleie, polering og keramisk coating – 15 avdelinger over hele Norge.",
};

const steps = [
  {
    title: "Velg avdeling og tjeneste",
    text: "Finn din nærmeste avdeling og velg blant våre profesjonelle bilpleietjenester.",
  },
  {
    title: "Tast inn regnummeret",
    text: "Vi henter bilens merke og modell automatisk, så prisen alltid stemmer.",
  },
  {
    title: "Velg tidspunkt – ferdig",
    text: "Se ledige tider i sanntid og få bekreftelse på SMS med én gang.",
  },
];

const testimonials = [
  {
    name: "Marius, Oslo",
    text: "Bilen så bedre ut enn da den var ny. Bestilling tok meg under ett minutt på mobilen.",
  },
  {
    name: "Ingrid, Bergen",
    text: "Endelig en bilpleiekjede der jeg ser pris og ledige tider før jeg bestiller. Aldri mer telefonkø.",
  },
  {
    name: "Thomas, Trondheim",
    text: "Keramisk coating hos Handz On var verdt hver krone. Proff jobb og påminnelse på SMS.",
  },
];

export default function HomePage() {
  const popularServices = services.filter((service) => service.popular);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(227,176,75,0.14),transparent_60%)]"
        />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <Badge>15 avdelinger over hele Norge</Badge>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Bilpleie på øverste hylle.{" "}
            <span className="text-accent">Bestilt på under ett minutt.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Profesjonell utvendig og innvendig bilpleie, polering og keramisk
            coating — utført av fagfolk, booket av deg. Se pris og ledige tider
            med én gang.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/booking" className="text-lg">
              Bestill bilpleie
            </ButtonLink>
            <ButtonLink href="/avdelinger" variant="secondary">
              Finn din avdeling
            </ButtonLink>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 text-center sm:text-left">
            {[
              ["15", "avdelinger"],
              ["120 000+", "biler behandlet"],
              ["4,8 av 5", "kundescore"],
            ].map(([value, label]) => (
              <div key={label}>
                <dd className="text-xl font-bold text-foreground sm:text-2xl">
                  {value}
                </dd>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Populære tjenester */}
      <section id="tjenester" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">Populære tjenester</h2>
        <p className="mt-2 text-muted">
          Faste priser, ingen overraskelser. Lokale avvik vises per avdeling.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {popularServices.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <Badge>{service.category}</Badge>
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p>
                  <span className="text-xl font-bold">
                    fra {formatOre(service.priceOre)}
                  </span>
                  <span className="ml-2 text-sm text-muted">
                    · {formatDuration(service.durationMin)}
                  </span>
                </p>
                <ButtonLink
                  href={`/booking?tjeneste=${service.slug}`}
                  variant="secondary"
                  className="!min-h-10 !px-4 text-sm"
                >
                  Bestill denne
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Slik fungerer det */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold sm:text-3xl">Slik fungerer det</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-contrast"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Social proof */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Over 120 000 fornøyde bileiere
        </h2>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
          <span aria-hidden>✓</span> Alle avdelinger er registrert i
          Arbeidstilsynets godkjenningsordning for bilpleie
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <p aria-hidden className="text-accent">
                ★★★★★
              </p>
              <blockquote className="mt-3 text-sm leading-relaxed">
                «{testimonial.text}»
              </blockquote>
              <p className="mt-3 text-sm font-semibold text-muted">
                {testimonial.name}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Avdelinger-teaser */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <Card className="flex flex-col items-start gap-5 bg-gradient-to-br from-surface-raised to-surface p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Fra Kristiansand i sør til Tromsø i nord
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              {locations.length} avdelinger drevet av lokale fagfolk. Finn din og
              se lokale priser, åpningstider og kampanjer.
            </p>
          </div>
          <ButtonLink href="/avdelinger" variant="secondary">
            Se alle avdelinger
          </ButtonLink>
        </Card>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Klar for en renere bil?</h2>
        <p className="mt-2 text-muted">
          Bestill nå — du velger tidspunktet, vi gjør resten.
        </p>
        <div className="mt-6">
          <ButtonLink href="/booking" className="text-lg">
            Bestill bilpleie
          </ButtonLink>
        </div>
        <p className="mt-4 text-sm text-muted">
          Har du bestilt før?{" "}
          <Link href="/min-side" className="text-accent hover:underline">
            Logg inn på Min side
          </Link>
        </p>
      </section>
    </div>
  );
}
