import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Montserrat } from "next/font/google";
import { studio } from "@/lib/studio-vip";
import "./studio-vip.css";

/*
  Tipografia das peças da marca: títulos condensados em itálico (como "VANDO"
  e "VANDO E NATÁLIA") e corpo em Montserrat. Só os pesos usados.
*/
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["800"],
  style: ["italic"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const title = "Studio VIP | Treinamento Personalizado em Poços de Caldas";
const description =
  "Conheça o Studio VIP em Poços de Caldas. Treinamento personalizado, acompanhamento próximo e orientação nutricional. Entre em contato pelo WhatsApp.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  applicationName: studio.name,
  authors: [{ name: studio.name }],
  creator: studio.name,
  keywords: [
    "Studio VIP",
    "treinamento personalizado Poços de Caldas",
    "personal trainer Poços de Caldas",
    "treinamento funcional Poços de Caldas",
    "studio de treino Poços de Caldas",
    "acompanhamento nutricional",
  ],
  alternates: { canonical: studio.path },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: studio.url,
    siteName: studio.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#04375a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function StudioVipLayout({ children }: { children: React.ReactNode }) {
  return <div className={`vip ${barlowCondensed.variable} ${montserrat.variable}`}>{children}</div>;
}
