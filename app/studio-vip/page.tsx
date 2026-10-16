import { ClientEnhancements } from "@/components/ui/ClientEnhancements";
import { Header } from "@/components/studio-vip/Header";
import { HeroSection } from "@/components/studio-vip/HeroSection";
import { SocialProof } from "@/components/studio-vip/SocialProof";
import { BenefitsSection } from "@/components/studio-vip/BenefitsSection";
import { TrainingSection } from "@/components/studio-vip/TrainingSection";
import { NutritionSection } from "@/components/studio-vip/NutritionSection";
import { TeamSection } from "@/components/studio-vip/TeamSection";
import { TestimonialsSection } from "@/components/studio-vip/TestimonialsSection";
import { ExperimentalClassCTA } from "@/components/studio-vip/ExperimentalClassCTA";
import { FAQSection } from "@/components/studio-vip/FAQSection";
import { LocationSection } from "@/components/studio-vip/LocationSection";
import { FinalCTA } from "@/components/studio-vip/FinalCTA";
import { Footer } from "@/components/studio-vip/Footer";
import { WhatsAppButton } from "@/components/studio-vip/WhatsAppButton";
import { site } from "@/lib/site";
import { studio } from "@/lib/studio-vip";
import { faq } from "@/lib/studio-vip-content";

/**
 * Dados estruturados locais — só o que foi confirmado: nome, endereço,
 * telefone e perfis. Sem horário, preço, coordenadas ou nota agregada
 * (avaliações próprias marcadas no site não são elegíveis no Google e a nota
 * já aparece no Perfil da Empresa).
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ExerciseGym",
      "@id": `${studio.url}${studio.standalone ? "/" : ""}#studio`,
      name: studio.fullName,
      alternateName: studio.name,
      url: studio.url,
      image: `${site.url}/studio-vip/opengraph-image`,
      telephone: `+${studio.phone.e164}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: studio.address.street,
        addressLocality: studio.address.city,
        addressRegion: studio.address.state,
        postalCode: studio.address.postalCode,
        addressCountry: studio.address.country,
      },
      hasMap: studio.links.maps,
      sameAs: [studio.links.instagram, studio.links.maps],
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

export default function StudioVipPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="conteudo">
        <HeroSection />
        <SocialProof />
        <BenefitsSection />
        <TrainingSection />
        <NutritionSection />
        <TeamSection />
        <TestimonialsSection />
        <ExperimentalClassCTA />
        <FAQSection />
        <LocationSection />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <ClientEnhancements />
    </>
  );
}
