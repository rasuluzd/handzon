import type { Metadata } from "next";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { formatDuration, formatOre } from "@/lib/format";
import { services } from "@/lib/mock-data";
import type { ServiceCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tjenester",
  description:
    "Alt innen bilpleie: utvendig og innvendig vask, polering, keramisk coating og mer. Faste priser inkl. mva. Lokale avvik vises per avdeling.",
};

const categoryOrder: ServiceCategory[] = [
  "Utvendig",
  "Innvendig",
  "Komplett",
  "Lakk og beskyttelse",
];

export default function ServicesPage() {
  const grouped = categoryOrder
    .map((category) => ({
      category,
      items: services.filter((service) => service.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto max-w-[1160px] px-[clamp(24px,4vw,48px)] pb-10 pt-7">
      <p className="mb-2.5 font-heading text-[14px] font-semibold uppercase tracking-[0.1em] text-navy">
        Tjenester
      </p>
      <h1 className="mb-2 font-heading text-[32px] font-bold leading-[1.1] text-ink">
        Alt innen bilpleie
      </h1>
      <p className="mb-[26px] text-[16px] text-body-soft">
        Faste priser, ingen overraskelser. Lokale avvik vises per avdeling.
      </p>

      {grouped.map((group) => (
        <div key={group.category} className="mb-[26px]">
          <h2 className="mb-3 font-heading text-[14px] font-semibold uppercase tracking-[0.06em] text-muted-light">
            {group.category}
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3">
            {group.items.map((service) => (
              <Link
                key={service.id}
                href={`/tjenester/${service.slug}`}
                className="flex items-center gap-4 rounded-[10px] border border-line-strong bg-surface p-4 transition-colors hover:border-navy"
              >
                <ImagePlaceholder className="h-16 w-16 shrink-0 overflow-hidden rounded-[8px]" />
                <div className="min-w-0 flex-1">
                  <div className="font-heading text-[18px] font-semibold text-ink">
                    {service.name}
                  </div>
                  <div className="mt-[3px] text-[14px] text-muted">
                    {formatDuration(service.durationMin)}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-heading text-[16px] font-bold text-navy">
                    fra {formatOre(service.priceOre)}
                  </div>
                  <div className="mt-0.5 text-[12px] text-muted-light">
                    Se mer →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
