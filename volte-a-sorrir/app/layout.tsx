import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const title = `Dentista em ${site.city} – ${site.state} | ${site.name}`;
const description =
  `${site.description} Implantes, próteses, coroas em porcelana, clareamento, aparelho ortodôntico, ` +
  `restaurações e canal em ${site.city}, ${site.stateName}. Agende pelo WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  applicationName: site.name,
  keywords: [
    "dentista em Alfenas",
    "dentista Alfenas MG",
    "clínica odontológica Alfenas",
    "implante dentário Alfenas",
    "prótese dentária Alfenas",
    "clareamento dental Alfenas",
    "aparelho ortodôntico Alfenas",
    "tratamento de canal Alfenas",
    "Dentista Volte a Sorrir",
  ],
  alternates: site.hasOfficialDomain ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: `${site.name} — Seu sorriso merece cuidado de verdade`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Seu sorriso merece cuidado de verdade`,
    description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#ffdd58",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca o documento antes da pintura: só então os .reveal começam ocultos. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">{children}</body>
    </html>
  );
}
