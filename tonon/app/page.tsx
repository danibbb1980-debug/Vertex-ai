import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { Positioning } from "@/components/sections/Positioning";
import { About } from "@/components/sections/About";
import { Cases } from "@/components/sections/Cases";
import { Approach } from "@/components/sections/Approach";
import { Visit } from "@/components/sections/Visit";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { ClientEnhancements } from "@/components/ui/ClientEnhancements";
import { faqJsonLd, localBusinessJsonLd } from "@/lib/structured-data";

const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(localBusinessJsonLd())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqJsonLd())} />
      <Header />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Hero />
        <Positioning />
        <About />
        <Cases />
        <Approach />
        <Visit />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ClientEnhancements />
    </>
  );
}
