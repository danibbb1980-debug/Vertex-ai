import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site, brl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const title = `${site.name} — Site profissional por assinatura, a partir de ${brl(site.price)}/mês`;
const description =
  `Sites premium para clínicas, imobiliárias, restaurantes e negócios locais. ` +
  `Sem investimento inicial: criação, hospedagem, manutenção e suporte por ${brl(site.price)}/mês. ` +
  `Sem fidelidade, sem taxa de setup, no ar em ${site.launchDays} dias.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description,
  applicationName: site.name,
  keywords: [
    "criação de sites",
    "site por assinatura",
    "site para clínica de estética",
    "site para imobiliária",
    "site para restaurante",
    "site para negócio local",
    "agência digital",
    "landing page",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#06060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // No maximum-scale / user-scalable=no: pinch-zoom must stay available.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:text-white"
        >
          Pular para o conteúdo
        </a>
        {children}
        {/*
          Core Web Vitals reais dos visitantes.
          O script vem de /_vercel/speed-insights/script.js, uma rota que só
          existe na infraestrutura da Vercel — fora dela daria 404 e erro de MIME
          no console a cada carregamento. VERCEL=1 é definido automaticamente no
          build e no runtime da Vercel, então em produção o comportamento é o
          padrão e localmente o console fica limpo.
        */}
        {process.env.VERCEL === "1" && <SpeedInsights />}
      </body>
    </html>
  );
}
