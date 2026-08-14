"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Sidebytte (MOTION.md): innholdet stiger `--page-shift` (18px) og toner inn
 * over `--dur-page` (420ms). Nav og footer står stille — de ligger utenfor
 * dette elementet.
 *
 * **Adminpanelet er unntatt.** Et internt verktøy skal føles raskt, ikke
 * levende, så der byttes skjermene uten bevegelse.
 *
 * Animasjonen restartes ved å ta klassen av og på igjen, ikke ved å nøkle
 * elementet på ruten: en nøkkel her ville revet ned alle underliggende layouts
 * — blant annet adminpanelets delte tilstand — ved hver navigering.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const isAdmin = pathname.startsWith("/admin");
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    element.classList.remove("hz-page");
    if (isAdmin) return;
    // Reflow tvinger nettleseren til å regne klassen som ny, så animasjonen
    // spilles om igjen i stedet for å bli stående ferdig.
    void element.offsetWidth;
    element.classList.add("hz-page");
  }, [pathname, isAdmin]);

  return (
    <main ref={ref} className={isAdmin ? "flex-1" : "hz-page flex-1"}>
      {children}
    </main>
  );
}
