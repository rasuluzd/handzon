import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ButtonExternal, ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { GoogleBranchMap } from "@/components/site/GoogleBranchMap";
import { OpenStatus } from "@/components/site/OpenStatus";
import { OpeningHoursTable } from "@/components/site/OpeningHoursTable";
import { Breadcrumbs, Section, SectionHead } from "@/components/site/Section";
import { ServiceRowLink } from "@/components/site/ServiceRow";
import { SocialProof } from "@/components/site/SocialProof";
import { StickyBar } from "@/components/site/StickyBar";
import { formatDuration, formatKr, formatOrgNr } from "@/lib/format";
import { distanceKm } from "@/lib/geo";
import {
  getEffectivePrice,
  getLocationBySlug,
  getOrganization,
  isServiceAvailable,
  locations,
  services,
} from "@/lib/mock-data";
import { reviews } from "@/lib/reviews";
import { branchHeroImage } from "@/lib/service-images";
import type { Location } from "@/lib/types";

const popularSlugs = ["vask-ut-innvendig-premium", "polering-basic", "rens-innvendig"];

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/avdelinger/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return {};
  return {
    title: `Bilpleie i ${location.city} – avdeling ${location.name}`,
    description: `Bestill bilpleie hos Handz On ${location.name}: ${location.center}, ${location.address}, ${location.postalCode} ${location.city}. Se åpningstider, lokale priser og ledige timer.`,
  };
}

/** Nærmeste avdeling som tilbyr en tjeneste denne avdelingen ikke har. */
function nearestOffering(from: Location, serviceId: string): Location | undefined {
  return locations
    .filter((item) => item.id !== from.id && isServiceAvailable(serviceId, item.id))
    .sort((a, b) => distanceKm(from.geo, a.geo) - distanceKm(from.geo, b.geo))[0];
}

export default async function LocationPage({ params }: PageProps<"/avdelinger/[slug]">) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const organization = getOrganization(location.orgId);
  const mapQuery = `Handz On ${location.name}, ${location.address}, ${location.postalCode} ${location.city}`;
  const popular = popularSlugs
    .map((popularSlug) => services.find((service) => service.slug === popularSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service))
    .filter((service) => isServiceAvailable(service.id, location.id));
  const missing = services.filter((service) => !isServiceAvailable(service.id, location.id));
  const branchReviews = reviews.filter((review) => review.locationSlug === location.slug);

  /* «Fra»-prisen i bunnbaren er den billigste tjenesten som faktisk finnes på
     DENNE avdelingen, med lokalpris der den gjelder — ikke kjedens listepris. */
  const availablePrices = services
    .filter((service) => isServiceAvailable(service.id, location.id))
    .map((service) => getEffectivePrice(service.id, location.id));
  const fromPriceOre = availablePrices.length > 0 ? Math.min(...availablePrices) : undefined;

  return (
    <>
      {/* Toppbildet er rent dekorativt og identisk på alle 14 avdelingssidene.
          På mobil var det 180px av den første skjermen — nå 120px, så H1 og
          «Bestill time her» kommer over folden. `priority` er fjernet: det er
          deprecated i Next 16, og H1-en er uansett den reelle LCP-kandidaten —
          bildet skal ikke forhåndslastes foran Barlow/Source Sans. alt="" fordi
          det ikke sier noe om denne avdelingen. */}
      <div className="relative h-[120px] overflow-hidden bg-surface-sunken hz:h-[clamp(180px,22vw,280px)]">
        <Image
          src={branchHeroImage}
          alt=""
          fill
          sizes="(min-width: 900px) 1180px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="px-[clamp(16px,4vw,64px)] pt-[clamp(20px,4vw,56px)]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Forside" },
            { href: "/avdelinger", label: "Avdelinger" },
          ]}
          current={location.name}
          className="mb-3.5"
        />
        <div className="mb-3.5 flex flex-wrap gap-2">
          <OpenStatus hours={location.openingHours} />
          {location.campaign && <Tag>{location.campaign}</Tag>}
        </div>
        <h1 className="font-heading text-[clamp(28px,4vw,46px)] font-bold leading-[1.06] tracking-[-.03em] text-ink hz:leading-[1.02]">
          Handz On {location.name}
        </h1>
        {/* Adressen var før del av ingressen og gjorde den til fire–fem linjer
            19px-tekst. Den er faktainformasjon, ikke et salgsargument, og får
            derfor sin egen mindre linje. */}
        <p className="mt-2.5 text-[14px] leading-[1.45] text-body-soft hz:mt-3 hz:text-[15px]">
          {location.center} · {location.address}, {location.postalCode} {location.city}
        </p>
        <p className="mt-2 max-w-[56ch] text-[16.5px] leading-[1.5] text-body hz:mt-2.5 hz:text-[19px] hz:leading-[1.55]">
          Lever nøkkelen i skranken, gjør ærendene dine på senteret, og hent en ren bil.
        </p>
        {/* To halvbrede knapper brakk uansett til hver sin rad på 390px, med
            150px dødt område ved siden av. Full bredde under 900px, og
            veibeskrivelsen er et hakk lavere enn bookingknappen. */}
        <div className="mt-5 flex flex-wrap gap-2.5 hz:mt-7 hz:gap-3">
          <ButtonLink
            href={`/booking?avdeling=${location.slug}`}
            size="lg"
            className="max-hz:w-full"
          >
            Bestill time her
          </ButtonLink>
          <ButtonExternal
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
            size="md"
            aria-label="Veibeskrivelse (åpnes i ny fane)"
            className="max-hz:w-full hz:min-h-[54px] hz:px-[30px] hz:text-[14px]"
          >
            Veibeskrivelse ↗
          </ButtonExternal>
        </div>
      </div>

      <Section className="!pt-[22px] hz:!pt-[34px]">
        <div className="grid items-start gap-5 hz:grid-cols-2 hz:gap-6">
          <div>
            <h2 className="mb-2.5 font-heading text-[20px] font-bold tracking-[-.02em] text-ink hz:mb-3.5 hz:text-[24px]">
              Åpningstider
            </h2>
            <OpeningHoursTable hours={location.openingHours} />

            <dl className="mt-4 flex flex-wrap rounded-card border border-line-strong hz:mt-[22px]">
              <div className="min-w-[140px] flex-1 border-r border-line px-4 py-3 max-hz:min-w-full max-hz:border-b max-hz:border-r-0 hz:py-3.5">
                <dt className="font-heading text-[11px] font-semibold uppercase tracking-[.16em] text-body-soft">
                  Telefon
                </dt>
                {/* Telefonlenka hadde bare tekstens linjeboks som trykkflate
                    (~22px høy). Ring-veien er den nest viktigste inngangen for
                    et verksted, så den får sitt eget 44px-mål på touch. */}
                <dd className="font-heading text-[17px] font-bold tabular text-ink">
                  <a
                    href={`tel:${location.phone.replace(/\s/g, "")}`}
                    className="inline-flex min-h-[44px] items-center text-navy hover:text-navy-hover hz:mt-1.5 hz:min-h-0"
                  >
                    {location.phone}
                  </a>
                </dd>
              </div>
              <div className="min-w-[140px] flex-1 px-4 py-3 max-hz:min-w-full hz:py-3.5">
                <dt className="font-heading text-[11px] font-semibold uppercase tracking-[.16em] text-body-soft">
                  Region
                </dt>
                <dd className="mt-1.5 font-heading text-[17px] font-bold text-ink">
                  {location.region}
                </dd>
              </div>
            </dl>

            {organization && (
              <p className="mt-3.5 text-[13px] leading-[1.6] text-body-soft hz:mt-4 hz:text-[13.5px]">
                {organization.legalName} er en egen juridisk enhet og selvstendig
                franchisetaker. Org. {formatOrgNr(organization.orgNr)}. Inntil{" "}
                {location.maxConcurrentCars} biler behandles samtidig her.
              </p>
            )}
          </div>

          {/* Kartet vises også på mobil — men bare her, ikke på /avdelinger.
              Forskjellen er hvor det står: der lå iframen øverst i første
              viewport og gjorde `loading="lazy"` til en no-op, mens den her
              ligger under åpningstidene og faktisk lastes først når man ruller
              ned til den. Én avdeling, ett kartutsnitt, ingen hover å savne.

              På touch er selve iframen `pointer-events-none`. Et Google
              Maps-innbygg spiser dratt-bevegelser og panorerer i stedet for å
              rulle siden, så man blir stående fast midt i dokumentet. I stedet
              ligger hele flaten som én lenke som åpner stedet i kartappen —
              der man uansett skal navigere fra. */}
          <div>
            <h2 className="mb-2.5 font-heading text-[20px] font-bold tracking-[-.02em] text-ink hz:mb-3.5 hz:text-[24px]">
              Slik finner du oss
            </h2>
            <div className="hz-map relative overflow-hidden rounded-card-lg border border-line-strong bg-map-bg max-hz:h-[190px] hz:h-[clamp(260px,32vw,380px)]">
              <GoogleBranchMap
                mode="place"
                query={mapQuery}
                title={`Kart – Handz On ${location.name}`}
                className="max-hz:pointer-events-none"
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Åpne Handz On ${location.name} i Google Maps (åpnes i ny fane)`}
                className="absolute inset-0 flex items-end justify-end p-2.5 hz:hidden"
              >
                <span className="rounded-full border border-line-strong bg-surface/95 px-3 py-1.5 font-heading text-[12px] font-semibold uppercase tracking-[.12em] text-navy shadow-[0_1px_4px_rgba(22,34,58,.16)]">
                  Åpne i kart ↗
                </span>
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section tight>
        <SectionHead
          title="Populært hos oss"
          moreHref="/tjenester"
          moreLabel="Se alle tjenester →"
        />
        <div className="flex flex-col gap-2.5">
          {popular.map((service) => {
            const price = getEffectivePrice(service.id, location.id);
            const local = price !== service.priceOre;
            return (
              <ServiceRowLink
                key={service.id}
                service={service}
                href={`/booking?avdeling=${location.slug}&tjeneste=${service.slug}`}
                meta={`${service.category} · ca. ${formatDuration(service.durationMin)}`}
                priceOre={price}
                wasOre={local ? service.priceOre : undefined}
                tags={local ? <Tag>Lokalpris</Tag> : undefined}
              />
            );
          })}
        </div>

        {missing.length > 0 && (
          <p className="mt-3.5 text-[13px] leading-[1.6] text-body-soft hz:mt-4 hz:text-[13.5px]">
            Ikke tilgjengelig her:{" "}
            {missing.map((service, index) => {
              const nearest = nearestOffering(location, service.id);
              return (
                <span key={service.id}>
                  {index > 0 && ", "}
                  {service.name}
                  {nearest ? ` (nærmest hos Handz On ${nearest.name})` : ""}
                </span>
              );
            })}
            .
          </p>
        )}
      </Section>

      <SocialProof
        heading={
          branchReviews.length > 0 ? `Anmeldelser fra ${location.name}` : "Det kundene sier"
        }
        items={branchReviews.length > 0 ? branchReviews : undefined}
      />

      {/* «Bestill time her» ligger over folden og forsvant etter første scroll.
          Derfra og ned var det ca. 2 000px — åpningstider, fakta, tjenester,
          anmeldelser — uten en eneste bookingknapp. Baren holder avdeling, pris
          og knapp synlig hele veien. Én rad på mobil: prisen til venstre,
          knappen fyller resten. Avdelingsnavnet er skjult der, siden H1-en over
          allerede sier hvilken avdeling det gjelder. */}
      <StickyBar maxWidth={820}>
        <div className="min-w-0 max-hz:hidden">
          <p className="text-[12.5px] text-body-soft">Valgt avdeling</p>
          <p className="mt-0.5 truncate font-heading text-[15.5px] font-semibold text-ink">
            Handz On {location.name}
          </p>
        </div>
        {fromPriceOre !== undefined && (
          <span className="shrink-0 hz:ml-auto hz:text-right">
            <span className="block font-heading text-[19px] font-bold leading-none tabular text-ink hz:text-[23px]">
              fra {formatKr(fromPriceOre)}
            </span>
            <span className="mt-1 block text-[11.5px] text-body-soft hz:text-[12.5px]">
              inkl. mva
            </span>
          </span>
        )}
        <ButtonLink
          href={`/booking?avdeling=${location.slug}`}
          size="md"
          className="max-hz:flex-1 hz:min-h-[54px] hz:px-[30px] hz:text-[14px]"
        >
          Bestill time
        </ButtonLink>
      </StickyBar>
    </>
  );
}
