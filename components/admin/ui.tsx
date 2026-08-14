"use client";

import { useLayoutEffect, useRef } from "react";
import type { ComponentProps, ReactNode } from "react";

/**
 * Adminpanelets småkomponenter (ADMIN.md). Samme merkevare som kundeflaten,
 * men desktop først: tettere kontroller, tabulære tall, hårlinjer.
 * Alle verdier kommer fra tokens i globals.css.
 */

/* ---------- Knapp ---------- */
const btnBase =
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-control border-[1.5px] " +
  "border-transparent font-heading font-semibold transition-[background-color,border-color,color] duration-[120ms] " +
  "ease-standard active:translate-y-px disabled:cursor-not-allowed disabled:border-transparent " +
  "disabled:bg-disabled disabled:text-disabled-text disabled:translate-y-0";

const btnVariants = {
  primary: "bg-navy text-white hover:bg-navy-hover",
  secondary: "bg-surface text-navy border-line-heavy hover:border-navy hover:bg-navy-06",
  ghost: "bg-transparent text-navy hover:bg-navy-06",
  danger: "bg-transparent text-danger hover:bg-danger-bg",
} as const;

const btnSizes = {
  sm: "min-h-[34px] px-3 text-[13px]",
  md: "min-h-10 px-4 text-[14px]",
  lg: "min-h-[46px] px-[22px] text-[15px]",
} as const;

export function AdButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: keyof typeof btnVariants;
  size?: keyof typeof btnSizes;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "children">) {
  return (
    <button
      type="button"
      className={[btnBase, btnVariants[variant], btnSizes[size], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------- Merkelapp ---------- */
const tagVariants = {
  navy: "bg-navy-08 text-navy",
  red: "bg-red text-white",
  ok: "bg-status-open-bg text-status-open",
  warn: "bg-status-closed-bg text-status-closed",
  off: "bg-surface-alt text-body-soft border border-line",
  danger: "bg-danger-bg text-danger",
} as const;

export function AdTag({
  variant = "navy",
  dot,
  children,
}: {
  variant?: keyof typeof tagVariants;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-badge px-[9px] py-1 font-heading text-[11.5px] font-semibold leading-[1.4] tracking-[.06em] ${tagVariants[variant]}`}
    >
      {dot && <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* ---------- Felt ---------- */
export const adInput =
  "min-h-10 w-full rounded-control border border-line-heavy bg-surface px-[13px] py-2.5 text-[15px] text-ink outline-none " +
  "transition-[border-color,box-shadow] duration-[120ms] placeholder:text-muted-light hover:border-muted " +
  "focus:border-navy focus:shadow-[0_0_0_3px_var(--color-navy-14)]";

export const adNumber = `${adInput} font-heading font-semibold tabular`;

export const adTextarea = `${adInput} min-h-[120px] resize-y leading-[1.6]`;

export const adSelect =
  "min-h-10 max-w-full cursor-pointer appearance-none rounded-control border border-line-heavy bg-surface " +
  "bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27%235a6273%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%3E%3Cpath%20d=%27m6%209%206%206%206-6%27/%3E%3C/svg%3E')] " +
  "bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat py-2 pl-[13px] pr-[38px] font-heading text-[14px] font-medium text-ink " +
  "outline-none focus:border-navy focus:shadow-[0_0_0_3px_var(--color-navy-14)]";

export function AdField({
  label,
  help,
  htmlFor,
  children,
  className,
}: {
  label?: string;
  help?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="mb-1.5 block font-heading text-[12.5px] font-semibold text-body-strong"
        >
          {label}
        </label>
      )}
      {children}
      {help && <p className="mt-1.5 text-[13px] leading-[1.5] text-body-soft">{help}</p>}
    </div>
  );
}

/* ---------- Bryter ---------- */
export function AdSwitch({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-2.5 font-heading text-[14px] font-semibold text-ink"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="relative h-[26px] w-11 shrink-0 rounded-full bg-neutral-300 transition-colors duration-[120ms] ease-standard
                   after:absolute after:left-[3px] after:top-[3px] after:size-5 after:rounded-full after:bg-white after:shadow-xs
                   after:transition-transform after:duration-[120ms] after:ease-standard
                   peer-checked:bg-navy peer-checked:after:translate-x-[18px]
                   peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy"
      />
      {label}
    </label>
  );
}

/* ---------- Segmentert velger ---------- */
/**
 * Hvit indikator som glir til valgt knapp. Bredden måles per knapp og
 * animeres, fordi «Måned» og «År» er ulikt brede (MOTION.md § Adminpanelet).
 */
export function AdSeg<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: Array<[T, string]>;
  label: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const mounted = useRef(false);
  const index = Math.max(
    0,
    options.findIndex(([option]) => option === value),
  );

  /* Indikatoren måles og flyttes direkte i DOM — ingen ekstra render, og
     glidningen slås først på etter første måling, så den ikke animerer inn
     fra venstre når skjermen åpnes. */
  useLayoutEffect(() => {
    const move = (animate: boolean) => {
      const button = wrap.current?.querySelectorAll("button")[index];
      const element = thumb.current;
      if (!button || !element) return;
      element.style.transition = animate
        ? "transform 200ms var(--ease-standard), width 200ms var(--ease-standard)"
        : "none";
      element.style.width = `${button.offsetWidth}px`;
      element.style.transform = `translateX(${button.offsetLeft}px)`;
      element.style.opacity = "1";
    };
    move(mounted.current);
    mounted.current = true;
    const onResize = () => move(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index]);

  return (
    <div
      ref={wrap}
      role="group"
      aria-label={label}
      className="relative inline-flex gap-0.5 rounded-control border border-line-strong bg-surface-sunken p-[3px]"
    >
      <span
        ref={thumb}
        aria-hidden
        className="pointer-events-none absolute inset-y-[3px] left-0 z-0 rounded-[6px] bg-surface opacity-0 shadow-xs"
      />
      {options.map(([option, text]) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`relative z-[1] cursor-pointer whitespace-nowrap rounded-[6px] px-[15px] py-2 font-heading text-[13.5px] font-semibold transition-colors duration-[120ms] hover:text-navy ${
            value === option ? "text-navy" : "text-body-soft"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/* ---------- Kort, tabell og småting ---------- */
export function AdCard({
  flush,
  className,
  children,
  ...rest
}: { flush?: boolean } & ComponentProps<"div">) {
  return (
    <div
      className={[
        "rounded-card-lg border border-line-strong bg-surface",
        flush ? "overflow-hidden" : "p-5",
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

export function AdCardHead({
  title,
  sub,
  action,
  className,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["mb-4 flex flex-wrap items-baseline justify-between gap-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <p className="font-heading text-[16.5px] font-semibold text-ink">{title}</p>
        {sub && <p className="mt-[3px] text-[13px] text-body-soft">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdSectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={[
        "mb-2.5 font-heading text-[11px] font-semibold uppercase tracking-[.18em] text-body-soft",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}

export const adTh =
  "whitespace-nowrap border-b border-line-strong bg-surface-alt px-3.5 py-[11px] text-left font-heading text-[10.5px] font-semibold uppercase tracking-[.16em] text-body-soft";
export const adTd = "border-b border-line px-3.5 py-[13px] align-middle text-[14.5px] text-body";
export const adNum = "whitespace-nowrap text-right font-heading font-semibold tabular text-ink";
export const adName = "font-heading text-[15px] font-semibold text-ink";
export const adMeta = "mt-0.5 text-[12.5px] text-body-soft";

export function AdTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">{children}</table>
    </div>
  );
}

/** Andelsstripe — brukes i rapportens nedbrytninger. */
export function AdShare({ value, className }: { value: number; className?: string }) {
  return (
    <div
      className={["h-1.5 min-w-[70px] overflow-hidden rounded-[3px] bg-surface-sunken", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className="block h-full rounded-[3px] bg-navy"
        style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }}
      />
    </div>
  );
}

export function AdList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

export function AdListItem({
  title,
  meta,
  value,
  icon,
  action,
  children,
}: {
  title?: string;
  meta?: string;
  value?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5 border-t border-line py-3.5 first:border-t-0 first:pt-0">
      {icon}
      <div className="min-w-0 flex-1">
        {title && <p className="font-heading text-[15px] font-semibold text-ink">{title}</p>}
        {meta && <p className="mt-0.5 text-[13px] text-body-soft">{meta}</p>}
        {children}
      </div>
      {value && (
        <span className="whitespace-nowrap font-heading font-bold tabular text-ink">{value}</span>
      )}
      {action}
    </div>
  );
}

export function AdEmpty({
  icon,
  title,
  text,
  action,
}: {
  icon?: ReactNode;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-card-lg bg-surface-alt px-6 py-12 text-center">
      {icon && <span className="text-body-soft">{icon}</span>}
      <p className="font-heading text-[18px] font-semibold text-ink">{title}</p>
      {text && <p className="max-w-[42ch] text-[14.5px] leading-[1.55] text-body-soft">{text}</p>}
      {action}
    </div>
  );
}

export function AdNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={["text-[13px] leading-[1.6] text-body-soft", className].filter(Boolean).join(" ")}>
      {children}
    </p>
  );
}

/** Pil-knapp for periode- og dagnavigasjon. */
export function AdArrow({
  label,
  children,
  ...rest
}: { label: string; children: ReactNode } & Omit<ComponentProps<"button">, "children">) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-9 cursor-pointer place-items-center rounded-control border border-line-heavy bg-surface text-[15px] text-navy hover:border-navy hover:bg-navy-06 disabled:cursor-not-allowed disabled:text-disabled-text disabled:hover:border-line-heavy disabled:hover:bg-surface"
      {...rest}
    >
      {children}
    </button>
  );
}
