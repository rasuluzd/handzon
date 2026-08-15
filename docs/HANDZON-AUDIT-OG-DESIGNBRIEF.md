# Handz On — Audit av handzon.no + Designbrief for demoen

Kilde: full gjennomgang av det ekte nettstedet handzon.no (juli 2026).
Formål: (1) hente inn ekte tjenester, priser, tilbud og nyheter, (2) kartlegge
hva demoen (Next.js-prototypen) mangler, (3) overlevere til design-pass som skal
gjøre hver komponent mer premium og brukervennlig.

---

## 1. Kort sammendrag — de største hullene

Demoen vår er en polert, men **forenklet** utgave: 8 fiktive tjenester, 14
avdelinger, 7-stegs booking, forside/tjenester/avdelinger/om-oss/min-side. Det
ekte nettstedet er en **full e-handels- og innholdsplattform** (Proline) med:

1. **9 tjenestekategorier og ~40 ekte produkter med reelle priser** (vår demo har 8 fiktive).
2. **Kundeklubb / medlemstilbud** med konkret lojalitetsmekanikk (hver 6. vask gratis).
3. **Nyheter/PR-seksjon** med 25+ ekte saker (jubileum, presse, nyåpninger).
4. **Gavekort** (kjøpbart, forhåndsvalgte beløp + hilsen).
5. **Selge bil** — salgsklargjøringspakker (Basis/Premium/Full Shine) med 360°-foto.
6. **Bli franchisetaker** — rekrutteringsspor (stor forretningsdel).
7. **Bilpleie-guiden** — innholds-/guidehub.
8. **Kontakt-skjema**, **Jobb hos oss**, **Gjestebok/anmeldelser**, **SMS & E-post**-preferanser.
9. **Sesongkampanje-blokk** på forsiden (sommer/vinter-vinkling).
10. **Hero-slideshow** (3 slides) i stedet for ett statisk bilde.

---

## 2. Full sitemap / informasjonsarkitektur (handzon.no)

Toppmeny: `Om oss` · `Kontakt` · `Logg inn` | **Forside** · **Bestille time** ·
**Tjenester** (dropdown) · **Selge bil** · **Avdelinger** · **Bli franchisetaker**
· **Nyheter** · **Gavekort** · **Bilpleie-guiden**

Tjenester-dropdown: Bilvask · Polering · Lakkforsegling · Full Shine · Interiør ·
Dekk & Felg · Foliering · Smart Repair · Tilbehør · Se alle.

Footer — «Informasjon»: Om oss · Franchise · Bli medlem · SMS & E-post · Jobb hos
oss · Kontakt oss. «Mine sider»: Logg inn · Ny kunde. Vilkår · Personvern · Cookies.
Selskap: Handz On Norway AS, Laguneveien 7, N-5239 Rådal. Org. 821230152 MVA.
Plattform: Proline.

Sider funnet: `/forside` `/tjenester` (+ produktsider) `/bilvask` `/polering`
`/tjenester/lakkforsegling` `/full-shine` `/interior` `/hjul` (Dekk & Felg)
`/Foliering` `/smart-repair` `/tilbehor` `/selge-bil` `/avdelinger`
`/bestille-time` (+ `/bookresource`) `/franchise` `/nyheter` (+ `/element/...`)
`/gavekort` `/bilpleie-guiden` `/om-oss` `/kontakt` `/guestbook`
`/Kategori/10/Bli-medlem` `/Kategori/34/SMS-E-post` `/Kategori/61/Jobb-hos-oss`
`/User/register` `/user` `/Checkout` `/terms` `/privacy`.

---

## 3. Ekte tjenestekatalog (≈40 produkter, 9 kategorier, «fra»-priser)

Prisene er reelle «fra Kr»-priser fra /tjenester. Kategoriene er de ekte.

### Bilvask
- Vask utvendig – Basic — fra 540 kr
- Vask utvendig – Premium — fra 790 kr (30–50 min)
- Vask utvendig – Premium XSB — fra 1 190 kr
- Vask innvendig – Premium — fra 790 kr
- Vask ut-/innvendig – Premium — fra 1 490 kr (populær)
- Vask av vindu innvendig — fra 200 kr
- Vask av 4 matter — fra 140 kr
- Vask av skiboks — fra 100 kr (populær)

### Polering
- Polering – Basic — fra 1 990 kr (populær)
- Polering – Pro — fra 2 990 kr (populær)
- Lakkrens + Polering – Basic — fra 3 490 kr (5–6 t)
- Lakkrens + Polering – Pro — fra 4 490 kr (6–7 t, NANO lakkonservering ~12 mnd)
- Polering av alle vinduer — fra 600 kr
- Polering av alle dørkarmer — fra 600 kr

### Lakkforsegling
- Keramisk lakkforsegling — fra 9 990 kr (Graphene, 6 års garanti) (populær)
- Kontrollvask & rebehandling — fra 1 690 kr (1,5–2,5 t)

### Full Shine
- Full Shine – Basic — fra 6 490 kr (total renovering ut+innv.)
- Full Shine – Pro — fra 7 490 kr (9,5–10 t, klimadesinfisering + NANO, ~12 mnd)

### Interiør
- Rens innvendig — fra 3 990 kr (5–6 t)
- Skinn rens og behandling — fra 1 990 kr
- Rens av enkelt sete — fra 590 kr (populær)
- Rens av flekker — fra 390 kr
- Ozon/desinfisering — fra 1 690 kr (populær, 1 t)

### Dekk & Felg (Hjul)
- Omlegg og balansering — fra 1 300 kr (1–1,5 t)
- Reparasjon av punktering (innenfra) — fra 990 kr
- Skift av hjul — fra 500 kr
- Vask av hjul (løse) — fra 250 kr

### Foliering / PPF / Solfilm
- PPF – hele bilen — fra 30 000 kr
- Premium wrap – metallic/chrome — fra 20 000 kr
- Basis wrap – standard folie — fra 15 000 kr
- PPF – mest utsatte steder — fra 12 000 kr
- PPF – full front — fra 8 000 kr
- Solfilm – full pakke (alle ruter unntatt frontrute) — fra 5 000 kr
- Solfilm – enkel toning (bak + sider) — fra 3 000 kr

### Smart Repair
- Småbulk oppretting (PDR) — fra 1 500 kr (pris etter avtale)

### Tilbehør / diverse
- Skift av lyspærer — fra 390 kr
- Smøring av dørlister mot frysing — fra 250 kr
- Spylervæske påfylling — fra 90 kr
- Handz On plast dekkposer (stk) — fra 25 kr
- Gavekort — fra 0 kr

Merk: mange tjenester har oppgitt **varighet** og «ved forhåndsbestilling». Flere
har Basic/Pro-nivåer — bra for et prisnivå-/pakkevalg i UI.

---

## 4. Ekte tilbud & kampanjer

**Kundeklubb / Medlemstilbud (gjennomgående CTA på alle sider):**
«Få hver 6. utvendige Basic-vask GRATIS (etter 5 betalte vasker/behandlinger)» +
«GRATIS påfyll av spylevæske ved besøk når du kjøper en bilpleietjeneste».
Gjelder kun medlemmer. CTA: «Bli medlem!». (Vår demo har en generisk «10 % på
hovedvasken»-CTA — bør erstattes/utvides med den ekte mekanikken.)

**Sesongkampanje (forsiden, sommer):** «Skinnende ren bil til sommeren? La
ekspertene ta jobben – mens du handler!» Poeng: sommersmuss (pollen, insekter,
fugleskitt, kvae), håndvask uten mikroriper, tidsbesparelse på senteret, oppsalg
til polering/keramisk. (Bør være en gjenbrukbar «sesong»-blokk: sommer/vinter.)

---

## 5. Nyheter (ekte saker — for en Nyheter-side)

Selskap/PR: «Handz On markerte 20-årsjubileum i 2025» · «Trygg og seriøs bilpleie
– ditt valg gir effekt» (Åsane Tidende) · «Det skal skinne av bilpleiernes HMS»
(Arbeidstilsynet/godkjenningsordning, 3 år) · «Pleier bilen mens kundene handler»
(gründer Ove Hagen) · «Brødresuksess i Åsane» (Rahil & Asos Ibrahim, nesten 5 mill)
· «Åsane-butikken vokser raskest» · NRK Vestlandsrevyen (Lagunen, hjulskiftsesong)
· «Revolusjonerende renseanlegg» (Strömstad, video) · «Ny avdeling i Strömstad».

Nyåpninger/franchise: Triaden (27. feb, solgt) · Moss (nyåpning feb 2027) ·
Trekanten/Asker («premiummarked») · Lambertseter (solgt) · Rortunet/Slemmestad ·
Kuben/Hønefoss · Jessheim (solgt).

Guide-/fagsaker: «Fjerning av salt, bremsestøv og skitt – polering beskytter
lakken» · «Grundig hjulvask ved hjulskift» · «Vær tidlig ute med hjulskift –
kombiner med polering» · «Viktighet av regelmessig rengjøring og pleie».

Struktur: kortliste med tittel + ingress + «Les hele saken»/«Se video». Noen saker
er video. Egner seg som kort-grid + detaljside.

---

## 6. Funksjoner/sider demoen mangler (gap-analyse)

| Ekte nettsted | Demoen i dag | Anbefaling |
|---|---|---|
| 9 kategorier / ~40 produkter, ekte priser, Basic/Pro-nivåer | 8 fiktive tjenester | Erstatt mock-data med ekte katalog; grupper i 9 kategorier; vis nivåer |
| Kundeklubb: hver 6. vask gratis + spylervæske | Generisk «10 %»-CTA | Ekte lojalitetsmekanikk + medlemsside |
| Nyheter (25+ saker, video) | Mangler | Ny Nyheter-side (kort-grid + detalj) |
| Gavekort (kjøpbart, beløp + hilsen) | Mangler | Gavekort-side/komponent |
| Selge bil (Basis/Premium/Full Shine + 360°-foto) | Mangler | Selge-bil-landingsside med 3 pakker |
| Bli franchisetaker | Mangler | Franchise-landingsside (rekruttering) |
| Bilpleie-guiden (innhold/guide) | Mangler | Guide-/innholdshub |
| Kontakt-skjema (type + avdeling) | Mangler | Kontaktside m/ skjema |
| Jobb hos oss / Gjestebok / SMS-pref | Mangler | Enkle sider (lav prioritet) |
| Hero-slideshow (3 slides) | Statisk hero | Behold rolig hero, ev. subtil karusell |
| Sesongkampanje-blokk | Mangler | Gjenbrukbar kampanjeseksjon |
| Tilbehør (småvarer, spylervæske, dekkposer) | Mangler | Del av katalog |
| Godkjenning m/ ekte verifiseringslenker (Arbeidstilsynet, Statens vegvesen) | Kort trygghets-notis | Styrk trust-seksjon med ekte lenker |

Bevar (demoens styrker): 7-stegs booking-flyt, avdelingskart, min side, det
rolige navy/lyse designet, Barlow/Source Sans 3, de nye bilpleiebildene.

---

## 7. Merkevare, verdier og stemme

Visjon: «det første selskapet som samler alt innen bilpleie under ett tak» —
primærmarked er Europas største kjøpesentre og lufthavner. Kjerneløfte: «Lever
nøkkelen, gjør ærendene dine, hent en skinnende ren bil». Bærekraft (miljøvennlige
produkter, mindre vann/energi/plast, egne produkter på sikt). Ekspanderer i Norden
(Sverige/Strömstad). 20 år (grunnlagt ~2005), gründer Ove Hagen.

Verdier — **HANDZON**: Handlekraft · Ansvarlig · Nyskapende · Direkte (ærlig) ·
Zen (tilstede/disiplinert) · Oppmerksom · Nøye. (Fin byggekloss for en Om oss- og
verdiseksjon.)

Tone: tillitsbyggende, profesjonell, «trygg og seriøs bilpleie», håndvask uten
mikroriper, godkjent bransjeaktør. Norsk (bokmål).

---

## 8. Demoens nåværende tilstand (design system + komponenter)

Stack: Next.js + TypeScript + Tailwind. Farger: navy `#1e3a70` (aksent), ink
`#16223A`, lyse flater `#FFFFFF`/`#F4F5F7`, hårfine 1px-linjer. Typografi: Barlow
(overskrifter/tall/knapper), Source Sans 3 (brødtekst). Radius 6/8/10–12px, flate
kort med hårlinjer, subtil on-scroll reveal. Breakpoint 900px. Appcontainer maks
1180px sentrert.

Sider/komponenter i dag: Header (sticky + hamburger), Footer, Forside (hero +
statstripe + «Slik gjør du» + Populære tjenester + Finn avdeling (kart) + Trygghet
+ Kundeklubb-CTA), Tjenester (liste gruppert i kategori), Tjeneste-detalj (hero +
fakta + «Ofte valgt sammen» + sticky CTA), Avdelinger (kart + liste + «Nær meg»),
Booking (7 steg), Om oss (hero + verdier), Min side. **Nytt:** ekte bilpleiebilder
er nå koblet på forsiden, tjenester, tjeneste-detalj og om-oss.

---

## 9. Per-komponent designbrief (premium + brukervennlig)

Prinsipper: behold den rolige navy/lyse identiteten og Barlow/Source Sans 3; hev
til «premium» via bedre hierarki, luft, mykere dybde (subtile skygger på
nøkkelkort), tydeligere CTA-er, konsistente bildekrop, og mikrointeraksjoner.
Alt responsivt (mobil først), WCAG-kontrast, redusert-bevegelse respektert.

- **Header/nav:** legg inn de nye toppvalgene (Selge bil, Nyheter, Gavekort,
  Bilpleie-guiden) uten å overfylle — bruk Tjenester-dropdown/mega-meny med
  kategorier. Premium: translucent + blur (finnes), tydelig aktiv-tilstand,
  «Bestill time» som primærknapp.
- **Hero (forside):** behold ett rolig, cinematisk bilde (evt. subtil 2–3-slides
  kryssfade, ikke sprikende). Klar H1 + underliggende løfte + to CTA-er. Legg til
  en diskret «godkjent bilpleie»-trust-markør.
- **Sesongkampanje-seksjon (ny):** gjenbrukbar blokk (sommer/vinter) med kort
  tekst + CTA til booking/relevant tjeneste.
- **Populære tjenester / Tjenestekort:** vis ekte pris «fra», varighet, kategori,
  og nivå (Basic/Pro). Premium bildekrop (kvadrat), hover-løft, tydelig prisstil.
- **Tjenester-side:** ekte 9 kategorier som filtrerbare seksjoner (chips/segment),
  sortering (populær/pris), Basic/Pro synlig. Behold hårlinje-kortstil.
- **Tjeneste-detalj:** hero-bilde (nå ekte), fakta (pris/varighet/garanti der det
  finnes, f.eks. graphene 6 år), «Ofte valgt sammen», sticky booking-CTA.
- **Kundeklubb-seksjon:** erstatt generisk «10 %» med ekte mekanikk (hver 6.
  Basic-vask gratis + spylervæske). Premium «stempelkort»-visual (5+1).
- **Nyheter (ny):** kort-grid (bilde/tittel/ingress/dato/tag: Nyhet/Presse/Guide/
  Nyåpning), detaljside, video-støtte. Filtrering på kategori.
- **Gavekort (ny):** premium produktkort med beløpsvalg (200/500/1000/2500/5000 +
  fritt), hilsen, «Kjøp». Presang-følelse.
- **Selge bil (ny):** landingsside med 3 pakker (Salgsklar Basis / Premium
  Polering / Full Shine – Toppklasse) som sammenlignbare pakkekort + verdipunkter
  (14 % høyere pris, 30 % raskere, 360°-foto, gratis vurdering).
- **Bli franchisetaker (ny):** rekrutterings-landingsside (mulighet, nøkkeltall,
  ledige lokasjoner, CTA/skjema).
- **Bilpleie-guiden (ny):** innholdshub (guider/tips), leservennlig typografi.
- **Avdelinger:** behold kart + liste; premium avdelingskort (senter, åpningstid,
  «Åpen nå», kampanje-chip, «Book her»). Ekte 14 avdelinger.
- **Om oss:** verdiseksjon (HANDZON-akronym), historie/visjon, bærekraft, 20 år.
- **Kontakt (ny):** skjema (navn/epost/telefon, type: endring/forespørsel/
  reklamasjon, velg avdeling).
- **Footer:** speil den ekte IA-en (Informasjon / Mine sider / juridisk),
  selskaps- og org.nr-linje, godkjenning.
- **Trust/godkjenning:** seksjon med ekte verifiseringslenker (Arbeidstilsynet,
  Statens vegvesen).

---

## 10. Overlevering til design-pass

Design-agenten skal, med utgangspunkt i dette dokumentet og demoens eksisterende
design-tokens, produsere en **premium, brukervennlig redesign per komponent** —
konkrete forbedringer i hierarki, layout, bildebruk, CTA, mikrointeraksjoner og
responsivitet — samt design for de nye sidene (Nyheter, Gavekort, Selge bil,
Franchise, Bilpleie-guiden, Kontakt) og den ekte kundeklubb-mekanikken. Behold
navy/Barlow-identiteten og de nye bilpleiebildene.
