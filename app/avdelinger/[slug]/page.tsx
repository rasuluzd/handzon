import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { formatDuration, formatOre, formatOrgNr } from "@/lib/format";
import {
  getEffectivePrice,
  getLocationBySlug,
  getOrganization,
  isServiceAvailable,
  locations,
  services,
} from "@/lib/mock-data";

const dayNames = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

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
    description: `Bestill bilpleie hos Handz On ${location.name}: ${location.address}, ${location.postalCode} ${location.city}. Se åpningstider, lokale priser og ledige timer.`,
  };
}

export default async function LocationPage({
  params,
}: PageProps<"/avdelinger/[slug]">) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const organization = getOrganization(location.orgId);

  return (
    <div className="mx-auto max-w-[1160px] px-[clamp(24px,4vw,48px)] pb-12 pt-7">
      <Link
        href="/avdelinger"
        className="text-[15px] font-semibold text-navy hover:text-navy-hover"
      >
        ← Alle avdelinger
      </Link>

      <div className="mt-4 flex flex-col gap-6 hz:flex-row hz:items-start hz:justify-between">
        <div>
          <h1 className="font-heading text-[32px] font-bold leading-[1.1] text-ink">
            Handz On {location.name}
          </h1>
          <p className="mt-2 text-[16px] text-body-soft">
            {location.address}, {location.postalCode} {location.city}
          </p>
          <p className="mt-1 text-[14px] text-muted">
            Telefon {location.phone} · {location.email}
          </p>
          {organization && (
            <p className="mt-1 text-[13px] text-muted-light">
              Drives av {organization.legalName}, org.nr{" "}
              {formatOrgNr(organization.orgNr)}
            </p>
          )}
        </div>
        <ButtonLink
          href={`/booking?avdeling=${location.slug}`}
          className="shrink-0"
        >
          Bestill time her
        </ButtonLink>
      </div>

      {location.campaign && (
        <div className="mt-6 rounded-[12px] bg-navy/6 px-4 py-3.5">
          <p className="font-heading text-[14px] font-semibold text-navy">
            Lokal kampanje
          </p>
          <p className="mt-1 text-[15px] text-body">{location.campaign}</p>
        </div>
      )}

      <div className="mt-8 grid gap-8 hz:grid-cols-[280px_1fr]">
        <Card className="self-start">
          <h2 className="font-heading text-[18px] font-semibold text-ink">
            Åpningstider
          </h2>
          <dl className="mt-3 space-y-1.5 text-[15px]">
            {location.openingHours.map((hours) => (
              <div key={hours.day} className="flex justify-between gap-4">
                <dt className="text-muted">{dayNames[hours.day]}</dt>
                <dd className={hours.closed ? "text-muted-light" : "text-body-strong"}>
                  {hours.closed ? "Stengt" : `${hours.open}–${hours.close}`}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] text-muted-light">
            Inntil {location.maxConcurrentCars} biler behandles samtidig ved
            denne avdelingen.
          </p>
        </Card>

        <section aria-labelledby="tjenester-heading">
          <h2
            id="tjenester-heading"
            className="font-heading text-[21px] font-bold text-ink"
          >
            Tjenester og priser hos {location.name}
          </h2>
          <p className="mt-1 text-[14px] text-muted">
            Priser inkl. mva. Lokale priser kan avvike fra kjedens veiledende
            priser.
          </p>
          <ul className="mt-4 space-y-2.5">
            {services.map((service) => {
              const available = isServiceAvailable(service.id, location.id);
              const price = getEffectivePrice(service.id, location.id);
              const isOverridden = price !== service.priceOre;
              return (
                <li key={service.id}>
                  <div
                    className={`flex items-center justify-between gap-4 rounded-[10px] border border-line-strong bg-surface p-4 ${available ? "" : "opacity-60"}`}
                  >
                    <div>
                      <p className="font-heading text-[17px] font-semibold text-ink">
                        {service.name}{" "}
                        {isOverridden && available && (
                          <Badge className="ml-1 align-middle !py-1 text-[12px]">
                            Lokal pris
                          </Badge>
                        )}
                      </p>
                      <p className="mt-0.5 text-[13.5px] text-muted">
                        {formatDuration(service.durationMin)} · {service.category}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      {available ? (
                        <>
                          <p className="font-heading text-[17px] font-bold text-navy">
                            {formatOre(price)}
                          </p>
                          <Link
                            href={`/booking?avdeling=${location.slug}&tjeneste=${service.slug}`}
                            className="mt-1 inline-block rounded-[8px] border-[1.5px] border-navy/35 bg-surface px-3 py-1.5 font-heading text-[14px] font-semibold text-navy hover:bg-surface-alt"
                          >
                            Bestill
                          </Link>
                        </>
                      ) : (
                        <p className="text-[13.5px] text-muted">
                          Tilbys ikke her
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
