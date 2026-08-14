"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/**
 * On-scroll reveal (MOTION.md). Brukes sparsomt — bare forsidens to
 * hovedblokker, og bare én gang.
 *
 * Bevisst en rulle-lytter og ikke IntersectionObserver: ved et hopp i
 * rullefeltet (ankerlenke, gjenopprettet posisjon, programmatisk scrollTo)
 * rekker ikke observatøren å se selve inngangen, og blokken kan bli stående
 * usynlig. Lytteren sjekker posisjonen direkte og fjerner seg selv etter
 * første treff.
 */
export function Reveal({
  delay = 0,
  className = "",
  children,
}: {
  /** Forskyvning i ms — 70ms mellom blokker. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    /* Under 900px er selve avsløringen slått av i CSS (globals.css) — da skal
       vi heller ikke betale for en rulle-lytter. */
    if (!window.matchMedia("(min-width: 900px)").matches) return;

    let done = false;
    let raf = 0;

    const measure = () => {
      raf = 0;
      if (done || !ref.current) return;
      if (ref.current.getBoundingClientRect().top < window.innerHeight * 0.9) {
        done = true;
        setShown(true);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    };

    /* getBoundingClientRect() tvinger fram en layout. Kalt direkte fra hver
       scroll-hendelse blir det ett tvungent oppsett per hendelse; her er det
       maks ett per frame. */
    const schedule = () => {
      if (done || raf) return;
      raf = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Første sjekk i neste frame — blokken kan allerede være i syne.
    schedule();
    return () => {
      done = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`hz-reveal${shown ? " is-in" : ""} ${className}`.trim()}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
