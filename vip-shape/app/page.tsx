import { Header } from "@/components/layout/Header";
import { DraftBanner } from "@/components/layout/DraftBanner";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { IdentityStrip } from "@/components/sections/IdentityStrip";
import { Differentials } from "@/components/sections/Differentials";
import { Structure } from "@/components/sections/Structure";
import { Classes } from "@/components/sections/Classes";
import { Reviews } from "@/components/sections/Reviews";
import { Partnerships } from "@/components/sections/Partnerships";
import { FinalCta } from "@/components/sections/FinalCta";
import { Location } from "@/components/sections/Location";
import { Faq } from "@/components/sections/Faq";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { ClientEnhancements } from "@/components/ui/ClientEnhancements";
import { localBusinessJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()).replace(/</g, "\\u003c") }}
      />
      <DraftBanner />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <IdentityStrip />
        <Differentials />
        <Structure />
        <Classes />
        <Reviews />
        <Partnerships />
        <FinalCta />
        <Location />
        <Faq />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ClientEnhancements />
    </>
  );
}
