import { HeroSection } from "@/components/hero/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Intro } from "@/components/sections/Intro";
import { Journey } from "@/components/sections/Journey";
import { Results } from "@/components/sections/Results";
import { Treatments } from "@/components/sections/Treatments";
import { ClientEnhancements } from "@/components/ui/ClientEnhancements";
import { dentistJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistJsonLd()).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="conteudo">
        <HeroSection />
        <Intro />
        <Treatments />
        <Results />
        <Journey />
        <Contact />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileCtaBar />
      <ClientEnhancements />
    </>
  );
}
