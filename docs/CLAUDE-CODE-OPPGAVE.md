# Implementeringsoppgave for Claude Code — Handz On demo

Kjør denne oppgaven i repoet `handzon-1` (Next.js 15 + TypeScript + Tailwind v4).
Referanser som allerede ligger i repoet:
- `docs/HANDZON-AUDIT-OG-DESIGNBRIEF.md` — ekte innhold, priser, tilbud, nyheter, gap-analyse.
- `docs/HANDZON-DESIGNSPEC.md` — premium redesign-spesifikasjon per komponent (følg denne for utseende/UX).

## Mål (avgrenset scope — IKKE gjør resten)
Implementer KUN dette utvalget:
1. **Erstatt mock-data med et kuratert utvalg av den ekte tjenestekatalogen** (ikke alle 9 kategorier — bruk de 6 under), med ekte priser og nivåer (Basic/Premium/Pro).
2. **Kundeklubb**: bytt den generiske «10 %»-CTA-en med den ekte mekanikken + lag en `/kundeklubb`-side (stempelkort 5+1).
3. **Nyheter**: ny `/nyheter` (kort-grid) + `/nyheter/[slug]` (detalj) som en mockup med et knippe artikler.
4. **Kontakt**: ny `/kontakt` med skjema (navn/epost/telefon, henvendelsestype, velg avdeling).
5. **Trust/godkjenning**: styrk trygghets-seksjonen med ekte verifiseringslenker.

**Hopp over for nå:** Gavekort, Selge bil, Bli franchisetaker, Bilpleie-guiden, Jobb/Gjestebok/SMS-preferanser, hero-slideshow, sesongkampanje-blokk.

**Viktig:** De nye sidene skal være **vår egen premium design** (følg `HANDZON-DESIGNSPEC.md`) — IKKE en ren kopi av handzon.no. Behold designidentiteten: navy `#1e3a70` (hover `#294b8c`), Barlow + Source Sans 3, hårfine linjer, radius 8/10–12px, breakpoint `hz` = 900px, container maks ~1180–1280px. All tekst på norsk (bokmål).

---

## 1) Kuratert ekte tjenestekatalog (erstatter de 8 fiktive)

Priser er **øre inkl. 25 % mva** (kr × 100). Formatér med `formatOre` i `lib/format.ts`.
Legg til feltene `level?` og `guarantee?` på `Service` (se «Kobling» under).

**Bilvask**
- Vask utvendig – Basic · `vask-utvendig-basic` · 54000 · 30 min · Basic
- Vask utvendig – Premium · `vask-utvendig-premium` · 79000 · 45 min · Premium · populær
- Vask ut-/innvendig – Premium · `vask-ut-innvendig-premium` · 149000 · 75 min · Premium · populær

**Polering**
- Polering – Basic · `polering-basic` · 199000 · 180 min · Basic · populær
- Polering – Pro · `polering-pro` · 299000 · 240 min · Pro
- Lakkrens + Polering – Pro · `lakkrens-polering-pro` · 449000 · 390 min · Pro

**Lakkforsegling**
- Keramisk lakkforsegling · `keramisk-lakkforsegling` · 999000 · 480 min · populær · guarantee: «6 års garanti (Graphene)»
- Kontrollvask & rebehandling · `kontrollvask-rebehandling` · 169000 · 120 min

**Full Shine** (total renovering ut + innvendig)
- Full Shine – Basic · `full-shine-basic` · 649000 · 480 min · Basic
- Full Shine – Pro · `full-shine-pro` · 749000 · 570 min · Pro · populær (klimadesinfisering + NANO ~12 mnd)

**Interiør**
- Rens innvendig (dyprens) · `rens-innvendig` · 399000 · 330 min · populær
- Skinn rens og behandling · `skinn-rens-behandling` · 199000 · 120 min
- Ozon / desinfisering · `ozon-desinfisering` · 169000 · 60 min

**Dekk & Felg**
- Skift av hjul · `skift-av-hjul` · 50000 · 30 min
- Omlegg og balansering · `omlegg-balansering` · 130000 · 75 min
- Vask av hjul · `vask-av-hjul` · 25000 · 20 min

Korte, ekte beskrivelser finnes i `HANDZON-AUDIT-OG-DESIGNBRIEF.md` (seksjon 3) — gjenbruk dem.

### Bilder (GJENBRUK — ikke last ned nye)
Filene ligger allerede i `/public`. Map per tjeneste i `lib/service-images.ts` (nøkkel = slug, `{thumb, hero}`):
- Bilvask basic/premium → `/tjenester/utvendig-handvask(.webp / -thumb.webp)`; ut-/innvendig → `/tjenester/utvendig-vask-og-voks*`
- Polering (alle) → `/tjenester/polering*`
- Lakkforsegling (begge) → `/tjenester/keramisk-coating*`
- Full Shine (begge) → `/tjenester/komplett-bilpleie*`
- Interiør (alle) → `/tjenester/innvendig-rens*`
- Dekk & Felg (alle) → `/hero-hjulskift.webp` (bruk samme fil for både thumb og hero; `object-cover` beskjærer til kvadrat)

## 2) Kundeklubb (ekte mekanikk)
Ekte tilbud: **«Hver 6. utvendige Basic-vask GRATIS (etter 5 betalte vasker/behandlinger)»** + **«GRATIS påfyll av spylervæske ved besøk når du kjøper en bilpleietjeneste»**. Gjelder kun medlemmer.
- Bytt «10 % på hovedvasken»-seksjonen på forsiden (`app/page.tsx`, KUNDEKLUBB-blokken) med denne mekanikken + CTA «Bli medlem».
- Ny side `app/kundeklubb/page.tsx`: forklaring + **stempelkort-visual 5+1** (5 betalte → 6. gratis) + spylervæske-perk + «Bli medlem»-CTA (kan peke til `/booking` eller `/min-side`).
- La bookingens eksisterende medlemslogikk (Vipps-innlogging, `member`-rabatt) stå urørt — ikke riv ut prislogikken. Kundeklubb-siden er front-facing markedsføring.

## 3) Nyheter (mockup, egen design)
- `lib/news.ts`: 6–8 mock-artikler `{ slug, title, date, tag, excerpt, body, video? }`. Tags: `Nyhet | Presse | Guide | Nyåpning`. Hent innhold fra audit-dokumentet (seksjon 5): f.eks. 20-årsjubileum, «Trygg og seriøs bilpleie», hjulvask-guide, ny avdeling Triaden, osv.
- `app/nyheter/page.tsx`: kort-grid med bilde/tag/tittel/dato/ingress (gjenbruk et par eksisterende bilder for topp-/kortbilder). Enkelt tag-filter er fint.
- `app/nyheter/[slug]/page.tsx`: detaljside (`generateStaticParams`), lesevennlig typografi, «← Nyheter»-lenke.

## 4) Kontakt (egen design)
- `app/kontakt/page.tsx` (client-komponent for skjema): felter navn, epost, telefon; henvendelsestype (`Endring/avbestilling | Forespørsel | Reklamasjon`); velg avdeling (fra `locations` i mock-data). Mock-innsending (ingen backend) → vis en pen bekreftelses-/suksesstilstand. Validering + tilgjengelige labels.

## 5) Trust / godkjenning
- Komponent/seksjon som styrker dagens «Trygghet»-notis på forsiden med ekte lenker (åpne i ny fane, `rel="noopener"`):
  - Arbeidstilsynet: `https://www.arbeidstilsynet.no/bilpleievirksomhet/`
  - Statens vegvesen (finn godkjent verksted): `https://www.vegvesen.no/kjoretoy/eie-og-vedlikeholde/finn-godkjent-verksted/`
- Følg trust-seksjonen i `HANDZON-DESIGNSPEC.md`.

---

## Kobling / filer som MÅ oppdateres konsistent (ellers brekker bygg/booking)
- **`lib/types.ts`**: utvid `ServiceCategory`-unionen til de 6 nye kategoriene (`"Bilvask" | "Polering" | "Lakkforsegling" | "Full Shine" | "Interiør" | "Dekk & Felg"`). Legg til `level?: "Basic" | "Premium" | "Pro"` og `guarantee?: string` på `Service`.
- **`lib/mock-data.ts`**: erstatt `services`-arrayet med katalogen over. Oppdater `addOnAffinity` (nøkkel = ny service-`id`; detaljsiden tåler manglende via `?? []`, men legg inn et par for demo). Oppdater `locationServiceOverrides` til å referere **nye** service-id-er (behold funksjonen: f.eks. lokal pris på `full-shine-pro`, `vask-utvendig-premium`; `unavailable` på `keramisk-lakkforsegling` i én avdeling). Behold `addOns`, `getEffectivePrice`, `isServiceAvailable`, `getServiceBySlug`.
- **`app/booking/wizard.tsx`** (~44 KB, KRITISK): oppdater den interne `categoryOrder`/kategorilistene til de 6 nye kategoriene. Steg 3 grupperer tjenester per kategori og bruker `getEffectivePrice`/`isServiceAvailable` — verifiser at det fortsatt fungerer. **Ikke endre booking-logikken/flyten**, kun kategori-/data-referanser.
- **`app/tjenester/page.tsx`**: oppdater `categoryOrder` til de 6 nye kategoriene; vis `level`-nivå på kortene.
- **`app/tjenester/[slug]/page.tsx`**: bruker `getServiceImage(slug)` + `addOnAffinity`. Vis `guarantee` i fakta-raden der den finnes.
- **`app/page.tsx`**: `popularServices = services.filter(popular)` — sørg for at nye «populær»-flagg gir 3–4 kort. Bytt KUNDEKLUBB-blokken (pkt. 2). Styrk TRYGGHET-blokken (pkt. 5).
- **`lib/service-images.ts`**: legg inn alle 16 nye slugs (map per pkt. 1).
- **`components/site/Header.tsx`**: legg til `Nyheter`, `Kontakt` (og ev. `Kundeklubb`) i `navLinks` (både desktop-nav og mobil-overlay). Ikke overfyll — vurder Tjenester-dropdown per designspec (valgfritt).
- **`components/site/Footer.tsx`**: legg til `Nyheter`, `Kontakt`, `Kundeklubb` i `links`. Behold finstilt-teksten.
- **`app/sitemap.ts`**: legg til `/nyheter` (+ artikler), `/kontakt`, `/kundeklubb`.
- Behold `lib/booking-adapter.ts` og `lib/receipt.ts` (refererer service via id — OK når id-er er konsistente).

## Designsystem (hold deg til dette)
Tokens finnes i `app/globals.css` (`--color-navy`, `--color-line-strong`, `--color-surface-alt`, `hz:`-breakpoint m.m.) og komponentene `components/ui/Button.tsx` (`Button`/`ButtonLink` med varianter `primary|secondary|ghost|vipps|onNavy|heroOutline`) og `components/ui/Card.tsx` (`Card`, `Badge`). Gjenbruk disse. Følg skygge-/tilstand-/tilgjengelighetsføringene i `HANDZON-DESIGNSPEC.md` (skygger kun på nøkkelkort, synlig `focus-visible`, WCAG-kontrast, `prefers-reduced-motion`).

## Ferdigkriterier (verifiser før du er ferdig)
1. `npx tsc --noEmit` er ren, og `npm run build` går grønt.
2. `/tjenester` viser de 6 kategoriene med ekte priser + nivåer; kortbilder vises.
3. `/tjenester/[slug]` virker for alle nye slugs (hero-bilde + fakta, garanti der relevant).
4. **Booking (`/booking`) fungerer ende-til-ende**: steg 3 lister nye tjenester per kategori med riktige priser; oppsummering/kvittering stemmer.
5. Forsiden viser ekte kundeklubb-mekanikk + styrket trust-seksjon med fungerende lenker.
6. `/kundeklubb`, `/nyheter`, `/nyheter/[slug]`, `/kontakt` finnes, er responsive (mobil/desktop) og lenket fra header/footer.
7. Ingen `ImagePlaceholder` i de berørte flatene; norsk tekst overalt; identiteten (navy/Barlow) bevart.

Jobb i små, verifiserbare steg (data → sider → nav → build). Kjør bygg til slutt.
