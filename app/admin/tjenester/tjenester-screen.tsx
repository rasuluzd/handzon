"use client";

import { useState } from "react";
import Image from "next/image";
import { Info, Search, Sparkles } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { BranchPicker, Top } from "@/components/admin/Top";
import {
  AdButton,
  AdCard,
  AdEmpty,
  AdField,
  AdNote,
  AdSectionTitle,
  AdSwitch,
  AdTable,
  AdTag,
  adInput,
  adMeta,
  adName,
  adNum,
  adNumber,
  adSelect,
  adTd,
  adTextarea,
  adTh,
} from "@/components/admin/ui";
import { formatDuration, formatKr } from "@/lib/format";
import { locations, serviceCategories } from "@/lib/mock-data";
import type { ServiceCategory } from "@/lib/types";
import { AdminBody } from "../admin-shell";
import {
  countDirty,
  isDirty,
  locationLabel,
  priceForLocation,
  publishedSnapshot,
  useAdmin,
} from "../admin-context";
import type { AdminService } from "../admin-context";

/** Mediebiblioteket: miniatyrene som ligger i /public. */
const PHOTOS = [
  "/tjenester/utvendig-handvask-thumb.webp",
  "/tjenester/utvendig-vask-og-voks-thumb.webp",
  "/tjenester/innvendig-rens-thumb.webp",
  "/tjenester/polering-thumb.webp",
  "/tjenester/keramisk-coating-thumb.webp",
  "/tjenester/komplett-bilpleie-thumb.webp",
  "/tjenester/lyktesliping-thumb.webp",
  "/tjenester/motorvask-thumb.webp",
  "/hero-hjulskift.webp",
];

const CATEGORIES = serviceCategories().map((item) => item.label as ServiceCategory);

/**
 * Tjenester og priser (ADMIN.md § 5). Kjedeprisen er standard for alle 14
 * avdelinger; velg en avdeling i toppen for å sette lokalpris. Endringer lagres
 * som utkast og treffer ikke kunden før de publiseres.
 */
export function TjenesterScreen() {
  const { loc, setLoc, services, setServices, setMenuOpen, toast } = useAdmin();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("alle");
  const [draft, setDraft] = useState<AdminService | null>(null);

  const label = locationLabel(loc, "Kjedepris (standard)");
  const dirty = countDirty(services);

  const term = query.trim().toLowerCase();
  const shown = services
    .filter((service) => category === "alle" || service.category === category)
    .filter((service) =>
      term
        ? `${service.name} ${service.category} ${service.description}`
            .toLowerCase()
            .includes(term)
        : true,
    );

  function save() {
    if (!draft) return;
    const saved: AdminService = { ...draft, isNew: undefined };
    setServices((previous) =>
      previous.some((service) => service.id === saved.id)
        ? previous.map((service) => (service.id === saved.id ? saved : service))
        : [...previous, saved],
    );
    toast({
      title: "Tjenesten er lagret",
      text: isDirty(saved)
        ? `${draft.name} — endringen ligger som utkast til du publiserer.`
        : `${draft.name} er tilbake slik den ligger publisert.`,
    });
    setDraft(null);
  }

  function toggleActive(service: AdminService, active: boolean) {
    setServices((previous) =>
      previous.map((item) => (item.id === service.id ? { ...item, active } : item)),
    );
    toast({
      variant: "info",
      title: active ? "Tjenesten er aktivert" : "Tjenesten er skjult",
      text: active
        ? `${service.name} kan bookes igjen.`
        : `${service.name} vises ikke i bookingen før den aktiveres.`,
    });
  }

  function addNew() {
    setDraft({
      id: `ny-tjeneste-${services.length + 1}`,
      slug: "",
      name: "",
      category: "Bilvask",
      description: "",
      priceOre: 0,
      durationMin: 30,
      level: "",
      guarantee: "",
      image: PHOTOS[0],
      active: false,
      popular: false,
      isNew: true,
      // Aldri publisert — teller som en upublisert endring fram til publisering.
      published: null,
      localPricesOre: {},
      sold30: 0,
    });
  }

  function remove() {
    if (!draft) return;
    setServices((previous) => previous.filter((service) => service.id !== draft.id));
    toast({
      variant: "info",
      title: "Tjenesten er fjernet",
      text: `${draft.name || "Ny tjeneste"} er tatt ut av katalogen.`,
    });
    setDraft(null);
  }

  function publishAll() {
    setServices((previous) =>
      previous.map((service) => ({ ...service, published: publishedSnapshot(service) })),
    );
    toast({
      title: `${dirty} ${dirty === 1 ? "endring" : "endringer"} publisert`,
      text: "Prisene er nå live på handzon.no og i bookingflyten.",
    });
  }

  return (
    <>
      <Top
        title="Tjenester og priser"
        sub={`${services.length} tjenester i katalogen · ${label}`}
        onBurger={() => setMenuOpen(true)}
        right={
          <>
            <BranchPicker value={loc} onChange={setLoc} allLabel="Kjedepris (standard)" />
            {dirty > 0 && (
              <AdButton variant="secondary" onClick={publishAll}>
                Publiser {dirty} {dirty === 1 ? "endring" : "endringer"}
              </AdButton>
            )}
            <AdButton onClick={addNew}>
              <Sparkles aria-hidden className="size-4" strokeWidth={1.75} />
              Ny tjeneste
            </AdButton>
          </>
        }
      />

      <AdminBody>
        {dirty > 0 && (
          <div className="flex flex-wrap items-center gap-3.5 rounded-card-lg border border-status-closed bg-status-closed-bg px-[18px] py-3.5">
            <Info aria-hidden className="size-5 shrink-0 text-status-closed" strokeWidth={1.75} />
            <div className="min-w-0">
              <p className="font-heading text-[15px] font-semibold text-ink">
                {dirty} {dirty === 1 ? "endring" : "endringer"} er ikke publisert
              </p>
              <AdNote className="mt-0.5">
                Endringene er lagret som utkast. De vises ikke for kunden før du publiserer.
              </AdNote>
            </div>
            <AdButton className="ml-auto" onClick={publishAll}>
              Publiser nå
            </AdButton>
          </div>
        )}

        <AdCard className="!flex !flex-wrap !items-center !gap-3 !p-3.5">
          <label className="relative block min-w-[220px] flex-1">
            <span className="sr-only">Søk i tjenester</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-[17px] -translate-y-1/2 text-body-soft"
              strokeWidth={2}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Søk i tjenestenavn eller beskrivelse"
              className={`${adInput} pl-[38px]`}
            />
          </label>
          <select
            aria-label="Kategori"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={adSelect}
          >
            <option value="alle">Alle kategorier</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </AdCard>

        {shown.length === 0 ? (
          <AdEmpty
            title="Ingen tjenester traff søket"
            text="Prøv et annet ord, eller nullstill kategorifilteret."
            action={
              <AdButton
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("alle");
                }}
              >
                Vis alle tjenester
              </AdButton>
            }
          />
        ) : (
          <AdCard flush>
            <AdTable>
              <thead>
                <tr>
                  {/* Under 760px står bare tjenesten og handlingene. Kategori,
                      varighet, pris, salgstall og status er flyttet ned i
                      tjenestecellen — sju kolonner gjorde tabellen 957px bred
                      i et 324px vindu, altså tre skjermbredder sidelengs. */}
                  <th className={adTh}>Tjeneste</th>
                  <th className={`${adTh} max-admin-sm:hidden`}>Kategori</th>
                  <th className={`${adTh} text-right max-admin-sm:hidden`}>Varighet</th>
                  <th className={`${adTh} text-right max-admin-sm:hidden`}>
                    {loc === "alle" ? "Kjedepris" : "Pris her"}
                  </th>
                  <th className={`${adTh} text-right max-admin-sm:hidden`}>Solgt 30 d.</th>
                  <th className={`${adTh} max-admin-sm:hidden`}>Status</th>
                  <th className={`${adTh} text-right`} />
                </tr>
              </thead>
              <tbody>
                {shown.map((service) => {
                  const local = loc !== "alle" ? service.localPricesOre[loc] : undefined;
                  const effective = priceForLocation(service, loc);
                  return (
                    <tr key={service.id}>
                      <td className={adTd}>
                        <div className="flex items-center gap-3">
                          {/* Bildet er desktop-only: 44px + 12px luft er en
                              fjerdedel av tekstbredden på en telefon, og det
                              sier ingenting man ikke leser i navnet. */}
                          <Image
                            src={service.image}
                            alt=""
                            width={44}
                            height={44}
                            className="size-11 shrink-0 rounded-control object-cover max-admin-sm:hidden"
                          />
                          <div className="min-w-0">
                            <p className={adName}>{service.name || "Uten navn"}</p>
                            {/* `truncate` setter `white-space: nowrap`, så uten
                                en definert maksbredde blir cellens min-content
                                hele setningen — det var det som holdt tabellen
                                957px bred. */}
                            <p
                              className={`${adMeta} max-w-[42ch] truncate max-admin-sm:max-w-[170px]`}
                            >
                              {service.description || "Ingen beskrivelse"}
                            </p>
                            {/* Det de skjulte kolonnene bar. */}
                            <span className="mt-1 block text-[12.5px] leading-[1.4] text-body-soft admin-sm:hidden">
                              {service.category} · {formatDuration(service.durationMin)} ·{" "}
                              <span className="font-heading font-semibold tabular text-ink">
                                {effective === null ? "Ikke tilbudt" : formatKr(effective)}
                              </span>
                              {" · "}
                              {service.sold30} solgt
                            </span>
                            <span className="mt-1.5 flex flex-wrap gap-1.5 admin-sm:hidden">
                              {service.active ? (
                                <AdTag variant="ok" dot>
                                  Aktiv
                                </AdTag>
                              ) : (
                                <AdTag variant="off">Skjult</AdTag>
                              )}
                              {isDirty(service) && <AdTag variant="warn">Utkast</AdTag>}
                              {local != null && local !== 0 && <AdTag>Lokalpris</AdTag>}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={`${adTd} max-admin-sm:hidden`}>{service.category}</td>
                      <td className={`${adTd} ${adNum} max-admin-sm:hidden`}>
                        {formatDuration(service.durationMin)}
                      </td>
                      <td className={`${adTd} ${adNum} max-admin-sm:hidden`}>
                        {effective === null ? (
                          <span className="text-body-soft">Ikke tilbudt</span>
                        ) : local != null && local !== service.priceOre ? (
                          <>
                            <span className="block">{formatKr(effective)}</span>
                            <s className={`${adMeta} block font-normal`}>
                              {formatKr(service.priceOre)}
                            </s>
                          </>
                        ) : (
                          formatKr(effective)
                        )}
                      </td>
                      <td className={`${adTd} ${adNum} max-admin-sm:hidden`}>
                        {service.sold30}
                      </td>
                      <td className={`${adTd} max-admin-sm:hidden`}>
                        <div className="flex flex-wrap gap-1.5">
                          {service.active ? (
                            <AdTag variant="ok" dot>
                              Aktiv
                            </AdTag>
                          ) : (
                            <AdTag variant="off">Skjult</AdTag>
                          )}
                          {isDirty(service) && <AdTag variant="warn">Utkast</AdTag>}
                          {local != null && local !== 0 && <AdTag>Lokalpris</AdTag>}
                          {service.guarantee && <AdTag>{service.guarantee}</AdTag>}
                        </div>
                      </td>
                      <td
                        className={`${adTd} whitespace-nowrap align-top text-right admin-sm:align-middle`}
                      >
                        <div className="inline-flex items-center gap-2 max-admin-sm:flex-col max-admin-sm:items-end">
                          <AdSwitch
                            id={`aktiv-${service.id}`}
                            checked={service.active}
                            onChange={(value) => toggleActive(service, value)}
                          />
                          <AdButton
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              setDraft({
                                ...service,
                                localPricesOre: { ...service.localPricesOre },
                              })
                            }
                          >
                            Rediger
                          </AdButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </AdTable>
          </AdCard>
        )}

        <AdNote>
          Kjedeprisen er standard for alle 14 avdelinger. Velg en avdeling øverst for å sette
          lokalpris — den overstyrer kjedeprisen bare der. Tjenester uten lokalpris følger
          kjedeprisen automatisk.
        </AdNote>
      </AdminBody>

      {draft && (
        <Panel
          title={draft.isNew ? "Ny tjeneste" : draft.name}
          sub={
            draft.isNew
              ? "Fyll ut, aktiver, og publiser når du er klar."
              : `${draft.category} · ${formatDuration(draft.durationMin)} · ${formatKr(draft.priceOre)}`
          }
          onClose={() => setDraft(null)}
          foot={
            <>
              <AdButton variant="danger" size="sm" onClick={remove}>
                Slett tjenesten
              </AdButton>
              <AdButton variant="secondary" onClick={() => setDraft(null)}>
                Avbryt
              </AdButton>
              <AdButton
                className="ml-auto"
                onClick={save}
                disabled={!draft.name.trim() || !draft.priceOre}
              >
                Lagre
              </AdButton>
            </>
          }
        >
          <AdField
            label="Navn"
            htmlFor="t-navn"
            help="Skriv som i katalogen: «Vask ut-/innvendig – Premium»."
          >
            <input
              id="t-navn"
              className={adInput}
              value={draft.name}
              placeholder="Vask utvendig – Premium"
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            />
          </AdField>

          <AdField label="Kategori" htmlFor="t-kat" className="mt-4">
            <select
              id="t-kat"
              className={`${adSelect} w-full`}
              value={draft.category}
              onChange={(event) =>
                setDraft({ ...draft, category: event.target.value as ServiceCategory })
              }
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </AdField>

          <AdField
            label="Beskrivelse"
            htmlFor="t-desc"
            help="To linjer maks. Konkret om hva som gjøres — ikke salgsspråk."
            className="mt-4"
          >
            <textarea
              id="t-desc"
              className={`${adTextarea} min-h-[90px]`}
              value={draft.description}
              placeholder="Grundig håndvask med to-bøtte-metode, felgvask og skånsom tørk – uten svirvelmerker."
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            />
          </AdField>

          <div className="mt-4 grid gap-3.5 admin-sm:grid-cols-2">
            <AdField label="Kjedepris (kr inkl. mva)" htmlFor="t-pris">
              <input
                id="t-pris"
                type="number"
                min={0}
                step={10}
                className={adNumber}
                value={draft.priceOre ? Math.round(draft.priceOre / 100) : ""}
                onChange={(event) =>
                  setDraft({ ...draft, priceOre: Number(event.target.value) * 100 })
                }
              />
            </AdField>
            <AdField
              label="Varighet (minutter)"
              htmlFor="t-min"
              help={formatDuration(draft.durationMin)}
            >
              <input
                id="t-min"
                type="number"
                min={10}
                step={5}
                className={adNumber}
                value={draft.durationMin}
                onChange={(event) =>
                  setDraft({ ...draft, durationMin: Number(event.target.value) })
                }
              />
            </AdField>
          </div>

          <div className="mt-4 grid gap-3.5 admin-sm:grid-cols-2">
            <AdField label="Nivå" htmlFor="t-niv" help="Basic, Premium eller Pro. Kan stå tomt.">
              <input
                id="t-niv"
                className={adInput}
                value={draft.level}
                placeholder="Premium"
                onChange={(event) => setDraft({ ...draft, level: event.target.value })}
              />
            </AdField>
            <AdField
              label="Garanti"
              htmlFor="t-gar"
              help="Vises som merkelapp. F.eks. «6 års garanti»."
            >
              <input
                id="t-gar"
                className={adInput}
                value={draft.guarantee}
                placeholder="6 års garanti"
                onChange={(event) => setDraft({ ...draft, guarantee: event.target.value })}
              />
            </AdField>
          </div>

          <div className="mt-5 border-t border-line pt-[18px]">
            <AdSectionTitle>Bilde</AdSectionTitle>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(78px,1fr))] gap-2">
              {PHOTOS.map((photo) => (
                <button
                  key={photo}
                  type="button"
                  aria-label={photo}
                  onClick={() => setDraft({ ...draft, image: photo })}
                  className={`aspect-[4/3] overflow-hidden rounded-control border-2 ${draft.image === photo ? "border-navy" : "border-transparent"}`}
                >
                  <Image
                    src={photo}
                    alt=""
                    width={120}
                    height={90}
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
            <AdNote className="mt-2">
              Bildene ligger i mediebiblioteket. Nye bilder lastes opp under Innhold.
            </AdNote>
          </div>

          <div className="mt-5 border-t border-line pt-[18px]">
            <AdSectionTitle>Synlighet</AdSectionTitle>
            <div className="flex flex-col gap-3.5">
              <AdSwitch
                id="t-akt"
                checked={draft.active}
                onChange={(value) => setDraft({ ...draft, active: value })}
                label="Kan bookes på nett"
              />
              <AdSwitch
                id="t-pop"
                checked={draft.popular}
                onChange={(value) => setDraft({ ...draft, popular: value })}
                label="Vis under «Populære tjenester» på forsiden"
              />
            </div>
          </div>

          <div className="mt-5 border-t border-line pt-[18px]">
            <AdSectionTitle>Lokalpriser</AdSectionTitle>
            <AdNote className="mb-3">
              Tomt felt betyr at avdelingen følger kjedeprisen {formatKr(draft.priceOre)}. Sett 0
              for å skjule tjenesten i den avdelingen.
            </AdNote>
            <div className="flex flex-col gap-2">
              {locations.map((location) => (
                <div key={location.slug} className="flex items-center gap-3">
                  <span className="flex-1 text-[14.5px] text-body">
                    Handz On {location.name}
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    aria-label={`Lokalpris hos Handz On ${location.name}`}
                    placeholder={String(Math.round(draft.priceOre / 100))}
                    className={`${adNumber} w-[120px]`}
                    value={
                      draft.localPricesOre[location.slug] != null
                        ? Math.round(draft.localPricesOre[location.slug] / 100)
                        : ""
                    }
                    onChange={(event) => {
                      const next = { ...draft.localPricesOre };
                      if (event.target.value === "") delete next[location.slug];
                      else next[location.slug] = Number(event.target.value) * 100;
                      setDraft({ ...draft, localPricesOre: next });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}
    </>
  );
}
