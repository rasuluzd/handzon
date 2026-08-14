"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import logoWhite from "@/public/logo-white.png";

/**
 * Global footer (README PR 3): navy flate, hvit logo, fire kolonner
 * 1.5fr 1fr 1fr 1fr, juridisk stripe skilt med hårlinje på navy.
 *
 * Tekstfargene er låst til on-navy-tokenene — `text-white/45` måler 3,56:1 og
 * strøk AA.
 */
const columns: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Informasjon",
    links: [
      { href: "/om-oss", label: "Om oss" },
      { href: "/kundeklubb", label: "Bli medlem" },
      { href: "/nyheter", label: "Nyheter" },
      { href: "/kontakt", label: "Kontakt oss" },
    ],
  },
  {
    title: "Tjenester",
    links: [
      { href: "/tjenester?kategori=Bilvask", label: "Bilvask" },
      { href: "/tjenester?kategori=Polering", label: "Polering" },
      { href: "/tjenester?kategori=Lakkforsegling", label: "Lakkforsegling" },
      { href: "/tjenester?kategori=Full+Shine", label: "Full Shine" },
      { href: "/tjenester?kategori=Interi%C3%B8r", label: "Interiør" },
      { href: "/tjenester?kategori=Dekk+%26+Felg", label: "Dekk & Felg" },
    ],
  },
  {
    title: "Mine sider",
    links: [
      { href: "/min-side", label: "Logg inn" },
      { href: "/booking", label: "Bestill time" },
      { href: "/avdelinger", label: "Finn avdeling" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/booking") || pathname.startsWith("/admin")) return null;

  return (
    <footer className="on-dark bg-navy text-on-navy">
      {/* Fire kolonner på desktop, to på mobil. Stablet i én kolonne ble
          footeren 1290px — nesten to hele telefonskjermer bunntekst. */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-7 px-[clamp(16px,4vw,64px)] pb-6 pt-[clamp(28px,4.5vw,62px)] hz:grid-cols-[1.5fr_1fr_1fr_1fr] hz:gap-8 hz:pb-7">
        <div className="col-span-2 hz:col-span-1">
          <Image
            src={logoWhite}
            alt="Handz On Auto Care"
            className="mb-3 h-[28px] w-auto hz:mb-4 hz:h-[30px]"
          />
          <p className="max-w-[42ch] text-[14px] leading-[1.55] text-on-navy-soft hz:max-w-[32ch] hz:text-[14.5px] hz:leading-[1.6]">
            Book på 60 sekunder. Lever nøkkelen på senteret, hent en ren bil når du er
            ferdig å handle.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-1.5 font-heading text-[11.5px] font-semibold uppercase tracking-[.18em] text-on-navy-eyebrow hz:mb-3.5">
              {column.title}
            </h2>
            <ul className="flex flex-col">
              {column.links.map((link) => (
                <li key={link.href}>
                  {/* Trykkflaten er hele raden, ikke bare de 22px teksten
                      måler — footerlenker ligger tett og bommes lett. */}
                  <Link
                    href={link.href}
                    className="flex min-h-[38px] items-center text-[15px] hover:text-white hz:min-h-0 hz:py-[5px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Inngang til adminpanelet — tydelig merket som intern demo, så den er
          lett å finne når løsningen vises fram. */}
      <div className="px-[clamp(16px,4vw,64px)]">
        <div className="flex flex-wrap items-center gap-3 border-t border-on-navy-hair py-4 hz:gap-5 hz:py-6">
          <div className="min-w-0">
            <p className="font-heading text-[11.5px] font-semibold uppercase tracking-[.18em] text-on-navy-eyebrow">
              Intern demo
            </p>
            {/* Den lange forklaringen er desktop-only: fire linjer bruksanvisning
                for et internt verktøy hører ikke hjemme i mobilfooteren. */}
            <p className="mt-1 max-w-[62ch] text-[13.5px] leading-[1.5] text-on-navy max-hz:hidden hz:mt-1.5 hz:text-[14.5px] hz:leading-[1.55]">
              Adminpanelet for avdelingene og kjedekontoret: salgsrapport dag for år,
              bestillinger med statusflyt, tjeneste- og prismatrise og bloggverktøy.
            </p>
            <p className="mt-1 text-[13.5px] leading-[1.5] text-on-navy hz:hidden">
              Adminpanelet for avdelingene og kjedekontoret.
            </p>
          </div>
          <ButtonLink href="/admin" variant="onNavy" className="ml-auto max-hz:w-full">
            Åpne adminpanelet →
          </ButtonLink>
        </div>
      </div>

      {/* Siste utgang. Den som har rullet helt ned har lest ferdig — da skal
          det stå én ting igjen å gjøre, ikke bare et organisasjonsnummer. */}
      <div className="px-[clamp(16px,4vw,64px)] pb-5 hz:hidden">
        <ButtonLink href="/booking" variant="onNavy" size="lg" block>
          Bestill time
        </ButtonLink>
        <p className="mt-2.5 text-center text-[13.5px] text-on-navy-soft">
          Faste priser · gratis avbestilling til 24 timer før
        </p>
      </div>

      <div className="px-[clamp(16px,4vw,64px)] pb-[max(20px,env(safe-area-inset-bottom))] hz:pb-8">
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-on-navy-hair pt-3.5 text-[12px] leading-[1.5] text-on-navy-soft hz:pt-[18px] hz:text-[12.5px] hz:leading-[1.7]">
          <span>© 2026 Handz On Auto Care · Hver avdeling drives av egen juridisk enhet.</span>
          <span>Handz On Norway AS, Laguneveien 7, 5239 Rådal · Org. 821 230 152 MVA</span>
          <span>Registrert i Arbeidstilsynets godkjenningsordning for bilpleie.</span>
        </div>
      </div>
    </footer>
  );
}
