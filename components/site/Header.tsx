"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/public/logo-original.webp";

const navLinks = [
  { href: "/", label: "Forside" },
  { href: "/tjenester", label: "Tjenester" },
  { href: "/avdelinger", label: "Avdelinger" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/min-side", label: "Min side" },
] as const;

/**
 * Sticky, gjennomskinnelig hvit header (README: Global chrome). Horisontal nav
 * på desktop (≥900px), hamburger → fullskjerms overlay på mobil.
 */
export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/94 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-[clamp(20px,4vw,48px)] py-3.5">
        <Link href="/" aria-label="Handz On Auto Care – til forsiden">
          <Image
            src={logo}
            alt="Handz On Auto Care"
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop-nav */}
        <nav
          aria-label="Hovedmeny"
          className="hidden items-center gap-8 hz:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="font-heading text-[16px] font-semibold text-ink hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="rounded-[8px] bg-navy px-[22px] py-3 font-heading text-[15px] font-semibold text-white transition-colors hover:bg-navy-hover"
          >
            Bestill time
          </Link>
        </nav>

        {/* Hamburger (mobil) */}
        <button
          type="button"
          aria-label="Åpne meny"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(true)}
          className="flex flex-col gap-[5px] p-2.5 hz:hidden"
        >
          <span className="block h-0.5 w-6 rounded bg-navy" />
          <span className="block h-0.5 w-6 rounded bg-navy" />
          <span className="block h-0.5 w-6 rounded bg-navy" />
        </button>
      </div>

      {/* Mobil overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white px-6 py-[22px] hz:hidden">
          <div className="mb-11 flex items-center justify-between">
            <Image src={logo} alt="Handz On" className="h-[38px] w-auto" />
            <button
              type="button"
              aria-label="Lukk meny"
              onClick={() => setNavOpen(false)}
              className="text-[30px] leading-none text-navy"
            >
              ✕
            </button>
          </div>
          <nav aria-label="Mobilmeny" className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setNavOpen(false)}
                className="border-b border-line py-[18px] font-heading text-[26px] font-semibold text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Link
              href="/booking"
              onClick={() => setNavOpen(false)}
              className="block rounded-[8px] bg-navy py-[18px] text-center font-heading text-[18px] font-semibold text-white transition-colors hover:bg-navy-hover"
            >
              Bestill time
            </Link>
            <p className="mt-4 text-center text-[15px] text-muted">
              14 avdelinger over hele Norge
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
