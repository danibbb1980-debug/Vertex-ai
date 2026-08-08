import { Nav } from "@/components/ui/Nav";
import { StickyCta } from "@/components/ui/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Offer } from "@/components/sections/Offer";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Industries } from "@/components/sections/Industries";
import { Portfolio } from "@/components/sections/Portfolio";
import { WhyVertex } from "@/components/sections/WhyVertex";
import { Comparison } from "@/components/sections/Comparison";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { faq } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Structured data. The FAQPage block makes the objection answers eligible for
 * rich results, and the Service block states the price and terms in a form
 * search engines can read directly.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#organizacao`,
      name: site.name,
      url: site.url,
      description:
        "Criação de sites profissionais por assinatura mensal para clínicas, imobiliárias, restaurantes e negócios locais.",
      areaServed: { "@type": "Country", name: "Brasil" },
      sameAs: [site.social.tiktok],
    },
    {
      "@type": "Service",
      name: "Site profissional por assinatura",
      provider: { "@id": `${site.url}/#organizacao` },
      serviceType: "Criação e manutenção de sites",
      offers: {
        "@type": "Offer",
        price: site.price,
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: site.price,
          priceCurrency: "BRL",
          billingIncrement: 1,
          unitCode: "MON",
        },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="conteudo">
        <Hero />
        <div className="hairline mx-auto h-px max-w-6xl" aria-hidden="true" />
        <Problem />
        <Offer />
        <HowItWorks />
        <Industries />
        <Portfolio />
        <WhyVertex />
        <Comparison />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
