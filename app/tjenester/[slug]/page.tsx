import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Breadcrumbs } from "@/components/site/Section";
import { ServiceRowLink } from "@/components/site/ServiceRow";
import { StickyBar } from "@/components/site/StickyBar";
import { formatDuration, formatKr } from "@/lib/format";
import { getAffinityAddOns, getServiceBySlug, services } from "@/lib/mock-data";
import { getServiceImage } from "@/lib/service-images";
import { serviceIncludes } from "@/lib/service-includes";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tjenester/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: `${service.name} – fra ${formatKr(service.priceOre)} inkl. mva, varighet ca. ${formatDuration(
      service.durationMin,
    )}. ${service.description}`,
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/tjenester/[slug]">) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const image = getServiceImage(slug);
  const extras = getAffinityAddOns(service.id);
  const related = services
    .filter((item) => item.category === service.category && item.id !== service.id)
    .slice(0, 3);
  const includes = serviceIncludes[service.category];

  return (
    <>
      {/* 26vw treffer aldri på mobil (101px på 390px), så clamp-en landet på
          gulvet 200px: en ren dekorbanner spiste 27 % av første skjerm før
          pris og CTA i det hele tatt kom til syne. 160px på mobil holder
          bildet som stemningssetter uten å utsette salgsargumentene.

          `preload` i stedet for `priority`: sistnevnte er avviklet i Next 16.
          Bildet er LCP-elementet her, så det skal fortsatt lastes i <head>. */}
      <div className="relative h-[160px] overflow-hidden bg-surface-sunken hz:h-[clamp(200px,26vw,320px)]">
        <Image
          src={image.hero}
          alt={service.name}
          fill
          preload
          sizes="(min-width: 900px) 1180px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mx-auto max-w-[820px] px-[clamp(16px,4vw,64px)] pb-[88px] pt-3 hz:pb-[100px] hz:pt-[26px]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Forside" },
            { href: "/tjenester", label: "Tjenester" },
          ]}
          current={service.name}
          className="mb-4 max-hz:hidden"
        />
        {/* Eneste tilbakeveien på mobil (Breadcrumbs er skjult), så den må ha
            et ekte trykkmål. Paddingen erstatter marginen den hadde før. */}
        <Link
          href="/tjenester"
          className="-ml-2 mb-0.5 inline-flex min-h-[44px] items-center px-2 text-[14px] text-body-soft hover:text-navy hz:hidden"
        >
          ← Tilbake
        </Link>

        <div className="mb-3 flex flex-wrap gap-2 hz:mb-3.5">
          <Tag>{service.category}</Tag>
          {service.popular && <Tag variant="red">Mest booket</Tag>}
          {service.guarantee && <Tag>{service.guarantee}</Tag>}
        </div>

        <h1 className="font-heading text-[clamp(27px,4vw,42px)] font-bold leading-[1.06] tracking-[-.03em] text-ink">
          {service.name}
        </h1>
        <p className="mt-3 max-w-[58ch] text-[16.5px] leading-[1.55] text-body hz:mt-3.5 hz:text-[19px]">
          {service.description}
        </p>

        {/* Faktaboksen lå i tre stablede rader på mobil (ca. 216px) fordi
            cellene hadde full bredde. Nå: «Pris fra» over hele bredden som
            eget salgsargument, varighet og garanti side om side under.
            Kantlinjene settes per celle siden mønsteret skifter ved 900px. */}
        <dl className="mt-5 grid grid-cols-2 rounded-card border border-line-strong hz:mt-[26px] hz:grid-cols-3">
          {[
            {
              label: "Pris fra",
              value: formatKr(service.priceOre),
              accent: true,
              cell: "col-span-2 border-b border-line hz:col-span-1 hz:border-b-0 hz:border-r",
            },
            {
              label: "Varighet",
              value: `ca. ${formatDuration(service.durationMin)}`,
              accent: false,
              cell: "border-r border-line",
            },
            {
              label: service.guarantee ? "Garanti" : "Nivå",
              value: service.guarantee ?? service.level ?? "Standard",
              accent: false,
              cell: "",
            },
          ].map((fact) => (
            <div key={fact.label} className={`px-4 py-3 hz:py-3.5 ${fact.cell}`}>
              <dt className="font-heading text-[11px] font-semibold uppercase tracking-[.16em] text-body-soft">
                {fact.label}
              </dt>
              <dd
                className={`mt-1 font-heading text-[18px] font-bold tabular hz:mt-1.5 hz:text-[19px] ${fact.accent ? "text-navy" : "text-ink"}`}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <h2 className="mb-2.5 mt-7 font-heading text-[20px] font-bold tracking-[-.02em] text-ink hz:mb-3.5 hz:mt-[34px] hz:text-[24px]">
          Dette inngår
        </h2>
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-x-7 gap-y-2 hz:gap-y-2.5">
          {includes.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 border-t border-line pt-2 text-[15.5px] leading-[1.5] text-body hz:pt-[11px] hz:text-[16px]"
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

        <h2 className="mb-2.5 mt-7 font-heading text-[20px] font-bold tracking-[-.02em] text-ink hz:mb-3.5 hz:mt-[34px] hz:text-[24px]">
          Ofte valgt sammen
        </h2>
        {/* Mersalget lå som tre fulle kort (ca. 426px på mobil) midt mellom
            «Dette inngår» og de relaterte tjenestene. Under 900px vises det som
            kompakte prisrader: navn og pris er det som selger, beskrivelsen er
            fyll når kortet uansett ikke kan hukes av her. */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 max-hz:flex max-hz:flex-col max-hz:gap-2">
          {extras.map((addOn) => (
            <Card
              key={addOn.id}
              className="max-hz:flex max-hz:items-center max-hz:justify-between max-hz:gap-3 max-hz:p-3"
            >
              <div className="min-w-0">
                <p className="font-heading text-[15.5px] font-semibold text-ink hz:text-[16px]">
                  {addOn.name}
                </p>
                <p className="mb-3 mt-1.5 text-[14px] leading-[1.45] text-body-soft max-hz:hidden">
                  {addOn.description}
                </p>
              </div>
              <span className="shrink-0 font-heading text-[16px] font-bold tabular text-navy">
                + {formatKr(addOn.priceOre)}
              </span>
            </Card>
          ))}
        </div>
        <p className="mt-2.5 text-[13px] leading-[1.5] text-body-soft hz:mt-3.5 hz:text-[13.5px]">
          Tillegg velges i bookingen, etter at du har valgt avdeling og tidspunkt.
        </p>

        {related.length > 0 && (
          <>
            <h2 className="mb-2.5 mt-7 font-heading text-[20px] font-bold tracking-[-.02em] text-ink hz:mb-3.5 hz:mt-[34px] hz:text-[24px]">
              Andre {service.category.toLowerCase()}-tjenester
            </h2>
            <div className="flex flex-col gap-2 hz:gap-2.5">
              {related.map((item) => (
                <ServiceRowLink
                  key={item.id}
                  service={item}
                  href={`/tjenester/${item.slug}`}
                  meta={`Varighet ca. ${formatDuration(item.durationMin)}`}
                />
              ))}
            </div>
          </>
        )}

        <p className="mt-6 text-[13px] leading-[1.6] text-body-soft hz:mt-7 hz:text-[13.5px]">
          Prisen er kjedens standardpris inkl. mva. Enkelte avdelinger har egne
          lokalpriser. Den endelige prisen vises i bookingen når du har valgt avdeling.
        </p>
      </div>

      {/* Baren var ca. 140px høy på mobil fordi knappen brakk til egen rad —
          19 % av skjermen, permanent. Under 900px er den én rad: pris til
          venstre, knappen fyller resten. «Valgt tjeneste» er skjult der, siden
          H1-en rett over allerede sier hvilken tjeneste det gjelder. */}
      <StickyBar maxWidth={820}>
        <div className="min-w-0 max-hz:hidden">
          <p className="text-[12.5px] text-body-soft">Valgt tjeneste</p>
          <p className="mt-0.5 truncate font-heading text-[15.5px] font-semibold text-ink">
            {service.name}
          </p>
        </div>
        <span className="shrink-0 hz:ml-auto hz:text-right">
          <span className="block font-heading text-[19px] font-bold leading-none tabular text-ink hz:text-[23px]">
            fra {formatKr(service.priceOre)}
          </span>
          <span className="mt-1 block text-[11.5px] text-body-soft hz:text-[12.5px]">
            inkl. mva
          </span>
        </span>
        <ButtonLink
          href={`/booking?tjeneste=${service.slug}`}
          size="md"
          className="max-hz:flex-1 hz:min-h-[54px] hz:px-[30px] hz:text-[14px]"
        >
          Bestill denne
        </ButtonLink>
      </StickyBar>
    </>
  );
}
