# ADMIN.md — Adminpanelet, skjerm for skjerm

Det interne verktøyet avdelingene og kjedekontoret jobber i. Samme merkevare som
kundeflatene, men **desktop først**: navy sidestolpe, hvite kort på
`--color-surface-alt`, hårlinjer og tabulære tall.

Prototypen: `design/ui_kits/admin/index.html`.
Stillag: `design/ui_kits/admin/admin.css` (prefiks `ad-`).

> **Dette finnes ikke i repoet i dag.** Panelet er en ny flate. Alt under er
> spesifikasjon, ikke gjenskaping.

---

## 0. Før du bygger — tre avklaringer

Disse må besvares av Handz On før panelet kan bygges ferdig. De endrer
datamodellen, ikke utformingen:

1. **Roller.** Ser en franchisetaker bare sin egen avdeling? Hvem får endre
   kjedeprisen — kjedekontoret alene, eller avdelingen også?
2. **Kilden til salgstall.** Kassesystemet eller bookingbasen? Prototypen
   genererer tall lokalt for å vise formen.
3. **Publisering.** Skal prisendringer kreve godkjenning sentralt før de treffer
   kunden? Prototypen har utkast-flyt, men ingen godkjenner.

---

## 1. Skallet

### Sidestolpe — `250px`, `--color-navy-deep` (#16223a)

```
┌ logo-white.png, høyde 30 ────────────┐
│ ADMINPANEL  (11px Barlow 600, .18em) │
├──────────────────────────────────────┤
│ DRIFT                                │  gruppeoverskrift 10,5px, hvit 42 %
│ ▣ Oversikt                           │  aktiv: bg --color-navy, hvit tekst
│ ▢ Bestillinger                       │
│ SALG                                 │
│ ▢ Salgsrapport                       │
│ ▢ Tjenester og priser            (3) │  teller = ulagrede endringer
│ INNHOLD                              │
│ ▢ Blogg og nyheter               (2) │  teller = utkast
├──────────────────────────────────────┤
│ (OH)  Ove Hagen                      │
│       Kjedeadministrator             │
└──────────────────────────────────────┘
```

- Menypunkt: `11px 12px` padding, radius 8px, Barlow 600 14,5px, `--color-on-navy`.
- Hover `rgba(255,255,255,.07)`, aktiv `--color-navy` + hvit tekst.
- Ikoner: Lucide 18px, strek 1,75 — `layout-dashboard`, `calendar`, `trending-up`,
  `sparkles`, `newspaper`.
- Telleren er høyrestilt, `--color-on-navy-eyebrow`, tabular-nums. Skjules når 0.

### Toppbar — sticky, `64px` min-høyde

`rgba(255,255,255,.95)` + `backdrop-blur(12px)` + hårlinje under. Innhold:
tittel (Barlow 600 19px) med undertekst (13px `--color-body-soft`) til venstre,
kontroller høyrestilt. Underteksten sier alltid **hvilken avdeling og hvilken
periode** som vises.

### Responsivt

| Bredde | Sidestolpe |
|---|---|
| > 1100px | Full, 250px, med etiketter og tellere |
| 760–1100px | Ikonrail, 74px. KPI-ene går til to kolonner |
| < 760px | Skuff bak hamburger. Alt stables, tabeller scroller horisontalt |

---

## 2. Oversikt (`/`)

Dagens drift for én avdeling eller hele kjeden.

**Rad 1 — fire KPI-kort.** Første er navy, resten hvite.

| Kort | Verdi | Sammenlignet med |
|---|---|---|
| Omsetning i dag | `25 730,-` | samme dag forrige uke |
| Ordrer i dag | `11` | i går |
| Snittordre | `2 339,-` | i går |
| Denne måneden | `623 013,-` | forrige måned |

Endringen vises som `↑ +29,3 %` i `--color-status-open`, `↓ −4,1 %` i
`--color-danger`, `→ 0,0 %` i `--color-body-soft`. Alltid med en tekstlig
forklaring ved siden — «mot i går» — aldri pil alene.

**Rad 2 — to kolonner `1.6fr 1fr`:**
- Venstre: stolpediagram, omsetning siste 14 dager.
- Høyre: kapasitetsmåler (`11 av 9 plasser booket` med fyllstripe som blir
  `--color-brand-red` over 90 %), deretter dagens fordeling per kategori.

Kapasitetsteksten er tilstandsavhengig: over 90 % «Nesten fullt. Vurder å åpne
kveldstider.», over 60 % «God belegg. Ledige tider sent på dagen.», ellers
«Ledig kapasitet — vurder å pushe dagens kampanje.»

**Rad 3 — to kolonner:**
- Venstre: tabell «Neste inn i dag» (tid, tjeneste + tillegg, avdeling når hele
  kjeden er valgt, kanal, sum).
- Høyre: «Å gjøre» (utkast, ulagrede prisendringer, Arbeidstilsynet-status) og
  «Beste tjenester denne måneden» med miniatyrbilde.

---

## 3. Bestillinger (`/bestillinger`)

Dag for dag, med piler bakover og forover. Etiketten sier «I dag», «I morgen»,
«I går», ellers `14. aug`.

**Fire KPI-kort:** Ordrer · Forventet omsetning · Inne nå · Klar til henting.

**Tabell:** tid, tjeneste + tillegg, avdeling (når hele kjeden), kanal-tag +
medlem-tag, sum, status, handling. Sumlinje nederst.

### Statusflyten — fire trinn, låst rekkefølge

| Status | Tag | Knapp | Effekt |
|---|---|---|---|
| Ny | navy | «Ta inn» | → Inne |
| Inne til behandling | gyllen | «Meld klar» | → Klar, **sender SMS til kunden** |
| Klar til henting | grønn m/prikk | «Registrer levert» | → Levert |
| Levert | grå | — | «Fullført» |

Startstatus utledes av klokketiden: er timen passert med 2+ timer er ordren
levert, er den passert er bilen inne, ellers er den ny.

SMS-teksten: «Bilen din er klar til henting hos Handz On.» Betaling registreres
ved henting — **bookingen tar ikke betalt på nett.**

---

## 4. Salgsrapport (`/rapport`) — kjernen

### Kontrollraden

```
[ Dag | Uke | Måned | År ]   [←]  august 2026  [→]        Hopp til i dag
```

Den segmenterte velgeren har en **hvit indikator som glir** til valgt knapp
(200 ms, `--ease-standard`), og bredden animeres fordi «Måned» og «År» er ulikt
brede. «Neste periode» er `disabled` når du står på gjeldende periode.

### Periodenivåene

| Periode | Vindu | Diagrammets bøtter | Sammenlignes med |
|---|---|---|---|
| **Dag** | Ett døgn | Time for time 08–16 | Dagen før |
| **Uke** | Man–søn (ISO) | Dag for dag, søndag dempet | Forrige uke |
| **Måned** | Kalendermåned | Dag for dag | Forrige måned |
| **År** | Kalenderår | Måned for måned | Samme periode i fjor |

Ukenummer beregnes etter ISO 8601 (mandag som første dag). Periodeetiketten
skrives ut i klartekst: «Uke 33 · 11.–17. august 2026».

### Fire KPI-kort

Omsetning inkl. mva (navy) · Antall ordrer · Snittordre · Medlemsandel — hver med
endring mot forrige tilsvarende periode.

### Diagrammet

Rene stolper, ingen SVG. Høyeste stolpe i perioden er `--color-brand-red`, resten
`--color-navy`, stengte dager `--color-navy-24`. Rutenett i fire nivåer med
avrundet maks (1 / 1,5 / 2 / 2,5 / 3 / 4 / 5 / 7,5 / 10 × tierpotens).
Hover gir et mørkt verktøytips: «torsdag 14. august: 25 730,- · 11 ordrer».
Forklaring under: omsetning · beste bøtte · stengt.

Til høyre i korthodet står periodens sum stort, med mva-linjen under:
«herav mva. 124 602,60 kr».

### Nedbrytninger

| Blokk | Innhold |
|---|---|
| **Tjenester i perioden** | Miniatyr, navn, kategori + varighet, antall, omsetning, andelsstripe + prosent. Sumlinje. |
| **Kategorier** | Omsetning per kategori med andelsstripe, antall ordrer, prosent av total |
| **Tilleggssalg** | Festerate i korthodet, deretter antall og kroner per add-on |
| **Bestillingskanal** | Nett / skranke / telefon med prosentandel |
| **Avdelinger i perioden** | Kun når «Hele kjeden» er valgt. Klikk «Vis →» filtrerer hele rapporten til den avdelingen |
| **Regnskapslinjer** | Tre kolonner: omsetning (tjenester, tillegg, rabatt), mva (sum inkl., herav mva, grunnlag eks.), nøkkeltall (snittordre, medlemsandel, festerate) |

### CSV-eksport

Én linje per ordre. Semikolon som skilletegn, BOM foran innholdet slik at norsk
Excel åpner filen riktig. Hode med avdeling, periode og totaler, deretter
kolonnene: dato, tid, avdeling, tjeneste, tillegg, kanal, medlem, rabatt, sum.
Filnavn: `handzon-salg-<avdeling>-<periode>-<fra-dato>.csv`.

---

## 5. Tjenester og priser (`/tjenester`)

**Kjedeprisen er standard for alle 14 avdelinger.** Avdelingsvelgeren i toppen
bytter mellom «Kjedepris (standard)» og en enkelt avdeling — velger du en
avdeling viser priskolonnen hva som faktisk gjelder der, med kjedeprisen
overstrøket under.

**Tabell:** tjeneste (miniatyr + navn + beskrivelse), kategori, varighet, pris,
solgt siste 30 dager, status-tagger, og til høyre en bryter for «kan bookes» +
«Rediger».

Status-taggene: `Aktiv` (grønn m/prikk) / `Skjult` (grå), `Utkast` (gyllen) når
det finnes ulagrede endringer, `Lokalpris` når avdelingen avviker, og garantien
når tjenesten har en.

### Redigeringspanelet (drawer, 560px, høyre side)

Felter i rekkefølge: navn · kategori · beskrivelse · kjedepris · varighet i
minutter · nivå · garanti · bilde (velges fra mediebiblioteket) · to brytere
(kan bookes / vis under populære) · **lokalpriser**.

Lokalpriser er ett tallfelt per avdeling:
- **Tomt** = avdelingen følger kjedeprisen (plassholderen viser kjedeprisen).
- **0** = tjenesten skjules i den avdelingen.
- **Tall** = lokalpris som overstyrer kjedeprisen.

De ekte overstyringene fra katalogen er utgangspunktet: Lambertseter Full Shine
– Pro `7 990,-` og Vask utvendig – Premium `849,-`, Forus Full Shine – Pro
`6 990,-`, Sandvika keramisk `9 490,-`, Moa uten keramisk coating, Ski uten
Polering – Pro.

Bunnlinjen i panelet: «Slett tjenesten» (rød, venstre) · «Avbryt» · «Lagre».
Lagre er sperret til navn og pris er utfylt.

### Utkast-flyten

Endringer lagres som utkast og merkes. En gyllen banner øverst teller ulagret
arbeid: «3 endringer er ikke publisert — Endringene er lagret som utkast. De vises
ikke for kunden før du publiserer.» Knappen «Publiser nå» skyver alt live.

Regelen: **ingenting treffer kunden ved uhell.**

---

## 6. Blogg og nyheter (`/blogg`)

Filter i toppen: Alle / Publisert / Utkast (samme glidende indikator som
rapporten). Søk på tittel, ingress og kategori.

**Tabell:** innlegg (hovedbilde + tittel + `/nyheter/<slug>`), kategori, dato,
lesninger, status, og handlinger «Avpubliser»/«Publiser» + «Rediger».

Kategorier: Bilpleie-guiden · Nyheter · Kampanje · Bak kulissene.

### Editoren (drawer)

- **Tittel** — sentence case. Genererer nettadressen automatisk til du redigerer
  den manuelt; da låses den. Æ/ø/å translittereres til ae/oe/aa.
- **Nettadresse** — vises som `handzon.no/nyheter/<slug>` under feltet.
- **Kategori** og **publiseringsdato**.
- **Ingress** — én til to setninger. Dette er teksten i listen og i søk.
- **Innhold** — markdown med verktøylinje: Mellomtittel (`## `), Fet, Kursiv,
  Punktliste, Lenke. Verktøyknappene omslutter markert tekst og setter markøren
  tilbake. Under feltet: ordtelling og lesetid (`ord / 200`, minimum 1 min).
- **Hovedbilde** — velges fra mediebiblioteket.
- **Forhåndsvisning** — viser innlegget slik det ser ut i listen på nettsiden:
  bilde, kategori-tag, tittel, ingress, forfatter · dato · lesetid.

Bunnlinjen: «Slett» · «Lagre utkast» · «Publiser». Publiser er sperret til
tittel, ingress og innhold er fylt ut.

Fem ekte innlegg ligger inne som utgangspunkt (tre publiserte, to utkast). De er
skrevet i kjedens stemme — konkret fagkunnskap, ingen selgerstemme, og ærlige
«når vi sier nei»-avsnitt. Behold dem som mal for tone.

---

## 7. Salgsdatamodellen i prototypen

`design/ui_kits/admin/sales-data.js` genererer ordrer **deterministisk** — samme
avdeling og dato gir alltid samme tall. Det er derfor tallene stemmer mellom
skjermene og ikke endrer seg ved omlasting.

Erstatt hele filen med et kall til det ekte datalaget. Formen den returnerer er
det rapporten trenger:

```ts
type Order = {
  id: string; date: string; loc: string; hour: number;
  serviceId: string; addOns: string[]; member: boolean;
  channel: "nett" | "skranke" | "telefon";
  base: number; addSum: number; discount: number; total: number;
};
```

Aggregeringsfunksjonene (`summarize`, `byService`, `byCategory`, `byAddOn`,
`byChannel`, `byLocation`, `buckets`, `range`, `shift`) er ren utregning over en
`Order[]` og kan gjenbrukes som de er.

Modellens antakelser — verdt å sjekke mot virkeligheten:
avdelingsvekt (Lambertseter og Lagunen størst), lørdag travlest, søndag stengt,
sesongtopper i april–mai og september–oktober, tjenestemiks vektet mot vask
(46 %), 41 % medlemsandel, 38 % festerate på tillegg, kanalsplitt 58/27/15.

---

## 8. Bevegelse i panelet

| Hva | Hvordan |
|---|---|
| Segmentert velger | Hvit indikator glir til valgt knapp, 200 ms, bredde animeres |
| Stolper i diagram | Ingen inn-animasjon — data skal ikke vente på pynt |
| Panel (drawer) | Skyves inn fra høyre, bakteppe `rgba(14,22,38,.55)` + blur(4px). Escape lukker |
| Toast | Nederst høyre, auto-lukk etter 5 s |
| Bryter | Knappen glir 18 px, 120 ms |

Ingenting annet. Et internt verktøy skal føles raskt, ikke levende.
