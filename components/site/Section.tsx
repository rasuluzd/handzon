import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Seksjonsrytmen fra SCREENS.md § Fellesnevnere:
 * eyebrow → 12px → h2 → 8px → ingress → 26–28px → innhold.
 */
export function Section({
  alt,
  tight,
  className,
  children,
  ...rest
}: {
  /** Annenhver seksjon kan få bg-surface-alt. Maks to bakgrunnsfarger per skjerm. */
  alt?: boolean;
  /** Mindre luft over — brukes når seksjonen følger tett på forrige. */
  tight?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<React.ComponentProps<"section">, "children">) {
  return (
    <section
      className={[
        "px-[clamp(16px,4vw,64px)]",
        /* Mobil-bunnen er senket fra 40/28 til 30/22px. Luft er premium på
           desktop, men på 390px er den bare avstand til neste kjøpsargument. */
        tight
          ? "pb-[clamp(30px,5vw,76px)] pt-[clamp(22px,3vw,44px)]"
          : "py-[clamp(30px,5vw,76px)]",
        alt ? "bg-surface-alt" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={[
        "font-heading text-[12px] font-semibold uppercase tracking-[.2em] text-navy",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  moreHref,
  moreLabel,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 hz:mb-7">
      <div>
        {eyebrow && <Eyebrow className="mb-2.5 hz:mb-3">{eyebrow}</Eyebrow>}
        <h2 className="font-heading text-[clamp(24px,3.2vw,38px)] font-bold leading-[1.08] tracking-[-.024em] text-ink hz:leading-[1.06]">
          {title}
        </h2>
        {lead && (
          <p className="mt-2 max-w-[56ch] text-[16.5px] leading-[1.5] text-body hz:text-[19px] hz:leading-[1.55]">
            {lead}
          </p>
        )}
      </div>
      {moreHref && moreLabel && (
        <Link
          href={moreHref}
          className="-my-2 inline-flex min-h-[44px] items-center font-heading text-[12.5px] font-semibold uppercase tracking-[.14em] text-navy hover:text-navy-hover hz:my-0 hz:min-h-0"
        >
          {moreLabel}
        </Link>
      )}
    </div>
  );
}

/** Sidetopp: eyebrow, h1 og ingress. */
export function PageHead({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="px-[clamp(16px,4vw,64px)] pt-[clamp(22px,4vw,56px)]">
      {eyebrow && <Eyebrow className="mb-2.5 hz:mb-3.5">{eyebrow}</Eyebrow>}
      <h1 className="font-heading text-[clamp(28px,4vw,46px)] font-bold leading-[1.06] tracking-[-.03em] text-ink hz:leading-[1.02]">
        {title}
      </h1>
      {lead && (
        <p className="mt-3 max-w-[56ch] text-[16.5px] leading-[1.5] text-body hz:mt-3.5 hz:text-[19px] hz:leading-[1.55]">
          {lead}
        </p>
      )}
      {children}
    </div>
  );
}

/** Brødsmulesti. Siste ledd er `aria-current="page"`. */
export function Breadcrumbs({
  items,
  current,
  className,
}: {
  items: Array<{ href: string; label: string }>;
  current: string;
  className?: string;
}) {
  return (
    <nav
      aria-label="Sti"
      /* `items-center` + 44px på lenkene: brødsmulene var 20px høye, altså
         under halve minstemålet, på sider der de faktisk vises på mobil. */
      className={["flex flex-wrap items-center gap-2 text-[13.5px] text-body-soft", className]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => (
        <span key={item.href} className="flex items-center gap-2">
          <Link
            href={item.href}
            className="inline-flex min-h-[44px] items-center hover:text-navy hz:min-h-0"
          >
            {item.label}
          </Link>
          <span aria-hidden>/</span>
        </span>
      ))}
      <span aria-current="page" className="text-body-strong">
        {current}
      </span>
    </nav>
  );
}
