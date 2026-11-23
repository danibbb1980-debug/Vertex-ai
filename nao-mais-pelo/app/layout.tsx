import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClientEnhancements } from "@/components/ui/ClientEnhancements";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

const description =
  "Depilação com a tecnologia Sun&Safe, exclusiva Não+Pelo, para todos os tipos de pele — inclusive bronzeadas. Mais de 100 unidades no Brasil. Cadastre-se e garanta sua primeira sessão gratuita.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Não+Pelo | Depilação com tecnologia exclusiva Sun&Safe",
    template: "%s | Não+Pelo",
  },
  description,
  applicationName: site.name,
  alternates: site.hasOfficialDomain ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: "Não+Pelo — Liberdade, na sua pele.",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Não+Pelo — Liberdade, na sua pele.",
    description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#95d400",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={jakarta.variable} suppressHydrationWarning>
      <body>
        {/* Habilita as animações de revelação antes da primeira pintura (ver globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.dataset.js="1"` }} />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-5 focus:py-3 focus:text-bone"
        >
          Pular para o conteúdo
        </a>
        {children}
        <ClientEnhancements />
      </body>
    </html>
  );
}
