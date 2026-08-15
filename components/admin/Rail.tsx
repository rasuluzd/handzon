"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  LayoutDashboard,
  Newspaper,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import logoWhite from "@/public/logo-white.png";

/**
 * Sidestolpen (ADMIN.md § 1). 250px navy-deep med grupper, aktiv rute i navy,
 * teller høyrestilt. Kollapser til 74px ikonrail under 1100px og blir skuff
 * bak hamburger under 760px.
 */
const NAV: Array<[string, Array<[href: string, label: string, icon: LucideIcon]>]> = [
  [
    "Drift",
    [
      ["/admin", "Oversikt", LayoutDashboard],
      ["/admin/bestillinger", "Bestillinger", Calendar],
    ],
  ],
  [
    "Salg",
    [
      ["/admin/rapport", "Salgsrapport", TrendingUp],
      ["/admin/tjenester", "Tjenester og priser", Sparkles],
    ],
  ],
  ["Innhold", [["/admin/blogg", "Blogg og nyheter", Newspaper]]],
];

/**
 * Løpenummer på tvers av grupper, brukt til `--i` i skuffens forskyvning.
 * Menypunktene ligger nestet under gruppene, så en `map`-indeks ville startet
 * på null i hver gruppe og gitt tre punkter samme forsinkelse.
 */
const STAGGER = new Map<string, number>();
NAV.forEach(([group, items]) => {
  STAGGER.set(`gruppe:${group}`, STAGGER.size);
  items.forEach(([href]) => STAGGER.set(href, STAGGER.size));
});

export function Rail({
  open,
  onClose,
  counts,
}: {
  open: boolean;
  onClose: () => void;
  counts: Record<string, number | null>;
}) {
  const pathname = usePathname();

  return (
    /* `data-open` i stedet for å bytte mellom `flex` og `hidden`: skuffen
       glir inn fra venstre og GLIR UT IGJEN når den lukkes. Med display-bytte
       forsvant den på én frame, uten at noe fortalte hvor den ble av.
       `.hz-drawer-rail` gjelder bare under 760px — over det er dette en fast
       sidestolpe som ikke skal forskyves. Se globals.css. */
    <aside
      data-open={open}
      className="hz-drawer-rail on-dark sticky top-0 flex h-screen flex-col overflow-y-auto bg-navy-deep text-on-navy
                 max-admin-sm:fixed max-admin-sm:inset-y-0 max-admin-sm:left-0 max-admin-sm:z-[80] max-admin-sm:w-[min(280px,86vw)]"
    >
      <div className="border-b border-on-navy-hair px-5 pb-[18px] pt-5 max-admin-lg:px-3.5 max-admin-lg:pt-[18px]">
        <Image
          src={logoWhite}
          alt="Handz On Auto Care"
          className="h-[30px] w-auto max-admin-lg:h-[26px]"
          preload
        />
        <span
          className={`mt-3 block font-heading text-[11px] font-semibold uppercase tracking-[.18em] text-on-navy-eyebrow ${open ? "" : "max-admin-lg:hidden"}`}
        >
          Adminpanel
        </span>
      </div>

      <nav aria-label="Adminmeny" className="flex flex-col gap-0.5 px-2.5 py-3">
        {NAV.map(([group, items]) => (
          <div key={group} className="contents">
            <p
              style={{ "--i": STAGGER.get(`gruppe:${group}`) } as CSSProperties}
              className={`hz-drawer-item px-2.5 pb-2 pt-4 font-heading text-[10.5px] font-semibold uppercase tracking-[.18em] text-white/40 ${open ? "" : "max-admin-lg:hidden"}`}
            >
              {group}
            </p>
            {items.map(([href, label, Icon]) => {
              const active = pathname === href;
              const count = counts[href];
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  style={{ "--i": STAGGER.get(href) } as CSSProperties}
                  className={`hz-drawer-item flex items-center gap-[11px] rounded-control px-3 py-[11px] font-heading text-[14.5px] font-semibold transition-colors duration-[120ms] ease-standard
                              ${active ? "bg-navy text-white" : "text-on-navy hover:bg-white/8 hover:text-white"}
                              ${open ? "" : "max-admin-lg:justify-center max-admin-lg:px-0"}`}
                >
                  <Icon aria-hidden className="size-[18px] shrink-0" strokeWidth={1.75} />
                  <span className={open ? "" : "max-admin-lg:hidden"}>{label}</span>
                  {count != null && (
                    <span
                      className={`ml-auto font-heading text-[12.5px] font-semibold tabular ${active ? "text-white" : "text-on-navy-eyebrow"} ${open ? "" : "max-admin-lg:hidden"}`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Vei ut av panelet, alltid synlig. */}
      <div className="mt-auto px-2.5 pb-3">
        <Link
          href="/"
          onClick={onClose}
          className={`flex items-center gap-[11px] rounded-control px-3 py-[11px] font-heading text-[14.5px] font-semibold text-on-navy transition-colors duration-[120ms] ease-standard hover:bg-white/8 hover:text-white ${open ? "" : "max-admin-lg:justify-center max-admin-lg:px-0"}`}
        >
          <ArrowLeft aria-hidden className="size-[18px] shrink-0" strokeWidth={1.75} />
          <span className={open ? "" : "max-admin-lg:hidden"}>Til nettstedet</span>
        </Link>
      </div>

      <div className="border-t border-on-navy-hair p-4">
        <div
          className={`flex items-center gap-[11px] ${open ? "" : "max-admin-lg:justify-center"}`}
        >
          <span
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-navy font-heading text-[13px] font-bold text-white"
          >
            OH
          </span>
          <div className={open ? "" : "max-admin-lg:hidden"}>
            <p className="font-heading text-[14px] font-semibold leading-[1.3] text-white">
              Ove Hagen
            </p>
            <p className="mt-px text-[12.5px] text-on-navy-eyebrow">Kjedeadministrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
