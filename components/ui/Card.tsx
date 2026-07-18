import type { ComponentProps } from "react";

/**
 * Flat kort med hårfin kant (README: Cards are flat with hairline borders,
 * radius 10–12px). Bruk `className` for lokale justeringer.
 */
export function Card({ className = "", ...rest }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-[12px] border border-line-strong bg-surface p-5 ${className}`}
      {...rest}
    />
  );
}

/** Liten marineblå tint-etikett (README: Accent tint chips, radius 6px). */
export function Badge({ className = "", ...rest }: ComponentProps<"span">) {
  return (
    <span
      className={`inline-flex items-center rounded-[6px] bg-navy/8 px-3 py-1.5 text-sm font-semibold text-navy ${className}`}
      {...rest}
    />
  );
}
