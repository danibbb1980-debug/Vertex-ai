import { useState } from 'react';
import { CONFIG } from '../config';
import { useVisible } from '../lib/useInView';
import { Pause, Play } from './Icons';

/** Faixa discreta com rolagem lenta. Pausa fora da tela, no hover/foco e no botão. */
export function Marquee() {
  const [ref, visible] = useVisible<HTMLDivElement>();
  const [paused, setPaused] = useState(false);
  const itens = [...CONFIG.atendimentos.map((a) => a.nome), 'Hora marcada', 'Planejamento individual', `${CONFIG.cidade} - ${CONFIG.uf}`];
  if (!itens.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {itens.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-6 font-serif text-2xl font-light text-cream-ivory sm:text-3xl">
          {t}
          <span className="ml-12 inline-block h-2.5 w-2.5 rounded-full border border-gold-light" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Resumo dos atendimentos" className="on-dark relative bg-ink py-7">
      <div
        ref={ref}
        className={`group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] ${
          !visible || paused ? 'marquee-paused' : ''
        } hover:[&_.marquee-track]:[animation-play-state:paused]`}
      >
        <div className="marquee-track flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-cream-sand hover:text-gold-light"
        aria-label={paused ? 'Retomar movimento da faixa' : 'Pausar movimento da faixa'}
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </section>
  );
}
