"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ServiceTile } from "@/components/site/ServiceTile";
import { serviceCategories, services } from "@/lib/mock-data";

/**
 * Tjenestekatalogen (SCREENS.md § Tjenester): filterbar med kategori-chips og
 * sortering, antallslinje med `aria-live`, deretter grid av ServiceTile.
 *
 * ## Mobilbudsjettet i denne baren
 *
 * Baren har vært gjennom to runder. Først tok sorteringen en egen full rad
 * (~123px); nå deler chips og sortering én rad, med sorteringen som en 44×44
 * ikonkontroll som ikke krymper.
 *
 * Chipene brakk deretter fra rullestrimmel til flere rader — som strimmel var
 * raden 726px bred i et 221px vindu, og fem av sju kategorier ble aldri
 * oppdaget. Prisen er at baren blir ~165px høy på mobil, og derfor er den
 * IKKE festet der: 165 + 61px header er 27 % av skjermen permanent opptatt av
 * et valg man tar én gang. Fra 900px får alt plass på én rad, og da fester den
 * seg under headeren (79px).
 */
const sortOptions = ["Populær", "Pris lav–høy", "Pris høy–lav"] as const;
type Sort = (typeof sortOptions)[number];

export function ServiceCatalog({ initialCategory }: { initialCategory: string | null }) {
  const categories = useMemo(() => serviceCategories(), []);
  const [category, setCategory] = useState<string | null>(
    categories.some((item) => item.label === initialCategory) ? initialCategory : null,
  );
  const [sort, setSort] = useState<Sort>("Populær");
  const listRef = useRef<HTMLElement>(null);

  const list = useMemo(() => {
    const filtered = category
      ? services.filter((service) => service.category === category)
      : services;
    return [...filtered].sort((a, b) => {
      if (sort === "Pris lav–høy") return a.priceOre - b.priceOre;
      if (sort === "Pris høy–lav") return b.priceOre - a.priceOre;
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
  }, [category, sort]);

  /**
   * Ett trykk på en chip gjør to ting utover å filtrere:
   *
   * 1. **Speiler valget i URL-en.** `history.replaceState` er Next-dokumentert
   *    (docs § Native History API) og oppdaterer ruteren uten å utløse en
   *    navigasjon — ingen server-runde, ingen scroll-reset. Da overlever
   *    utvalget en deling, en oppdatering og tilbake-gesten fra en tjenesteside.
   * 2. **Henter blikket tilbake til toppen av lista.** Filtrering kan korte
   *    dokumentet fra 18 til 3 kort. Står man langt nede når man trykker — og
   *    det gjør man, baren er sticky — blir siden kortere enn scrollposisjonen
   *    og nettleseren dumper deg i footeren. Vi hopper bare når lista allerede
   *    har rullet ut av syne, ellers ville et trykk øverst gitt et unødig rykk.
   */
  function selectCategory(next: string | null) {
    setCategory(next);
    window.history.replaceState(
      null,
      "",
      next ? `/tjenester?kategori=${encodeURIComponent(next)}` : "/tjenester",
    );
    const listSection = listRef.current;
    if (listSection && listSection.getBoundingClientRect().top < 0) {
      listSection.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  return (
    <>
      {/* IKKE festet på mobil. Med brekkende chips blir baren tre rader
          (~165px), og festet til toppen sammen med headerens 61px ville et
          filter man setter én gang okkupert 27 % av skjermen permanent. Nå
          ruller den bort, og alle sju kategoriene er synlige mens man velger.
          Fra 900px er det plass til én rad, og da er den festet — der er også
          uskarpheten på: backdrop-filter på en sticky flate må resamples hver
          eneste frame under rulling, og det er en desktop-luksus. */}
      <div className="static z-30 flex items-center gap-2.5 border-b border-line bg-surface px-[clamp(16px,4vw,64px)] py-2 hz:sticky hz:top-[79px] hz:gap-4 hz:bg-surface/95 hz:py-3 hz:backdrop-blur-[12px]">
        {/* Chipene BREKKER linje. Som rullestrimmel var raden 726px bred i et
            221px vindu — man så «Alle» og halve «Bilvask», og de fem andre
            kategoriene ble i praksis aldri oppdaget uansett hvor tydelig
            kantmasken var. To rader koster 46px sticky chrome; fem skjulte
            kategorier koster salg. */}
        <div
          className="flex min-w-0 flex-1 flex-wrap gap-2 py-0.5"
          role="group"
          aria-label="Filtrer på kategori"
        >
          <Chip active={category === null} onClick={() => selectCategory(null)}>
            Alle
          </Chip>
          {categories.map((item) => (
            <Chip
              key={item.label}
              active={category === item.label}
              count={item.count}
              onClick={() => selectCategory(item.label)}
            >
              {item.label}
            </Chip>
          ))}
        </div>

        {/* Sortering er en sjelden handling og skal ikke betale husleie i full
            bredde på hver skjerm. Under 900px er kontrollen 44×44 med ikon —
            hvilken sortering som gjelder står i antallslinja rett under, og
            kanten blir navy når den er noe annet enn standard. Den native
            <select>-en ligger usynlig oppå og håndterer interaksjonen (iOS får
            sitt eget hjul); fokusringen speiles derfor med `peer-focus-visible`
            på den synlige flaten. */}
        <span className="relative shrink-0">
          <select
            aria-label="Sortering"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-control text-[16px] opacity-0"
          >
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <span
            aria-hidden
            className={[
              "flex h-11 w-11 items-center justify-center gap-1.5 rounded-control border",
              "font-heading text-[13.5px] font-semibold hz:h-[38px] hz:w-auto hz:px-3.5",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-navy",
              sort === "Populær" ? "border-line-strong text-body" : "border-navy text-navy",
            ].join(" ")}
          >
            <ArrowUpDown aria-hidden className="size-[17px] shrink-0" strokeWidth={1.75} />
            <span className="max-hz:hidden">{sort}</span>
            <ChevronDown aria-hidden className="size-4 shrink-0 max-hz:hidden" strokeWidth={2} />
          </span>
        </span>
      </div>

      {/* `scroll-mt` = header + filterbar, så `scrollIntoView` over legger
          lista rett under de to sticky flatene i stedet for bak dem. */}
      <section
        ref={listRef}
        className="scroll-mt-[72px] px-[clamp(16px,4vw,64px)] pb-[clamp(30px,5vw,76px)] pt-4 hz:scroll-mt-[148px] hz:pt-[22px]"
      >
        <p aria-live="polite" className="mb-3 text-[13.5px] text-body-soft hz:mb-4">
          {/* Krysstoningen ligger på TEKSTEN, ikke på gridet. Selve
              live-regionen beholder identitet, ellers mister skjermlesere
              annonseringen når innholdet byttes. */}
          <span key={`${category ?? "alle"}|${sort}`} className="hz-xfade">
            Viser {list.length} {list.length === 1 ? "tjeneste" : "tjenester"}
            {category ? ` i ${category}` : ""}
            {sort === "Populær" ? "" : ` · ${sort}`}.
          </span>
        </p>
        {/* Ingen `key` på gridet. Med `key={category}` ble alle 18 next/image-
            noder demontert og dekodet på nytt ved hvert chip-trykk. Nå gjenbruker
            React kortene på `service.id`, og bare de som faktisk faller ut av
            utvalget forsvinner (MOTION.md § Kategorifilteret: ingen stagger). */}
        <div className="grid grid-cols-1 gap-3 hz:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] hz:gap-4">
          {list.map((service) => (
            <ServiceTile
              key={service.id}
              service={service}
              flag={service.popular ? "Populær" : undefined}
            />
          ))}
        </div>

        {/* Lukker lista med veien videre. Fra katalogen er korteste vei til
            booking ellers to navigeringer (kort → tjenesteside → booking);
            her sier vi rett ut at tjenesten kan velges inne i bookingen, og
            fjerner den vanligste bremsen: usikkerhet om pris og binding. */}
        <div className="mt-5 flex flex-col items-start gap-3.5 rounded-card-lg border border-line bg-surface-alt px-4 py-4 hz:mt-9 hz:flex-row hz:items-center hz:justify-between hz:gap-8 hz:px-7 hz:py-6">
          <div className="min-w-0">
            <p className="font-heading text-[17px] font-semibold leading-[1.25] text-ink hz:text-[21px]">
              Usikker på hva bilen trenger?
            </p>
            <p className="mt-1.5 max-w-[52ch] text-[14px] leading-[1.45] text-body-soft hz:text-[15.5px] hz:leading-[1.5]">
              Du velger tjeneste underveis i bookingen og ser fast pris og ledig tid før du
              bekrefter. Gratis avbestilling inntil 24 timer før.
            </p>
          </div>
          <ButtonLink href="/booking" size="lg" className="max-hz:w-full">
            Bestill time
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
