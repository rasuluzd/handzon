import type { ReactNode } from "react";

/**
 * Lite, ikke-interaktivt statusmerke (COMPONENTS.md § Tag).
 * Barlow 600, 11,5px, VERSALER, tracking .1em, radius 6px.
 *
 * `open`/`closed` får en 7px prikk foran — ingen andre varianter har prikk,
 * fordi en prikk uten betydning er pynt.
 */
const variants = {
  navy: "bg-navy-08 text-navy",
  red: "bg-red text-white",
  open: "bg-status-open-bg text-status-open",
  closed: "bg-status-closed-bg text-status-closed",
  mute: "bg-surface-alt text-body-soft border border-line",
  out: "text-body-soft border border-line-strong normal-case tracking-normal text-[12.5px] whitespace-normal",
} as const;

export type TagVariant = keyof typeof variants;

export function Tag({
  variant = "navy",
  children,
  className,
}: {
  variant?: TagVariant;
  children: ReactNode;
  className?: string;
}) {
  const dot = variant === "open" || variant === "closed";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-badge px-[9px] py-[4px]",
        "font-heading text-[11.5px] font-semibold uppercase tracking-[.1em]",
        "leading-[1.4] whitespace-nowrap",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}
