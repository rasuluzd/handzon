"use client";

import type { ComponentProps, ReactNode } from "react";

/**
 * Interaktiv filter-pille (COMPONENTS.md § Chip). Antall bak etiketten settes i
 * samme font med `opacity-65`. Raden er `flex gap-2 overflow-x-auto` + `.hz-scroll`.
 */
export function Chip({
  active,
  count,
  children,
  className,
  ...rest
}: {
  active?: boolean;
  count?: number;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "children">) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={[
        /* 44px høy på touch (py-[11px]), 38px fra 900px. Chipene ligger i en
           horisontal strimmel man drar i — en for lav chip gir bomtrykk. */
        "shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-[15px] py-[11px] hz:py-2",
        "font-heading text-[13.5px] font-semibold transition-colors duration-[120ms] ease-standard",
        active
          ? "border-navy bg-navy text-white"
          : "border-line-strong bg-surface text-body hover:border-navy",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
      {count !== undefined && <span className="ml-1.5 opacity-65">{count}</span>}
    </button>
  );
}
