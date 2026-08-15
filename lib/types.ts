/**
 * Domenetyper for Handz On Auto Care.
 *
 * Speiler ERD-en i docs/IMPLEMENTASJONSPLAN.md kap. 3 — forenklet for demoen
 * (ingen database; alt serveres via BookingAdapter med mock-data).
 */

/** Juridisk enhet (franchisetaker) — én per avdeling i dagens kjede. */
export interface Organization {
  id: string;
  orgNr: string;
  legalName: string;
}

export interface OpeningHours {
  /** 0 = mandag … 6 = søndag */
  day: number;
  open: string;
  close: string;
  closed?: boolean;
}

/** De tre landsdelene kjeden er i. Værvarselet hentes per region. */
export type Region = "Østlandet" | "Vestlandet" | "Sørlandet";

export interface Location {
  id: string;
  orgId: string;
  slug: string;
  name: string;
  /** Senteret avdelingen ligger på, f.eks. «Lambertseter senter». */
  center: string;
  address: string;
  postalCode: string;
  city: string;
  region: Region;
  phone: string;
  email: string;
  openingHours: OpeningHours[];
  /** Maks samtidige biler (samtidighetstak i kapasitetslogikken). */
  maxConcurrentCars: number;
  geo: { lat: number; lng: number };
  /** Kort lokal kampanjetekst (redigeres i CMS i produksjon). */
  campaign?: string;
}

export type ServiceCategory =
  | "Bilvask"
  | "Polering"
  | "Lakkforsegling"
  | "Full Shine"
  | "Interiør"
  | "Dekk & Felg";

export type ServiceLevel = "Basic" | "Premium" | "Pro";

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  description: string;
  /** Standard kjedepris i øre, inkl. 25 % mva. */
  priceOre: number;
  durationMin: number;
  popular?: boolean;
  /** Nivå (Basic/Premium/Pro) der tjenesten finnes i flere trinn. */
  level?: ServiceLevel;
  /** Garantitekst der relevant (f.eks. keramisk/NANO). */
  guarantee?: string;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  priceOre: number;
  durationMin: number;
}

/** Kundeanmeldelse (sosialt bevis på forside og avdelingsside). */
export interface Review {
  initials: string;
  name: string;
  where: string;
  /** Avatarfarge — alle ≥ 4,6:1 mot hvit tekst. */
  color: string;
  quote: string;
  service: string;
  locationSlug: string;
}

/** Lokal prisoverstyring per avdeling (FR-5.2). */
export interface LocationServiceOverride {
  locationId: string;
  serviceId: string;
  priceOre?: number;
  unavailable?: boolean;
}

export interface Vehicle {
  regNr: string;
  make: string;
  model: string;
  year: number;
  fuel: string;
  color: string;
}

export interface TimeSlot {
  /** ISO-dato, f.eks. "2026-07-15" */
  date: string;
  /** Klokkeslett, f.eks. "09:30" */
  time: string;
  capacityLeft: number;
}

export type BookingStatus =
  | "confirmed"
  | "in_progress"
  | "ready"
  | "completed"
  | "cancelled";

export interface BookingRequest {
  locationId: string;
  regNr: string;
  vehicle: Vehicle | null;
  serviceId: string;
  addOnIds: string[];
  date: string;
  time: string;
  contact: { name: string; phone: string };
  /** Kundeklubb-medlem identifisert via Vipps (FR-2.2). */
  member?: boolean;
}

export interface Booking {
  id: string;
  /** Kundevendt referanse, f.eks. "HOAC-4271" */
  reference: string;
  locationId: string;
  orgNr: string;
  regNr: string;
  vehicle: Vehicle | null;
  serviceId: string;
  addOnIds: string[];
  date: string;
  time: string;
  status: BookingStatus;
  totalOre: number;
  vatOre: number;
}

export interface Receipt {
  id: string;
  bookingReference: string;
  orgNr: string;
  legalName: string;
  locationName: string;
  date: string;
  totalOre: number;
  /** Mock-referanse til PDF i objektlager (6 års oppbevaring per org). */
  pdfKey: string;
}
