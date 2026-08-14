import type { Metadata } from "next";
import { BloggScreen } from "./blogg-screen";

export const metadata: Metadata = {
  title: "Blogg og nyheter",
  description:
    "Innleggsliste med publisert og utkast, editor med markdown-verktøy, hovedbilde og forhåndsvisning.",
};

export default function AdminBloggPage() {
  return <BloggScreen />;
}
