import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Knapp — Dagsverkstedet (design_handoff_dagsverkstedet/code/button.tsx.txt).
 *
 *  - primary/accent/secondary/onNavy er VERSALER, Barlow 600, tracking .1em.
 *    `ghost` og `danger` beholder sentence case (de er tekstlenker i praksis).
 *  - Radius 8px (--radius-control), ikke pille.
 *  - Hover bytter FARGE, aldri opacity. Trykk gir translateY(1px), aldri skalering.
 *  - Rødt (`accent`) er reservert ETT konverteringspunkt per skjerm.
 */
const base =
  "inline-flex items-center justify-center gap-[9px] border-[1.5px] border-transparent rounded-control " +
  "font-heading font-semibold whitespace-nowrap cursor-pointer " +
  "transition-[background-color,border-color,color] duration-[120ms] ease-standard " +
  "active:translate-y-px disabled:bg-disabled disabled:text-disabled-text " +
  "disabled:border-transparent disabled:cursor-not-allowed disabled:translate-y-0";

const variants = {
  primary:
    "bg-navy text-white hover:bg-navy-hover active:bg-navy-active uppercase tracking-[.1em]",
  accent:
    "bg-red text-white hover:bg-red-hover active:bg-red-active uppercase tracking-[.1em]",
  /* Hover-tinten legges som et BILDE-lag, ikke som background-color. `hover:bg-navy-06`
     erstattet den ugjennomsiktige hvite flaten med en 6 % gjennomsiktig navy — på en
     hvit side var det en svak tint, men på et navy-panel forsvant knappen helt:
     navy tekst på navy. Et gradient-lag oppå `bg-surface` gir samme tint uten å
     røre den hvite bunnen, uansett hva knappen ligger på. */
  secondary:
    "bg-surface text-navy border-line-heavy hover:border-navy uppercase tracking-[.1em] " +
    "hover:bg-[image:linear-gradient(var(--color-navy-06),var(--color-navy-06))]",
  ghost: "bg-transparent text-navy hover:bg-navy-06 px-3 normal-case tracking-normal",
  danger: "bg-transparent text-danger hover:bg-danger-bg px-3 normal-case tracking-normal",
  onNavy: "bg-white text-navy hover:bg-on-navy-bright uppercase tracking-[.1em]",
} as const;

/* `sm` er 44px på touch og 38px fra 900px. 38px var under minstemålet på
   trykkflater, og `sm` bærer «Book her» på alle 14 avdelingskortene — den
   knappen har ikke råd til et bomtrykk. */
const sizes = {
  sm: "min-h-[44px] px-4 text-[12px] hz:min-h-[38px]",
  md: "min-h-[46px] px-[22px] text-[13px]",
  lg: "min-h-[54px] px-[30px] text-[14px]",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

function classes(variant: Variant, size: Size, block?: boolean, className?: string) {
  return [base, variants[variant], sizes[size], block ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  block,
  loading,
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "children">) {
  return (
    <button
      type="button"
      className={classes(variant, size, block, className)}
      aria-busy={loading || undefined}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          className="size-[15px] rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      {loading ? "Henter…" : children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  block,
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
} & ComponentProps<typeof Link>) {
  return (
    <Link className={classes(variant, size, block, className)} {...rest}>
      {children}
    </Link>
  );
}

/**
 * Ekstern lenke i knappelåsning — «Veibeskrivelse ↗» o.l. Egen komponent fordi
 * next/link ikke skal brukes til eksterne mål.
 */
export function ButtonExternal({
  variant = "secondary",
  size = "md",
  block,
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  children: ReactNode;
} & ComponentProps<"a">) {
  return (
    <a
      className={classes(variant, size, block, className)}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}
