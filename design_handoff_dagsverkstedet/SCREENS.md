# Skjermer

Seksjon for seksjon, med repo-fil, layout og innhold. Referansen ligger i
`design/` — åpne `design/index.html` og klikk gjennom mens du bygger.

Fellesnevnere:
- Seksjonspadding: `px-[clamp(20px,4vw,64px)] py-[clamp(40px,5vw,76px)]`
- Annenhver seksjon kan få `bg-surface-alt`. **Maks to bakgrunnsfarger per skjerm.**
- Seksjonshode: eyebrow → 12px → h2 → 8px → ingress → 26px → innhold
- Grid: `grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4`, én kolonne under 900px
- Ett brytepunkt: `hz:` (900px)

---

## Forside — `app/page.tsx`

Rekkefølge:

1. **Hero** — `code/Hero.tsx`. Full-bleed `komplett-bilpleie.webp`, hvitt kort oppå.
2. **Statstripe** — `grid-cols-4` (2 på mobil), `border-b border-line`, hver celle `border-l border-line` (første uten), padding `22px var(--pad)`. Tall Barlow 700 29px `text-navy` tabular, etikett 12,5px VERSALER `tracking-[.06em]` `text-body-soft`.
   `14 avdelinger · 120 000+ biler behandlet · 4,8 av 5 i score · 20 år siden 2005`
3. **Slik gjør du** — eyebrow, deretter `grid-cols-3 gap-x-10` (1 kolonne mobil). Hver kolonne `flex gap-[18px] border-t border-line py-[22px]`: siffer Barlow 700 22px `text-navy` tabular `min-w-[22px]`, så h3 21px + tekst 16px `text-body-soft`.
   - «Lever nøkkelen» / «Kom innom avdelingen på senteret. Vi tar imot bilen — ingen kø, ingen skjema.»
   - «Gjør ærendene dine» / «Handle, spis lunsj, ta en kaffe. Du får melding på SMS når bilen er klar.»
   - «Hent en ren bil» / «Bilen står klar, vasket for hånd og tørket. Du betaler når du henter.»
4. **Populære tjenester** — seksjonshode med «Se hele katalogen →», så `grid-cols-3 gap-4` med `ServiceTile` i **`aspect-[4/5]`**. Tre tjenester: Vask ut-/innvendig – Premium, Polering – Basic, Keramisk lakkforsegling. Kun det første kortet får `<Tag variant="red">Mest booket</Tag>`.
5. **Sesongkampanje** — `grid-cols-[0.95fr_1fr] border border-line-strong rounded-card-lg overflow-hidden` (1 kolonne mobil, bilde først, `min-h-[220px]`). Venstre: `om-oss/detaljering.webp` `object-cover`. Høyre: padding `clamp(26px,3vw,42px)`, eyebrow «Sesongtilbud · Sommer», h2 «Pollen, insekter og kvae — vekk før høsten», tre haker, «Book sommervask» + «Se poleringspakker →».
6. **Finn din avdeling** — seksjonshode med «Se alle 14 →», oversiktskart `h-[clamp(220px,26vw,320px)] rounded-card-lg border border-line-strong`, deretter fire `BranchCard` (flat) i grid.
7. **Sosialt bevis** — `bg-surface-alt`. Se `COMPONENTS.md` § Sosialt bevis. Overskrift «Det kundene sier», «Les gjesteboka →».
8. **Trygghetsband** — `grid-cols-3 border-t border-line`, hver celle `pt-[26px] border-l border-line` (første uten venstrekant og uten venstre padding). h3 med `ShieldCheck` 20px `text-status-open`, tekst 15px `text-body-soft max-w-[38ch]`, ekstern lenke Barlow 600 14px `text-navy` med `↗`. Mobil: 1 kolonne, `border-t` i stedet for `border-l`.
   - «Godkjent bilpleie» → arbeidstilsynet.no/bilpleievirksomhet/
   - «Seriøse fagfolk» → vegvesen.no/…/finn-godkjent-verksted/
   - «20 år, 120 000 biler» (ingen lenke)
9. **Kundeklubb** — `bg-navy rounded-card-lg p-[clamp(26px,3vw,44px)]`, `grid-cols-[1fr_auto] gap-10 items-center`. Venstre: eyebrow `text-on-navy-eyebrow`, h2 hvit «Få hver 6. vask gratis», to haker `text-on-navy`, `Button variant="secondary"` «Bli medlem — gratis». Høyre (skjult på mobil): stempelkortet — fem 44px `rounded-full bg-white/14` haker + `GRATIS`-pille (hvit flate, `text-navy`, Barlow 700 13px, `ring-3 ring-white/28`).

---

## Tjenester — `app/tjenester/page.tsx`

- **Pagehead** `px-[var(--pad)] pt-[clamp(32px,4vw,56px)]`: eyebrow «Tjenester», h1 «Alt innen bilpleie», ingress «Faste priser, ingen overraskelser. Lokale avvik vises per avdeling — endelig pris får du i bookingen.»
- **Sticky filterbar** `top-[69px] z-30 bg-surface/95 backdrop-blur-[12px] border-y border-line p-[12px_var(--pad)] flex gap-3.5 items-center`. Chip-rad `flex-1 min-w-0` med «Alle» + syv kategorier med antall. Til høyre `<select>` med egen chevron (`bg-no-repeat right-[13px]`), `min-h-[42px] border-line-heavy rounded-control`, Barlow 500 14,5px: Populær / Pris lav–høy / Pris høy–lav. Mobil: `flex-wrap`, chips på egen linje, select `w-full`.
- **Antallslinje** `aria-live="polite"` 13,5px `text-body-soft`: «Viser 18 tjenester.» / «Viser 6 tjenester i Polering.»
- **Grid** `ServiceTile` i `aspect-[4/3]`. Populære får `<Tag variant="red">Populær</Tag>`.

Kategorier og antall: Bilvask 4 · Polering 3 · Lakkforsegling 2 · Full Shine 2 ·
Interiør 4 · Dekk & Felg 3.

---

## Tjeneste-detalj — `app/tjenester/[slug]/page.tsx`

Kolonne `max-w-[820px] mx-auto`, `pb-[100px]` for sticky baren.

1. **Banner** `h-[clamp(200px,26vw,320px)]` med tjenestens `hero`-bilde, `object-cover`. Ingen scrim, ingen tekst på bildet.
2. **Sti** 13,5px `text-body-soft`: Forside / Tjenester / {navn}. Siste ledd `text-body-strong`, `aria-current="page"`. Skjult på mobil — erstattes av «← Tilbake».
3. **Merkelapper** `flex gap-2 flex-wrap`: kategori (`navy`), «Mest booket» (`red`) hvis populær, garanti (`navy`).
4. **h1** `clamp(30px,3.6vw,42px)` + ingress 19px `max-w-[58ch]`.
5. **Nøkkeltall** `flex flex-wrap border border-line-strong rounded-card`, tre celler `flex-1 min-w-[140px] p-[14px_16px] border-r border-line` (siste uten). `dt` Barlow 600 11px VERSALER `tracking-[.16em]` `text-body-soft`, `dd` Barlow 700 19px `text-ink` (prisen `text-navy`). Mobil: stablet, `border-b` i stedet for `border-r`.
   «Pris fra» / «Varighet» / «Garanti» eller «Nivå»
6. **Dette inngår** — h2 24px, så `grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[10px_28px]`, hver `li` `flex gap-2.5 border-t border-line pt-[11px]` 16px `text-body` med `Check` 18px `text-status-open`. Fire punkter per kategori — listene ligger i `design/screen-tjenester.jsx` (`INCLUDES`).
7. **Ofte valgt sammen** — tre `Card` flat i grid: navn Barlow 600 16px, beskrivelse 14px `text-body-soft`, «+ 450,-» Barlow 700 16px `text-navy`. Hvilke add-ons: fra affinitetsmatrisen i `lib/mock-data.ts`.
8. **Andre {kategori}-tjenester** — opptil tre `Row` (se COMPONENTS.md), klikkbare til søsken-tjenester.
9. **Disclaimer** 13,5px `text-body-soft`: «Prisen er kjedens standardpris inkl. mva. Enkelte avdelinger har egne lokalpriser — den endelige prisen vises i bookingen når du har valgt avdeling.»
10. **Sticky bunnbar** — «Valgt tjeneste» + navn (truncate), sum «fra 1 990,-», `Button lg` «Bestill denne» → `/booking?service={slug}`.

---

## Avdelinger — `app/avdelinger/page.tsx` + `location-list.tsx`

`grid-cols-2 gap-6 items-start` (1 kolonne mobil, kart først).

**Venstre kolonne** `sticky top-[92px]` (statisk på mobil):
- Kart `h-[clamp(280px,40vw,500px)] rounded-card-lg border border-line-strong`, `filter: saturate(.55) contrast(1.05)`.
- Under: `MapPin` 16px + «Viser **Handz On Lambertseter** · Lambertseter senter», 13,5px `text-body-soft`.

**Høyre kolonne**:
- Søkefelt `flex-1` med Lucide `Search` 18px absolutt `left-[14px] top-1/2 -translate-y-1/2`, input `pl-11`. Placeholder «By eller postnummer, f.eks. Bergen». Ved siden: `Button secondary` med `MapPin` «Nær meg».
- Statuslinje 13,5px `text-body-soft`: «14 avdelinger, sortert etter avstand fra Oslo sentrum.» / «3 treff på «Oslo».» / «Ingen treff på «Bergn» — viser alle avdelinger.» / «Sortert etter avstand fra posisjonen din.»
- `BranchCard` elevated i `flex flex-col gap-2.5`. **Hover på et kort flytter kartet** (`onMouseEnter` → `setActive`), og kortet får `border-navy`.

Søket treffer på navn, by, postnummer, region og senternavn. Alle 14 avdelinger
fra `lib/mock-data.ts`.

---

## Avdelingsside — `app/avdelinger/[slug]/page.tsx`

1. **Banner** `h-[clamp(180px,22vw,280px)]` med `tjenester/utvendig-handvask.webp`.
2. **Pagehead**: sti (Forside / Avdelinger / {navn}), merkelapper (`open`/`closed` + kampanje), h1 «Handz On Lambertseter», ingress «{senter} · {adresse}, {postnr} {sted}. Lever nøkkelen i skranken, gjør ærendene dine på senteret, og hent en ren bil.», så `Button lg` «Bestill time her» + `secondary` «Veibeskrivelse ↗» (åpner Google Maps i ny fane).
3. **Åpningstider + kart** `grid-cols-2 gap-6`. Tabellen: `w-full border-collapse tabular`, hver rad `border-t border-line py-[9px]` 15px `text-body`, klokketid høyrestilt Barlow 600 `text-ink`. **Dagen i dag markeres** med `text-navy` og « (i dag)» bak dagsnavnet. Under: `dl` med Telefon og Region. Så 13,5px `text-body-soft`: «Handz On {navn} AS er en egen juridisk enhet og selvstendig franchisetaker. Org. {nr}.» Høyre: enkeltkart zoom 15, `h-[clamp(260px,32vw,380px)]`.
   Åpningstider: Man–ons 08–17, Tors 08–18, Fre 08–17, Lør 10–15, Søn stengt.
4. **Populært hos oss** — tre `Row`. Tjenester med lokalpris får `<Tag>Lokalpris</Tag>` og overstrøket kjedepris over beløpet.
5. **Ikke tilgjengelig her** — 13,5px `text-body-soft` som lister tjenestene avdelingen ikke har, med henvisning til nærmeste avdeling som har dem.
6. **Sosialt bevis** — samme blokk, overskrift «Anmeldelser fra {navn}».

---

## Om oss — `app/om-oss/page.tsx`

1. Banner `om-oss/detaljering.webp`.
2. Pagehead: eyebrow «Om oss», h1 «Kvalitet du kan stole på», ingress `max-w-[62ch]` (full tekst i `design/screen-om-oss.jsx`).
3. Statstripe: 14 avdelinger · 120 000+ biler · 20 år · 4,8 av 5.
4. **HANDZON-verdiene** — `grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-x-8`. Hver: `flex gap-4 border-t border-line py-5`, bokstav Barlow 700 32px `text-navy w-[26px]`, så tittel Barlow 600 17px + tekst 15px `text-body-soft`. Sju bokstaver: Handlekraft, Ansvarlig, Nyskapende, Direkte, Zen, Oppmerksom, Nøye.
5. **Historie** — `bg-surface-alt`. `grid-cols-[repeat(auto-fit,minmax(200px,1fr))]`, hver `border-t-2 border-navy pt-3.5 pr-5`: årstall Barlow 700 22px `text-navy` tabular + tekst 15px. 2005 / 2014 / 2021 / 2025.
6. **Bærekraft** — `grid-cols-2 gap-6 items-center`: venstre eyebrow + h2 «Mindre vann, mindre plast» + tre haker; høyre `utvendig-vask-og-voks.webp` `h-[300px] object-cover rounded-card-lg`.
7. Trygghetsband, deretter «Bestill time» + «Se alle avdelinger».

---

## Booking — `app/booking/wizard.tsx`

Reducer og stegrekkefølge finnes allerede. **Behold logikken.**

Skall: `max-w-[720px] mx-auto min-h-screen bg-surface`.
Sticky chrome `top-0 z-40 bg-surface/95 backdrop-blur-[12px] border-b border-line p-[14px_var(--pad)_16px]`:
rad med «← Tilbake» (`visibility:hidden` på steg 1 og 7, ikke fjernet — så logoen ikke hopper),
logo 26px midt, «Avbryt» høyre. Under: `StepProgress`.
Body `p-[clamp(24px,3.4vw,36px)_var(--pad)_40px]`, `aria-live="polite"`.
Steg 5 får `pb-[120px]`.

Steghode: h1 `clamp(27px,3.6vw,34px)` + hjelpetekst 16px `text-body-soft`.

### Steg 1 — Avdeling
«Velg avdeling» / «Der du leverer og henter bilen.»
Søkefelt + «Nær meg», statuslinje, deretter alle 14 som `Card` `rounded-card p-5`
klikkbare: navn Barlow 600 18px (+ avstand `text-navy` når «Nær meg» er på),
adresse 14px, merkelapper, `Tick` til høyre. **Valg går videre automatisk** og
nullstiller dato/tid.

### Steg 2 — Bilen din
«Bilen din» / «Vi henter merke og modell fra Statens vegvesen.»
RegNr-felt (se COMPONENTS.md), hjelpetekst, `Button lg block` «Hent bilinfo»
(disabled til formatet er gyldig, `loading` under oppslag).

Suksess → `Card` `border-navy bg-navy-06`: «Vi fant bilen din» 13,5px, så
Barlow 700 21px «Tesla Model Y (2023)», så «Elektrisk · Hvit · EB12345».
Under: `Button lg block` «Dette stemmer — gå videre».

Feil → `Card` `border-danger bg-danger-bg`: forklaringen, to felt (Merke, Modell)
i `grid-cols-2 gap-3`, `Button secondary block` «Fortsett uten oppslag».
**Aldri en blindvei.**

### Steg 3 — Tjeneste
«Velg tjeneste» / «{merke} {modell} · {regnr} · Handz On {avdeling}»

Medlemsbanner `flex justify-between items-center border border-line-strong
rounded-card p-[16px_18px] mb-[22px]`: «Medlem? Få 10 % på tjenesten.» +
«Gratis medlemskap — hver 6. Basic-vask er gratis.» + Vipps-knapp.
Etter innlogging: `border-navy bg-navy-06`, «Medlemspris aktiv» `text-navy` +
«10 % avslag er trukket fra prisene under.»

Kategori-chips, deretter per kategori en `dg-cat`-etikett (Barlow 600 12px
VERSALER `tracking-[.16em]` `text-body-soft`, `border-b border-line pb-[9px]`) og
`Row` per tjeneste. Lokalpris brukes automatisk. Utilgjengelig: `disabled` +
`opacity-50` + `<Tag mute>Ikke tilgjengelig her</Tag>` — dempet, aldri skjult.
Medlem: overstrøket kjedepris over medlemsprisen.

Disclaimer nederst: «Prisene gjelder Handz On {avdeling} og er inkl. mva. Tillegg
som asfaltfjerning (+450,-) og seterens (+500,-) velger du i steg 5.»

Valg går videre automatisk.

### Steg 4 — Tidspunkt
«Velg tidspunkt» / «{tjeneste} · ca. {varighet}. Vi tar bilen mens du er på senteret.»
14 dag-chips, linje «Ledige tider lørdag 15. aug», timeliste `grid-cols-3`.
Lørdag stenger 13:00, søndag er stengt (EmptyState). Valg går videre automatisk.

### Steg 5 — Tillegg
«Vil du legge til noe?» / «Vi gjør det mens bilen først står inne — du sparer en ekstra tur.»
`Row` uten bilde, per add-on: navn + `<Tag red>Ofte valgt sammen</Tag>` på de
anbefalte (fra affinitetsmatrisen, sortert først), beskrivelse, «+ ca. 30 min»,
pris «+ 450,-», `Tick`. Sticky bunnbar med løpende sum.
Knappetekst: «Gå videre uten tillegg» / «Gå videre».

### Steg 6 — Oppsummering
«Oppsummering» / «Sjekk at alt stemmer før du bekrefter.»

Tre `Card elevated`:
1. **Valgene** — rader med etikett 13px `text-body-soft` + verdi Barlow 600 16px `text-ink` + «Endre»-lenke Barlow 600 13,5px `text-navy` som hopper til riktig steg. Avdeling, Bil, Tjeneste, Tidspunkt, (Tillegg).
2. **Prisspesifikasjon** — linjer 15px `text-body` med beløp Barlow 600 tabular `text-ink`. Rabattlinje `text-navy`. Mva-linje `text-body-soft`: «Herav mva. (25 %) 488,00 kr». Totalen `border-t border-line-strong pt-3 mt-2.5`, Barlow 700 17px / beløp 19px: «Å betale ved henting». Under: «Alle priser er inkl. mva. Selger: Handz On {avdeling} AS, org. {nr}.»
3. **Kontaktinfo** — Vipps «Fyll ut med», så Navn og Mobilnummer. Hjelpetekst: «Vi sender bekreftelse og melding når bilen er klar.»

Så: «Gratis avbestilling frem til 24 timer før avtalt tid. Du betaler i avdelingen
når du henter bilen.» og `Button lg block` «Bekreft bestilling – 2 440,-».
Disabled til navn (>1 tegn) og mobil (≥8 siffer) er utfylt, med hjelpetekst
«Fyll inn navn og mobilnummer for å bekrefte.» under.

### Steg 7 — Bekreftelse
Sentrert: 64px `rounded-full bg-status-open-bg text-status-open` med `Check` 32px,
h1 29px «Takk for bestillingen!», så «Referanse **HOAC-9685**. Bekreftelse er
sendt på SMS til 912 34 567.»

**Kvittering** `Card elevated flush`:
- Topplinje `bg-navy p-[16px_22px] flex justify-between items-center`: hvit logo 24px + «KVITTERING» Barlow 600 12px `tracking-[.14em]` `text-on-navy-eyebrow`.
- Body `p-[22px]`: rader (Referanse, Tjeneste, Tillegg, Avdeling, Tidspunkt, Bil), `border-t border-dashed border-line-heavy`, så «Å betale ved henting» + beløp Barlow 700 28px `text-navy`, og «inkl. mva. 488,00 kr» høyrestilt 13,5px.
- Strekkode: `h-[44px]` `repeating-linear-gradient(90deg,var(--color-ink) 0 2px,transparent 2px 4px,var(--color-ink) 4px 5px,transparent 5px 9px,var(--color-ink) 9px 12px,transparent 12px 14px)`, `aria-hidden`.
- «Utstedes av Handz On {avdeling} AS, org. {nr}. Kvitteringen legges på Min side etter utført behandling.»

**Slik blir det** — `Card` `bg-surface-alt` med tre haker: møt opp i skranken /
gjør ærendene dine, SMS når klar / betal ved henting, gratis avbestilling til 24 t før.

Avslutning: «Last ned kvittering» (secondary) + «Se på Min side» (primary),
og «Til forsiden» som `ghost block`.

---

## Min side — `app/min-side/min-side-client.tsx`

**Denne skjermen er godkjent som den er.** Ikke endre layout, seksjonsrekkefølge
eller copy. Det eneste som skal gjøres er tekstfargene fra PR 1:
`text-muted` og `text-muted-light` → `text-body-soft` (åtte steder, blant annet
«inkl. mva», referansenumrene og «Innlogget med Vipps · 912 34 567»).

Struktur, for referanse:
- **Utlogget**: `max-w-[440px] mx-auto`. h1 «Min side», ingress, `Card elevated` med Vipps-knapp + «Engangskode på SMS» + «Passordfritt og trygt. Vi bruker Vipps til å bekrefte at det er deg.» Under kortet: `ShieldCheck` + «Ny kunde? Du får automatisk en profil første gang du bestiller — kvitteringen ligger her etterpå.»
- **Innlogget**: `max-w-[760px] mx-auto`. «Hei, Kari!» + «Innlogget med Vipps · 912 34 567» + «Logg ut». Fire chip-faner: Kommende avtaler / Historikk / Kvitteringer / Personvern.
  - *Avtaler*: bookingrader med «Bekreftet»-merke, ref, tjeneste, tid+avdeling, regnr+tillegg, sum + «inkl. mva», og «Endre tid» / «Veibeskrivelse» / «Avbestill». Så kundeklubb-kort på navy med stempelkort (4 av 6) og forklaring. Så «Bilene dine» — to kort med regnr-plate, «7 behandlinger · sist Polering – Basic».
  - *Historikk*: samme rader, «Utført»-merke, ingen handlinger.
  - *Kvitteringer*: `Card elevated flush` med rader: tjeneste, «HOAC-3966 · 13.07.2026 · Handz On Lambertseter AS», sum, «PDF»-knapp.
  - *Personvern*: «Dine data» med «Last ned mine data» / «Endre samtykker», og «Slett profilen min» med 6-årsforklaringen. Sletting viser bekreftelsesskjerm.

---

## Sider som ikke er tegnet

`app/kontakt/`, `app/kundeklubb/`, `app/nyheter/` finnes i repoet men er ikke
tegnet i denne retningen. Følg mønstrene: pagehead øverst, `Card elevated` for
nøkkelkort, `bg-surface-alt` på annenhver seksjon, samme seksjonsrytme.
Si fra hvis dere vil ha dem tegnet.
