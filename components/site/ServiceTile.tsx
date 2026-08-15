import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/ui/Price";
import { Tag } from "@/components/ui/Tag";
import { formatDuration } from "@/lib/format";
import { getServiceImage } from "@/lib/service-images";
import type { Service } from "@/lib/types";

/**
 * Tjenestekortet (COMPONENTS.md § ServiceTile) i to presentasjoner — samme
 * komponent, samme data, ulik form etter skjermbredde:
 *
 *  - **Under 900px: radkort.** 116px kvadratisk foto til venstre, tekst og pris
 *    til høyre. Et 4:5-mediefelt over full mobilbredde ble 390×487px — ett kort
 *    fylte mer enn en halv skjerm, og katalogens 18 tjenester ble 12 000px lang
 *    side. Radformen gir ~140px per kort: fire tjenester i syne i stedet for én.
 *  - **Fra 900px: mediekort.** Bilde på topp, `tall` gir 4:5 til forsidens trio,
 *    katalogen bruker 4:3.
 *
 * `sizes` følger de faktiske bredden i begge tilfeller — uten den lastet mobilen
 * et 390px bredt bilde for et 116px felt.
 */
export function ServiceTile({
  service,
  flag,
  tall,
  preload,
}: {
  service: Service;
  flag?: string;
  tall?: boolean;
  preload?: boolean;
}) {
  const image = getServiceImage(service.slug);
  return (
    <Link
      href={`/tjenester/${service.slug}`}
      className="group relative flex overflow-hidden rounded-card-lg border border-line-strong bg-surface transition-[border-color,transform] duration-200 ease-standard hover:border-navy hz:flex-col hz:hover:-translate-y-0.5"
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-surface-sunken max-hz:w-[116px] hz:w-full ${
          tall ? "hz:aspect-[4/5]" : "hz:aspect-[4/3]"
        }`}
      >
        <Image
          src={image.hero}
          alt={service.name}
          fill
          preload={preload}
          sizes="(min-width: 900px) 380px, 116px"
          className="object-cover transition-transform duration-[380ms] ease-standard group-hover:scale-[1.03]"
        />
      </div>
      {flag && (
        <span className="absolute left-2 top-2 hz:left-3 hz:top-3">
          <Tag variant="red">{flag}</Tag>
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1 px-3.5 py-3 hz:gap-2 hz:px-5 hz:pb-5 hz:pt-[18px]">
        <p className="font-heading text-[11px] font-semibold uppercase tracking-[.14em] text-body-soft hz:text-[11.5px] hz:tracking-[.16em]">
          {service.category} · ca. {formatDuration(service.durationMin)}
        </p>
        <h3 className="font-heading text-[17px] font-semibold leading-[1.2] text-ink hz:text-[21px] hz:leading-[1.25]">
          {service.name}
        </h3>
        <p className="line-clamp-2 text-[14px] leading-[1.45] text-body-soft hz:line-clamp-none hz:text-[14.5px] hz:leading-[1.5]">
          {service.description}
        </p>
        {service.guarantee && (
          <span className="self-start max-hz:hidden">
            <Tag>{service.guarantee}</Tag>
          </span>
        )}
        <div className="mt-auto flex items-baseline justify-between gap-2.5 pt-2 hz:border-t hz:border-line hz:pt-3.5">
          <Price ore={service.priceOre} from sizeClass="text-[19px] hz:text-[22px]" />
          <span className="font-heading text-[11px] font-semibold uppercase tracking-[.14em] text-navy hz:text-[11.5px] hz:text-body-soft">
            Se mer →
          </span>
        </div>
      </div>
    </Link>
  );
}
