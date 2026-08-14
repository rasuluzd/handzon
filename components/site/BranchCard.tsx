import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { OpenStatus } from "@/components/site/OpenStatus";
import { formatDistance } from "@/lib/geo";
import { formatWeekSummary } from "@/lib/opening-hours";
import type { Location } from "@/lib/types";

/**
 * Avdelingskortet (COMPONENTS.md § BranchCard). Flat på forsiden og i booking
 * steg 1, elevated på avdelingsoversikten. Avstand vises kun ved geolokalisering.
 */
export function BranchCard({
  location,
  distanceKm,
  elevated,
  active,
  showHours = true,
  onMouseEnter,
  className,
}: {
  location: Location;
  distanceKm?: number;
  elevated?: boolean;
  active?: boolean;
  showHours?: boolean;
  onMouseEnter?: () => void;
  className?: string;
}) {
  return (
    <Card
      elevated={elevated}
      onMouseEnter={onMouseEnter}
      className={[active ? "border-navy" : "", className].filter(Boolean).join(" ") || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading text-[17px] font-semibold leading-tight text-ink hz:text-[18px]">
            Handz On {location.name}
          </p>
          <p className="mt-1 text-[13.5px] leading-[1.4] text-body-soft hz:text-[14px]">
            {location.center} · {location.address}, {location.postalCode} {location.city}
          </p>
        </div>
        {distanceKm !== undefined && (
          <span className="shrink-0 font-heading text-[14px] font-semibold tabular text-navy">
            {formatDistance(distanceKm)}
          </span>
        )}
      </div>

      {/* Fast minstehøyde: «Åpen nå» finnes ikke i server-HTML-en (OpenStatus
          leser klokka etter hydrering), så uten den hoppet hele kortstabelen
          nedover idet statusene dukket opp. */}
      <div className="mt-2.5 flex min-h-[26px] flex-wrap items-center gap-2">
        <OpenStatus hours={location.openingHours} />
        {location.campaign && (
          <Tag className="whitespace-normal text-left">{location.campaign}</Tag>
        )}
      </div>

      {showHours && (
        <p className="mt-2.5 border-t border-line pt-2.5 text-[13px] leading-[1.5] tabular text-body-soft hz:text-[13.5px]">
          {formatWeekSummary(location.openingHours)}
        </p>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <ButtonLink href={`/booking?avdeling=${location.slug}`} size="sm">
          Book her
        </ButtonLink>
        <ButtonLink href={`/avdelinger/${location.slug}`} variant="ghost" size="sm">
          Se avdelingen →
        </ButtonLink>
      </div>
    </Card>
  );
}
