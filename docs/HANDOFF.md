# Handoff — Handz On Auto Care

Statusdokument for prosjektet slik det står nå. Er du en ny økt: les denne først,
så vet du hvor ting bor og hvilke regler som gjelder før du rører kode.

---

## 1. Hva dette er

Nettsted + adminpanel for Handz On Auto Care, en bilpleiekjede med 14 avdelinger
i og rundt Oslo. Kundeflaten selger og booker; adminpanelet er kjedekontorets og
avdelingenes verktøy. Alt er bygget mot designleveransen i
`design_handoff_dagsverkstedet/` — den er fasit for farger, komponenter,
skjermbilder, bevegelse og tekst.

Løsningen er en **demo**: ingen backend, ingen innlogging, ingen betaling. Data
kommer fra `lib/`, og endringer i adminpanelet lever i nettleserminnet til du
laster på nytt. Alt er bygget slik at datalaget kan byttes mot et ekte API uten
at UI-et må skrives om.

## 2. Kom i gang

```
npm run dev      # http://localhost:3000
npm run build    # 61 statiske sider, må være grønn før du er ferdig
npx tsc --noEmit
npx eslint .
```

Adminpanelet ligger på `/admin` og har ingen innlogging. Du kommer dit fra
bunnteksten på forsiden («INTERN DEMO → Åpne adminpanelet») og ut igjen via
«← Til nettstedet» nederst i sidestolpen.

Stack: Next.js 16.2.4 (App Router, Turbopack, typede ruter), React 19.2,
TypeScript 5, Tailwind CSS 4, lucide-react for ikoner, jsPDF til kvitteringer.

## 3. Rutekart

| Rute | Fil | Merknad |
| --- | --- | --- |
| `/` | `app/page.tsx` | Forside |
| `/tjenester` | `app/tjenester/page.tsx` + `service-catalog.tsx` | Filtrering på kategori |
| `/tjenester/[slug]` | `app/tjenester/[slug]/page.tsx` | 18 tjenestesider (SSG) |
| `/avdelinger` | `app/avdelinger/page.tsx` + `location-list.tsx` | Søk, «nær meg», kart |
| `/avdelinger/[slug]` | `app/avdelinger/[slug]/page.tsx` | 14 avdelingssider (SSG) |
| `/booking` | `app/booking/page.tsx` + `wizard.tsx` | 7 steg, klientside |
| `/min-side` | `app/min-side/page.tsx` + `min-side-client.tsx` | Demoinnlogging |
| `/kundeklubb` | `app/kundeklubb/page.tsx` | Stempelkort |
| `/nyheter` | `app/nyheter/page.tsx` + `news-grid.tsx` | 11 publiserte innlegg |
| `/nyheter/[slug]` | `app/nyheter/[slug]/page.tsx` | Artikkel |
| `/om-oss`, `/kontakt` | `app/om-oss/`, `app/kontakt/` | |
| `/admin` | `app/admin/page.tsx` + `oversikt-screen.tsx` | Dagens drift |
| `/admin/bestillinger` | `app/admin/bestillinger/` | Statusflyt |
| `/admin/rapport` | `app/admin/rapport/` | Salgsrapport + CSV |
| `/admin/tjenester` | `app/admin/tjenester/` | Katalog og priser |
| `/admin/blogg` | `app/admin/blogg/` | Innholdsverktøy |
| `/sitemap.xml` | `app/sitemap.ts` | Genereres fra data |

## 4. Filkart

**Kundeflate** — `components/site/`
`Header`, `Footer`, `Hero`, `Section`, `ServiceTile`, `ServiceRow`, `BranchCard`,
`StatStrip`, `TrustBand`, `SocialProof`, `StampCard`, `StickyBar`, `OpenStatus`,
`OpeningHoursTable`, `PostBody`, `Reveal`, `PageTransition`, `GoogleBranchMap`.

**Byggeklosser** — `components/ui/`
`Button` (+ `ButtonLink`), `Card`, `Chip`, `Tag`, `Price`, `EmptyState`,
`VippsButton`.

**Booking** — `components/booking/`
`StepProgress`, `OptionRow`, `use-count-up.ts`.

**Admin** — `components/admin/`
`Rail` (sidestolpe), `Top` (sticky toppbar), `Kpi`, `Chart`, `Panel` (drawer),
`Toasts`, `ui.tsx` (AdButton/AdTag/AdField/AdSwitch/AdSeg/AdCard/AdTable …).

**Data og logikk** — `lib/`

| Fil | Innhold |
| --- | --- |
| `types.ts` | Alle domenetyper |
| `mock-data.ts` | 14 avdelinger, 18 tjenester, tillegg, lokale prisoverstyringer |
| `blog.ts` | 13 innlegg (11 publisert, 2 utkast), kategorier, lesetid |
| `sales.ts` | Deterministisk ordregenerering + all rapportaggregering |
| `prng.ts` | `mulberry32` + FNV-1a-hash — grunnlaget for at tallene er stabile |
| `booking-adapter.ts` | Prisberegning, `MEMBER_DISCOUNT_RATE = 0.1`, mock-API |
| `vehicle-lookup.ts` | Regnr-oppslag (EB12345, DR34567, FE11111 = feiltilfelle) |
| `receipt.ts` | Kvittering som PDF |
| `opening-hours.ts` | Åpent/stengt nå, ukeoppsummering |
| `service-images.ts` | Slug → bildepar (thumb/hero) i `public/` |
| `service-includes.ts` | «Dette inngår» per kategori |
| `reviews.ts`, `geo.ts`, `format.ts` | Anmeldelser, avstand, tall- og datoformat |

**Spesifikasjon** — `design_handoff_dagsverkstedet/`
`README.md` (les først), `TOKENS.md`, `COMPONENTS.md`, `SCREENS.md`, `MOTION.md`,
`ADMIN.md`, `CONTENT.md`, `SKILL.md`, samt en kjørbar HTML-prototype under
`design/`. Mappen er ekskludert fra lint og skal ikke endres — den er kilden.

## 5. Designsystemet — reglene som ikke kan brytes

Alle tokens bor i `@theme` i `app/globals.css`. Tailwind 4 lager utilities av dem
automatisk: `--color-navy` gir `bg-navy`, `text-navy`, `border-navy`. Det finnes
ingen `tailwind.config.js`.

- Navy `#1E3A70` er merkevaren. Rød `#E41830` er kun aksent, aldri stor flate.
- **`--color-muted` og `--color-muted-light` er under AA og skal aldri brukes til
  tekst.** Sekundær tekst går på `--color-body-soft`.
- **Ingen `text-white/45` og lignende på navy.** Bruk `on-navy`-tokenene
  (`text-on-navy`, `text-on-navy-soft`, `text-on-navy-eyebrow`).
- Ett brytepunkt på kundeflaten: `hz:` = 900px. Adminpanelet har to egne:
  `admin-sm:` = 760px og `admin-lg:` = 1100px.
- Fokusring er definert globalt i `@layer base` og skal aldri fjernes.
- Seksjonspadding er `.hz-pad` / `.hz-sec` — ikke finn opp egne verdier.
- Sticky bunnbarer bruker `position: sticky`, ikke `fixed`.

## 6. Bevegelse

Varighetene bor som `:root`-variabler i `globals.css` (`--dur-page: 420ms`,
`--page-shift: 18px`, `--dur-fill`, `--dur-xfade` …), keyframes og
utility-klasser rett under.

- `.hz-page` — sidebytte, innholdet stiger 18px og toner inn.
  Styres av `components/site/PageTransition.tsx`. **Adminpanelet er unntatt** —
  der skal sidebytte være helt stille.
- `.hz-fwd` / `.hz-back` — retningsbevisste bookingsteg.
- `.hz-rise` — sticky bunnbar reiser seg når den monteres.
- `.hz-pop`, `.hz-fade`, `.hz-xfade`, `.hz-slot`, `.hz-sheet`, `.hz-unfold`,
  `.hz-fill`, `.hz-reveal`.
- **Én global av-bryter** for `prefers-reduced-motion` nederst i filen. Ikke skriv
  egne unntak per komponent.
- Adminpanelets diagram har bevisst *ingen* inn-animasjon.

`PageTransition` har med vilje ingen `key={pathname}` på `<main>` — en nøkkel der
remounter alle nestede layouts og ville nullstilt hele adminpanelets tilstand ved
hver navigasjon.

## 7. Datalaget

Alle tall er deterministiske. `lib/sales.ts` genererer ordrer fra en seed som er
hashet ut av avdeling + dato (`lib/prng.ts`), slik at omsetningen på
oversiktssiden, i rapporten og i CSV-eksporten alltid stemmer overens — og er lik
etter omlasting. **Ikke bruk `Math.random()` til tall som vises.**

Priser lagres i **øre** overalt (`priceOre`, `localPricesOre`) og formateres via
`lib/format.ts`.

## 8. Bestillingsflyten

`app/booking/wizard.tsx` er én fil med en reducer og ett steg per komponent:

1. Avdeling → 2. Bilen din → 3. Tjeneste → 4. Tidspunkt → 5. Tillegg →
6. Oppsummering → 7. Bekreftelse

Viktig oppførsel som er bevisst valgt:

- **Å velge bytter ikke steg.** `selectLocation`, `selectService` og `selectSlot`
  oppdaterer bare tilstanden. Stegskiftet skjer i `continue`, altså når brukeren
  trykker «Gå videre». Et feilklikk skal aldri kaste deg videre.
- `BottomBar` er den sticky bunnbaren på steg 1, 3, 4 og 6: hva du har valgt til
  venstre, beløp i midten og handlingen til høyre — én rad, også på mobil.
  Steg 5 bruker `AddOnBar`, som er en `BottomBar` med løpende sum.
  Beløpet vises fra og med steg 3, så prisen aldri forsvinner ut av syne.
- Steg 6 sin «Bekreft bestilling» ligger i baren, ikke i innholdet, og er
  **aldri `disabled`**: mangler navn eller telefon, ruller og fokuserer et
  trykk til feltet som mangler og viser feilen der. En avslått knapp sluker
  trykket helt på touch.
- Wizard-containeren er `flex min-h-dvh flex-col` med `flex-1` på innholdet.
  Uten det ble `sticky bottom-0` liggende midt på skjermen når steget var
  kortere enn viewporten.
- Dagsstripa på steg 4 starter **i dag**. `lib/booking-adapter.ts` filtrerer
  bort klokkeslett som har passert (`LEAD_TIME_MIN = 60`), så dagens chip
  tømmer seg selv utover kvelden.
- Redigering fra oppsummeringen (`state.editing`) sender deg tilbake til steg 6
  når du bekrefter, ikke videre i flyten — se `routeAfterEdit`.

## 9. Adminpanelet

Fem skjermer, ingen innlogging, delt tilstand i `app/admin/admin-context.tsx`
(`AdminProvider`): valgt avdeling, tjenestekatalog, blogginnlegg, toaster,
mobilmeny. Tilstanden nullstilles ved omlasting — som i prototypen.

| Skjerm | Innhold |
| --- | --- |
| Oversikt | KPI-kort, 14-dagers trend, kapasitet i dag, fordeling per kategori |
| Bestillinger | Statusflyt i låst rekkefølge: Ny → Inne → Klar (sender SMS) → Levert |
| Salgsrapport | Periode dag/uke/måned/år, stolpediagram, topplister, CSV-eksport |
| Tjenester og priser | Katalogtabell, redigering i drawer, lokale priser per avdeling, publisering |
| Blogg og nyheter | Innleggsliste, editor med bildevelger, utkast/publiser |

**Publiseringssemantikken er en faktisk diff.** Hver tjeneste bærer et
`published`-øyeblikksbilde av de redigerbare feltene. `isDirty()` sammenligner
serialisert nåtilstand mot det, i kanonisk form (lokalpriser sorteres). Derfor:
deaktiverer du en tjeneste og slår den på igjen før publisering, forsvinner
«ikke publisert»-varselet og telleren synker. `published: null` betyr aldri
publisert (ny tjeneste). Ikke gå tilbake til et «rørt»-flagg.

Sidestolpen kollapser til ikonrail under 1100px og blir skuff bak hamburger under
760px.

## 10. Google Maps

`components/site/GoogleBranchMap.tsx` bruker Maps Embed API og skal stå som den
er — det er et eksplisitt krav fra kunden. Nøkkel via
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Uten nøkkel faller den tilbake til et
nøkkelfritt innbygg som alltid rendrer, men uten pins i oversikten. Søket bruker
«Handz On» fordi det matcher alle avdelingene.

## 11. Språk og tall

Norsk bokmål, ingen emoji, ingen utropstegn.

- Marked: `1 490,-` · Kvittering og admin-summer: `1 490 kr`
- «inkl. mva» skal stå på hver total
- Knapper er verb + objekt: «Bestill time», «Hent bilinfo», «Åpne adminpanelet»
- Prosentendring vises alltid med tekstlig forklaring, aldri pil alene

## 12. Fallgruver

1. **`AGENTS.md` gjelder:** dette er Next.js 16 med brytende endringer. Les
   `node_modules/next/dist/docs/` før du skriver kode som rører rammeverket.
2. **`react-hooks/set-state-in-effect`** er på og slår hardt. Bruk
   `useSyncExternalStore` (se `OpenStatus`, `OpeningHoursTable`),
   rAF-utsatt første sjekk (`Reveal`), eller skriv rett til DOM (`AdSeg`).
   Ikke sett state i en effekt.
3. **Tailwind-bredder kolliderer.** Derfor er `adField` (uten bredde) skilt fra
   `adInput` (`w-full ${adField}`) i `components/admin/ui.tsx`. Legger du `w-*`
   utenpå en klasse som allerede har `w-full`, taper du.
4. **Målte høyder:** headeren er 79px på desktop og **61px på mobil** (44px
   trykkflate + 8px luft + hårlinje). Sticky filterbarer bruker
   `top-[61px] hz:top-[79px]`. Headeren krymper ikke lenger ved rulling —
   krympe-lytteren er fjernet, se `components/site/Header.tsx`.
5. **Mobilmenyen må ligge UTENFOR `<header>`.** `backdrop-filter` gjør et
   element til containing block for `position: fixed`-etterkommere. Lå arket
   inni den uskarpe headeren, ble `inset-0` regnet mot headerens 69px boks:
   den hvite flaten dekket bare toppstripen og resten av menyen fløt
   gjennomsiktig over siden. Headeren returnerer derfor et fragment.
6. **Typede ruter** kan bli utdaterte når du legger til en ny rute-fil. `npm run
   build` regenererer validatoren.
7. Legger du til en side: husk `app/sitemap.ts`.

## 13. Status i git

Alt ligger **ucommittet på `main`**. Siste commit er `9a0513a`. Det som er gjort
etter det — full implementasjon av designleveransen, adminpanelet, blogg/nyheter,
bevegelsessystemet og bookingendringene — er ikke committet. `npm run build`,
`npx tsc --noEmit` og `npx eslint .` er grønne.

To filer er slettet i arbeidstreet og erstattet: `components/site/RevealProvider.tsx`
(→ `Reveal.tsx`) og `components/ui/ImagePlaceholder.tsx` (→ ekte bilder i
`public/`). `lib/news.ts` er borte, slått sammen til `lib/blog.ts`.

`_to_delete/` inneholder bare en strøfil (`__wtest.txt`) og kan fjernes.

## 14. Bevisst ikke gjort

- Ingen backend, database, autentisering eller betaling
- Ingen e-post/SMS-utsending — «sender SMS» i bestillingsflyten er en toast
- Ingen tester
- Adminpanelets endringer lagres ikke; de forsvinner ved omlasting
- Kapasitetskortet i admin kan vise «11 av 9 plasser» — det er hentet direkte fra
  designspesifikasjonen og er ikke en feil

## 15. «Jeg vil endre X» → hvor

| Endring | Fil |
| --- | --- |
| Farge, radius, skygge, brytepunkt | `app/globals.css` (`@theme`) |
| Animasjon eller varighet | `app/globals.css` (nederste halvdel) |
| Sidebytte-animasjon | `components/site/PageTransition.tsx` |
| Priser, tjenester, avdelinger, tillegg | `lib/mock-data.ts` |
| Bilder på tjenester | `lib/service-images.ts` + `public/tjenester/` |
| «Dette inngår» | `lib/service-includes.ts` |
| Medlemsrabatt, prisberegning | `lib/booking-adapter.ts` |
| Bookingflyt, steg, knapper | `app/booking/wizard.tsx` |
| Kvitterings-PDF | `lib/receipt.ts` |
| Nyhetsartikler | `lib/blog.ts` |
| Anmeldelser og rating | `lib/reviews.ts` |
| Åpningstider | `lib/opening-hours.ts` + `locations` i `lib/mock-data.ts` |
| Meny, logo, bunntekst | `components/site/Header.tsx`, `Footer.tsx` |
| Admin: delt tilstand, publiseringslogikk | `app/admin/admin-context.tsx` |
| Admin: en enkelt skjerm | `app/admin/*/…-screen.tsx` |
| Admin: knapper, felter, tabeller | `components/admin/ui.tsx` |
| Admin: sidestolpe og toppbar | `components/admin/Rail.tsx`, `Top.tsx` |
| Salgstall og rapportlogikk | `lib/sales.ts` |
| Kart | `components/site/GoogleBranchMap.tsx` (helst ikke) |
