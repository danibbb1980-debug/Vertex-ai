import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { site } from "@/lib/site-data";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const title = `${site.name} | Reabilitação estética em ${site.city} – ${site.state}`;
const description =
  `${site.person}, especialista em reabilitação estética e CEO do ${site.name}. ` +
  `Alta performance em reabilitação oral em ${site.city} – ${site.state}. ` +
  `Atendimento de segunda a sábado, mediante agendamento pelo WhatsApp.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  applicationName: site.name,
  authors: [{ name: site.person }],
  keywords: [
    "Laboratório Tonon",
    "Matheus Tonon",
    "reabilitação estética",
    "reabilitação oral",
    "reabilitação oral São João da Boa Vista",
    "estética dental São João da Boa Vista",
    "São João da Boa Vista",
  ],
  // Canonical só com o domínio oficial configurado (NEXT_PUBLIC_SITE_URL).
  alternates: site.hasOfficialDomain ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.focus}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.focus}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#e6ecf0",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${instrument.variable}`} suppressHydrationWarning>
      <body>
        {/* Habilita as animações de revelação antes da primeira pintura (ver globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.dataset.js="1"` }} />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-graphite focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
