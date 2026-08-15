export const meta = {
  name: 'handzon-mobil-implementering',
  description: 'Implementer mobiltilpasning per sideområde etter auditfunnene',
  phases: [{ title: 'Implementer', detail: 'ett område per agent, disjunkte filer' }],
}

const ROOT = 'C:/Users/rasul/handzon-1'
const BRIEFS = 'C:/Users/rasul/AppData/Local/Temp/claude/C--Users-rasul-handzon-1/d02f5160-37d3-48c5-ac45-63d5aaa08cf8/scratchpad'

const CONTRACT = `
# Oppdrag

Handz On Auto Care — Next.js 16 (App Router) + React 19 + Tailwind CSS 4 i ${ROOT}.
Norsk bilpleiekjede. Booking er konverteringsmålet.

Kunden sier: mobilmenyen var ødelagt, siden er tung å scrolle, elementene er for store
og lite brukervennlige, og siden skal maksimere salg. Du skal gjøre DINE tildelte filer
mobilvennlige og salgsmaksimerende. Du er en toppklasses produktdesigner som skriver kode.

# Dette er ALLEREDE gjort i delte filer — ikke gjør det om igjen, men bygg på det

- \`components/site/Header.tsx\`: mobilmeny-feilen er fikset (arket lå inni en
  backdrop-filter-header og ble klippet). Headeren er nå **61px høy på mobil**,
  79px fra 900px, uten krympe-effekt, og har en **permanent «Bestill time»-knapp
  også på mobil**. Sticky elementer skal derfor bruke \`top-[61px] hz:top-[79px]\`.
  Fordi headerens CTA alltid er synlig, trenger IKKE hver side sin egen global
  bunnbar — men sidespesifikke sticky barer (tjenestedetalj, booking) beholdes.
- \`components/ui/Button.tsx\`: \`size="sm"\` er nå \`min-h-[44px] hz:min-h-[38px]\`.
- \`components/ui/Chip.tsx\`: nå \`py-[11px] hz:py-2\` (44px på touch).
- \`components/ui/Card.tsx\`: \`elevated\` = \`p-4 hz:p-6\`, flat = \`p-4 hz:p-5\`.
- \`components/site/Section.tsx\`: \`Section\` gir \`py-[clamp(30px,5vw,76px)]\`
  (tight: \`pt-[clamp(22px,3vw,44px)]\`), horisontal \`px-[clamp(16px,4vw,64px)]\`.
  \`SectionHead\`/\`PageHead\` har fått responsiv typografi (h2 clamp(24px,3.2vw,38px),
  h1 clamp(28px,4vw,46px), ingress 16.5px mobil / 19px desktop).
- \`components/site/ServiceTile.tsx\`: er nå et **RADKORT under 900px** (116px
  kvadratisk foto til venstre, tekst og pris til høyre) og mediekort fra 900px.
- \`components/site/BranchCard.tsx\`: strammet inn, kampanje-tag brekker nå linje,
  tag-raden har \`min-h-[26px]\` mot layouthopp.
- \`components/site/Footer.tsx\`, \`StatStrip\`, \`TrustBand\`, \`SocialProof\`,
  \`StampCard\`, \`Hero\`, \`app/page.tsx\`: strammet inn for mobil.
- \`app/globals.css\`: \`.hz-reveal\` og \`.hz-map iframe\`-filteret er nå
  **desktop-only** (min-width: 900px). \`.hz-page\` er en kort fade på mobil.
  Sidepadding-tokenene er \`clamp(16px,4vw,64px)\`.

# Designsystemet — regler som ikke kan brytes

- Ett brytepunkt på kundeflaten: \`hz:\` = 900px. \`max-hz:\` = kun under 900px.
  Ikke innfør nye brytepunkter.
- Navy \`#1e3a70\` er eneste merkevarefarge. Rød \`--color-red\` er KUN aksent
  (maks ett konverteringspunkt per skjerm), aldri stor flate. Ingen nye farger.
- \`--color-muted\` / \`--color-muted-light\` er under AA og skal ALDRI brukes til
  tekst. Sekundær tekst går på \`text-body-soft\`.
- Ingen \`text-white/45\` o.l. på navy — bruk \`text-on-navy\`, \`text-on-navy-soft\`,
  \`text-on-navy-eyebrow\`, \`text-on-navy-bright\`.
- Fokusringen er global i \`@layer base\` og skal aldri fjernes.
- Priser lagres i ØRE og formateres via \`lib/format.ts\`. \`tabular\`-klassen på tall.
- Norsk bokmål i all UI-tekst. Ingen emoji. Ingen utropstegn.
  Knapper er verb + objekt: «Bestill time», «Se avdelingen», «Hent bilinfo».
- Trykkflater minst 44px på touch (\`min-h-[44px] hz:min-h-0\` er mønsteret).
- Skriftstørrelse minst 16px i input-felt (ellers zoomer iOS).

# Tekniske fallgruver

- \`react-hooks/set-state-in-effect\` er PÅ og slår hardt. Ikke sett state i en
  effekt. Bruk \`useSyncExternalStore\`, rAF-utsatt første sjekk, eller skriv rett
  til DOM. Se \`components/site/OpenStatus.tsx\` og \`Reveal.tsx\` for mønstrene.
- Dette er Next.js 16 med brytende endringer. Rører du rammeverks-API-er, les
  \`${ROOT}/node_modules/next/dist/docs/\` først.
- \`next/image\`: \`sizes\` MÅ speile den faktiske viste bredden. Et \`100vw\` på et
  bilde som vises 116px bredt laster et 1200px-bilde på mobil.
- Tailwind-bredder kolliderer: legger du \`w-*\` utenpå noe som allerede har
  \`w-full\`, taper du.
- Ikke bruk \`Math.random()\` eller \`Date.now()\` til noe som vises.

# Arbeidsregler

1. **Du eier KUN filene som er listet under «Dine filer».** Ikke rør noen andre
   filer — andre agenter jobber parallelt i samme repo, og en endring utenfor
   ditt område blir overskrevet eller skaper konflikt.
2. Les auditbriefen din først. Den inneholder verifiserte funn med målte
   pikselverdier. Bruk dem, men bruk skjønn — noen funn kan være feil eller
   allerede løst av endringene over. Ikke implementer et tiltak du mener er galt;
   forklar heller hvorfor i rapporten.
3. Behold all eksisterende funksjonalitet og forretningslogikk. Du endrer
   presentasjon, tetthet, trykkflater og konverteringsstier — ikke datamodell,
   ikke prisberegning, ikke stegrekkefølge.
4. Behold og oppdater de norske kommentarene i filene der de forklarer HVORFOR.
   Skriver du ny ikke-åpenbar kode, forklar hvorfor på norsk i samme stil.
5. Koden må typesjekke (\`npx tsc --noEmit\`) og passere \`npx eslint\`. IKKE kjør
   build/lint selv — flere agenter deler samme .next-katalog. Vær nøye i stedet.
6. Ikke lag nye filer med mindre det er strengt nødvendig; hold deg til å endre
   de tildelte.

# Rapport

Svar til slutt med en kort punktliste på norsk: hva du endret per fil, og hvilke
funn du forkastet med begrunnelse. Ingen kodeblokker i rapporten.
`

const AREAS = [
  {
    key: 'tjenester-katalog',
    brief: `${BRIEFS}/tjenester-katalog.md`,
    files: ['app/tjenester/page.tsx', 'app/tjenester/service-catalog.tsx'],
    focus: `Katalogen er der folk velger hva de skal kjøpe. Viktigst:
- Filterbaren: \`sticky top-[69px]\` er feil nå (headeren er 61px) → \`top-[61px] hz:top-[79px]\`.
  Fjern \`backdrop-blur\` på mobil (bruk ugjennomsiktig \`bg-surface\`, \`hz:bg-surface/95 hz:backdrop-blur-[12px]\`)
  — to backdrop-filter-lag oppå hverandre er dyrt i hver rullefreme.
- Baren er ~123px høy på mobil fordi sorterings-selecten legger seg på egen full rad.
  Få chips og sortering på SAMME rad på mobil (chip-stripa \`flex-1 min-w-0\`, selecten
  \`shrink-0\` og smal, f.eks. bare ikon + kort etikett), slik at baren blir ~56px.
- \`key={category ?? "alle"}\` på gridet river ned alle 18 next/image-noder ved hvert
  chip-trykk. Fjern nøkkelen (eller flytt den til et element som ikke inneholder bildene)
  slik at React kan gjenbruke kortene. Behold gjerne kryssfaden, men ikke på bekostning av
  remount av bilder.
- Chip-stripa er ~773px bred i et 358px vindu uten synlig affordans for at den kan dras.
  Legg på en kantmaske/fade i høyre kant så det er tydelig at det er mer.
- ServiceTile er nå radkort på mobil — sørg for at grid-oppsettet er én kolonne under
  900px (\`grid-cols-1\`) og at gapet er 12px på mobil.
- Vurder å vise pris + en direkte «Bestill»-vei sterkere: fra katalogen er korteste vei til
  booking i dag to navigeringer. Ikke bygg om ServiceTile (den eies ikke av deg), men du kan
  justere sidens tekst og eventuelle CTA-er rundt listen.`,
  },
  {
    key: 'tjeneste-detalj',
    brief: `${BRIEFS}/tjeneste-detalj.md`,
    files: ['app/tjenester/[slug]/page.tsx', 'components/site/ServiceRow.tsx'],
    focus: `Dette er siden som konverterer et produkt til en booking.
- Sticky bunnbar er ~140px høy på mobil fordi knappen brekker til egen rad.
  Gjør den til ÉN rad på mobil: kompakt pris til venstre, «Bestill denne» som
  \`flex-1\` til høyre. Fjern «Valgt tjeneste»-blokka under 900px (navnet står i H1 rett over).
  Juster \`pb-[100px]\` på innholdet til den nye barhøyden.
- Toppbildet \`h-[clamp(200px,26vw,320px)]\` lander på 200px gulvverdi på mobil —
  vurder ~160px og sørg for at \`sizes\` reflekterer faktisk bredde.
- \`ServiceRowLink\`: tekstkolonnen klemmes til ~146px på 390px fordi bildet er 70px
  \`shrink-0\` og priskolonnen ~78px. Krymp bildet til 56px på mobil, la beskrivelsen
  klippes med \`line-clamp-2\`, og gjør prisen mindre på mobil.
- Faktaboksen (\`<dl>\`) og «Dette inngår» kan strammes inn på mobil.
- Overskrifter \`text-[24px] mt-[34px]\` → mindre topmarg og 20-21px på mobil.`,
  },
  {
    key: 'avdelinger',
    brief: `${BRIEFS}/avdelinger.md`,
    files: [
      'app/avdelinger/page.tsx',
      'app/avdelinger/location-list.tsx',
      'app/avdelinger/[slug]/page.tsx',
      'components/site/OpeningHoursTable.tsx',
      'components/site/GoogleBranchMap.tsx',
    ],
    focus: `To ekte feil og en lang side.
- \`onMouseEnter\` er ENESTE måte å bytte hvilken avdeling kartet viser. Touch har ingen
  hover, så kartet står fast på locations[0] for alltid på mobil. Fiks: enten skjul kartet
  under 900px (\`max-hz:hidden\` på kartkolonnen) — det er også en stor ytelsesgevinst siden
  et Google Maps-iframe øverst i viewporten gjør \`loading="lazy"\` til en no-op — eller gi
  kortene et faktisk trykk-mål som setter aktiv avdeling. Velg det du mener er best for salg,
  og begrunn valget. Anbefaling: skjul kartet på mobil, la søk + «Nær meg» + rangert liste
  være mobilopplevelsen, siden hvert avdelingskort uansett lenker videre til sin egen side.
- Gjør i så fall søkefeltet og «Nær meg» til det første man ser på mobil.
- 14 avdelingskort etter hverandre blir en veldig lang side. Vurder «Vis flere avdelinger»
  etter de 6 første på mobil (ren useState, ingen state i effekt), slik at siden starter
  kort. Behold alle 14 i DOM for søk hvis det er enklest — men da må du klippe visningen.
- \`app/avdelinger/[slug]/page.tsx\`: ingen vedvarende booking-CTA, 287px åpningstidstabell,
  og generelt for store elementer. Stram inn, og vurder en sticky bunnbar med «Bestill time
  her» på mobil (bruk \`components/site/StickyBar.tsx\` — den er allerede kompakt).
- \`GoogleBranchMap\`: hold API-bruken som den er (eksplisitt kundekrav), men du kan legge
  til attributter som gjør innlastingen billigere.`,
  },
  {
    key: 'nyheter',
    brief: `${BRIEFS}/nyheter.md`,
    files: [
      'app/nyheter/page.tsx',
      'app/nyheter/news-grid.tsx',
      'app/nyheter/[slug]/page.tsx',
      'components/site/PostBody.tsx',
    ],
    focus: `- 11 innlegg à ~400px = ~4580px på mobil. Gjør kortene til RADKORT under 900px
  etter samme mønster som \`components/site/ServiceTile.tsx\` (les den for stilen): lite
  kvadratisk foto til venstre (~96-116px), tittel + kategori + dato til høyre, beskrivelse
  \`line-clamp-2\`. Behold mediekort-oppsettet fra 900px.
- \`sizes="(min-width: 900px) 380px, 100vw"\` er feil for den nye mobilbredden — rett den.
- Artikkelsiden har NULL booking-CTA. Dette er sidens høyeste intensjonspunkt: leseren har
  nettopp lest om en tjeneste. Legg inn en tydelig, relevant CTA etter artikkelteksten
  (navy kort eller knapperad) som lenker til \`/booking\` eller til relevant tjeneste.
  Bruk eksisterende komponenter (\`ButtonLink\`, \`Card\`, \`Section\`).
- «← Tilbake» på mobil har ~62x20px trykkflate. Minst 44px høyde.
- Kategori-chips: Chip er allerede 44px nå — sjekk bare at raden har rulleaffordans.
- \`PostBody\`: typografi og bildestørrelser for mobil.`,
  },
  {
    key: 'min-side',
    brief: `${BRIEFS}/min-side.md`,
    files: ['app/min-side/min-side-client.tsx', 'app/min-side/page.tsx'],
    focus: `- Handlingsraden på en kommende avtale har tre 38px-kontroller som ikke får
  plass på 390px. Prioriter: «Endre tid» er primær, «Veibeskrivelse» og «Avbestill»
  sekundære. Gjør raden brukbar på mobil (stable, eller la primærknappen ta full bredde).
- Fanevalget: Chip er 44px nå, men raden er ~435px bred mot 358px tilgjengelig — sørg for
  rulleaffordans eller kortere etiketter.
- Kvitteringsraden klemmer tekstblokka i stjerneform på 390px — la den brekke.
- Når brukeren HAR kommende avtaler finnes ingen «Bestill ny time» noe sted. Legg inn en
  tydelig CTA øverst eller nederst i «Kommende avtaler»-fanen.
- Generell tetthet: mindre kortpadding, mindre overskrifter på mobil.`,
  },
  {
    key: 'innhold',
    brief: `${BRIEFS}/innhold.md`,
    files: [
      'app/om-oss/page.tsx',
      'app/kontakt/page.tsx',
      'app/kontakt/kontakt-form.tsx',
      'app/kundeklubb/page.tsx',
    ],
    focus: `- \`om-oss\`: 200px dekorativt toppfoto før H1 i det hele tatt starter — kort det
  ned på mobil (~140px). Tidslinje-gridet mangler \`gap\`, så postene klistrer seg sammen når
  det kollapser til én kolonne på mobil. HANDZON-verdigridet og bærekraftsbildet (300px fast
  høyde) må strammes inn. Legg gjerne inn en tydeligere avslutnings-CTA.
- \`kundeklubb\`: første CTA treffer først rundt 1550px ned. Flytt en «Bli medlem — gratis»
  opp i eller rett under navy-heroen. \`StampCard\` er allerede fikset for mobil av andre —
  ikke rør den filen, men du kan justere panelet rundt (padding, rekkefølge).
- \`kontakt\`/\`kontakt-form\`: skjemaet er ~826px høyt på mobil. Stram inn feltavstandene.
  \`handleSubmit\` setter feilmeldinger uten å flytte fokus eller scroll — brukeren ser
  ingenting skje. Flytt fokus til første felt med feil (\`ref\` + \`.focus()\` i
  hendelseshåndtereren, IKKE i en effekt). Sjekk at alle felt har riktig \`type\`,
  \`inputMode\` og \`autoComplete\`, og minst 16px skrift.`,
  },
]

phase('Implementer')
const results = await parallel(
  AREAS.map((a) => () =>
    agent(
      `${CONTRACT}

# Dine filer (og BARE disse)

${a.files.map((f) => '- ' + ROOT + '/' + f).join('\n')}

# Auditbrief

Les først: ${a.brief}
Den har verifiserte funn med målte pikselverdier for akkurat dine filer.

# Ekstra føringer for ditt område

${a.focus}

Les filene, gjør endringene, og rapporter.`,
      { label: `impl:${a.key}`, phase: 'Implementer' },
    ).then((r) => ({ area: a.key, report: r })),
  ),
)

return results.filter(Boolean)
