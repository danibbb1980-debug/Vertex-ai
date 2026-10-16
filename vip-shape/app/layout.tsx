import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site-data";
/*
  Fontes auto-hospedadas (Fontsource, variáveis). Saem do mesmo domínio do site,
  sem depender do Google Fonts, e cada subconjunto só é baixado se a página usar
  aqueles caracteres (unicode-range).
*/
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";

const title = `${site.name} | Academia e musculação em ${site.city} – ${site.state}`;
/** Mesmo título do hero, para o compartilhamento em redes sociais. */
const shareTitle = `Seu próximo nível começa aqui. | ${site.name}`;
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
    title: shareTitle,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description,
  },
  // Rascunho: noindex/nofollow (também enviado no header X-Robots-Tag, ver public/_headers).
  robots: site.rascunho
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
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
    <html lang="pt-BR">
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
