import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Section, SectionHead } from "@/components/site/Section";
import { ratingAverage, ratingSources, ratingTotal, reviews } from "@/lib/reviews";
import type { Review } from "@/lib/types";

/**
 * Sosialt bevis (COMPONENTS.md § Sosialt bevis): navy ratingkort + anmeldelser.
 * Stjernene bruker cyan-on-navy — ikke --color-cyan, som bare gir 4,08:1 på navy.
 */
export function SocialProof({
  heading = "Det kundene sier",
  items = reviews,
}: {
  heading?: string;
  items?: Review[];
}) {
  return (
    <Section alt>
      <SectionHead title={heading} moreHref="/nyheter" moreLabel="Les gjesteboka →" />
      <div className="grid items-start gap-3 hz:grid-cols-[320px_1fr] hz:gap-4">
        {/* På mobil ligger tallet og stjernene på én rad i stedet for stablet:
            64px sifre over 5 punkter under hverandre er 322px snittkort før
            den første anmeldelsen i det hele tatt begynner. */}
        <div className="on-dark rounded-card-lg bg-navy p-4 hz:p-7">
          <div className="flex items-center gap-4 hz:block">
            <p className="font-heading text-[44px] font-bold leading-[.92] tabular text-white hz:text-[64px]">
              {ratingAverage}
            </p>
            <div className="min-w-0">
              <p
                aria-hidden
                className="text-[16px] tracking-[.22em] text-cyan-on-navy hz:mt-2.5 hz:text-[18px]"
              >
                ★★★★★
              </p>
              <p className="mt-1 text-[13.5px] leading-[1.45] text-on-navy hz:mt-3.5 hz:text-[14.5px] hz:leading-[1.55]">
                {ratingTotal} vurderinger fra Google, Trustpilot og gjesteboka vår.
              </p>
            </div>
          </div>
          <dl className="mt-3.5 flex flex-col gap-2 border-t border-on-navy-hair pt-3 text-[13px] text-on-navy-soft hz:mt-[22px] hz:gap-2.5 hz:pt-4 hz:text-[13.5px]">
            {ratingSources.map((source) => (
              <div key={source.name} className="flex justify-between gap-3 tabular">
                <dt>{source.name}</dt>
                <dd>
                  {source.score} · {source.count}
                </dd>
              </div>
            ))}
          </dl>

          {/* Seksjonen hadde ingen handling. Her står leseren på sitt mest
              overbeviste — 4,8 av 5 fra 1 200 vurderinger — og hadde
              ingenting å trykke på før footeren. */}
          <ButtonLink href="/booking" variant="onNavy" block className="mt-4 hz:hidden">
            Bestill time
          </ButtonLink>
        </div>

        <div className="grid content-start gap-3 hz:grid-cols-2 hz:gap-4">
          {items.map((review, index) => (
            /* To anmeldelser holder på mobil. Fire à ~200px er 848px sosialt
               bevis — det overbeviser ingen som allerede har rullet forbi. */
            <Card
              key={review.name}
              className={`!p-4 hz:!p-[22px] ${index >= 2 ? "max-hz:hidden" : ""}`}
            >
              <div className="mb-2.5 flex items-center gap-[11px] hz:mb-3">
                <span
                  aria-hidden
                  className="grid size-[38px] shrink-0 place-items-center rounded-full font-heading text-[14px] font-bold text-white"
                  style={{ background: review.color }}
                >
                  {review.initials}
                </span>
                <div>
                  <p className="font-heading text-[15px] font-semibold text-ink">
                    {review.name}
                  </p>
                  <p className="mt-px text-[12.5px] text-body-soft">{review.where}</p>
                </div>
              </div>
              <blockquote className="text-[15px] leading-[1.55] text-body">
                «{review.quote}»
              </blockquote>
              <span className="mt-3 inline-flex">
                <Tag variant="out">{review.service}</Tag>
              </span>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
