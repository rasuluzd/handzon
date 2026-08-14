import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { PostBody } from "@/components/site/PostBody";
import { Breadcrumbs, Section } from "@/components/site/Section";
import {
  formatPostDate,
  formatPostDateShort,
  getPostBySlug,
  publishedPosts,
  readingMinutes,
} from "@/lib/blog";
import { formatDuration, formatKr } from "@/lib/format";
import { getServiceBySlug } from "@/lib/mock-data";

/**
 * Saken → tjenesten den handler om. Artikkelslutten er sidens høyeste
 * intensjonspunkt: leseren har nettopp lest hva en behandling innebærer og hva
 * den koster. Kartet lar bookingen starte med riktig tjeneste allerede valgt
 * (`/booking?tjeneste=`), slik tjenestedetaljsiden gjør. Saker uten en åpenbar
 * tjeneste — nyåpninger, kjedenytt, HMS — faller tilbake på vanlig booking.
 */
const postService: Record<string, string> = {
  "derfor-ripes-lakken-i-vaskehallen": "vask-utvendig-premium",
  "keramisk-coating-hva-du-faar": "keramisk-lakkforsegling",
  "slik-gjoer-du-bilen-klar-for-hoesten": "omlegg-balansering",
  "grundig-hjulvask-ved-hjulskift": "vask-av-hjul",
  "tidlig-ute-med-hjulskift": "omlegg-balansering",
  "salt-bremsestov-og-skitt": "polering-pro",
};

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/nyheter/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function NewsArticlePage({ params }: PageProps<"/nyheter/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const serviceSlug: string | undefined = postService[slug];
  const service = serviceSlug ? getServiceBySlug(serviceSlug) : undefined;

  /* Samme kategori først: den som nettopp har lest en fagartikkel leser heller
     neste fagartikkel enn en pressemelding. Rekkefølgen er deterministisk. */
  const others = publishedPosts().filter((item) => item.slug !== slug);
  const related = [
    ...others.filter((item) => item.category === post.category),
    ...others.filter((item) => item.category !== post.category),
  ].slice(0, 3);

  return (
    <>
      {/* Toppbildet er dekorativt (alt=""). På 390px la et 200px høyt bilde
          pluss 61px header beslag på en tredjedel av skjermen før tittelen kom
          — der er det en 140px stripe. `sizes` følger den faktiske bredden, så
          mobilen henter 640px-kandidaten i stedet for 1200px. */}
      <div className="relative h-[140px] overflow-hidden bg-surface-sunken hz:h-[clamp(200px,26vw,320px)]">
        <Image
          src={post.image}
          alt=""
          fill
          preload
          sizes="(min-width: 900px) 100vw, 420px"
          className="object-cover"
        />
      </div>

      <article className="mx-auto max-w-[820px] px-[clamp(16px,4vw,64px)] pb-4 pt-[18px] hz:pt-[26px]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Forside" },
            { href: "/nyheter", label: "Nyheter" },
          ]}
          current={post.title}
          className="mb-4 max-hz:hidden"
        />
        {/* Eneste vei tilbake på mobil — brødsmulene er skjult der. Uten
            padding var trefflaten 62×20px. `-ml-2` holder teksten på
            tekstkanten selv om knappen er 44px høy. */}
        <Link
          href="/nyheter"
          className="-ml-2 mb-1 inline-flex min-h-[44px] items-center px-2 text-[14px] text-body-soft hover:text-navy hz:hidden"
        >
          ← Tilbake
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 hz:mb-3.5">
          <Tag variant="mute">{post.category}</Tag>
          <time dateTime={post.date} className="tabular text-[13px] text-body-soft hz:text-[13.5px]">
            <span className="hz:hidden">{formatPostDateShort(post.date)}</span>
            <span className="max-hz:hidden">{formatPostDate(post.date)}</span>
          </time>
          <span aria-hidden className="text-body-soft">
            ·
          </span>
          <span className="text-[13px] text-body-soft hz:text-[13.5px]">
            {post.author} · {readingMinutes(post.body)} min
          </span>
        </div>

        <h1 className="font-heading text-[clamp(27px,3.6vw,42px)] font-bold leading-[1.06] tracking-[-.03em] text-ink hz:leading-[1.04]">
          {post.title}
        </h1>
        <p className="mt-3 max-w-[58ch] text-[16.5px] leading-[1.5] text-body hz:mt-3.5 hz:text-[19px] hz:leading-[1.55]">
          {post.excerpt}
        </p>

        <PostBody body={post.body} />

        {/* Konverteringspunktet. Artikkelen endte tidligere rett i tre nye
            artikler, altså i mer lesing — aldri i en bestilling. Blokken ligger
            inne i artikkelen fordi den er sakens konklusjon, ikke en banner. */}
        <aside className="on-dark mt-8 rounded-card-lg bg-navy p-4 hz:mt-10 hz:p-[clamp(26px,3vw,40px)]">
          <p className="font-heading text-[11.5px] font-semibold uppercase tracking-[.18em] text-on-navy-eyebrow hz:text-[12px] hz:tracking-[.2em]">
            Neste steg
          </p>
          <h2 className="my-2 font-heading text-[clamp(21px,2.6vw,30px)] font-bold leading-[1.12] tracking-[-.024em] text-white hz:my-3">
            Klar for å bestille?
          </h2>
          <p className="mb-4 max-w-[52ch] text-[15px] leading-[1.5] text-on-navy hz:mb-6 hz:text-[16.5px] hz:leading-[1.55]">
            {service
              ? `${service.name} koster fra ${formatKr(service.priceOre)} og tar ca. ${formatDuration(service.durationMin)}. Fast pris, ingen timepris — du får bekreftelsen med én gang.`
              : "Fast pris på alle tjenester i 14 avdelinger. Lever nøkkelen mens du er på senteret, og hent en ferdig pleiet bil."}
          </p>
          <div className="flex flex-col items-start gap-3 hz:flex-row hz:items-center hz:gap-5">
            <ButtonLink
              href={service ? `/booking?tjeneste=${service.slug}` : "/booking"}
              variant="onNavy"
              size="lg"
              block
              className="hz:w-auto"
            >
              Bestill time
            </ButtonLink>
            <Link
              href={service ? `/tjenester/${service.slug}` : "/tjenester"}
              className="inline-flex min-h-[44px] items-center font-heading text-[12.5px] font-semibold uppercase tracking-[.1em] text-on-navy-bright underline underline-offset-4 hover:text-white"
            >
              {service ? "Se hva som inngår" : "Se alle tjenester"}
            </Link>
          </div>
        </aside>
      </article>

      {related.length > 0 && (
        <Section tight>
          <h2 className="mb-4 border-t border-line pt-6 font-heading text-[20px] font-bold tracking-[-.02em] text-ink hz:mb-5 hz:pt-8 hz:text-[24px]">
            Flere saker
          </h2>
          {/* Samme radkort som i nyhetslisten under 900px. Tre mediekort à
              ~290px la 870px «mer lesing» etter bestillingsknappen. */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 max-hz:grid-cols-1 max-hz:gap-2.5">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/nyheter/${item.slug}`}
                className="group flex overflow-hidden rounded-card-lg border border-line-strong bg-surface transition-[border-color,transform] duration-200 ease-standard hover:border-navy hz:flex-col hz:hover:-translate-y-0.5"
              >
                <div className="relative shrink-0 overflow-hidden bg-surface-sunken max-hz:w-[92px] hz:aspect-[16/9] hz:w-full">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 900px) 360px, 92px"
                    className="object-cover transition-transform duration-[380ms] ease-standard hz:group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center px-3.5 py-3 hz:justify-start hz:p-4">
                  <div className="mb-1 flex items-center gap-1.5 text-[11.5px] text-body-soft hz:mb-1.5 hz:gap-2 hz:text-[12.5px]">
                    <span className="truncate font-heading font-semibold">{item.category}</span>
                    <span aria-hidden>·</span>
                    <time dateTime={item.date} className="shrink-0 tabular">
                      <span className="hz:hidden">{formatPostDateShort(item.date)}</span>
                      <span className="max-hz:hidden">{formatPostDate(item.date)}</span>
                    </time>
                  </div>
                  <h3 className="line-clamp-2 font-heading text-[15.5px] font-semibold leading-[1.28] text-ink group-hover:text-navy hz:text-[16.5px] hz:leading-[1.3]">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
