import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HomeHero } from "@/components/sections/HomeHero";
import {
  Differentials,
  FirstSession,
  FranchiseTeaser,
  LocatorSection,
  Manifesto,
  Technology,
  Testimonials,
  Treatments,
} from "@/components/sections/HomeSections";
import { StickyCta } from "@/components/ui/StickyCta";
import { organizationJsonLd } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <Header over="light" />
      <main id="conteudo">
        <HomeHero />
        <Manifesto />
        <Technology />
        <Treatments />
        <Differentials />
        <Testimonials />
        <LocatorSection />
        <FirstSession />
        <FranchiseTeaser />
      </main>
      <Footer />
      <StickyCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
    </>
  );
}
