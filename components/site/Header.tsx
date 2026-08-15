"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import logo from "@/public/logo-original.webp";

const navLinks: Array<{ href: string; label: string }> = [
  { href: "/tjenester", label: "Tjenester" },
  { href: "/avdelinger", label: "Avdelinger" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/min-side", label: "Min side" },
];

/* Menyen på mobil er rangert etter salgsverdi, ikke etter desktop-rekkefølgen:
   det man kjøper står øverst, det man leser om står nederst. */
const sheetLinks: Array<{ href: string; label: string; note?: string }> = [
  { href: "/tjenester", label: "Tjenester", note: "18 tjenester · faste priser" },
  { href: "/avdelinger", label: "Avdelinger", note: "14 avdelinger i Norge" },
  { href: "/kundeklubb", label: "Kundeklubb", note: "Hver 6. vask gratis" },
  { href: "/min-side", label: "Min side" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/kontakt", label: "Kontakt" },
];

/**
 * Global chrome (README PR 3): sticky hvit header med hårlinje. Menylenkene er
 * VERSALER 13px Barlow 600 med .12em tracking, og aktiv rute får 2px navy
 * understrek. Hamburger → fullskjerms ark under 900px.
 *
 * Headeren skjules i bookingflyten og i admin — begge har egen chrome.
 *
 * ## To ting her er ikke stil, men mekanikk
 *
 * 1. **Arket rendres som SØSKEN av `<header>`, ikke inni den.** `backdrop-filter`
 *    gjør elementet til containing block for `position: fixed`-etterkommere. Lå
 *    arket inni den uskarpe headeren, ble `inset-0` regnet mot headerens 69px
 *    høye boks: den hvite flaten dekket bare toppstripen, og resten av menyen
 *    fløt gjennomsiktig over siden. Flytter du arket inn igjen, er feilen tilbake.
 * 2. **Ingen krympe-lytter.** Headeren hadde en `scroll`-lytter som satte state
 *    og re-rendret hele komponenten ved 40px. Det kostet en React-render midt i
 *    rullingen og gjorde at sticky filterbarer (`top-[69px]`) mistet festet når
 *    headeren ble 48px. Fast høyde er både roligere og raskere.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* Lås bakgrunnsrullingen mens arket er oppe. Skriver rett til DOM — ingen
     state i effekt (react-hooks/set-state-in-effect). */
  useEffect(() => {
    if (!open) return;
    const { style } = document.body;
    const previous = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = previous;
    };
  }, [open]);

  /* Esc lukker, Tab holder seg innenfor arket, og fokus går tilbake til
     hamburgeren når man lukker (WCAG 2.4.3). */
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    /* Nettleserens tilbakeknapp bytter rute uten å avmontere headeren — uten
       dette ble arket stående over den nye siden. */
    const onPopState = () => setOpen(false);

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
    };
  }, [open]);

  if (pathname.startsWith("/booking") || pathname.startsWith("/admin")) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Ugjennomsiktig på mobil med vilje: backdrop-blur på et sticky element
          tvinger nettleseren til å sample bakgrunnen på nytt hver eneste frame
          under rulling. Uskarpheten er en desktop-luksus. */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface hz:bg-surface/95 hz:backdrop-blur-[12px]">
        {/* Mobil: 44px trykkflate + 8px luft = 61px total med hårlinja.
            Sticky filterbarer festes på `top-[61px] hz:top-[79px]`. */}
        <div className="flex items-center justify-between gap-3 px-[clamp(16px,4vw,64px)] py-2 hz:gap-5 hz:py-4">
          <Link
            href="/"
            aria-label="Handz On Auto Care – til forsiden"
            className="shrink-0"
          >
            <Image
              src={logo}
              alt="Handz On Auto Care"
              preload
              className="h-[30px] w-auto hz:h-9"
            />
          </Link>

          <nav aria-label="Hovedmeny" className="hidden items-center gap-[26px] hz:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`relative py-1.5 font-heading text-[13px] font-semibold uppercase tracking-[.12em] hover:text-navy ${
                    active
                      ? "text-navy after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-navy"
                      : "text-body-strong"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Hovedhandlingen står i headeren også på mobil. Lå den bare bak
              hamburgeren, kostet hver booking to trykk og en menylesing. */}
          <div className="flex shrink-0 items-center gap-1">
            <ButtonLink href="/booking" className="max-hz:min-h-[40px] max-hz:px-3.5 max-hz:text-[12px]">
              Bestill time
            </ButtonLink>

            <button
              ref={triggerRef}
              type="button"
              aria-label="Åpne meny"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="-mr-2 flex size-11 flex-col items-center justify-center gap-[5px] hz:hidden"
            >
              <span aria-hidden className="block h-[1.5px] w-[22px] bg-navy" />
              <span aria-hidden className="block h-[1.5px] w-[22px] bg-navy" />
              <span aria-hidden className="block h-[1.5px] w-[22px] bg-navy" />
            </button>
          </div>
        </div>
      </header>

      {/* Arket er ALLTID montert og styres av `data-open`. Med betinget render
          forsvant menyen på én frame når man lukket den — bare åpningen var
          animert. Se `.hz-drawer` i globals.css: `visibility` er med i
          transisjonen, så panelet er ute av tabrekkefølgen når det er lukket
          uten at `display: none` dreper bevegelsen. */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Meny"
        data-open={open}
        className="hz-drawer hz-drawer-right fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-surface px-[clamp(16px,4vw,64px)] pb-[max(20px,env(safe-area-inset-bottom))] pt-2.5 hz:hidden"
      >
        <div className="flex items-center justify-between">
          <Link href="/" onClick={() => setOpen(false)} aria-label="Til forsiden">
            <Image src={logo} alt="Handz On Auto Care" className="h-[30px] w-auto" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            aria-label="Lukk meny"
            onClick={() => setOpen(false)}
            className="-mr-2 grid size-11 place-items-center text-navy"
          >
            <X aria-hidden className="size-6" strokeWidth={1.75} />
          </button>
        </div>

        <nav aria-label="Mobilmeny" className="mt-4 flex flex-col">
          {sheetLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === link.href ? "page" : undefined}
              style={{ "--i": index } as CSSProperties}
              className="hz-drawer-item flex items-center justify-between gap-3 border-b border-line py-[13px]"
            >
              <span className="min-w-0">
                <span
                  className={`block font-heading text-[19px] font-semibold leading-tight ${
                    isActive(link.href) ? "text-navy" : "text-ink"
                  }`}
                >
                  {link.label}
                </span>
                {link.note && (
                  <span className="mt-0.5 block text-[13px] leading-tight text-body-soft">
                    {link.note}
                  </span>
                )}
              </span>
              <span aria-hidden className="shrink-0 text-[15px] text-muted-light">
                →
              </span>
            </Link>
          ))}
        </nav>

        <div
          className="hz-drawer-item mt-auto pt-6"
          style={{ "--i": sheetLinks.length } as CSSProperties}
        >
          <ButtonLink href="/booking" size="lg" block onClick={() => setOpen(false)}>
            Bestill time
          </ButtonLink>
          <p className="mt-3 text-center text-[13.5px] text-body-soft">
            Faste priser · gratis avbestilling til 24 timer før
          </p>
        </div>
      </div>
    </>
  );
}
