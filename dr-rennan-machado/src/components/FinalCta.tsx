import { CONFIG } from '../config';
import { waLink } from '../lib/whatsapp';
import { Rings, TextReveal } from './Motion';
import { Instagram, WhatsApp } from './Icons';

export function FinalCta() {
  return (
    <section aria-labelledby="cta-titulo" className="on-dark relative overflow-hidden bg-ink py-28 text-cream-ivory sm:py-36">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <Rings strong className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] text-gold opacity-60" />
      <div className="wrap relative">
        <p className="eyebrow">Próximo passo</p>
        <TextReveal
          id="cta-titulo"
          className="mt-6 max-w-4xl text-[2.6rem] font-light leading-[1.04] text-cream-ivory sm:text-6xl lg:text-7xl"
          parts={['Sua avaliação é o ', { em: 'primeiro' }, ' passo.']}
        />
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-sand/85">
          Conte o que você precisa e combine o dia da consulta diretamente com a clínica.
        </p>
        <div className="mt-14 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
          <span data-thread="end" className="inline-flex">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold px-8 text-base">
              <WhatsApp size={20} /> Agendar pelo WhatsApp
            </a>
          </span>
          <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <Instagram size={20} /> Ver no Instagram
          </a>
          <a href="#agendar" className="inline-flex min-h-[48px] items-center text-sm font-semibold text-cream-sand underline decoration-gold underline-offset-[6px] hover:text-gold-light">
            Ou preencha a solicitação
          </a>
        </div>
      </div>
    </section>
  );
}
