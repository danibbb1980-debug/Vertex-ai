import { LazyMotion, MotionConfig } from "motion/react";

const features = () => import("./motion-features").then((r) => r.default);
import { CONFIG } from "./config";
import { Cursor, FloatingCTA, Header, ScrollProgress, SmoothScroll } from "./components/chrome";
import { Hero, Manifesto } from "./components/hero";
import { Areas } from "./components/areas";
import { Process } from "./components/process";
import { About, Articles, Contact, FAQ, FinalCTA, Footer } from "./components/sections";

export default function App() {
  return (
    <LazyMotion features={features} strict>
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ScrollProgress />
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className={CONFIG.modelo ? "pt-8" : ""}>
        <Hero />
        <Manifesto />
        <Areas />
        <Process />
        <About />
        <Articles />
        <FAQ />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingCTA />
      <Cursor />
    </MotionConfig>
    </LazyMotion>
  );
}
