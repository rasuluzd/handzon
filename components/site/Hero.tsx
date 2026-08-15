import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { heroImage } from "@/lib/service-images";

/**
 * Dagsverkstedets signatur (code/hero.tsx.txt): full-bleed foto med
 * tekstinnholdet i et HVITT KORT oppå — ikke tekst direkte på bildet, og ingen
 * scrim.
 *
 * Desktop: kortet er venstrejustert, maks 600px, med 28–56px luft over/under.
 * Mobil:   bildet er 230px høyt, kortet trekkes 40px OPP over bildekanten og
 *          får 16px sidemarg.
 *
 * Mobilhierarkiet er strammet inn med ett mål: få «Bestill time» over bretten.
 * Før lå knappen ~580px ned (290px bilde, 38px H1, 19px ingress, to knapper
 * side ved side som brøt til to rader). Nå ligger den rundt 430px — synlig uten
 * å rulle på en 844px skjerm. Én dominant handling, én dempet.
 */
export function Hero() {
  return (
    <header className="relative border-b border-line hz:flex hz:min-h-[min(620px,74vh)] hz:items-center">
      <div className="relative h-[230px] overflow-hidden hz:absolute hz:inset-0 hz:h-auto">
        <Image
          src={heroImage}
          alt="Skum som skylles av svart lakk hos Handz On"
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        className="relative -mt-10 mx-4 mb-2 rounded-card-lg bg-surface p-5 pb-6 shadow-hero-soft hz:shadow-hero
                   hz:mx-0 hz:mb-0 hz:mt-0 hz:my-[clamp(28px,4vw,56px)] hz:ml-[clamp(16px,4vw,64px)]
                   hz:max-w-[600px] hz:p-[clamp(30px,3.4vw,50px)]"
      >
        <span className="mb-3 block font-heading text-[11.5px] font-semibold uppercase tracking-[.18em] text-navy hz:mb-6 hz:text-[12px] hz:tracking-[.2em]">
          14 avdelinger · book mens du handler
        </span>

        <h1 className="font-heading text-[clamp(31px,5.4vw,64px)] font-bold leading-[1.02] tracking-[-.03em] text-ink hz:leading-[.99] hz:tracking-[-.032em]">
          Lever nøkkelen.
          <br />
          Hent bilen <span className="text-navy">ren.</span>
        </h1>

        <p className="mt-3 max-w-[42ch] text-[16.5px] leading-[1.5] text-body hz:mt-5 hz:text-[19px] hz:leading-[1.55]">
          Vi tar bilen mens du gjør ærendene dine på senteret. Håndvask med to bøtter,
          kontroll i lys før levering, og SMS når den står klar.
        </p>

        {/* Én dominant handling. På mobil får den full bredde og 54px høyde;
            «Finn din avdeling» står under som dempet alternativ, ikke som
            likeverdig konkurrent som bryter til to rader. */}
        <div className="mt-5 flex flex-col gap-2.5 hz:mt-7 hz:flex-row hz:flex-wrap hz:gap-3">
          <ButtonLink href="/booking" size="lg" block className="hz:w-auto">
            Bestill time
          </ButtonLink>
          <ButtonLink
            href="/avdelinger"
            variant="secondary"
            size="lg"
            block
            className="hz:w-auto"
          >
            Finn din avdeling
          </ButtonLink>
        </div>

        {/* Innvendingene folk har i det de vurderer å trykke: hva koster det,
            og hva om jeg ikke kan komme. Svaret står rett under knappen, ikke
            tre skjermer ned. */}
        <p className="mt-2.5 text-center text-[13px] leading-[1.4] text-body-soft hz:text-left">
          Faste priser · gratis avbestilling til 24 timer før
        </p>

        <p className="mt-4 flex items-center gap-2 border-t border-line pt-3.5 text-[13px] leading-[1.4] text-body-soft hz:mt-[22px] hz:gap-2.5 hz:pt-[18px] hz:text-[14px]">
          <ShieldCheck
            aria-hidden
            className="size-[18px] shrink-0 text-status-open"
            strokeWidth={1.75}
          />
          Registrert i Arbeidstilsynets godkjenningsordning for bilpleie
        </p>
      </div>
    </header>
  );
}
