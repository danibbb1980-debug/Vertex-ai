import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import { DraftBanner, Header, ScrollProgress } from "./components/Chrome";
import { DeferredExtras } from "./components/DeferredExtras";
import { Hero } from "./sections/Hero";
import { Manifesto } from "./sections/Manifesto";
import { Areas } from "./sections/Areas";
import { Online } from "./sections/Online";
import { Process } from "./sections/Process";
import { Lawyer } from "./sections/Lawyer";
import { Guides } from "./sections/Guides";
import { Faq } from "./sections/Faq";
import { Contact } from "./sections/Contact";
import { Booking } from "./sections/Booking";
import { FinalCta } from "./sections/FinalCta";

export default function App() {
  let n = 0;
  const next = () => String(++n).padStart(2, "0");
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-12 focus:z-[90] focus:rounded focus:bg-ink focus:px-4 focus:py-3 focus:text-paper">
          Pular para o conteúdo
        </a>
        <DraftBanner />
        <ScrollProgress />
        <Header />
        <main id="conteudo">
          <Hero />
          <Manifesto />
          <Areas num={next()} />
          <Online num={next()} />
          <Process num={next()} />
          <Lawyer num={next()} />
          <Guides num={next()} />
          <Faq num={next()} />
          <Contact num={next()} />
          <Booking num={next()} />
        </main>
        <FinalCta />
        <DeferredExtras />
      </MotionConfig>
    </LazyMotion>
  );
}
