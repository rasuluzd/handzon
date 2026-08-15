"use client";

import { useState } from "react";
import Image from "next/image";
import { Newspaper, Search } from "lucide-react";
import { Panel } from "@/components/admin/Panel";
import { Top } from "@/components/admin/Top";
import {
  AdButton,
  AdCard,
  AdEmpty,
  AdField,
  AdNote,
  AdSectionTitle,
  AdSeg,
  AdTable,
  AdTag,
  adInput,
  adMeta,
  adName,
  adNum,
  adSelect,
  adTd,
  adTextarea,
  adTh,
} from "@/components/admin/ui";
import {
  BLOG_CATEGORIES,
  countWords,
  formatPostDateShort,
  readingMinutes,
  slugify,
} from "@/lib/blog";
import type { BlogCategory } from "@/lib/blog";
import { AdminBody } from "../admin-shell";
import { useAdmin } from "../admin-context";
import type { AdminPost } from "../admin-context";

/** Hovedbilder å velge mellom — mediebiblioteket i /public. */
const PHOTOS = [
  "/tjenester/utvendig-handvask.webp",
  "/tjenester/utvendig-vask-og-voks.webp",
  "/tjenester/innvendig-rens.webp",
  "/tjenester/polering.webp",
  "/tjenester/keramisk-coating.webp",
  "/tjenester/komplett-bilpleie.webp",
  "/om-oss/detaljering.webp",
  "/tjenester/lyktesliping.webp",
  "/hero-hjulskift.webp",
];

const FILTERS: Array<["alle" | "publisert" | "utkast", string]> = [
  ["alle", "Alle"],
  ["publisert", "Publisert"],
  ["utkast", "Utkast"],
];

/** Blogg og nyheter (ADMIN.md § 6). Mater `/nyheter` på nettstedet. */
export function BloggScreen() {
  const { posts, setPosts, setMenuOpen, toast } = useAdmin();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"alle" | "publisert" | "utkast">("alle");
  const [draft, setDraft] = useState<AdminPost | null>(null);
  const [slugLocked, setSlugLocked] = useState(true);

  const term = query.trim().toLowerCase();
  const shown = [...posts]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .filter((post) =>
      filter === "alle" ? true : filter === "publisert" ? post.published : !post.published,
    )
    .filter((post) =>
      term
        ? `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(term)
        : true,
    );

  const drafts = posts.filter((post) => !post.published).length;
  const words = draft ? countWords(draft.body) : 0;

  function addNew() {
    setDraft({
      id: `p${posts.length + 1}`,
      slug: "",
      title: "",
      category: "Bilpleie-guiden",
      author: "Ove Hagen",
      date: new Date().toISOString().slice(0, 10),
      published: false,
      image: PHOTOS[0],
      reads: 0,
      excerpt: "",
      body: "",
      isNew: true,
    });
    setSlugLocked(false);
  }

  function save(publish?: boolean) {
    if (!draft) return;
    const next: AdminPost = {
      ...draft,
      published: publish ?? draft.published,
      isNew: undefined,
    };
    setPosts((previous) =>
      previous.some((post) => post.id === next.id)
        ? previous.map((post) => (post.id === next.id ? next : post))
        : [...previous, next],
    );
    toast(
      publish
        ? {
            title: "Innlegget er publisert",
            text: `«${next.title}» ligger nå på handzon.no/nyheter.`,
          }
        : {
            variant: "info",
            title: "Utkast lagret",
            text: "Innlegget er ikke synlig for kunder ennå.",
          },
    );
    setDraft(null);
  }

  function remove() {
    if (!draft) return;
    setPosts((previous) => previous.filter((post) => post.id !== draft.id));
    toast({
      variant: "info",
      title: "Innlegget er slettet",
      text: `«${draft.title || "Uten tittel"}» er fjernet.`,
    });
    setDraft(null);
  }

  function togglePublished(post: AdminPost) {
    setPosts((previous) =>
      previous.map((item) =>
        item.id === post.id ? { ...item, published: !item.published } : item,
      ),
    );
    toast(
      post.published
        ? {
            variant: "info",
            title: "Innlegget er avpublisert",
            text: `«${post.title}» vises ikke lenger på nettsiden.`,
          }
        : { title: "Innlegget er publisert", text: `«${post.title}» er nå live.` },
    );
  }

  /** Verktøyknappene omslutter markert tekst og setter markøren tilbake. */
  function wrap(before: string, after = "") {
    const field = document.getElementById("b-body") as HTMLTextAreaElement | null;
    if (!field || !draft) return;
    const { selectionStart, selectionEnd, value } = field;
    const next =
      value.slice(0, selectionStart) +
      before +
      value.slice(selectionStart, selectionEnd) +
      after +
      value.slice(selectionEnd);
    setDraft({ ...draft, body: next });
    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(selectionStart + before.length, selectionEnd + before.length);
    });
  }

  return (
    <>
      <Top
        title="Blogg og nyheter"
        sub={`${posts.length} innlegg · ${drafts} utkast`}
        onBurger={() => setMenuOpen(true)}
        right={
          <>
            <AdSeg label="Filter" options={FILTERS} value={filter} onChange={setFilter} />
            <AdButton onClick={addNew}>
              <Newspaper aria-hidden className="size-4" strokeWidth={1.75} />
              Nytt innlegg
            </AdButton>
          </>
        }
      />

      <AdminBody>
        <AdCard className="!p-3.5">
          <label className="relative block">
            <span className="sr-only">Søk i innlegg</span>
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-[17px] -translate-y-1/2 text-body-soft"
              strokeWidth={2}
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Søk i tittel, ingress eller kategori"
              className={`${adInput} pl-[38px]`}
            />
          </label>
        </AdCard>

        {shown.length === 0 ? (
          <AdEmpty
            icon={<Newspaper aria-hidden className="size-9" strokeWidth={1.75} />}
            title="Ingen innlegg her"
            text="Prøv et annet søk, eller skriv et nytt innlegg."
            action={<AdButton onClick={addNew}>Nytt innlegg</AdButton>}
          />
        ) : (
          <AdCard flush>
            <AdTable>
              <thead>
                <tr>
                  {/* Under 760px står bare innlegget og handlingene. Kategori,
                      dato, lesninger og status flyttes ned i innleggscellen. */}
                  <th className={adTh}>Innlegg</th>
                  <th className={`${adTh} max-admin-sm:hidden`}>Kategori</th>
                  <th className={`${adTh} max-admin-sm:hidden`}>Dato</th>
                  <th className={`${adTh} text-right max-admin-sm:hidden`}>Lesninger</th>
                  <th className={`${adTh} max-admin-sm:hidden`}>Status</th>
                  <th className={`${adTh} text-right`} />
                </tr>
              </thead>
              <tbody>
                {shown.map((post) => (
                  <tr key={post.id}>
                    <td className={adTd}>
                      <div className="flex items-center gap-3">
                        <Image
                          src={post.image}
                          alt=""
                          width={44}
                          height={44}
                          className="size-11 shrink-0 rounded-control object-cover max-admin-sm:hidden"
                        />
                        <div className="min-w-0 max-w-[46ch]">
                          <p className={adName}>{post.title || "Uten tittel"}</p>
                          {/* Slug-en er ett langt ord med `nowrap` fra
                              `truncate` — uten maksbredde blir den cellens
                              min-content og sprenger tabellen på mobil. */}
                          <p className={`${adMeta} truncate max-admin-sm:max-w-[170px]`}>
                            /nyheter/{post.slug}
                          </p>
                          {/* Det de skjulte kolonnene bar. */}
                          <span className="mt-1 block text-[12.5px] leading-[1.4] tabular text-body-soft admin-sm:hidden">
                            {post.category} · {formatPostDateShort(post.date)}
                            {post.reads ? ` · ${post.reads.toLocaleString("nb-NO")} lesninger` : ""}
                          </span>
                          <span className="mt-1.5 flex admin-sm:hidden">
                            {post.published ? (
                              <AdTag variant="ok" dot>
                                Publisert
                              </AdTag>
                            ) : (
                              <AdTag variant="warn">Utkast</AdTag>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className={`${adTd} max-admin-sm:hidden`}>{post.category}</td>
                    <td className={`${adTd} tabular max-admin-sm:hidden`}>
                      {formatPostDateShort(post.date)}
                    </td>
                    <td className={`${adTd} ${adNum} max-admin-sm:hidden`}>
                      {post.reads ? post.reads.toLocaleString("nb-NO") : "—"}
                    </td>
                    <td className={`${adTd} max-admin-sm:hidden`}>
                      {post.published ? (
                        <AdTag variant="ok" dot>
                          Publisert
                        </AdTag>
                      ) : (
                        <AdTag variant="warn">Utkast</AdTag>
                      )}
                    </td>
                    <td className={`${adTd} whitespace-nowrap align-top text-right admin-sm:align-middle`}>
                      {/* To knapper side ved side er ~180px — de stables på
                          telefon så innleggstittelen får bredden. */}
                      <div className="inline-flex gap-2 max-admin-sm:flex-col">
                        <AdButton
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublished(post)}
                        >
                          {post.published ? "Avpubliser" : "Publiser"}
                        </AdButton>
                        <AdButton
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setDraft({ ...post });
                            setSlugLocked(true);
                          }}
                        >
                          Rediger
                        </AdButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </AdTable>
          </AdCard>
        )}

        <AdNote>
          Publiserte innlegg havner under «Nyheter» på handzon.no, i kategorien de er merket
          med. Utkast er bare synlige her.
        </AdNote>
      </AdminBody>

      {draft && (
        <Panel
          title={draft.isNew ? "Nytt innlegg" : "Rediger innlegg"}
          sub={
            draft.isNew
              ? "Lagres som utkast til du publiserer."
              : `${draft.category} · ${draft.published ? "publisert" : "utkast"} · ${words} ord`
          }
          onClose={() => setDraft(null)}
          foot={
            <>
              {!draft.isNew && (
                <AdButton variant="danger" size="sm" onClick={remove}>
                  Slett
                </AdButton>
              )}
              <AdButton
                variant="secondary"
                onClick={() => save(false)}
                disabled={!draft.title.trim()}
              >
                Lagre utkast
              </AdButton>
              <AdButton
                className="ml-auto"
                onClick={() => save(true)}
                disabled={
                  !draft.title.trim() || !draft.excerpt.trim() || !draft.body.trim()
                }
              >
                Publiser
              </AdButton>
            </>
          }
        >
          <AdField
            label="Tittel"
            htmlFor="b-tittel"
            help="Sentence case. Konkret framfor kreativ, for folk søker på problemet sitt."
          >
            <input
              id="b-tittel"
              className={adInput}
              value={draft.title}
              placeholder="Slik gjør du bilen klar for høsten"
              onChange={(event) => {
                const title = event.target.value;
                setDraft({
                  ...draft,
                  title,
                  slug: slugLocked && !draft.published ? slugify(title) : draft.slug,
                });
              }}
            />
          </AdField>

          <AdField
            label="Nettadresse"
            htmlFor="b-slug"
            help={`handzon.no/nyheter/${draft.slug || "…"}`}
            className="mt-4"
          >
            <input
              id="b-slug"
              className={adInput}
              value={draft.slug}
              placeholder="slik-gjoer-du-bilen-klar-for-hoesten"
              onChange={(event) => {
                setSlugLocked(false);
                setDraft({ ...draft, slug: slugify(event.target.value) });
              }}
            />
          </AdField>

          <div className="mt-4 grid gap-3.5 admin-sm:grid-cols-2">
            <AdField label="Kategori" htmlFor="b-kat">
              <select
                id="b-kat"
                className={`${adSelect} w-full`}
                value={draft.category}
                onChange={(event) =>
                  setDraft({ ...draft, category: event.target.value as BlogCategory })
                }
              >
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </AdField>
            <AdField label="Publiseringsdato" htmlFor="b-dato">
              <input
                id="b-dato"
                type="date"
                className={adInput}
                value={draft.date}
                onChange={(event) => setDraft({ ...draft, date: event.target.value })}
              />
            </AdField>
          </div>

          <AdField
            label="Ingress"
            htmlFor="b-ing"
            help="Én til to setninger. Dette er teksten som vises i listen og i søk."
            className="mt-4"
          >
            <textarea
              id="b-ing"
              className={`${adTextarea} min-h-20`}
              value={draft.excerpt}
              placeholder="Insektrester, kvae og pollen etter sommeren gjør reell skade om de får stå."
              onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })}
            />
          </AdField>

          <div className="mt-4">
            <label
              htmlFor="b-body"
              className="mb-1.5 block font-heading text-[12.5px] font-semibold text-body-strong"
            >
              Innhold
            </label>
            <div className="flex flex-wrap gap-1.5 rounded-t-control border border-b-0 border-line-heavy bg-surface-alt p-2">
              {[
                ["Mellomtittel", "## ", ""],
                ["Fet", "**", "**"],
                ["Kursiv", "*", "*"],
                ["Punktliste", "\n- ", ""],
                ["Lenke", "[", "](https://)"],
              ].map(([text, before, after]) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => wrap(before, after)}
                  className="cursor-pointer rounded-[6px] border border-line-strong bg-surface px-2.5 py-[5px] font-heading text-[12.5px] font-semibold text-body-strong hover:border-navy hover:text-navy"
                >
                  {text}
                </button>
              ))}
            </div>
            <textarea
              id="b-body"
              className={`${adTextarea} min-h-[260px] rounded-t-none`}
              value={draft.body}
              placeholder={"Skriv innlegget her.\n\n## Mellomtittel\nBrødtekst i korte avsnitt."}
              onChange={(event) => setDraft({ ...draft, body: event.target.value })}
            />
            <AdNote className="mt-1.5">
              {words} ord · ca. {readingMinutes(draft.body)} min lesetid. Markdown for
              mellomtitler, fet og lister.
            </AdNote>
          </div>

          <div className="mt-5 border-t border-line pt-[18px]">
            <AdSectionTitle>Hovedbilde</AdSectionTitle>
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
          </div>

          <div className="mt-[22px] border-t border-line pt-[18px]">
            <AdSectionTitle>Slik ser det ut i listen</AdSectionTitle>
            <div className="overflow-hidden rounded-card border border-line-strong bg-surface">
              <div className="relative h-[150px] bg-surface-sunken">
                <Image src={draft.image} alt="" fill sizes="520px" className="object-cover" />
              </div>
              <div className="p-[18px]">
                <AdTag>{draft.category}</AdTag>
                <h3 className="mt-2.5 font-heading text-[20px] font-bold leading-[1.2] tracking-[-.015em] text-ink">
                  {draft.title || "Uten tittel"}
                </h3>
                <p className="mt-2 text-[14.5px] leading-[1.55] text-body-soft">
                  {draft.excerpt || "Ingressen vises her."}
                </p>
                <p className="mt-3 text-[13px] text-body-soft">
                  {draft.author} · {formatPostDateShort(draft.date)} ·{" "}
                  {readingMinutes(draft.body)} min
                </p>
              </div>
            </div>
          </div>
        </Panel>
      )}
    </>
  );
}
