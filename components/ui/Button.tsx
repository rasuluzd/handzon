import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Knapp i designsystemet (README: Radius/borders — 8px, Barlow 600).
 * - primary: marineblå fylt (standard CTA)
 * - secondary: hvit med marineblå kant (sekundær CTA på lys flate)
 * - ghost: ren tekst (f.eks. «← Tilbake»)
 * - vipps: Vipps-oransje (kun Vipps-innlogging)
 * - onNavy: hvit fylt med marineblå tekst (CTA på marineblå panel)
 * - heroOutline: gjennomsiktig med hvit kant (sekundær CTA på marineblå panel)
 */
type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "vipps"
  | "onNavy"
  | "heroOutline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[8px] font-heading font-semibold " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy " +
  "min-h-12 px-6 py-3 text-[16px] cursor-pointer " +
  "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-text disabled:border-transparent";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-hover",
  secondary:
    "bg-surface text-navy border-[1.5px] border-navy/35 hover:bg-surface-alt",
  ghost: "text-body-soft hover:text-navy",
  vipps: "bg-vipps text-white hover:brightness-110",
  onNavy: "bg-white text-navy hover:bg-on-navy-bright",
  heroOutline:
    "bg-transparent text-white border-[1.5px] border-white/40 hover:bg-white/10",
};

interface ButtonOwnProps {
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  ...rest
}: ButtonOwnProps & ComponentProps<"button">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  ...rest
}: ButtonOwnProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
