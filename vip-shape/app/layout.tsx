import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const title = `${site.name} | Academia e musculação em ${site.city} – ${site.state}`;
const description =
  `Academia em ${site.city} com equipamentos modernos, musculação e aulas de Hit Dance, Dança e Jump. ` +
  `Ambiente acolhedor e equipe atenciosa no Residencial Tiradentes. Fale com a VIP Shape pelo WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  applicationName: site.name,
  keywords: [
    "academia em Poços de Caldas",
    "musculação Poços de Caldas",
    "academia Residencial Tiradentes",
    "Hit Dance Poços de Caldas",
    "aula de Jump Poços de Caldas",
    "aula de dança Poços de Caldas",
    "VIP Shape Academia",
  ],
  // Canonical só com o domínio oficial configurado (NEXT_PUBLIC_SITE_URL).
  alternates: site.hasOfficialDomain ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {/* Habilita as animações de revelação antes da primeira pintura (ver globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.dataset.js="1"` }} />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-orange focus:px-5 focus:py-3 focus:font-semibold focus:text-ink"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
