import { faqFor } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";
import { dentistJsonLd, faqJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/ui/JsonLd";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { About } from "@/components/sections/About";
import { Implants } from "@/components/sections/Implants";
import { ClinicalCases } from "@/components/sections/ClinicalCases";
import { Prosthesis } from "@/components/sections/Prosthesis";
import { Treatments } from "@/components/sections/Treatments";
import { Differentials } from "@/components/sections/Differentials";
import { Experience } from "@/components/sections/Experience";
import { Reviews } from "@/components/sections/Reviews";
import { Steps } from "@/components/sections/Steps";
import { Faq } from "@/components/sections/Faq";
import { Location } from "@/components/sections/Location";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata = {
  ...pageMetadata({
    title: "Star Sorrindo | Implantes Dentários em Poços de Caldas",
    description:
      "Conheça a Star Sorrindo em Poços de Caldas, MG. Saiba mais sobre implantes dentários, próteses e cuidados odontológicos. Entre em contato para agendar uma avaliação.",
    path: "/",
  }),
  title: { absolute: "Star Sorrindo | Implantes Dentários em Poços de Caldas" },
};

export default function HomePage() {
  const faq = faqFor("home");
  return (
    <>
      <JsonLd data={dentistJsonLd()} />
      <JsonLd data={faqJsonLd(faq)} />
      <Hero />
      <TrustBar />
      <About />
      <Implants />
      <ClinicalCases />
      <Prosthesis />
      <Treatments />
      <Differentials />
      <Experience />
      <Reviews />
      <Steps />
      <Faq items={faq} />
      <Location />
      <FinalCta />
    </>
  );
}
