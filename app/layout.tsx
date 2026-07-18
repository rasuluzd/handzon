import type { Metadata, Viewport } from "next";
import { Barlow, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RevealProvider } from "@/components/site/RevealProvider";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-source",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.handzonautocare.no"),
  title: {
    default: "Handz On Auto Care – Lever nøkkelen, hent bilen ren",
    template: "%s | Handz On Auto Care",
  },
  description:
    "Book bilpleie mens du handler på senteret. Grundig bilpleie gjort for hånd, hos 15 avdelinger over hele Norge. Se pris og ledige tider med én gang.",
  openGraph: {
    siteName: "Handz On Auto Care",
    locale: "nb_NO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      suppressHydrationWarning
      className={`${barlow.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface">
        {/* Aktiverer reveal-animasjonen kun når JS er tilgjengelig (unngår skjult innhold). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <RevealProvider />
      </body>
    </html>
  );
}
