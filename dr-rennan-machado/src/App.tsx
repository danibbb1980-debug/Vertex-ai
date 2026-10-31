import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import { CONFIG } from './config';
import { DraftBanner, Header, type NavItem } from './components/Header';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Dentist } from './components/Dentist';
import { Services } from './components/Services';
import { WhenToSeek } from './components/WhenToSeek';
import { HowItWorks } from './components/HowItWorks';
import { Structure } from './components/Structure';
import { Faq } from './components/Faq';
import { Location } from './components/Location';
import { Booking } from './components/Booking';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GoldThread } from './components/GoldThread';

export default function App() {
  const s = CONFIG.secoes;
  const nav: NavItem[] = [
    s.dentista && { href: '#dentista', label: 'O dentista' },
    s.atendimentos && CONFIG.atendimentos.length > 0 && { href: '#atendimentos', label: 'Atendimentos' },
    s.comoFunciona && { href: '#como-funciona', label: 'Como funciona' },
    s.duvidas && { href: '#duvidas', label: 'Dúvidas' },
    s.contato && { href: '#contato', label: 'Contato' },
  ].filter(Boolean) as NavItem[];

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <DraftBanner />
        <Header nav={nav} />
        <main id="conteudo">
          <GoldThread>
            <Hero />
            {s.faixa && <Marquee />}
            {s.dentista && <Dentist />}
            {s.atendimentos && <Services />}
            {s.quandoProcurar && <WhenToSeek />}
            {s.comoFunciona && <HowItWorks />}
            {s.estrutura && <Structure />}
            {s.duvidas && <Faq />}
            {s.contato && <Location />}
            {s.agendar && <Booking />}
            {s.ctaFinal && <FinalCta />}
          </GoldThread>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </MotionConfig>
    </LazyMotion>
  );
}
