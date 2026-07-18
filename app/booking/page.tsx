import type { Metadata } from "next";
import { getLocationBySlug, getServiceBySlug } from "@/lib/mock-data";
import { BookingWizard } from "./wizard";

export const metadata: Metadata = {
  title: "Bestill time",
  description:
    "Bestill bilpleie i 7 enkle steg: velg avdeling, tast inn regnummeret, velg tjeneste og tidspunkt – ferdig på under ett minutt.",
};

export default async function BookingPage({ searchParams }: PageProps<"/booking">) {
  const query = await searchParams;
  const locationSlug = typeof query.avdeling === "string" ? query.avdeling : undefined;
  const serviceSlug = typeof query.tjeneste === "string" ? query.tjeneste : undefined;

  const initialLocationId = locationSlug
    ? (getLocationBySlug(locationSlug)?.id ?? null)
    : null;
  const initialServiceId = serviceSlug
    ? (getServiceBySlug(serviceSlug)?.id ?? null)
    : null;

  // «Endre tid» fra Min side: start på tidspunkt-steget med regnr forhåndsutfylt.
  const regNr = typeof query.regnr === "string" ? query.regnr : undefined;
  const initialStep =
    query.steg === "tid" && initialLocationId && initialServiceId ? 4 : undefined;

  return (
    <BookingWizard
      initialLocationId={initialLocationId}
      initialServiceId={initialServiceId}
      initialRegNr={regNr}
      initialStep={initialStep}
    />
  );
}
