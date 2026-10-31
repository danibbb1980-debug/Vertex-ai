import { useRef } from 'react';
import { m, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { Reveal, TextReveal } from './Motion';

const ETAPAS = [
  { t: 'Contato e agendamento', d: 'Você chama pelo WhatsApp ou envia uma solicitação pelo site. A clínica confirma o dia e o horário disponíveis.' },
  { t: 'Avaliação e escuta', d: 'Na consulta, o dentista ouve suas queixas e expectativas e faz o exame clínico. Se necessário, pede exames complementares.' },
  { t: 'Plano explicado com clareza', d: 'Você recebe a explicação do que foi observado e das opções de tratamento, com as etapas de cada uma.' },
  { t: 'Acompanhamento', d: 'O tratamento segue as etapas combinadas, com retornos para acompanhar a evolução e orientar os cuidados em casa.' },
];

function Etapa({ i, t, d, progress }: { i: number; t: string; d: string; progress: MotionValue<number> }) {
  const limiar = (i + 0.35) / ETAPAS.length;
  const fill = useTransform(progress, [limiar - 0.08, limiar], [0, 1]);
  const inv = useTransform(fill, (v) => 1 - v);
  return (
    <li className="relative grid grid-cols-[56px_1fr] gap-5 pb-14 last:pb-0 sm:grid-cols-[72px_1fr] sm:gap-8">
      <div className="relative flex justify-center">
        <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-cream font-serif text-lg italic text-gold-deep sm:h-[72px] sm:w-[72px] sm:text-xl">
          <m.span aria-hidden="true" className="absolute inset-0 rounded-full bg-ink" style={{ scale: fill, opacity: fill }} />
          <m.span aria-hidden="true" className="relative text-gold-light" style={{ opacity: fill }}>
            0{i + 1}
          </m.span>
          <m.span className="absolute" style={{ opacity: inv }}>
            0{i + 1}
          </m.span>
        </span>
      </div>
      <Reveal className="pt-2 sm:pt-4">
        <h3 className="text-2xl font-normal sm:text-[1.9rem]">{t}</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-ink-muted">{d}</p>
      </Reveal>
    </li>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="bg-cream-ivory py-24 sm:py-32">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-36">
            <p className="eyebrow">Como funciona</p>
            <TextReveal id="como-titulo" className="h2 mt-5" parts={['Quatro passos, ', { em: 'sem pressa', }, '.']} />
            <p className="lead mt-6 max-w-md">
              O caminho é o mesmo para todos os atendimentos: entender o caso antes de propor qualquer tratamento.
            </p>
          </div>
        </div>
        <ol ref={ref} className="relative lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-7 left-[27px] top-7 w-px bg-cream-line sm:left-[35px]" />
          <m.span
            aria-hidden="true"
            className="absolute bottom-7 left-[27px] top-7 w-px origin-top bg-gold-deep sm:left-[35px]"
            style={{ scaleY: progress }}
          />
          {ETAPAS.map((e, i) => (
            <Etapa key={e.t} i={i} {...e} progress={progress} />
          ))}
        </ol>
      </div>
    </section>
  );
}
