import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.handzonautocare.no"),
  title: {
    default: "Handz On Auto Care – Profesjonell bilpleie på 15 steder i Norge",
    template: "%s | Handz On Auto Care",
  },
  description:
    "Norges ledende bilpleiekjede. Bestill utvendig og innvendig bilpleie, polering og keramisk coating på under ett minutt – hos 15 avdelinger over hele landet.",
  openGraph: {
    siteName: "Handz On Auto Care",
    locale: "nb_NO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
