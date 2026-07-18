import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { formatDuration, formatOre } from "@/lib/format";
import { addOns, addOnAffinity, getServiceBySlug, services } from "@/lib/mock-data";
import { getServiceImage } from "@/lib/service-images";

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
    description: `${service.name} – fra ${formatOre(service.priceOre)}, varighet ca. ${formatDuration(
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
  const priceFrom = `fra ${formatOre(service.priceOre)}`;
  const affinity = (addOnAffinity[service.id] ?? [])
    .slice(0, 3)
    .map((id) => addOns.find((addOn) => addOn.id === id))
    .filter((addOn): addOn is NonNullable<typeof addOn> => Boolean(addOn));

  return (
    <div>
      {/* Bilde med flytende tilbake-knapp */}
      <div className="relative h-[220px]">
        {image ? (
          <Image
            src={image.hero}
            alt={service.name}
            fill
            priority
            sizes="(min-width: 900px) 1180px, 100vw"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder
            label="Bilde av tjenesten"
            className="absolute inset-0 h-full w-full"
          />
        )}
        <Link
          href="/tjenester"
          className="absolute left-4 top-4 rounded-[8px] border border-line-strong bg-surface px-4 py-[11px] text-[15px] font-semibold text-navy hover:bg-surface-alt"
        >
          ← Tjenester
        </Link>
      </div>

      <section className="mx-auto max-w-[760px] px-6 pb-2 pt-[26px]">
        <div className="mb-3.5 flex gap-2">
          <span className="inline-flex rounded-[6px] bg-navy/8 px-3 py-1.5 text-[14px] font-semibold text-navy">
            {service.category}
          </span>
          {service.popular && (
            <span className="inline-flex rounded-[6px] border border-line-strong bg-surface-alt px-3 py-1.5 text-[14px] font-semibold text-body-soft">
              Populær
            </span>
          )}
        </div>
        <h1 className="mb-3 font-heading text-[33px] font-bold leading-[1.1] text-ink">
          {service.name}
        </h1>
        <p className="mb-6 text-[17px] leading-[1.55] text-body-soft">
          {service.description}
        </p>

        <div className="flex gap-8 border-y border-line py-[22px]">
          <div>
            <div className="mb-1 text-[13px] text-muted-light">Pris fra</div>
            <div className="font-heading text-[28px] font-bold text-ink">
              {formatOre(service.priceOre)}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[13px] text-muted-light">Varighet</div>
            <div className="pt-[5px] font-heading text-[22px] font-semibold text-ink">
              {formatDuration(service.durationMin)}
            </div>
          </div>
        </div>

        {affinity.length > 0 && (
          <div className="mt-[26px]">
            <h2 className="mb-1 font-heading text-[19px] font-semibold text-ink">
              Ofte valgt sammen
            </h2>
            <p className="mb-3.5 text-[14.5px] text-muted">
              Legg til når bilen først er inne.
            </p>
            <div className="flex flex-col gap-2.5">
              {affinity.map((addOn) => (
                <div
                  key={addOn.id}
                  className="flex items-center justify-between gap-3 rounded-[10px] border border-line-strong px-4 py-3.5"
                >
                  <div>
                    <div className="font-heading text-[16px] font-semibold text-ink">
                      {addOn.name}
                    </div>
                    <div className="mt-0.5 text-[13.5px] text-muted">
                      {addOn.description}
                    </div>
                  </div>
                  <span className="whitespace-nowrap font-heading text-[15px] font-bold text-navy">
                    + {formatOre(addOn.priceOre)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-[22px] text-[14px] text-muted-light">
          Prisen er kjedens standardpris inkl. mva. Enkelte avdelinger har egne
          lokalpriser.
        </p>
      </section>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 z-30 mx-auto max-w-[760px] bg-gradient-to-b from-transparent from-0% to-surface to-[35%] px-6 pb-[22px] pt-4">
        <Link
          href={`/booking?tjeneste=${service.slug}`}
          className="block w-full rounded-[8px] bg-navy py-[18px] text-center font-heading text-[18px] font-semibold text-white transition-colors hover:bg-navy-hover"
        >
          Legg til i booking · {priceFrom}
        </Link>
      </div>
    </div>
  );
}
