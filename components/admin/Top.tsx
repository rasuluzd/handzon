"use client";

import type { ReactNode } from "react";
import { locations } from "@/lib/mock-data";
import { adSelect } from "./ui";

/**
 * Sticky toppbar (ADMIN.md § 1). Tittel med undertekst til venstre —
 * underteksten sier alltid hvilken avdeling og hvilken periode som vises.
 */
export function Top({
  title,
  sub,
  right,
  onBurger,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
  onBurger: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 flex min-h-16 flex-wrap items-center gap-4 border-b border-line bg-surface/95 px-[clamp(18px,2.4vw,32px)] py-3 backdrop-blur-[12px]">
      <button
        type="button"
        aria-label="Åpne meny"
        onClick={onBurger}
        className="flex-col gap-[5px] p-2 admin-sm:hidden max-admin-sm:flex"
      >
        <span aria-hidden className="block h-0.5 w-[22px] rounded-[2px] bg-navy" />
        <span aria-hidden className="block h-0.5 w-[22px] rounded-[2px] bg-navy" />
        <span aria-hidden className="block h-0.5 w-[22px] rounded-[2px] bg-navy" />
      </button>
      <div>
        <h1 className="font-heading text-[19px] font-semibold leading-[1.2] text-ink">{title}</h1>
        {sub && <p className="mt-0.5 text-[13px] text-body-soft">{sub}</p>}
      </div>
      {/* På telefon legger kontrollene seg på ÉN rad under tittelen i stedet
          for én rad hver. Avdelingsvelgeren og «Full rapport» tok 116px av
          toppen alene — chrome før man så et eneste tall. */}
      {right && (
        <div className="ml-auto flex flex-wrap items-center gap-2 max-admin-sm:w-full admin-sm:gap-2.5">
          {right}
        </div>
      )}
    </header>
  );
}

/** Avdelingsvelger. «alle» er hele kjeden. */
export function BranchPicker({
  value,
  onChange,
  allLabel = "Hele kjeden (14 avdelinger)",
}: {
  value: string;
  onChange: (slug: string) => void;
  allLabel?: string;
}) {
  return (
    <select
      aria-label="Velg avdeling"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      /* `min-w-0` er nødvendig: en <select> er ellers like bred som sin
         lengste option («Hele kjeden (14 avdelinger)») og nekter å krympe i
         en flex-rad. */
      className={`${adSelect} min-w-0 flex-1 admin-sm:flex-none`}
    >
      <option value="alle">{allLabel}</option>
      {locations.map((location) => (
        <option key={location.slug} value={location.slug}>
          Handz On {location.name}
        </option>
      ))}
    </select>
  );
}
