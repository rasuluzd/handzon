import type { Metadata } from "next";
import { PageHead, Section } from "@/components/site/Section";
import { publishedPosts } from "@/lib/blog";
import { NewsGrid } from "./news-grid";

export const metadata: Metadata = {
  title: "Nyheter",
  description:
    "Siste nytt fra Handz On — nyåpninger, presse og fagstoff om bilpleie, hjulskift og lakkbeskyttelse.",
};

export default function NyheterPage() {
  return (
    <>
      {/* Ingressen er kortet ned til det leseren har nytte av. Setningen om at
          innholdet publiseres fra adminpanelet er intern informasjon, og på
          390px kostet den to linjer over selve listen. */}
      <PageHead
        eyebrow="Aktuelt"
        title="Nyheter og bilpleie-guiden"
        lead="Nyåpninger, saker fra pressen og konkrete råd fra folkene som står i hallen."
      />
      <Section className="!pt-5 hz:!pt-7">
        <NewsGrid posts={publishedPosts()} />
      </Section>
    </>
  );
}
