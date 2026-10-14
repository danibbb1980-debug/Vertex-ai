import type { Metadata, Viewport } from "next";
import { ClientEnhancements } from "@/components/ui/ClientEnhancements";
import { Header } from "@/components/ailton/Header";
import { Hero } from "@/components/ailton/Hero";
import { SocialProof } from "@/components/ailton/SocialProof";
import { Benefits } from "@/components/ailton/Benefits";
import { Marquee } from "@/components/ailton/Marquee";
import { CoachingProcess } from "@/components/ailton/CoachingProcess";
import { Testimonials } from "@/components/ailton/Testimonials";
import { ConversionCta } from "@/components/ailton/ConversionCta";
import { Faq } from "@/components/ailton/Faq";
import { FinalCta } from "@/components/ailton/FinalCta";
import { Footer } from "@/components/ailton/Footer";
import { WhatsAppButton } from "@/components/ailton/WhatsAppButton";
import { ailton, faq } from "@/lib/ailton";
import { site } from "@/lib/site";

const title = "Ailton D’Avila | Personal Trainer em Poços de Caldas";
const description =
  "Conheça o acompanhamento do personal trainer Ailton D’Avila em Poços de Caldas, MG. Veja as avaliações e entre em contato pelo WhatsApp.";
const pageUrl = `${site.url}${ailton.path}`;

export const metadata: Metadata = {
  // absolute: não herda o template "| Vertex Web Studios" do layout raiz
  title: { absolute: title },
  description,
  applicationName: `${ailton.name} — ${ailton.role}`,
  keywords: [
    "personal trainer Poços de Caldas",
    "personal trainer",
    "Ailton D’Avila",
    "treino personalizado",
    "acompanhamento de treino",
    "musculação Poços de Caldas",
  ],
  authors: [{ name: ailton.name }],
  creator: ailton.name,
  alternates: { canonical: ailton.path },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: pageUrl,
    siteName: `${ailton.name} — ${ailton.role}`,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark",
};

/**
 * Dados estruturados apenas com o que é verificável: nome, telefone,
 * endereço e o perfil do Google Maps. A nota do Google fica de fora de
 * propósito — o Google não aceita marcação de avaliações "autodeclaradas"
 * de um negócio sobre si mesmo, e ela poderia gerar ação manual.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${pageUrl}#negocio`,
      name: `${ailton.name} — ${ailton.role}`,
      description,
      url: pageUrl,
      telephone: `+${ailton.phone.e164}`,
      image: `${pageUrl}/opengraph-image`,
      hasMap: ailton.google.mapsUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: ailton.address.street,
        addressLocality: ailton.address.city,
        addressRegion: ailton.address.state,
        postalCode: ailton.address.postalCode,
        addressCountry: "BR",
      },
      areaServed: { "@type": "City", name: ailton.address.city },
      founder: { "@type": "Person", name: ailton.name, jobTitle: ailton.role },
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function AiltonPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="conteudo">
        <Hero />
        <SocialProof />
        <Benefits />
        <Marquee />
        <CoachingProcess />
        <Testimonials />
        <ConversionCta />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppButton />
      <ClientEnhancements />
    </>
  );
}
