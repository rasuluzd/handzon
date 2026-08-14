import type { ComponentProps } from "react";

/**
 * Kort i tre dybdenivåer (design_handoff_dagsverkstedet/code/card.tsx.txt).
 * Aldri to nivåer i samme kortkontekst.
 *
 *  1. flat      hårlinje, ingen skygge      → lister, faktarader
 *  2. elevated  hårlinje + shadow-card      → tjeneste-, avdelings-, pakkekort
 *  3. selected  2px navy + navy-06-fyll     → bookingvalg
 *
 * Skygge erstatter aldri hårlinjen — den legges oppå.
 */
export function Card({
  elevated,
  interactive,
  selected,
  flush,
  className,
  children,
  ...rest
}: {
  elevated?: boolean;
  interactive?: boolean;
  selected?: boolean;
  flush?: boolean;
} & ComponentProps<"div">) {
  return (
    <div
      className={[
        "relative bg-surface border border-line-strong",
        /* Kortpaddingen er 16px på mobil og 24/20px fra 900px. Et kort med
           24px luft på alle kanter spiser 48px av 358px brukbar bredde, og
           /avdelinger stabler fjorten av dem. */
        elevated ? "rounded-card-lg p-4 shadow-card hz:p-6" : "rounded-card p-4 hz:p-5",
        flush ? "!p-0 overflow-hidden" : "",
        interactive
          ? "cursor-pointer transition-[border-color,box-shadow,transform] duration-200 ease-standard hover:border-navy"
          : "",
        interactive && elevated
          ? "hover:-translate-y-0.5 hover:shadow-card-hover hover:border-line-strong"
          : "",
        selected ? "!border-2 !border-navy bg-navy-06" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Rund hake for valgte kort i bookingflyten. Spretter inn når den fylles. */
export function Tick({ on }: { on?: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        "grid place-items-center size-[26px] shrink-0 rounded-full border-2 text-[13px]",
        on ? "hz-pop bg-navy border-navy text-white" : "border-line-heavy text-transparent",
      ].join(" ")}
    >
      ✓
    </span>
  );
}
