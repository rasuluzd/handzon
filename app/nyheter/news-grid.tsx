"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tag } from "@/components/ui/Tag";
import {
  BLOG_CATEGORIES,
  formatPostDate,
  formatPostDateShort,
  readingMinutes,
} from "@/lib/blog";
import type { BlogCategory, BlogPost } from "@/lib/blog";

/**
 * Nyhetslisten. Innholdet redigeres i bloggverktøyet i adminpanelet — bare
 * publiserte innlegg når hit.
 *
 * Kortet har to former, samme mønster som `components/site/ServiceTile`:
 *
 *  - **Under 900px: radkort.** 104px foto til venstre, meta, tittel og
 *    ingress til høyre. Mediekortet med 16:9-foto over full bredde ble ~400px
 *    høyt, og elleve innlegg ga 4 580px — 5,4 skjermhøyder der halvparten var
 *    dekorativt foto. Radformen gir ~130px per innlegg og hele listen på
 *    ~1 500px.
 *  - **Fra 900px: mediekort.** Foto på topp i 16:9, som før.
 */
export function NewsGrid({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState<BlogCategory | null>(null);
  const shown = active ? posts.filter((post) => post.category === active) : posts;

  return (
    <div>
      {/* Filterraden brekker linje i stedet for å rulle. I en horisontal
          strimmel med skjult scrollbar lå «Bak kulissene» utenfor kanten uten
          noen antydning om at den fantes — og filteret er det eneste
          navigasjonsverktøyet i listen. To rader à 44px viser alle fire. */}
      <div
        role="group"
        aria-label="Filtrer innlegg"
        className="flex flex-wrap gap-2 py-0.5"
      >
        <Chip active={active === null} onClick={() => setActive(null)}>
          Alle
        </Chip>
        {BLOG_CATEGORIES.filter((category) =>
          posts.some((post) => post.category === category),
        ).map((category) => (
          <Chip
            key={category}
            active={active === category}
            count={posts.filter((post) => post.category === category).length}
            onClick={() => setActive(category)}
          >
            {category}
          </Chip>
        ))}
      </div>
      <p aria-live="polite" className="mb-3 mt-3 text-[13px] text-body-soft hz:mb-4 hz:mt-3.5">
        Viser {shown.length} innlegg{active ? ` i ${active}` : ""}.
      </p>

      {shown.length === 0 ? (
        <EmptyState
          icon={<Newspaper aria-hidden className="size-10" strokeWidth={1.75} />}
          title="Ingen innlegg i denne kategorien"
          text="Prøv en annen kategori — vi publiserer nytt hver måned."
        />
      ) : (
        /* Ingen `key` på griddet og ingen kryssfade: et bytte av nøkkel rev ned
           og monterte alle kortene på nytt, så inntil elleve next/image-felt ble
           dekodet om igjen samtidig som en opacity-animasjon gikk over hele
           viewporten. Nå gjenbruker React kortene som blir stående. */
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 max-hz:grid-cols-1 max-hz:gap-2.5">
          {shown.map((post) => (
            <Link
              key={post.slug}
              href={`/nyheter/${post.slug}`}
              className="group flex overflow-hidden rounded-card-lg border border-line-strong bg-surface transition-[border-color,transform,box-shadow] duration-200 ease-standard hover:border-navy hz:flex-col hz:shadow-card hz:hover:-translate-y-0.5 hz:hover:shadow-card-hover"
            >
              {/* `sizes` følger den faktiske bredden i begge former. Med 100vw
                  hentet mobilen 1200px-varianten til et 104px felt — elleve
                  dekodinger av fullskjermbilder mens brukeren ruller. */}
              <div className="relative shrink-0 overflow-hidden bg-surface-sunken max-hz:w-[104px] hz:aspect-[16/9] hz:w-full">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 380px, 104px"
                  className="object-cover transition-transform duration-[380ms] ease-standard hz:group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col px-3.5 py-3 hz:p-5">
                {/* Tag-boksen koster 18px sidepadding og versaler i 11,5px. På
                    en 224px bred tekstkolonne dyttet «BILPLEIE-GUIDEN» pluss
                    full dato metaraden til to linjer, så under 900px står
                    kategorien som ren eyebrow og datoen i kortform. */}
                <div className="mb-1 flex items-center gap-2 hz:mb-2 hz:gap-2.5">
                  <span className="max-hz:hidden">
                    <Tag variant="mute">{post.category}</Tag>
                  </span>
                  <span className="truncate font-heading text-[11px] font-semibold uppercase tracking-[.12em] text-body-soft hz:hidden">
                    {post.category}
                  </span>
                  <time
                    dateTime={post.date}
                    className="shrink-0 tabular text-[12px] text-body-soft hz:text-[13px]"
                  >
                    <span className="hz:hidden">{formatPostDateShort(post.date)}</span>
                    <span className="max-hz:hidden">{formatPostDate(post.date)}</span>
                  </time>
                </div>
                <h2 className="line-clamp-2 font-heading text-[16.5px] font-semibold leading-[1.28] text-ink group-hover:text-navy hz:text-[18px] hz:leading-[1.3]">
                  {post.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-[13.5px] leading-[1.4] text-body-soft hz:mt-2 hz:text-[14.5px] hz:leading-[1.5]">
                  {post.excerpt}
                </p>
                <span className="mt-auto pt-3 font-heading text-[11.5px] font-semibold uppercase tracking-[.14em] text-body-soft max-hz:hidden">
                  Les hele saken → {readingMinutes(post.body)} min
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
