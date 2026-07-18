"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/public/logo-original.webp";

const links = [
  { href: "/tjenester", label: "Tjenester" },
  { href: "/avdelinger", label: "Avdelinger" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/min-side", label: "Min side" },
  { href: "/booking", label: "Bestill time" },
] as const;

/**
 * Footer (README: Global chrome). Skjules i bookingflyten, som i prototypen.
 */
export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/booking")) return null;

  return (
    <footer className="mt-6 border-t border-line bg-surface-alt">
      <div className="mx-auto max-w-[1280px] px-6 pb-10 pt-9">
        <Image src={logo} alt="Handz On" className="mb-5 h-[34px] w-auto" />
        <nav
          aria-label="Bunnmeny"
          className="mb-6 flex flex-wrap gap-x-7 gap-y-4"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[16px] text-body hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="max-w-3xl text-[13.5px] leading-relaxed text-muted-light">
          © 2026 Handz On Auto Care · Franchisekjede med 14 lokale avdelinger.
          Hver avdeling drives av egen juridisk enhet. Alle avdelinger er
          registrert i Arbeidstilsynets godkjenningsordning for bilpleie.
        </p>
      </div>
    </footer>
  );
}
