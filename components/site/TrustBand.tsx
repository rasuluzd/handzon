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
    text: "Godkjent verkstedstandard for hjul- og dekktjenester — sjekk oss hos Statens vegvesen.",
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
              ? "pt-4 hz:pt-[26px]"
              : "border-t border-line pt-3.5 hz:border-l hz:border-t-0 hz:pl-[clamp(20px,3vw,40px)] hz:pt-[26px]"
          }
        >
          <h3 className="mb-1.5 flex items-center gap-2 font-heading text-[16px] font-semibold text-ink hz:mb-2 hz:gap-2.5 hz:text-[17px]">
            <ShieldCheck
              aria-hidden
              className="size-[18px] shrink-0 text-status-open hz:size-5"
              strokeWidth={1.75}
            />
            {item.title}
          </h3>
          <p className="max-w-[38ch] text-[14.5px] leading-[1.45] text-body-soft hz:text-[15px] hz:leading-[1.5]">
            {item.text}
          </p>
          {item.href && (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.cta} (åpnes i ny fane)`}
              className="-my-1.5 inline-flex min-h-[40px] items-center font-heading text-[14px] font-semibold text-navy hover:text-navy-hover hz:my-0 hz:mt-2.5 hz:min-h-0"
            >
              {item.cta} ↗
            </a>
          )}
        </div>
      ))}
    </section>
  );
}
