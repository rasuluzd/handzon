# Handz On Auto Care — Premium Redesign-spesifikasjon

Implementeringsklar designspesifikasjon for Next.js + TypeScript + Tailwind-demoen.
Bygger på audit (`HANDZON-AUDIT-OG-DESIGNBRIEF.md`) og demoens eksisterende
design-tokens (`README.md`). Målet: løfte fra «ren, men forenklet» til **premium og
brukervennlig** uten å bryte identiteten.

**Ufravikelig identitet:** navy-aksent `#1e3a70` (hover `#294b8c`), ink `#16223A`,
lyse flater `#FFFFFF`/`#F4F5F7`, hårfine 1px-linjer, radius 6/8/10–12px, Barlow
(overskrifter/tall/knapper) + Source Sans 3 (brødtekst), breakpoint **900px** (`hz:`),
sentrert app-container maks 1180px, subtil on-scroll reveal. **Én aksentfarge** — ingen
gradientdekor, ingen turkis/regnbue. Ekte tjenester/priser og ekte kundeklubb-mekanikk
(hver 6. Basic-vask gratis + gratis spylervæske). All UI-tekst på **norsk (bokmål)**.

**Premium-prinsippet i én setning:** samme farger og typografi som i dag — men mer luft,
tydeligere hierarki, mykere dybde kun på nøkkelkort, og gjennomtenkte tilstander.

---

## Innhold

- [A. Raffinert design-token-ark](#a-raffinert-design-token-ark)
- [B. Komponentbibliotek (atomer/molekyler)](#b-komponentbibliotek-atomermolekyler)
- [C. Per-side / komponent-redesign](#c-per-side--komponent-redesign)
- [D. Prioritert implementeringsrekkefølge + premium-sjekkliste](#d-prioritert-implementeringsrekkefølge--premium-sjekkliste)

---

# A. Raffinert design-token-ark

Utvider demoens eksisterende Tailwind-tokens (`navy`, `ink`, `line`, `surface`, `muted`
osv.) uten å endre kjerneverdiene. Nye tokens er additive og semantiske. Alle
kontrastverdier er WCAG-sjekket mot angitt bakgrunn.

## A.1 Farge

### Merkevare / aksent
| Token | Verdi | Bruk | Kontrast |
|---|---|---|---|
| `navy` | `#1e3a70` | Primærknapp, lenker, aktiv tilstand, priser, logo | 8,6:1 på hvit — AAA |
| `navy-hover` | `#294b8c` | Knapp/lenke hover | 6,2:1 på hvit — AA+ |
| `navy-active` | `#16294f` (ny) | Knapp `:active`/trykk | — |
| `navy-deep` | `#16223A` (= ink) | Dype paneler, footer, kvitteringshode | — |
| `navy-tint-06` | `rgba(30,58,112,0.06)` | Valgt kort, subtil fyll | — |
| `navy-tint-08` | `rgba(30,58,112,0.08)` | Badge/chip-bakgrunn | — |
| `navy-tint-10` | `rgba(30,58,112,0.10)` | Aktiv chip, hover-fyll | — |
| `navy-tint-14` | `rgba(30,58,112,0.14)` (ny) | Trykk-fyll, kart-prikk aktiv-glød | — |

### Ink / tekst (navy-tintet kaldgrå, uendret)
| Token | Verdi | Bruk |
|---|---|---|
| `ink` | `#16223A` | Overskrifter, primærtekst |
| `body-strong` | `#333B4A` | Sterk brødtekst, faktaverdier |
| `body` | `#444C5C` | Standard brødtekst |
| `body-soft` | `#5A6273` | Sekundær brødtekst, ingress |
| `muted` | `#737B8A` | Meta, kategori · varighet |
| `muted-light` | `#9AA1AD` | Bildetekst, mikro, «Bestill →» hint |

### Overflater
| Token | Verdi | Bruk |
|---|---|---|
| `canvas` | `#DCDEE3` | Bak sentrert app-container |
| `surface` | `#FFFFFF` | App-bakgrunn, kort |
| `surface-alt` | `#F4F5F7` | Stat-tiles, footer, subtile fyll |
| `surface-sunken` | `#EDEFF3` (ny) | Innfelte felt (dropdown-panel, kart-ramme, tomtilstand) |
| `surface-raised` | `#FFFFFF` + skygge | Kort som løftes (se A.5) |

### På navy (uendret)
`on-navy` `#D6E0F1` · `on-navy-strong` `#EAF0FB` · `on-navy-eyebrow` `#9EB6E0` ·
`on-navy-hair` `rgba(255,255,255,0.14)` (ny — hårlinje på navy-paneler).

### Linjer
| Token | Verdi | Bruk |
|---|---|---|
| `line` | `rgba(20,32,58,0.10)` | Standard hårlinje, delelinjer |
| `line-strong` | `rgba(20,32,58,0.12)` | Kortkant |
| `line-focus` | `#1e3a70` | Valgt kort (2px), fokus |

### Semantiske tilstander (funksjonelle — ikke dekor)
Restrained, navy-forenlig. Brukes **kun** til status/validering, aldri som pynt.
| Token | Verdi | Bruk | Kontrast |
|---|---|---|---|
| `status-open` | `#2E7D53` | «Åpen nå»-prikk/tekst, «Godkjent» | 4,7:1 på hvit — AA |
| `status-open-bg` | `rgba(46,125,83,0.10)` | Chip-fyll «Åpen nå» | — |
| `status-closed` | `#8A6D1F` | «Stengt nå» (dempet gyllen, ikke rød) | 4,6:1 på hvit |
| `danger` | `#B4232A` | Feilvalidering, «utilgjengelig» | 5,3:1 på hvit — AA |
| `danger-bg` | `rgba(180,35,42,0.08)` | Feil-input bakgrunn | — |
| `info` | `navy` | Info-toast (gjenbruk navy) | — |
| `disabled-bg` | `#E3E5E9` | Inaktiv primærknapp | — |
| `disabled-text` | `#A5AAB4` | Inaktiv knappetekst | 2,0:1 (bevisst dempet, kun disabled) |
| `vipps` | `#FF5B24` | Kun Vipps-innloggingsknapp | — |

> Regel: grønn og rød opptrer aldri som flater eller ikoner større enn ~10px. De er
> statusprikker, mikro-tekst og 1px-kanter. Aksenten forblir navy.

## A.2 Typografi

`Barlow` (500/600/700) = overskrifter, tall, etiketter, knapper. `Source Sans 3`
(400/500/600) = brødtekst. Type-skala som navngitte klassemønstre:

| Rolle | Font/vekt | Mobil | Desktop (`hz:`) | Line-height | Bruk |
|---|---|---|---|---|---|
| `display` | Barlow 700 | 38px | `clamp(42px,3.6vw,58px)` | 1.08 / 1.04 | Hero-H1 |
| `h1` | Barlow 700 | 30px | 32px | 1.10 | Side-H1 |
| `h2` | Barlow 700 | 25px | 28px | 1.15 | Seksjonsoverskrift |
| `h3` | Barlow 600 | 19px | 21px | 1.25 | Kort/blokktittel |
| `title` | Barlow 600 | 17px | 18px | 1.3 | Kortnavn, listetittel |
| `price` | Barlow 700 | 16–28px | — | 1.0 | «fra»-pris (kontekstavhengig) |
| `eyebrow` | Barlow 600 UPPERCASE | 14px | 14px | 1.2 | Etikett, `tracking-[0.1em]`, `text-navy` |
| `body-lg` | Source Sans 3 400 | 18px | 19px | 1.55 | Ingress/lead |
| `body` | Source Sans 3 400 | 16px | 16.5px | 1.55 | Brødtekst |
| `small` | Source Sans 3 400/500 | 13–15px | — | 1.5 | Meta, hjelpetekst |
| `micro` | Barlow 600 | 12–13px | — | 1.4 | Badge, kapasitet, mikro-CTA |

**Målelinjelengde:** brødtekst maks ~68 tegn (`max-w-[64ch]` på lange avsnitt, guiden/
om-oss). Tall og priser alltid Barlow for premium-følelse; bruk `tabular-nums` i
prisspesifikasjon og oppsummering slik at kolonner flukter.

## A.3 Spacing-skala (4px-basis)

`0 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80`. Tailwind spacing brukes direkte
(`gap-3` = 12px osv.). Semantiske rytmer:

| Token | Verdi | Bruk |
|---|---|---|
| `pad-section-x` | mobil `24px`, desktop `clamp(24px,4vw,48px)` | Seksjon horisontal |
| `pad-section-y` | mobil `40px`, desktop `clamp(48px,6vw,80px)` | Seksjon vertikal (økt fra dagens ~44px for mer luft) |
| `pad-card` | `16–20px` (kompakt) / `24px` (nøkkelkort) | Kortinnhold |
| `gap-grid` | `12–16px` | Kortgrid |
| `gap-stack` | `12 / 16 / 24` | Vertikal stabling i kort |
| `rhythm-heading` | `12–16px` mellom eyebrow→H2, `20–24px` H2→innhold | Overskriftsrytme |

**Endring fra i dag:** seksjonene får mer vertikal luft (min 48px topp på desktop),
og overskrift→innhold får konsekvent 20–24px i stedet for varierende 5–22px.

## A.4 Radius

| Token | Verdi | Bruk |
|---|---|---|
| `r-pill` | `999px` | Statuspiller, chips, day-chips |
| `r-badge` | `6px` | Badges, tags |
| `r-control` | `8px` | Knapper, input, select |
| `r-card` | `10px` | Standard kort |
| `r-card-lg` | `12px` | Nøkkelkort, navy-paneler, kart-ramme |
| `r-media` | `12px` | Bilder/media-topp i kort |

## A.5 Skygge-nivåer (mykere dybde — kun på nøkkelkort)

Dagens regel: kort er flate med hårlinjer, kun app-container har skygge. Premium-tillegg:
en **liten, disiplinert skygge-stige** brukt *selektivt* på kort som fortjener løft
(ServiceCard, avdelingskort, gavekort, pakkekort, sticky CTA, dropdown). Vanlige
listerader forblir hårlinje-flate.

| Token | Verdi | Bruk |
|---|---|---|
| `shadow-app` | `0 0 60px rgba(20,32,58,0.14)` | App-container (uendret) |
| `shadow-xs` | `0 1px 2px rgba(20,32,58,0.06)` | Input, subtil heving |
| `shadow-card` | `0 6px 20px -8px rgba(20,32,58,0.12)` | Nøkkelkort i hvile |
| `shadow-card-hover` | `0 14px 30px -10px rgba(20,32,58,0.18)` | Nøkkelkort hover |
| `shadow-pop` | `0 18px 44px -14px rgba(20,32,58,0.24)` | Dropdown/mega-meny, modal |
| `shadow-sticky` | `0 -10px 28px -16px rgba(20,32,58,0.22)` | Sticky booking-bar (skygge oppover) |

> Regel: aldri mer enn **ett** skyggenivå synlig i samme kortkontekst. Skygge erstatter
> ikke hårlinjen — nøkkelkort har `border border-line-strong` **og** `shadow-card`.
> Maks 2px løft ved hover (`hover:-translate-y-0.5`).

## A.6 Motion / easing

| Token | Verdi | Bruk |
|---|---|---|
| `dur-fast` | `120ms` | Farge/opasitet på hover, chip-toggle |
| `dur` | `200ms` | Standard hover/transform |
| `dur-slow` | `500ms` | On-scroll reveal |
| `dur-hero` | `700ms` | Hero-kryssfade |
| `ease-standard` | `cubic-bezier(0.2,0.6,0.2,1)` | Standard inn/ut |
| `ease-out` | `cubic-bezier(0.16,1,0.3,1)` | Reveal, panel-inn |
| `reveal` | opacity `0→1` + `translateY(14px)→0`, `500ms ease-out`, stagger ~60ms | Seksjonsavsløring |

**Redusert bevegelse (obligatorisk):**
```
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after { animation-duration:0.01ms!important;
    transition-duration:0.01ms!important; scroll-behavior:auto!important; }
}
```
Alt reveal vises da umiddelbart (opacity 1, ingen translate). Hero-kryssfade fryser på
første slide. Auto-advance i booking beholdes (funksjonell), men uten glide-animasjon.

## A.7 Fokus-ring (WCAG 2.4.7 / 2.4.11)

Konsekvent, synlig, aldri fjernet:
```
focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-navy
focus-visible:ring-offset-2 focus-visible:ring-offset-surface
```
På navy-paneler: `ring-offset-navy` + `ring-white`. Interaktive kort får ring på hele
kortet (`focus-visible` på `<a>`/`<button>`), ikke bare på tekst. Minste treffområde
44×44px på mobil.

## A.8 Z-index-skala

| Token | Verdi | Bruk |
|---|---|---|
| `z-base` | `0` | Innhold |
| `z-raised` | `10` | Hover-løftede kort, floating «← Tjenester» |
| `z-sticky` | `30` | Sticky booking-CTA, sticky sortering |
| `z-header` | `40` | Sticky header |
| `z-pop` | `50` | Dropdown/mega-meny, overlay-bakteppe |
| `z-mobilenav` | `60` | Fullskjerms mobilmeny |
| `z-toast` | `70` | Toast |
| `z-modal` | `80` | Modal/lightbox (video, 360°-foto) |

---

# B. Komponentbibliotek (atomer/molekyler)

For hver: **anatomi → tilstander → Tailwind-notat**. Ingen full kode — mønstre en utvikler
implementerer direkte. Alle komponenter arver fokus-ring (A.7) og respekterer redusert
bevegelse (A.6).

## B.1 Button

**Anatomi:** `[ikon?] label [ikon?]`, Barlow 600, `r-control` (8px), sentrert.
Høyde etter størrelse; horisontal padding ≥ 1,4× vertikal.

**Varianter:**
| Variant | Hvile | Hover | Notat |
|---|---|---|---|
| `primary` | `bg-navy text-white` | `bg-navy-hover` | Hovedhandling. `active:bg-navy-active` |
| `secondary` | `bg-surface text-navy border border-line-strong` | `border-navy bg-navy-tint-06` | Sidestilt handling |
| `ghost` | `text-navy` | `bg-navy-tint-06` | Tekst-CTA, «Se alle →» |
| `onNavy` | `bg-white text-navy` | `bg-on-navy-strong` | Primær på navy-panel |
| `heroOutline` | `border border-white/50 text-white` | `bg-white/10 border-white` | Sekundær på navy-hero |
| `danger-ghost` | `text-danger` | `bg-danger-bg` | «Avbestill» o.l. |

**Størrelser:** `sm` h36 `px-4 text-[14px]` · `md` h44 `px-[22px] text-[15px]` (standard)
· `lg` h52 `px-7 text-[16px]` (hero/sticky CTA). `fullWidth` → `w-full`.

**Tilstander:**
- `default/hover/active` som over; transitions `dur` (200ms), farge + evt.
  `active:translate-y-[1px]`.
- `focus-visible`: ring (A.7).
- `disabled`: `bg-disabled-bg text-disabled-text cursor-not-allowed`, ingen hover.
- `loading`: behold bredde, bytt label til 16px spinner (navy/hvit) + skjul tekst,
  `aria-busy="true"`, `aria-live` uendret. Brukes på «Hent bilinfo», «Bekreft bestilling».
- Ikon-mellomrom `gap-2`; piler («→») er dekorative → `aria-hidden`.

**Tailwind-mønster (primary/md):**
`inline-flex items-center justify-center gap-2 rounded-[8px] bg-navy px-[22px] py-3
font-heading text-[15px] font-semibold text-white transition-colors duration-200
hover:bg-navy-hover active:bg-[#16294f] disabled:bg-disabled-bg disabled:text-disabled-text
focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2`

## B.2 Chip / Tag

**Anatomi:** kompakt pille, Barlow 600 12–13px, `px-3 py-1`, `r-pill`. Valgfritt ledende
prikk/ikon (10px).

**Bruk & tilstander:**
- **Filter-chip (interaktiv):** hvile `bg-surface text-body border border-line-strong`;
  hover `border-navy`; **aktiv** `bg-navy text-white border-navy` (eller `bg-navy-tint-10
  text-navy border-navy` for lettere segment-stil); `focus-visible` ring; `role="button"`
  eller reell `<button aria-pressed>`.
- **Status-chip (ikke-interaktiv):** «Åpen nå» `bg-status-open-bg text-status-open` med
  8px prikk; «Kampanje» `bg-navy-tint-08 text-navy`.
- **Tag (nyheter):** «Nyhet/Presse/Guide/Nyåpning» `bg-surface-alt text-muted border
  border-line`, 12px. Kategoritag er lenke → filtrerer.

## B.3 Card (base)

**Anatomi:** `surface` flate, `r-card`, `border border-line-strong`, `pad-card`.
Valgfri media-topp (`r-media` øverst), innhold, valgfri footer-rad.

**To dybde-nivåer:**
- **Flat kort** (lister, trygghet, guide-rader): kun hårlinje. Hover: `border-navy`.
- **Nøkkelkort** (ServiceCard, avdeling, gavekort, pakke): `shadow-card` +
  `hover:shadow-card-hover hover:-translate-y-0.5`, `transition` `dur`.

**Tilstander:** default / hover (kant→navy eller løft) / `focus-visible` ring på hele
kortet / **selected** `border-2 border-navy bg-navy-tint-06` (booking-valg). Hele kortet
klikkbart: bruk `<a>`/`<button>` som ytre element; sekundære lenker i kortet får
`relative z-raised` (nested-link-mønster).

## B.4 PriceTag

**Anatomi:** «fra»-etikett (Source Sans 3 13px `muted`, valgfri) + beløp (Barlow 700
`navy`, `tabular-nums`). Format via `formatOre` → `"1 490 kr"`.

**Varianter:** `inline` (16px, i listerad), `feature` (22–28px, tjeneste-detalj/pakke),
`member` (overstrøket standardpris `line-through text-muted` + medlemspris `text-navy`).
Aldri desimaler på hele kroner; mva-linjer bruker 2 desimaler (`495,60 kr`). Nivå-hint
(«Basic»/«Pro») som liten `micro`-tag ved siden av navn, ikke i prisen.

## B.5 ServiceCard

**Anatomi (premium):** kvadratisk media-topp (`aspect-square` eller `1:1`, `object-cover`,
`r-media`) → innholdsblokk: kategori-eyebrow + evt. nivå-tag (Basic/Pro), tittel (`title`),
1-linjes beskrivelse (`small`, `line-clamp-2`), meta-rad (varighet, evt. garanti), footer:
PriceTag «fra …» + `ghost`-CTA «Se mer →». Valgfri «Populær»-badge (B.9) øverst til venstre
over bildet.

**Layout:** i grid `repeat(auto-fit,minmax(300–330px,1fr))`, `gap-grid`. To presentasjoner:
- **Media-kort** (Populære tjenester, Tjenester-side): bilde på topp.
- **Rad-kort** (kompakt liste): 60–72px kvadrat-thumb venstre + tekst + pris høyre
  (dagens forsidemønster, men med thumb fra `serviceImages`, ikke placeholder).

**Tilstander:** hvile `shadow-card`; hover `-translate-y-0.5 shadow-card-hover`, tittel
`text-navy`, media `scale-[1.03]` (kun `object`-transform, `overflow-hidden` på media-boks);
`focus-visible` ring; hvis utilgjengelig lokalt → dempet (`opacity-60`) + tag «Ikke
tilgjengelig her».

## B.6 CategoryFilter / Segment

**Anatomi:** horisontal rad av filter-chips (B.2) + sorteringskontroll. På mobil:
horisontal scroll (`overflow-x-auto`, `snap-x`, skjult scrollbar, fade-maske i kantene).
Førsteledd «Alle». Aktiv chip navy-fylt. Antall pr. kategori i parentes valgfritt
(`Bilvask (8)`).

**Sortering:** `Select` (B.7) eller segment: «Populær» / «Pris lav–høy» / «Pris høy–lav».
Sticky under header på Tjenester-siden (`sticky top-[64px] z-sticky bg-white/94 backdrop-blur
border-b border-line`).

**Tilstander:** chip default/hover/aktiv/focus; segment aktiv = navy-fylt pille som glir
(`transition` på bakgrunn). `aria-pressed`/`role="tablist"` med `aria-selected` for
skjermlesere; tastatur: piltaster mellom chips.

## B.7 Input / Select

**Anatomi:** valgfri label (Barlow 600 14px `body-strong`), felt (`surface`,
`border border-line-strong`, `r-control`, h44, `px-3.5`, 16px tekst for å unngå iOS-zoom),
valgfri hjelpetekst (`small muted`) / feilmelding (`small danger`).

**Tilstander:**
- default; hover `border-muted`; `focus-visible` `border-navy ring-2 ring-navy/30`
  (mykere ring i felt) + `shadow-xs`.
- filled; disabled `bg-surface-alt text-muted`.
- error `border-danger bg-danger-bg` + melding med `aria-describedby` +
  `aria-invalid="true"`.
- Spesial: **reg-nummer-input** (booking steg 2) — sentrert, Barlow 700, `uppercase
  tracking-[0.25em] text-[24px]`, monospace-følelse, maks 7 tegn.
- **Select:** egen chevron (`aria-hidden` SVG), `appearance-none`, samme rammer.
- **Søkefelt** (avdelinger): ledende lupe-ikon, `pl-11`; sekundær «📍 Nær meg»-knapp
  (`secondary sm`) ved siden.

## B.8 Stat-tile

**Anatomi:** stort tall (Barlow 700 `navy`, 22–34px, `tabular-nums`) + label (`small muted`).
På `surface-alt` eller hårlinje-delt stripe.

**Varianter:** `strip` (forsidens 3-delte stripe med `border-r border-line`), `tile`
(om-oss/franchise: `surface-alt`, `r-card`, `p-5`, sentrert). Reveal med liten stagger.
Ikke-interaktiv (ingen hover).

## B.9 Badge

Små, ikke-interaktive statusmerker. Barlow 600 12px, `r-badge`, `px-2 py-0.5`, valgfri
ledeprikk.
| Badge | Stil |
|---|---|
| «Populær» | `bg-navy text-white` (over bilde) eller `bg-navy-tint-10 text-navy` (i tekst) |
| «Åpen nå» | `bg-status-open-bg text-status-open` + 8px grønn prikk |
| «Stengt nå» | `bg-surface-alt text-status-closed` |
| «Godkjent» | `bg-status-open-bg text-status-open` + hake-ikon |
| «Kampanje» | `bg-navy-tint-08 text-navy` |
| «Ny» / «6 års garanti» | `bg-navy-tint-08 text-navy` |

Kontrast-krav: alle badge-tekster ≥ 4,5:1 mot sin fyll.

## B.10 Breadcrumb

**Anatomi:** `Forside / Tjenester / {kategori} / {tjeneste}`, Source Sans 3 14px `muted`,
skilletegn `/` (`aria-hidden`), siste ledd `text-body-strong` uten lenke
(`aria-current="page"`). `<nav aria-label="Sti">` + `<ol>`. På mobil: vis kun forrige
nivå med «← Tilbake»-affordans der plass er trang (tjeneste-detalj beholder floating
«← Tjenester»).

## B.11 Carousel / Slides

**Anatomi:** slide-spor (`overflow-hidden`), slides, prikk-indikatorer (`r-pill`, aktiv =
navy, inaktiv = `navy-tint-14`), valgfrie pil-knapper (desktop, `secondary sm`, `aria-label`).

**Bruk:**
- **Hero-kryssfade:** 2–3 stillbilder, `opacity`-kryssfade `dur-hero` (700ms), auto hver
  6s, **pauser** ved hover/fokus og ved redusert bevegelse (fryser slide 1). Tekstpanelet
  er statisk — kun bildet krysser. `aria-roledescription="carousel"`, live-region av.
- **«Ofte valgt sammen» / nyheter-relatert:** scroll-snap-rad på mobil (`snap-x
  snap-mandatory`), grid på desktop.

**Tilstander:** prikk default/aktiv/`focus-visible`; tastatur ←/→; drag/swipe på touch;
`aria-hidden` på ikke-aktive slides for skjermleser når det er innhold.

## B.12 Toast / Empty state

**Toast:** nederst-sentrert (mobil) / nederst-høyre (desktop), `surface`, `shadow-pop`,
`r-card`, `p-4`, ledeikon (navy/`status-open`/`danger`), tittel + valgfri handling.
`role="status"` (info) / `role="alert"` (feil), auto-dismiss 4s (ikke feil), lukkeknapp.
Bruk: «Lagt til i booking», «Gavekort lagt i handlekurv», «Skjema sendt».

**Empty state:** sentrert i kortflate `surface-alt`, `r-card-lg`, `py-12`: dempet
linje-ikon (48px, `muted-light`), kort tittel (`h3`), forklaring (`body-soft`), evt.
`secondary`-CTA. Bruk: «Ingen ledige tider denne dagen — prøv en annen dag», «Ingen
treff — vis alle avdelinger», «Ingen nyheter i denne kategorien».

## B.13 SectionHeader

**Anatomi:** eyebrow (valgfri, `eyebrow`-stil) → H2 (`h2`) → valgfri ingress (`body-soft`,
`max-w-[56ch]`) → valgfri handling høyre («Se alle →», `ghost`). På desktop kan
tittel + handling ligge `flex items-baseline justify-between`. Konsekvent rytme:
eyebrow→H2 12px, H2→ingress 8px, header→innhold 20–24px.

---

# C. Per-side / komponent-redesign

Format per punkt: **Nåværende → Premium oppgradering** (layout, hierarki, spacing,
bildebruk, CTA, tilstander/mikrointeraksjoner, responsiv, tilgjengelighet).

## C.1 Header / nav (med Tjenester mega-meny)

**Nåværende:** sticky translucent hvit header, 5 flate nav-lenker (Forside/Tjenester/
Avdelinger/Om oss/Min side) + navy «Bestill time». Hamburger→fullskjerm-overlay på mobil.
Ingen dropdown; ingen aktiv-understrek; mangler nye toppvalg.

**Premium oppgradering**

*Layout & IA (desktop ≥900):* logo venstre (h40). Primærnav (Barlow 600 15–16px):
**Tjenester** (mega-meny), **Avdelinger**, **Selge bil**, **Nyheter**, **Gavekort**,
**Bilpleie-guiden**. Sekundært, lavere visuell vekt til høyre før CTA: **Om oss**,
**Kontakt**. CTA **«Bestill time»** som `primary md` helt til høyre. Ved trang bredde
(900–1080px): flytt Om oss/Kontakt/Bilpleie-guiden inn under et «Mer ▾»-punkt for å unngå
overfylling. Behold translucent `bg-white/94 backdrop-blur-md` + bunn-hårlinje;
`z-header`. Ved scroll ned > 8px: legg på `shadow-xs` for subtil løsrivelse.

*Aktiv tilstand:* aktiv rute får `text-navy` + 2px navy underline-indikator
(`after:` pseudo, `aria-current="page"`). Hover: `text-navy` + underline fade inn `dur-fast`.

*Tjenester mega-meny:* på hover/klikk åpnes panel (`surface`, `shadow-pop`, `r-card-lg`,
`z-pop`) forankret under «Tjenester», bredde ~640px, `p-6`. To/tre-kolonners liste over de
**9 ekte kategoriene** med liten linje-ikon + navn + mikro-undertekst («fra»-prisantydning),
pluss en fremhevet «Se alle tjenester →»-rad nederst med hårlinje-topp:
- Bilvask · Polering · Lakkforsegling · Full Shine · Interiør · Dekk & Felg · Foliering ·
  Smart Repair · Tilbehør.
Mikrointeraksjon: panel glir inn `translateY(-6px)→0` + fade `dur` `ease-out`. Én åpen om
gangen. Lukkes på `Esc`, klikk utenfor, blur.

*Mobil (<900):* hamburger→fullskjerm-overlay (behold). Forbedring: **Tjenester** blir en
sammenleggbar `<details>`/accordion som lister de 9 kategoriene; øvrige toppvalg som store
Barlow 24–26px-lenker med hårlinjedelere; nederst «Bestill time» `primary lg fullWidth` +
«14 avdelinger over hele Norge». Lås body-scroll når åpen; fang fokus i overlay.

*Tilgjengelighet:* nav i `<nav aria-label="Hovedmeny">`. Mega-meny som `<button
aria-expanded aria-controls>` + panel med `role="menu"`/lenke-liste; full tastaturstøtte
(Tab inn, piltaster, Esc). Hamburger `aria-expanded`; overlay `role="dialog"
aria-modal="true"` med fokusfelle og retur-fokus til hamburger ved lukking. Treffområde
≥44px.

## C.2 Hero (forside)

**Nåværende:** to-kolonne (navy tekstpanel venstre `1.05fr`, bilde høyre `0.95fr`,
min-h `clamp(440px,40vw,580px)`); stablet på mobil (bilde 300px topp, panel under). H1
«Lever nøkkelen. Hent bilen ren.» + ingress + to CTA-er. Statstripe rett under.

**Premium oppgradering**

*Cinematisk ro:* behold to-kolonne-strukturen, men gjør bildesiden mer filmisk: subtil
mørk navy-vignett/`bg-gradient` **kun** som lesbarhetslag i overgangen mot tekstpanelet
(vertikal `from-navy/0 to-navy/15` på panel-siden av bildet — ikke dekor, kun kontrast),
og en **valgfri 2–3-slides kryssfade** (B.11): rolige motiv (håndvask nærbilde, senter-
eksteriør, ferdig blank bil). Tekstpanelet står stille; kun bildet krysser hver 6s.

*Hierarki & innhold:* eyebrow-badge «● Book mens du handler» (liten pille, `on-navy-eyebrow`
+ 8px prikk). `display`-H1. Ingress (`body-lg`, `max-w-[440px]`, `text-on-navy`). CTA-rad:
`onNavy` **«Bestill time»** + `heroOutline` **«Finn din avdeling»**. **Ny trust-markør**
under CTA: liten rad med hake-ikon + «Godkjent bilpleie · Arbeidstilsynets godkjenningsordning»
(`small text-on-navy`, `border-t border-on-navy-hair pt-4 mt-6`).

*Spacing:* panel-padding desktop `clamp(48px,4vw,76px)`; øk pusterom mellom ingress→CTA til
28px. Bilde-min-høyde uendret.

*Statstripe:* behold 3-delt, men hev typografi: tall Barlow 700 24px `navy` `tabular-nums`,
label 12,5px `muted`; hårlinje-delere. Legg `data-reveal` med liten stagger.

*Mikrointeraksjoner:* CTA-hover som B.1; kryssfade `dur-hero` `ease-standard`; reveal på
panelinnhold. Ved redusert bevegelse: statisk førstebilde, ingen kryssfade.

*Responsiv:* mobil stablet (bilde 300px topp med samme vignett-bunn, panel under, CTA-er
`fullWidth` stablet). Desktop to-kolonne.

*Tilgjengelighet:* H1 er eneste `<h1>`. Bilde har beskrivende `alt`; kryssfade-bilder er
dekorative → `alt=""` på slides 2–3, behold beskrivende alt på slide 1. Kontrast hvit tekst
på navy = AAA.

## C.3 Sesongkampanje-seksjon (ny, gjenbrukbar)

**Nåværende:** finnes ikke.

**Premium oppgradering**

*Konsept:* gjenbrukbar `SeasonCampaign`-blokk (props: `season: "sommer" | "vinter"`,
tittel, tekst, bilde, CTA-mål). Plasseres på forsiden mellom hero/statstripe og «Slik gjør
du», eller som slank band.

*Layout:* to-kolonne band på desktop — bilde (`0.9fr`, `r-card-lg`, `object-cover`,
sesongmotiv: sommer = pollen/insekter-nærbilde eller blank bil i sol; vinter = salt/
bremsestøv/hjulskift) + innholdskort (`0.1fr` tekst): eyebrow «Sesongtilbud · Sommer»,
`h2` («Skinnende ren bil til sommeren?»), 2–3 punktliste med hake-ikoner (pollen, insekter,
fugleskitt, kvae — håndvask uten mikroriper — tidsbesparelse mens du handler), CTA
`primary` «Book sommervask» + `ghost` «Se poleringspakker →». Mobil: stablet, bilde topp.

*Dybde:* nøkkelkort-nivå (`shadow-card`), `r-card-lg`. Én aksent — ingen ekstra farge for
«sommer/vinter»; motivet bærer sesongen.

*Tilstander/motion:* reveal; CTA-hover; bilde `hover:scale-[1.02]` i `overflow-hidden`.
Byttbar via CMS-prop uten kodeendring.

*Tilgjengelighet:* seksjon `aria-labelledby` mot H2; punktliste ekte `<ul>`.

## C.4 Populære tjenester + ServiceCard

**Nåværende:** «Populære tjenester» + «Se alle →»; 4 tjenester som rad-kort (60px
placeholder, navn, `kategori · varighet`, «fra {pris}», «Bestill →»). Hover: kant→navy.

**Premium oppgradering**

*Kort (bruk B.5):* bytt placeholder med ekte kvadrat-thumb fra `serviceImages`
(`*-thumb.webp`). Behold rad-layout på forsiden for tetthet, men hev: thumb 72px `r-media`,
navn `title`, meta `kategori · varighet` (`muted`), **nivå-tag** Basic/Pro der relevant
(`micro`-tag ved navn), PriceTag «fra {pris}» (Barlow 700 `navy`), mikro-CTA «Se mer →».
«Populær»-badge (B.9) diskret. Bruk **ekte** populær-tjenester og «fra»-priser fra auditen
(f.eks. *Vask ut-/innvendig – Premium* fra 1 490 kr; *Polering – Basic* fra 1 990 kr;
*Keramisk lakkforsegling* fra 9 990 kr med «6 års garanti»-badge; *Rens av enkelt sete*
fra 590 kr).

*Layout:* grid `repeat(auto-fit,minmax(320px,1fr))`, `gap-3.5`. Nøkkelkort-dybde
(`shadow-card` + hover-løft). SectionHeader (B.13) med «Se alle →».

*Mikrointeraksjoner:* hover `-translate-y-0.5 shadow-card-hover`, tittel→navy; thumb
`scale-[1.03]`; reveal-stagger over grid.

*Responsiv:* mobil enkolonne, kort `fullWidth`. Desktop 2–3 pr. rad.

*Tilgjengelighet:* hele kortet én lenke med tilgjengelig navn = tjenestenavn + pris; badge
har tekst (ikke bare farge).

## C.5 Tjenester-side (9 ekte kategorier)

**Nåværende:** eyebrow + H1 «Alt innen bilpleie» + undertekst; tjenester gruppert i 4
kategorier med små versal-headere + rad-kort (64px placeholder, navn, varighet, «fra {pris}»,
«Se mer →»).

**Premium oppgradering**

*IA:* de **9 ekte kategoriene** (Bilvask, Polering, Lakkforsegling, Full Shine, Interiør,
Dekk & Felg, Foliering, Smart Repair, Tilbehør). Toppen: SectionHeader (eyebrow «Tjenester»,
H1 «Alt innen bilpleie», ingress «Faste priser, ingen overraskelser. Lokale avvik vises per
avdeling.»).

*Filter + sortering (B.6):* sticky filterbar under header: CategoryFilter-chips («Alle» +
9 kategorier, aktiv navy-fylt, antall i parentes) + sorterings-`Select` («Populær» /
«Pris lav–høy» / «Pris høy–lav»). Mobil: chips i horisontal scroll-snap med kant-fade;
sortering som `Select` høyre.

*Visning:* to modus — (a) **filtrert grid** når en kategori er valgt (`repeat(auto-fit,
minmax(300px,1fr))` ServiceCards med thumb, nivå-tag, varighet, pris); (b) **grupperte
seksjoner** når «Alle» (hver kategori = SectionHeader + kort-grid, ankerbare
`id`-er for mega-menyen). Behold hårlinje-estetikk, hev til nøkkelkort-dybde på kortene.

*Basic/Pro:* der en tjeneste har nivåer, vis som to kort eller ett kort med to prislinjer
(«Basic fra 1 990 kr / Pro fra 2 990 kr») + nivå-tag. Garanti-badge der relevant.

*Tilstander:* chip default/hover/aktiv/focus; tom kategori → Empty state (B.12); sortering
oppdaterer med kort fade (`dur`). URL-synk (`?kategori=polering&sort=pris`) for delbarhet.

*Responsiv:* mobil enkolonne + horisontal filterscroll; desktop 2–3-kolonne grid + sticky
filterbar. *Tilgjengelighet:* filter som `role="group"`/`aria-pressed`; sorterings-`Select`
har label; endring annonseres via `aria-live="polite"` («Viser 6 tjenester i Polering»).

## C.6 Tjeneste-detalj

**Nåværende:** fullbredde bilde (220px) + floating «← Tjenester»; kategori-chip (+ «Populær»);
H1 = navn; beskrivelse; faktarad (Pris fra / Varighet); «Ofte valgt sammen» (opptil 3);
finstilt; sticky bunnbar «Legg til i booking · {pris}». Capp 760px.

**Premium oppgradering**

*Hero:* behold ekte fullbredde toppbilde (`hero`-varianten fra `serviceImages`), øk til
`clamp(240px,32vw,360px)`, subtil bunn-vignett for lesbar floating «← Tjenester»
(`secondary sm`, `shadow-xs`, `z-raised`). Legg Breadcrumb (B.10) over H1 på desktop.

*Hierarki:* kategori-chip + evt. «Populær»/«6 års garanti»-badge → H1 (`h1`) → ingress
(`body-lg`). **Faktaboks** (nøkkelkort, `surface-alt`, `r-card-lg`, `p-5`, grid 2–3 kolonner,
hårlinje-delere): «Pris fra {pris}» (PriceTag `feature` 28px), «Varighet {varighet}»,
og der det finnes **«Garanti»** (f.eks. Graphene 6 år; NANO ~12 mnd) og **«Nivå»** (Basic/
Pro). Under: kort punktliste «Dette inngår» med hake-ikoner (2–5 punkter).

*«Ofte valgt sammen»:* opptil 3 affinitets-tillegg som kompakte kort (navn, 1-linje, «+
{pris}»), horisontal snap på mobil. Overskrift som SectionHeader.

*Sticky booking-CTA:* behold bunnbar, hev visuelt: `surface`, `border-t border-line`,
`shadow-sticky`, `z-sticky`, inneholder tjenestenavn + PriceTag + `primary lg` «Legg til i
booking». På desktop kan den bli et **sticky sidepanel** (høyre kolonne, `sticky top-[88px]`)
med pris, varighet, garanti og CTA — mer premium på brede skjermer. Mikro: knappen får kort
«lagt til»-toast (B.12) og lenker til booking med tjenesten forhåndsvalgt (starter steg 1).

*Responsiv:* mobil enkolonne + sticky bunnbar; desktop capp 760px (eller to-kolonne 760+
320 sidepanel). *Tilgjengelighet:* faktaboks som `<dl>`; sticky-bar-knapp beskriver pris;
finstilt mva-tekst beholdt.

## C.7 Kundeklubb-seksjon (ekte mekanikk)

**Nåværende:** navy-kort «10 % på hovedvasken — hver gang» + generisk medlemstekst + «Bli
medlem — gratis». **Feil mekanikk.**

**Premium oppgradering**

*Ekte innhold:* erstatt med den reelle lojalitetsmekanikken:
- **«Få hver 6. utvendige Basic-vask GRATIS»** (etter 5 betalte vasker/behandlinger).
- **«GRATIS påfyll av spylervæske»** ved besøk når du kjøper en bilpleietjeneste.
- Gjelder medlemmer. CTA **«Bli medlem — gratis»**.

*Premium «stempelkort»-visual (5+1):* navy-panel (`bg-navy`, `r-card-lg`) med en rad av **6
stempelfelt** — 5 utfylte hake-/dråpe-ikoner (`on-navy-strong`) + det 6. som fremhevet
«GRATIS»-felt (hvit fyll, `text-navy`, subtil ring). Under: kort forklaring + spylervæske-
perk som egen liten linje med dråpe-ikon. Eyebrow «Kundeklubb». H2. CTA `onNavy`.

*Layout:* stempelkortet er blikkfanget (visuell metafor for progresjon). På desktop:
to-kolonne (tekst venstre, stempelkort høyre). Mobil: stablet, stempelrad horisontal
scroll om trangt.

*Mikrointeraksjoner:* stemplene reveal-stagger inn (dråpe «faller» — respekter redusert
bevegelse: da bare fade). Hover på CTA.

*Tilgjengelighet:* stempelraden er dekorativ illustrasjon → `aria-hidden`; en tekstlig
`sr-only`/synlig setning formidler «5 av 6 — neste Basic-vask gratis». Kontrast på navy AAA.

## C.8 Avdelinger (kart + premium avdelingskort)

**Nåværende:** eyebrow + H1 «14 avdelinger …» + SVG-kart; søkefelt + «📍 Nær meg»;
rangeringsnotat; avdelingskort (navn, adresse, «● Åpen nå», evt. kampanje, åpningstider,
«Book her»).

**Premium oppgradering**

*Layout:* på desktop **to-kolonne**: sticky kart venstre (`sticky top-[88px]`,
`r-card-lg`, `border border-line-strong`, `surface-sunken`-ramme), rullbar avdelingsliste
høyre. Mobil: kart topp (`clamp(220px,40vw,320px)`) + liste under. Søkefelt (B.7, lupe-ikon)
+ «📍 Nær meg» (`secondary`) over listen; rangeringsnotat som `small muted` linje.

*Premium avdelingskort (nøkkelkort):* `shadow-card`, `r-card-lg`, `p-5`:
- Tittel «Handz On {navn}» (`title`) + evt. avstand (`text-navy`, `tabular-nums`) når
  geolokalisert.
- Senter/adresse-linje (`small muted`): «{senter} · {adresse}, {postnr} {by}».
- Status-rad: **«● Åpen nå»** (B.9, grønn) / «Stengt nå» (gyllen) beregnet fra åpningstider;
  evt. **kampanje-chip** (navy-tint).
- Åpningstider-blokk kompakt (`small`, `tabular-nums`): «Man–fre 08–17 (tors. 18) · Lør
  10–15 · Søn stengt».
- Footer: `primary sm` **«Book her»** (→ booking med avdeling forhåndsvalgt, steg 2) +
  `ghost` «Veibeskrivelse →» (Maps-lenke).

*Mikrointeraksjoner:* hover-løft på kort + korresponderende kart-prikk får `navy-tint-14`-
glød/scale (koblet hover kort↔kart); klikk på kart-prikk ruller til kortet (`scroll-into-view`,
`focus`). «Nær meg» viser lasteindikator på knappen.

*Tilstander:* søk uten treff → vis alle + Empty-notat (aldri tom liste); geolokalisering
avslått → notat. *Responsiv:* enkolonne mobil, to-kolonne desktop. *Tilgjengelighet:* kart
har `role="img"`/tekstalternativ; «Åpen nå» har tekst, ikke bare prikk; avstand annonseres.

## C.9 Booking (7 steg — hev det visuelle, behold flyten)

**Nåværende:** «← Tilbake», «Steg N av 7», 7-segments tynn progresjonsbar, stegetikett;
kolonne capp 680px. Steg 1 avdeling (auto-advance), 2 bil (reg-nr), 3 tjeneste (Vipps/
medlem), 4 tidspunkt (dag-chips + slots), 5 tillegg, 6 oppsummering, 7 bekreftelse/kvittering.

**Premium oppgradering (behold logikk/auto-advance/priser 100 %)**

*Progresjon:* behold 7-segments bar, men hev til **premium steg-indikator**: fylte segment
`navy`, aktivt segment med subtil puls-ende, kommende `line-strong`. Over baren: stegetikett
(`eyebrow`) + «Steg N av 7» (`small muted tabular-nums`). Sticky topp-chrome
(`bg-white/94 backdrop-blur border-b border-line z-sticky`) med «← Tilbake» (skjult steg 1
og 7). Valgfritt: klikkbare fullførte steg for å hoppe tilbake (samme som «Endre»).

*Steg-kort:* hvert steg i et rolig, luftig kort (maks 680px sentrert). Konsekvent
SectionHeader per steg (kort spørsmål-tittel + 1-linje hjelpetekst).

- **Steg 1 Avdeling:** søk + «Nær meg» + rangert liste av **select-kort** (B.3 selected:
  `border-2 border-navy bg-navy-tint-06` + fylt ✓). Valg → auto-advance til 2, nullstill
  dato/tid. Nøkkelkort-dybde.
- **Steg 2 Bilen din:** stor sentrert reg-nr-input (B.7-spesial), «Hent bilinfo»
  (`primary`, disabled til gyldig, `loading` under oppslag ~450ms). Suksess: «funnet bil»-kort
  (`surface-alt`, `r-card-lg`) med merke/modell/år + drivstoff · farge + `primary` «Dette
  stemmer — gå videre». Feil (`FE11111`/ugyldig): manuelle merke/modell-felt + `secondary`
  «Fortsett uten oppslag». Vis kjente demo-plater som hjelpetekst i dev.
- **Steg 3 Tjeneste:** Vipps-innlogging-kort (Vipps-oransje, kun her) eller medlemsbanner
  når innlogget; tjenester gruppert per kategori, filtrert på lokal tilgjengelighet; priser
  reflekterer lokale overstyringer; medlem → overstrøket standardpris + `text-navy`
  medlemspris (PriceTag `member`). Valg → auto-advance til 4.
- **Steg 4 Tidspunkt:** horisontal scroll av **dag-chips** (14 dager: ukedag / dato / mnd;
  valgt = navy-fylt, `snap-x`); under: «Ledige tider {dato}» grid (3 kol) med kapasitets-
  undertekst («1 plass igjen» `danger`-tonet når knapt / «N plasser»). Tom dag → Empty
  state (B.12). Valg → auto-advance til 5.
- **Steg 5 Tillegg:** tillegg sortert med anbefalte først («Ofte valgt sammen»-pille);
  toggle-select (✓, `selected`-kort). Sticky bar: «Gå videre med N tillegg» / «… uten
  tillegg».
- **Steg 6 Oppsummering:** oppsummeringskort (Avdeling / Bil / Tidspunkt, hver med «Endre»
  → hopper til riktig steg). Prisspesifikasjon (`tabular-nums`, høyrejustert): tjenestelinje,
  tilleggslinjer, «Kundeklubb-rabatt (10 %)» (`text-navy`, når medlem), «Herav mva. (25 %)»
  (2 desimaler), **«Å betale ved henting»** total (`price feature`), selger-org-linje.
  Kontaktkort (Navn + Mobil, evt. «Fyll ut med Vipps»). `primary lg` «Bekreft bestilling –
  {total}» (disabled til navn > 1 og telefon ≥ 8). Finstilt: «Gratis avbestilling frem til
  24 timer før avtalt tid.»
- **Steg 7 Bekreftelse:** stor hake-badge (`status-open`, animasjons-scale inn — respekter
  redusert bevegelse) + «Takk for bestillingen!» + «Referanse {HOAC-XXXX}. Bekreftelse er
  sendt på SMS.» **Kvitteringskort:** navy-hode «Handz On Auto Care / Kvittering», rader
  (Referanse, Tjeneste + Tillegg, Avdeling, Tidspunkt, Bil), stiplet delelinje, «Å betale
  ved henting {total}», strekkode-stripe, org.nr-linje. CTA `secondary` «Last ned kvittering
  (PDF)» + `primary` «Til forsiden». Footer skjult i hele flyten (behold).

*Mikrointeraksjoner:* auto-advance med kort fremover-glide (`dur` `ease-standard`; ved
redusert bevegelse: instant); valg-kort ✓ «pop»; slot-valg highlight. *Responsiv:* alt
enkolonne, knapper `fullWidth`, sticky barer nederst; desktop capp 680px sentrert.
*Tilgjengelighet:* progresjon `role="progressbar" aria-valuenow/aria-valuemax`; hvert steg
`aria-labelledby` steg-tittel; auto-advance annonseres (`aria-live="polite"` «Steg 2 av 7 —
Bilen din»); input-feil `aria-invalid`; disabled-knapper forklart med hjelpetekst, ikke bare
farge; fokus flyttes til nytt stegs overskrift ved advance.

## C.10 Om oss

**Nåværende:** fullbredde bilde (240px) → navy intro-band (eyebrow, H1 «Kvalitet du kan
stole på», lead); stat-tiles (14 avdelinger / 120k+ biler); tre prinsipper som hårlinje-
blokker; avsluttende «Bestill time».

**Premium oppgradering**

*Hero + intro:* behold ekte toppbilde (`aboutHeroImage`) → navy intro-band (eyebrow «Om oss»,
H1, lead om kjeden og visjonen «samle alt innen bilpleie under ett tak»). Legg til
**«20 år»-markør** (grunnlagt ~2005) som stat-tile og et diskret jubileums-notat.

*HANDZON-verdiseksjon (ny, kjerne):* de 7 verdiene som akronym-grid (`repeat(auto-fit,
minmax(220px,1fr))`, hårlinje-delte blokker eller `surface-alt` tiles): **H**andlekraft ·
**A**nsvarlig · **N**yskapende · **D**irekte (ærlig) · **Z**en (tilstede/disiplinert) ·
**O**ppmerksom · **N**øye. Hver: stor Barlow-forbokstav (`navy`), verditittel, 1-linje.

*Historie/visjon:* kort tidslinje-band (2005 grunnlagt → vekst → Norden/Strömstad → 20 år
2025) som hårlinje-delt horisontal rad (`tabular-nums` årstall). Visjonssitat i navy-band
(`h3`, `text-white`, `max-w-[64ch]`).

*Bærekraft:* egen blokk med 2–3 punkter (miljøvennlige produkter, mindre vann/energi/plast,
egne produkter på sikt) + hake-ikoner. Rolig, ingen ny farge.

*Stat-tiles:* 14 avdelinger · 120 000+ biler · 20 år · 4,8/5 score.

*Avslutning:* `primary` «Bestill time» + `secondary` «Bli franchisetaker». *Responsiv:*
grid kollapser til enkolonne mobil. *Tilgjengelighet:* verdiliste som `<dl>`/`<ul>`;
tidslinje lesbar lineært; kontrast AAA på navy.

## C.11 Footer (speil ekte IA)

**Nåværende:** `#F4F5F7`, topp-hårlinje, logo + enkel lenkerad (Tjenester/Avdelinger/Om oss/
Bestill time) + finstilt franchise/godkjenning.

**Premium oppgradering**

*Struktur (speil ekte IA):* fler-kolonne footer (`surface-alt`, topp-hårlinje,
`pad-section`):
- **Kolonne 1 — Merke:** logo (light-versjon på lys flate) + kort løftesetning + evt. 20-år-
  linje.
- **Kolonne 2 — Informasjon:** Om oss · Bli franchisetaker · Bli medlem · SMS & E-post ·
  Jobb hos oss · Kontakt oss · Bilpleie-guiden · Nyheter.
- **Kolonne 3 — Tjenester (utvalg):** de mest søkte kategoriene + «Se alle tjenester».
- **Kolonne 4 — Mine sider:** Logg inn · Ny kunde · Gavekort.

*Juridisk/bunnlinje:* hårlinje-delt bunnstripe: «© 2026 Handz On Auto Care · Franchisekjede
med 14 lokale avdelinger. Hver avdeling drives av egen juridisk enhet.» + **org.nr-linje**
(«Handz On Norway AS, Laguneveien 7, 5239 Rådal · Org. 821230152 MVA») + **godkjenning**
(«Registrert i Arbeidstilsynets godkjenningsordning for bilpleie») + Vilkår · Personvern ·
Cookies. Skjult i booking-flyten (behold).

*Tilstander:* lenker `text-body` hover `text-navy`. *Responsiv:* kolonner stables til
accordion/enkel liste på mobil. *Tilgjengelighet:* `<footer>` landmark, lenke-grupper med
`<nav aria-label>` og synlige gruppetitler (`eyebrow`).

## C.12 Trust / godkjenning-seksjon (ekte verifiseringslenker)

**Nåværende:** kort hårlinje-notis «Alle avdelinger er registrert i Arbeidstilsynets
godkjenningsordning …».

**Premium oppgradering**

*Innhold:* egen trust-band (forside + relevante sider): 2–3 verifiserings-«merker» som kort
med hake/skjold-ikon (`status-open`), tittel og **ekte utgående lenke**:
- **Arbeidstilsynets godkjenningsordning for bilpleie** → verifiseringslenke
  (`target="_blank" rel="noopener"`, ekstern-ikon).
- **Statens vegvesen** (godkjent for relevante tjenester) → lenke.
- Evt. «20 års erfaring» / «120 000+ biler behandlet» som tillitstall.

*Layout:* hårlinje-delt trippel eller `surface-alt` tiles, rolig. `small`-tekst,
Barlow-titler. *Tilstander:* lenke-hover `text-navy` + understrek; ekstern-ikon `aria-hidden`,
`aria-label` sier «åpnes i ny fane». *Tilgjengelighet:* «Godkjent» formidles i tekst;
lenker har beskrivende navn.

---

## Nye sider (full design)

## C.13 Nyheter

**Kort-grid + tags + detalj + video.**

*Landing:* SectionHeader (eyebrow «Aktuelt», H1 «Nyheter»). Filter-chips (B.6): Alle ·
Nyhet · Presse · Guide · Nyåpning. **Kort-grid** (`repeat(auto-fit,minmax(300px,1fr))`,
`gap-grid`) med nyhets-kort (nøkkelkort): 16:9 media-topp (`r-media`, `object-cover`;
video-saker får sentrert play-ikon-overlegg), tag (B.2) + dato (`small muted tabular-nums`),
tittel (`title`, `line-clamp-2`), ingress (`small body-soft`, `line-clamp-2`), «Les hele
saken →» / «Se video →». Bruk ekte saker: 20-årsjubileum (2025), «Trygg og seriøs bilpleie»,
Arbeidstilsynet/HMS, gründer Ove Hagen, «Brødresuksess i Åsane», NRK Vestlandsrevyen,
«Revolusjonerende renseanlegg» (video), nyåpninger (Triaden, Moss feb 2027, Trekanten/Asker,
Rortunet, Kuben/Hønefoss).

*Detalj:* fullbredde hero-bilde (eller innebygd video-lightbox, `z-modal`), Breadcrumb,
tag + dato, H1, lead, brødtekst (`body`, `max-w-[68ch]` for lesbarhet), evt. sitat-blokk
(navy venstrekant), «Relaterte saker» (3 kort). Video: klikk play → modal med `<video>`/
embed, `Esc`/klikk-utenfor lukker, fokusfelle.

*Tilstander:* tom kategori → Empty state; video-kort har play-badge + `aria-label`.
*Responsiv:* mobil enkolonne. *Tilgjengelighet:* tags er lenker; datoer `<time datetime>`;
video har tekstalternativ/undertekster der mulig.

## C.14 Gavekort

**Beløpsvalg 200/500/1000/2500/5000 + fritt + hilsen + kjøp.**

*Layout:* to-kolonne på desktop — **produkt-preview** venstre (visuelt gavekort:
navy-kort `r-card-lg` `shadow-card` med logo, «Gavekort», valgt beløp stort `price feature`,
og hilsen-forhåndsvisning) + **konfigurator** høyre. Mobil: preview topp, konfigurator under.

*Konfigurator:* SectionHeader (eyebrow «Presang», H1 «Gi bilpleie i gave»). **Beløpsvalg**
som segment/chips (B.2): 200 · 500 · 1000 · 2500 · 5000 kr + «Fritt beløp» (Input, min/maks).
Valgt beløp = navy-fylt chip, oppdaterer preview live. Felt: **hilsen** (Textarea, teller,
speiles i preview), **mottakers navn/e-post** (valgfritt, for digital levering),
**avsenders navn**. Leveringsvalg (e-post nå / skriv ut selv). `primary lg fullWidth`
**«Kjøp gavekort — {beløp}»**.

*Presang-følelse:* mykt løftet gavekort-preview, subtil skygge; ved beløpsbytte kort
tall-«tick»-animasjon (redusert bevegelse: instant). Ingen ekstra farge — navy + hvit
bærer det premium.

*Tilstander:* fritt-beløp validering (`danger` ved < min); «Kjøp» disabled til gyldig beløp;
suksess → Toast «Gavekort lagt i handlekurv» + evt. checkout-lenke. *Responsiv:* stablet
mobil. *Tilgjengelighet:* beløps-chips som `role="radiogroup"`; hilsen-teller `aria-live`;
preview `aria-hidden` (dekorativt speil av felt).

## C.15 Selge bil

**3 pakker + verdipunkter (14 %/30 %/360°-foto).**

*Hero:* eyebrow «Selge bil», H1 «Få mer for bilen — salgsklar på ett sted», lead om
verdiøkning. **Verdipunkt-stripe** (Stat-tiles): «**+14 %** høyere salgspris» · «**30 %**
raskere salg» · «**360°-foto** inkludert» · «Gratis vurdering». (`tabular-nums`, `navy`.)

*3 pakker som sammenlignbare pakkekort* (`repeat(auto-fit,minmax(300px,1fr))`, nøkkelkort,
midterste «Premium Polering» fremhevet med `border-2 border-navy` + «Mest valgt»-badge):
1. **Salgsklar Basis** — grundig ut-/innvendig klargjøring, «fra {pris}».
2. **Premium Polering** — + polering/oppfrisking av lakk, «fra {pris}» (fremhevet).
3. **Full Shine – Toppklasse** — total renovering + beskyttelse, «fra {pris}».
Hvert kort: pakkenavn (`h3`), kort løfte, **hva inngår** (hake-liste), PriceTag «fra …»,
`primary` «Bestill vurdering» / «Book pakke».

*Sammenligning:* valgfri hårlinje-delt funksjonstabell under kortene (rader = tiltak,
kolonner = pakker, ✓/–). *Tillit:* trust-band (C.12) + 360°-foto-eksempel (lightbox).

*Tilstander:* pakkekort hover-løft; fremhevet kort alltid visuelt løftet. *Responsiv:*
kort stables mobil, fremhevet først. *Tilgjengelighet:* «Mest valgt» i tekst; tabell med
`<th scope>`; 360°-viewer har tastatur/tekstalternativ.

## C.16 Bli franchisetaker

**Rekruttering: mulighet, nøkkeltall, ledige lokasjoner, CTA/skjema.**

*Hero:* eyebrow «Franchise», H1 «Bygg din egen Handz On», lead om muligheten (bilpleie på
Europas største kjøpesentre/lufthavner). `primary` «Meld interesse» + `secondary` «Last ned
prospekt».

*Mulighet:* 3–4 verdiblokker (hårlinje-delt): etablert merke & system, opplæring & drift-
støtte, sterk beliggenhet (senter), voksende marked. Ikoner (linje, `navy`).

*Nøkkeltall (Stat-tiles):* «14 avdelinger» · «20 år» · «120 000+ biler» · eksempel-omsetning
(«Åsane: nær 5 mill»). `tabular-nums`.

*Ledige lokasjoner:* kort-liste/kart-utsnitt over åpne/kommende (Moss – nyåpning feb 2027,
Trekanten/Asker, Rortunet/Slemmestad, Kuben/Hønefoss) med status-chip («Ledig»/«Kommer»);
solgte vist dempet.

*CTA/skjema:* interesseskjema (Input/Select, B.7): navn, e-post, telefon, ønsket region/
lokasjon (`Select`), egenkapital-intervall (`Select`), melding (Textarea), samtykke-
avkrysning. `primary lg` «Send interesse» → Toast/bekreftelse. *Tilstander:* validering pr.
felt; disabled til påkrevde utfylt. *Responsiv:* skjema enkolonne mobil, to-kolonne felt-par
desktop. *Tilgjengelighet:* fieldset/legend, feilsammendrag øverst ved submit-feil.

## C.17 Bilpleie-guiden (innholdshub)

*Landing:* eyebrow «Kunnskap», H1 «Bilpleie-guiden», lead. Fremhevet artikkel (stort kort,
16:9) + tema-filter (Vask · Polering · Lakkbeskyttelse · Interiør · Sesong · Hjul). Guide-
grid (nøkkelkort: media, tema-tag, lesetid `small muted`, tittel, ingress). Ekte temaer fra
auditen: «Fjerning av salt, bremsestøv og skitt», «Grundig hjulvask ved hjulskift», «Vær
tidlig ute med hjulskift — kombiner med polering», «Viktighet av regelmessig pleie».

*Artikkel:* leservennlig typografi — `body` 18px, `max-w-[68ch]`, generøs line-height 1.65,
tydelige H2/H3, bilder med bildetekst (`small muted-light`), sitat-blokker (navy venstrekant),
punktlister. Sticky innholdsfortegnelse på desktop (`sticky top-[88px]`, hårlinje-lenker,
aktiv seksjon uthevet). Bunn: «Relaterte guider» + CTA til relevant tjeneste/booking.

*Tilstander:* TOC aktiv-seksjon via scroll-spy (`aria-current`). *Responsiv:* TOC kollapser
til `<details>` topp på mobil. *Tilgjengelighet:* semantiske overskriftsnivåer, skip-lenke
til innhold, lesbar kontrast, ekte `<article>`.

## C.18 Kontakt

**Skjema: navn/e-post/telefon, type (endring/forespørsel/reklamasjon), velg avdeling.**

*Layout:* to-kolonne desktop — **skjema** venstre, **kontaktinfo** høyre (org.linje,
sentralbord/e-post, «Finn din avdeling»-lenke, åpningstider-notat, evt. lite kart). Mobil:
skjema først, info under.

*Skjema (B.7):* SectionHeader (eyebrow «Kontakt», H1 «Kontakt oss», lead). Felt: **Navn**,
**E-post**, **Telefon**, **Type henvendelse** (`Select`: Endring · Forespørsel · Reklamasjon
· Annet), **Velg avdeling** (`Select` med de 14 avdelingene), **Melding** (Textarea, teller),
samtykke-avkrysning. `primary lg` «Send henvendelse». Reklamasjon-valg kan avsløre ekstra
felt (ordrereferanse `HOAC-…`).

*Tilstander:* inline-validering (`aria-invalid`, `danger`); e-post/telefon-format;
submit disabled til påkrevde felt; suksess → Empty/Toast «Takk — vi svarer normalt innen 1
virkedag». *Responsiv:* enkolonne mobil. *Tilgjengelighet:* `<label>` for hvert felt,
`aria-describedby` hjelpetekst, feilsammendrag med lenker til felt, fokus til første feil.

---

# D. Prioritert implementeringsrekkefølge + premium-sjekkliste

## D.1 Prioritert rekkefølge (høy verdi først)

**Fase 0 — Fundament (blokkerer alt annet)**
1. Utvid Tailwind-tokens (A): skygge-stige, semantiske farger, motion/easing, fokus-ring,
   z-skala, type-/spacing-tokens. Legg inn `prefers-reduced-motion`-global.
2. Kjerne-atomer/molekyler (B): Button (alle varianter/tilstander), Chip, Card,
   PriceTag, ServiceCard, Input/Select, Badge, SectionHeader, Empty state, fokus-ring.

**Fase 1 — Datasannhet + høyest konverteringsverdi**
3. Erstatt mock-katalog med **ekte 9 kategorier / ~40 tjenester + Basic/Pro + garanti**.
4. **ServiceCard + Populære tjenester + Tjenester-side** (filter/sortering) på ekte data.
5. **Header/nav** med mega-meny + nye toppvalg.
6. **Kundeklubb-seksjon** med ekte mekanikk (stempelkort 5+1 + spylervæske).
7. **Booking**-visuell heving (progresjon, steg-kort, sticky CTA, kvittering) — logikk uendret.

**Fase 2 — Tillit + hero + avdelinger**
8. **Hero** (cinematisk, valgfri kryssfade, trust-markør) + **Trust/godkjenning**-band
   (ekte lenker).
9. **Avdelinger** (to-kolonne, sticky kart, premium kort, «Åpen nå»).
10. **Tjeneste-detalj** (faktaboks m/ garanti, sticky sidepanel/bar).
11. **Sesongkampanje**-blokk (gjenbrukbar).
12. **Footer** (ekte IA + org.nr + godkjenning). **Om oss** (HANDZON-verdier, 20 år,
    bærekraft).

**Fase 3 — Nye salgs-/innholdssider**
13. **Selge bil** (3 pakker + verdipunkter). 14. **Gavekort** (beløp + hilsen).
15. **Nyheter** (grid + detalj + video). 16. **Kontakt** (skjema).
17. **Bli franchisetaker**. 18. **Bilpleie-guiden**.

**Fase 4 — Finpuss**
19. Toasts, mikrointeraksjoner, reveal-stagger, koblet kart↔kort-hover, 360°/video-lightbox.
20. Tilgjengelighets- og kontrast-revisjon (aksesibilitetstest), redusert-bevegelse-QA.

## D.2 Premium-sjekkliste (bruk på hver komponent før «ferdig»)

- [ ] **Én aksent:** kun navy som farge-aksent; grønn/rød kun som funksjonell status ≤10px.
- [ ] **Luft:** seksjon topp ≥ 40px mobil / 48px desktop; overskrift→innhold 20–24px.
- [ ] **Hierarki:** eyebrow → H → ingress → innhold; maks én `<h1>` pr. side.
- [ ] **Dybde med måte:** `shadow-card` kun på nøkkelkort; lister forblir hårlinje-flate;
      aldri to skyggenivåer i samme kontekst; maks 2px hover-løft.
- [ ] **CTA tydelig:** primær = navy-fylt; én primær pr. skjermseksjon; disabled forklart
      med tekst, ikke bare farge.
- [ ] **Bildekrop konsekvent:** thumbs kvadrat (`1:1`), hero-bånd `16:9`/fast høyde,
      `object-cover`, `r-media`.
- [ ] **Tall = Barlow + `tabular-nums`** i priser, stats, oppsummering, åpningstider.
- [ ] **Tilstander komplett:** default/hover/active/focus/disabled + loading/empty/error der
      relevant.
- [ ] **Fokus synlig:** `focus-visible` ring på alle interaktive elementer; treff ≥44px mobil.
- [ ] **WCAG-kontrast:** tekst ≥ 4,5:1 (stor ≥ 3:1); ikke kun farge som informasjonsbærer.
- [ ] **Redusert bevegelse:** all transform/kryssfade/reveal nøytralisert; auto-advance
      beholdt uten glide.
- [ ] **Norsk (bokmål)** i all UI-tekst; ekte priser («fra …»), ekte kundeklubb-mekanikk.
- [ ] **Mobil først:** enkolonne, `fullWidth`-knapper, sticky barer, horisontal scroll-snap
      for filter/dag-chips; alt testet < 900px før desktop.

---

*Slutt på spesifikasjon. Alle nye tokens er additive til demoens eksisterende Tailwind-tema;
ingen kjerneverdi (navy/ink/lys flate/hårlinje/Barlow/Source Sans 3/900px/1180px) er endret.*
