import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HomeHero } from "@/components/sections/HomeHero";
import {
  Clinic,
  Differentials,
  FirstSession,
  LocationSection,
  Manifesto,
  Technology,
  Testimonials,
  Treatments,
} from "@/components/sections/HomeSections";
import { StickyCta } from "@/components/ui/StickyCta";
import { localBusinessJsonLd } from "@/lib/structured-data";

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
        <Clinic />
        <LocationSection />
        <FirstSession />
      </main>
      <Footer />
      <StickyCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
    </>
  );
}
