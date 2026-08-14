/**
 * Blogg og nyheter — kilden både til `/nyheter` på nettstedet og til
 * bloggverktøyet i adminpanelet (ADMIN.md § 6).
 *
 * Innholdet er skrevet i kjedens stemme: konkret fagkunnskap, ingen
 * selgerstemme, og ærlige «når vi sier nei»-avsnitt. Behold tonen.
 * `body` er markdown-lett: `## ` gir mellomtittel, blank linje skiller avsnitt.
 */
export type BlogCategory =
  | "Bilpleie-guiden"
  | "Nyheter"
  | "Kampanje"
  | "Bak kulissene";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Bilpleie-guiden",
  "Nyheter",
  "Kampanje",
  "Bak kulissene",
];

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  author: string;
  /** ISO-dato (YYYY-MM-DD). */
  date: string;
  published: boolean;
  /** Sti under /public. */
  image: string;
  reads: number;
  excerpt: string;
  body: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "p1",
    slug: "derfor-ripes-lakken-i-vaskehallen",
    title: "Derfor ripes lakken i vaskehallen — og hva vi gjør annerledes",
    category: "Bilpleie-guiden",
    author: "Ove Hagen",
    date: "2026-08-06",
    published: true,
    image: "/tjenester/utvendig-handvask.webp",
    reads: 3140,
    excerpt:
      "Roterende børster samler sand fra bilen før deg. Vi vasker for hånd med to bøtter — her er forskjellen i praksis.",
    body: `De fine, halvmåneformede ripene du ser når sola står lavt kalles svirvelmerker. De kommer nesten aldri fra én dramatisk hendelse. De kommer fra vask.

## Børsten husker forrige bil
En automatvask kjører samme børste over hundrevis av biler i døgnet. Sand og veistøv fra bilen før deg sitter fortsatt i børstehårene når de treffer lakken din. På svart og mørkeblå lakk ser du resultatet med én gang.

## To bøtter, én klut per panel
Vi bruker to-bøtte-metoden: én bøtte med såpe, én med rent skyllevann. Kluten skylles mellom hvert panel, så skitten havner i bøtta og ikke tilbake på bilen. Panelene tas i rekkefølge ovenfra og ned, fordi nederste tredjedel av bilen alltid er skitnest.

## Tørking er halve jobben
Mange gjør alt riktig og ødelegger det på slutten. Vi tørker med plysjmikrofiber uten trykk, og går aldri i sirkler. Til slutt kontrollerer vi bilen i arbeidslys — det er der du ser det øyet ikke fanger opp i dagslys.

Har lakken allerede fått svirvelmerker, er polering det som fjerner dem. Vask fjerner skitt, polering fjerner riper.`,
  },
  {
    id: "p2",
    slug: "keramisk-coating-hva-du-faar",
    title: "Keramisk coating: hva du faktisk får for 9 990,-",
    category: "Bilpleie-guiden",
    author: "Ove Hagen",
    date: "2026-07-22",
    published: true,
    image: "/tjenester/keramisk-coating.webp",
    reads: 2410,
    excerpt:
      "Seks års garanti, selvrensende lakk og dyp glans. Vi går gjennom hva behandlingen innebærer, og når den ikke er verdt pengene.",
    body: `Keramisk lakkforsegling er den behandlingen vi får flest spørsmål om. Her er det ærlige svaret.

## Hva du får
Et graphene-basert lag som binder seg kjemisk til klarlakken. Vann perler av og tar med seg støv, så bilen holder seg ren lenger mellom vaskene. Glansen blir dypere, og lakken blir enklere å vaske. Vi gir seks års garanti på behandlingen.

## Hva du ikke får
Coating er ikke panserplate. Den stopper ikke steinsprut og fjerner ikke riper som allerede er der. Derfor poleres bilen alltid først — coating over svirvelmerker låser dem inne.

## Når vi sier nei
Er bilen leaset og skal leveres inn om et år, sier vi det rett ut: ta en polering med voks i stedet. Er lakken svært slitt, må vi vurdere om det er polering og ikke coating som gir mest for pengene.

Behandlingen tar en full dag, og bilen må herde tørt i 24 timer etterpå.`,
  },
  {
    id: "p3",
    slug: "handz-on-asker-er-aapnet",
    title: "Handz On Asker er åpnet — 15 % på første bestilling",
    category: "Nyheter",
    author: "Ove Hagen",
    date: "2026-07-01",
    published: true,
    image: "/tjenester/komplett-bilpleie.webp",
    reads: 1870,
    excerpt:
      "Avdeling nummer 14 står klar på Trekanten i Asker. Ny lokal franchisetaker, samme faste priser.",
    body: `Vi har åpnet på Trekanten i Asker — avdeling nummer 14 i kjeden.

Avdelingen drives av en lokal franchisetaker, slik alle Handz On-avdelinger gjør, og tilbyr hele katalogen: vask ut- og innvendig, polering, keramisk lakkforsegling, interiørrens og hjultjenester.

## Åpningstilbud
Nye kunder får 15 % på første bestilling ut august. Rabatten legges på automatisk i bookingen når du velger Asker.

## Åpningstider
Mandag til onsdag 08–17, torsdag 08–18, fredag 08–17 og lørdag 10–15. Søndag stengt.

Lever nøkkelen i skranken, gjør ærendene dine på senteret, og hent en ren bil.`,
  },
  {
    id: "p4",
    slug: "slik-gjoer-du-bilen-klar-for-hoesten",
    title: "Slik gjør du bilen klar for høsten",
    category: "Bilpleie-guiden",
    author: "Ove Hagen",
    date: "2026-08-12",
    published: false,
    image: "/tjenester/polering.webp",
    reads: 0,
    excerpt:
      "Insektrester, kvae og pollen etter sommeren gjør reell skade om de får stå. Fire ting vi anbefaler før første frost.",
    body: `Sommeren setter spor i lakken som ikke synes før det er for sent.

## 1. Få bort insekter og kvae nå
Insektrester er sure og eter seg inn i klarlakken. Kvae herder og blir vanskeligere for hver uke. Begge løses opp skånsomt — ikke skrap.

## 2. Vurder forsegling før saltet kommer
En forseglet lakk slipper saltet lettere. Det gjør vintervaskene enklere og reduserer risikoen for begynnende korrosjon rundt steinsprut.

## 3. Rens under panseret og i dørkarmene
Det er der løv og skitt samler seg og holder fuktighet mot metall.

## 4. Bytt til vinterhjul i tid
Vi legger om og balanserer mens du handler. Husk å ta vask av de løse hjulene før de settes bort — salt og bremsestøv jobber hele vinteren i lagerrommet.`,
  },
  {
    id: "p5",
    slug: "vi-gjenbruker-vaskevannet",
    title: "Vi gjenbruker vaskevannet — dette er tallene",
    category: "Bak kulissene",
    author: "Ove Hagen",
    date: "2026-06-14",
    published: false,
    image: "/om-oss/detaljering.webp",
    reads: 0,
    excerpt:
      "Renseanlegget vårt betyr at en full håndvask hos oss bruker mindre vann enn en hjemmevask med hageslange.",
    body: `Folk blir overrasket når vi sier at håndvask bruker mindre vann enn en hageslange hjemme. Her er regnestykket.

## Anlegget
Vaskevannet går gjennom oljeavskiller og rensetrinn, og brukes om igjen i forvask. Bare siste skylling er ferskvann.

## Hva det betyr i praksis
En hageslange på full åpning gir rundt 15 liter i minuttet. En halvtimes vask hjemme kan fort bruke over 300 liter — og vannet går rett i overvannsnettet med olje, asfalt og bremsestøv.

## Ikke bare vann
Vi doserer miljømerkede produkter i stedet for å øse på, og dekkposene våre er i resirkulert plast.

Vi er registrert i Arbeidstilsynets godkjenningsordning for bilpleie, og det stiller krav til både kjemikaliehåndtering og avløp.`,
  },
  {
    id: "p6",
    slug: "20-ars-jubileum",
    title: "Handz On markerte 20-årsjubileum",
    category: "Nyheter",
    author: "Ove Hagen",
    date: "2025-09-15",
    published: true,
    image: "/tjenester/komplett-bilpleie.webp",
    reads: 1420,
    excerpt:
      "I 2025 rundet kjeden 20 år. Fra ett vaskested til 14 avdelinger på noen av landets største kjøpesentre.",
    body: `Handz On startet med en enkel idé: gjør grundig bilpleie enkelt for folk med en travel hverdag. Lever nøkkelen, gjør ærendene dine, og hent en skinnende ren bil.

Tjue år senere er konseptet det samme, men kjeden teller nå 14 lokale avdelinger drevet av egne franchisetakere. Over 120 000 biler er behandlet av fagfolk som bryr seg om detaljene.

«Det viktigste har alltid vært håndverket og folkene. Vi feirer jubileet ved å fortsette å heve standarden for bilpleie i Norge,» sier ledelsen.`,
  },
  {
    id: "p7",
    slug: "trygg-og-serios-bilpleie",
    title: "Trygg og seriøs bilpleie — ditt valg gir effekt",
    category: "Nyheter",
    author: "Ove Hagen",
    date: "2025-06-10",
    published: true,
    image: "/om-oss/detaljering.webp",
    reads: 980,
    excerpt:
      "Når du velger en registrert og godkjent aktør, bidrar du til ryddige forhold i en bransje med useriøse aktører.",
    body: `Bilpleiebransjen har dessverre sitt innslag av useriøse aktører. Handz On har fra start satset på det motsatte: registrerte virksomheter, ordnede lønninger og godkjente prosesser.

Alle avdelinger er registrert i Arbeidstilsynets godkjenningsordning for bilpleievirksomhet. Det betyr trygghet for både ansatte og kunder.

Velger du en godkjent aktør, gir valget ditt effekt langt utover din egen bil.`,
  },
  {
    id: "p8",
    slug: "det-skal-skinne-av-hms",
    title: "Det skal skinne av bilpleiernes HMS",
    category: "Bak kulissene",
    author: "Ove Hagen",
    date: "2025-04-22",
    published: true,
    image: "/om-oss/detaljering.webp",
    reads: 760,
    excerpt:
      "Godkjenningsordningen for bilpleie, dekk og karosseri har løftet standarden i hele bransjen.",
    body: `Arbeidstilsynets godkjenningsordning stiller krav til HMS, arbeidsforhold og seriøsitet. Handz On har vært en pådriver for ordningen fra tidlig av.

For kundene betyr det at bilen behandles av folk som jobber under ryddige forhold — og at kvaliteten er forutsigbar fra avdeling til avdeling.`,
  },
  {
    id: "p9",
    slug: "pleier-bilen-mens-kundene-handler",
    title: "Pleier bilen mens kundene handler",
    category: "Nyheter",
    author: "Ove Hagen",
    date: "2025-03-05",
    published: true,
    image: "/tjenester/utvendig-vask-og-voks.webp",
    reads: 1130,
    excerpt:
      "Konseptet er enkelt: lever bilen på senteret, gjør ærendene dine, og hent den ferdig pleiet.",
    body: `Ideen bak Handz On er å fjerne friksjonen fra bilpleie. Du trenger ikke sette av en hel formiddag — du leverer bilen mens du uansett er på senteret.

Plasseringen på kjøpesentre gjør at kundene kan handle, spise lunsj eller ta en kaffe mens fagfolkene jobber. Når du er ferdig, står bilen klar.`,
  },
  {
    id: "p10",
    slug: "ny-avdeling-triaden",
    title: "Ny avdeling åpnet på Triaden",
    category: "Nyheter",
    author: "Ove Hagen",
    date: "2026-02-27",
    published: true,
    image: "/hero-hjulskift.webp",
    reads: 1540,
    excerpt:
      "Handz On er nå på plass på Triaden i Lørenskog — enda et senter der du kan pleie bilen mens du handler.",
    body: `Nyåpningen på Triaden føyer seg inn i rekken av avdelinger på sentrale kjøpesentre. Avdelingen tilbyr hele tjenestespekteret, fra Basic-vask til keramisk lakkforsegling.

Kombinert med søsteravdelingen Metro dekker Handz On nå Lørenskog-området godt. Velkommen innom!`,
  },
  {
    id: "p11",
    slug: "grundig-hjulvask-ved-hjulskift",
    title: "Grundig hjulvask ved hjulskift",
    category: "Bilpleie-guiden",
    author: "Ove Hagen",
    date: "2026-05-14",
    published: true,
    image: "/hero-hjulskift.webp",
    reads: 1290,
    excerpt:
      "Skal du legge om? Rene hjul før lagring hindrer misfarging og gjør neste sesong enklere.",
    body: `Bremsestøv og veisalt setter seg i felgene og kan misfarge dem over tid. Når du legger om hjulene, er det derfor lurt å vaske dem grundig før de settes bort.

Vi tilbyr vask av løse hjul samtidig som vi legger om — da er sommer- eller vinterhjulene klare og rene til neste sesong.

Tips: kombiner gjerne hjulskift med en utvendig vask, så er hele bilen klar på ett besøk.`,
  },
  {
    id: "p12",
    slug: "tidlig-ute-med-hjulskift",
    title: "Vær tidlig ute med hjulskift — kombiner med polering",
    category: "Bilpleie-guiden",
    author: "Ove Hagen",
    date: "2025-10-02",
    published: true,
    image: "/tjenester/polering.webp",
    reads: 870,
    excerpt:
      "Unngå køen i høysesongen. Å bestille tidlig gir bedre tid — og en fin anledning til å friske opp lakken.",
    body: `Når været snur, vil alle skifte hjul samtidig. Er du tidlig ute, slipper du ventetiden og får den tiden som passer deg best.

Sesongskiftet er også et godt tidspunkt for polering: lakken har fått en sesong med salt, bremsestøv og skitt. En polering fjerner matthet og legger et lag med beskyttelse før vinteren.`,
  },
  {
    id: "p13",
    slug: "salt-bremsestov-og-skitt",
    title: "Fjerning av salt, bremsestøv og skitt — polering beskytter lakken",
    category: "Bilpleie-guiden",
    author: "Ove Hagen",
    date: "2026-01-20",
    published: true,
    image: "/tjenester/keramisk-coating.webp",
    reads: 1010,
    excerpt:
      "Veisalt og bremsestøv sliter på lakken. Riktig vask og beskyttelse forlenger levetiden og glansen.",
    body: `Om vinteren utsettes bilen for salt, sand og bremsestøv som fester seg til lakk og felger. Over tid gir det matthet og små skader.

Regelmessig, skånsom håndvask fjerner det verste. En polering med påfølgende forsegling — enten voks, NANO eller keramisk — legger et beskyttende lag som gjør bilen lettere å holde ren.

Vil du ha maksimal beskyttelse, er keramisk lakkforsegling med Graphene et godt valg, med opptil seks års garanti.`,
  },
];

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatPostDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T12:00:00`));
}

/** «12.08.2026» — tabellvisningen i adminpanelet. */
export function formatPostDateShort(isoDate: string): string {
  return isoDate.split("-").reverse().join(".");
}

/** Nettadresse fra tittel. Æ/ø/å translittereres (ADMIN.md § Editoren). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function countWords(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(countWords(body) / 200));
}

/** Kun publiserte innlegg vises på nettstedet. */
export const publishedPosts = (): BlogPost[] =>
  blogPosts.filter((post) => post.published).sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug && post.published);
}
