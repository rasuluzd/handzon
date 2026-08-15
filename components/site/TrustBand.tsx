import { ShieldCheck } from "lucide-react";

/**
 * Trygghetsbandet (SCREENS.md § Forside punkt 8). Ekte, etterprøvbare
 * påstander med ekte lenker — aldri «sertifisert kvalitet».
 */
const items = [
  {
    title: "Godkjent bilpleie",
    text: "Alle 14 avdelinger er registrert i Arbeidstilsynets godkjenningsordning for bilpleievirksomhet.",
    cta: "Se godkjenningen",
    href: "https://www.arbeidstilsynet.no/bilpleievirksomhet/",
  },
  {
    title: "Seriøse fagfolk",
    text: "Godkjent verkstedstandard for hjul- og dekktjenester. Sjekk oss i registeret til Statens vegvesen.",
    cta: "Finn godkjent verksted",
    href: "https://www.vegvesen.no/kjoretoy/eie-og-vedlikeholde/finn-godkjent-verksted/",
  },
  {
    title: "20 år, 120 000 biler",
    text: "Familiedrevet siden 2005. Hver avdeling drives av en lokal franchisetaker som kan bilene i sitt nabolag.",
  },
];

export function TrustBand() {
  return (
    <section
      className="grid border-t border-line px-[clamp(16px,4vw,64px)] pb-[clamp(30px,5vw,76px)] hz:grid-cols-3"
    >
      {items.map((item, index) => (
        <div
          key={item.title}
          className={
            index === 0
              ? "pb-5 pt-6 hz:pb-0 hz:pt-[26px]"
              : "border-t border-line pb-5 pt-6 hz:border-l hz:border-t-0 hz:pb-0 hz:pl-[clamp(20px,3vw,40px)] hz:pt-[26px]"
          }
        >
          <h3 className="mb-2.5 flex items-start gap-2.5 font-heading text-[16.5px] font-semibold leading-[1.3] text-ink hz:mb-2 hz:items-center hz:text-[17px]">
            <ShieldCheck
              aria-hidden
              className="mt-px size-[19px] shrink-0 text-status-open hz:mt-0 hz:size-5"
              strokeWidth={1.75}
            />
            {item.title}
          </h3>
          <p className="max-w-[38ch] text-[15px] leading-[1.6] text-body-soft hz:text-[15px] hz:leading-[1.5]">
            {item.text}
          </p>
          {item.href && (
            /* Ingen negativ marg her. `-my-1.5` trakk 44px-trykkflaten opp i
               avsnittet over, så lenka klistret seg til teksten samtidig som
               den var for lav å treffe. Nå står den fritt med 12px over seg. */
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.cta} (åpnes i ny fane)`}
              className="mt-3 inline-flex min-h-[44px] items-center font-heading text-[14.5px] font-semibold text-navy hover:text-navy-hover hz:mt-2.5 hz:min-h-0 hz:text-[14px]"
            >
              {item.cta} ↗
            </a>
          )}
        </div>
      ))}
    </section>
  );
}
