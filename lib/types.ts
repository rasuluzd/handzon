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

export interface Location {
  id: string;
  orgId: string;
  slug: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
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
  | "Utvendig"
  | "Innvendig"
  | "Komplett"
  | "Lakk og beskyttelse";

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
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  priceOre: number;
  durationMin: number;
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
