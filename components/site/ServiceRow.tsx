import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { formatKr } from "@/lib/format";
import { getServiceImage } from "@/lib/service-images";
import type { Service } from "@/lib/types";

/**
 * Tett radvariant (COMPONENTS.md § Row) — bookingflytens arbeidshest, og
 * gjenbrukt til «Andre tjenester» og «Populært hos oss».
 * Denne varianten er en lenke; bookingen bruker sin egen knapp-variant.
 *
 * Mobiltetthet: på 390px har raden bare ca. 358px å gå på. Med 70px bilde,
 * 15px gap og en 19px prissøyle ble tekstkolonnen ca. 150px — navnet brakk i
 * to og beskrivelsen ble fem linjer, så «tett rad» ble sidens høyeste element.
 * Under 900px krymper derfor bilde, gap, navn, meta og pris, og beskrivelsen
 * klippes til to linjer. Raden faller fra ca. 165px til ca. 100px med metalinje
 * (ca. 83px uten) — godt over 44px-målet, og navnet får én linje.
 */
export function ServiceRowLink({
  service,
  href,
  meta,
  priceOre,
  wasOre,
  tags,
}: {
  service: Service;
  href: string;
  meta?: string;
  priceOre?: number;
  wasOre?: number;
  tags?: ReactNode;
}) {
  const image = getServiceImage(service.slug);
  const price = priceOre ?? service.priceOre;
  return (
    <Link
      href={href}
      className="flex w-full items-center gap-3 rounded-card border border-line-strong bg-surface p-[11px] text-left transition-[border-color,background-color] duration-[120ms] ease-standard hover:border-navy hover:bg-navy-06 hz:gap-[15px] hz:p-[13px]"
    >
      {/* `sizes` speiler den faktiske boksen (56/70px). Uten den lager
          next/image en 1x/2x-srcset og en DPR-2-telefon henter 256px-filen
          til et 56px-bilde — på en side med flere rader per skjerm. */}
      <Image
        src={image.thumb}
        alt=""
        width={70}
        height={70}
        sizes="(min-width: 900px) 70px, 56px"
        className="size-[56px] shrink-0 rounded-control object-cover hz:size-[70px]"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 hz:gap-2.5">
          <span className="font-heading text-[15.5px] font-semibold leading-[1.25] text-ink hz:text-[17px]">
            {service.name}
          </span>
          {tags}
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] leading-[1.45] text-body-soft hz:line-clamp-none hz:text-[13.5px]">
          {service.description}
        </p>
        {/* Versaler med .12em sperring er dyrt per tegn: «Varighet ca. 1 t 30
            min» ble ca. 190px og brakk til to linjer i en tekstkolonne på ca.
            194px. 11px og .06em holder metalinja på én linje på mobil uten at
            eyebrow-uttrykket ryker. */}
        {meta && (
          <p className="mt-1 font-heading text-[11px] font-semibold uppercase tracking-[.06em] text-body-soft hz:mt-1.5 hz:text-[11.5px] hz:tracking-[.12em]">
            {meta}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right font-heading tabular">
        {wasOre !== undefined && wasOre !== price && (
          <s className="block text-[12px] text-body-soft hz:text-[13px]">
            {formatKr(wasOre)}
          </s>
        )}
        <b className="block text-[16.5px] font-bold leading-[1.2] text-ink hz:text-[19px]">
          {formatKr(price)}
        </b>
      </div>
    </Link>
  );
}
