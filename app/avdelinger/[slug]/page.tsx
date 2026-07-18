import type { Metadata } from "next";
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="Brødsmulesti" className="text-sm text-muted">
        <ButtonLink href="/avdelinger" variant="ghost" className="!min-h-8 !px-2 text-sm">
          ← Alle avdelinger
        </ButtonLink>
      </nav>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Handz On {location.name}
          </h1>
          <p className="mt-2 text-muted">
            {location.address}, {location.postalCode} {location.city}
          </p>
          <p className="mt-1 text-sm text-muted">
            Telefon {location.phone} · {location.email}
          </p>
          {organization && (
            <p className="mt-1 text-xs text-muted">
              Drives av {organization.legalName}, org.nr {formatOrgNr(organization.orgNr)}
            </p>
          )}
        </div>
        <ButtonLink href={`/booking?avdeling=${location.slug}`} className="text-lg">
          Bestill time her
        </ButtonLink>
      </div>

      {location.campaign && (
        <Card className="mt-6 border-accent/40 bg-accent/10">
          <p className="font-semibold text-accent">Lokal kampanje</p>
          <p className="mt-1 text-sm">{location.campaign}</p>
        </Card>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <Card>
          <h2 className="font-semibold">Åpningstider</h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            {location.openingHours.map((hours) => (
              <div key={hours.day} className="flex justify-between gap-4">
                <dt className="text-muted">{dayNames[hours.day]}</dt>
                <dd className={hours.closed ? "text-muted" : ""}>
                  {hours.closed ? "Stengt" : `${hours.open}–${hours.close}`}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted">
            Inntil {location.maxConcurrentCars} biler behandles samtidig ved
            denne avdelingen.
          </p>
        </Card>

        <section aria-labelledby="tjenester-heading">
          <h2 id="tjenester-heading" className="text-xl font-bold">
            Tjenester og priser hos {location.name}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Priser inkl. mva. Lokale priser kan avvike fra kjedens veiledende priser.
          </p>
          <ul className="mt-4 space-y-3">
            {services.map((service) => {
              const available = isServiceAvailable(service.id, location.id);
              const price = getEffectivePrice(service.id, location.id);
              const isOverridden = price !== service.priceOre;
              return (
                <li key={service.id}>
                  <Card
                    className={`flex items-center justify-between gap-4 ${available ? "" : "opacity-60"}`}
                  >
                    <div>
                      <p className="font-semibold">
                        {service.name}{" "}
                        {isOverridden && available && (
                          <Badge className="ml-1 align-middle">Lokal pris</Badge>
                        )}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">
                        {formatDuration(service.durationMin)} · {service.category}
                      </p>
                    </div>
                    <div className="text-right">
                      {available ? (
                        <>
                          <p className="text-lg font-bold">{formatOre(price)}</p>
                          <ButtonLink
                            href={`/booking?avdeling=${location.slug}&tjeneste=${service.slug}`}
                            variant="secondary"
                            className="mt-1 !min-h-9 !px-3 text-sm"
                          >
                            Bestill
                          </ButtonLink>
                        </>
                      ) : (
                        <p className="text-sm text-muted">
                          Tilbys ikke ved denne avdelingen
                        </p>
                      )}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
