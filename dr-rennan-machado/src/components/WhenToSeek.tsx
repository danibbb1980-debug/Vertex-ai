import { Reveal, TextReveal } from './Motion';
import { Arch, Calendar, Implant, ToothRoot } from './Icons';

const ITENS = [
  { Icon: Calendar, t: 'Check-up periódico', d: 'Consultas regulares ajudam a acompanhar a saúde bucal e a perceber mudanças cedo, mesmo sem nenhum incômodo.' },
  { Icon: ToothRoot, t: 'Sensibilidade ou dor', d: 'Sensibilidade ao frio ou ao doce, ou dor ao mastigar, são sinais para procurar uma avaliação e entender a causa.' },
  { Icon: Arch, t: 'Alinhamento dos dentes', d: 'Dentes tortos, apinhados ou uma mordida que não encaixa podem ser avaliados em qualquer idade.' },
  { Icon: Implant, t: 'Perda de um dente', d: 'Quando um dente é perdido, uma avaliação ajuda a conhecer as formas de reposição possíveis para o seu caso.' },
];

export function WhenToSeek() {
  return (
    <section aria-labelledby="quando-titulo" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="max-w-3xl">
          <p className="eyebrow">Quando procurar</p>
          <TextReveal id="quando-titulo" className="h2 mt-5" parts={['Alguns bons motivos para ', { em: 'marcar', }, ' uma consulta.']} />
          <p className="lead mt-6">Informações gerais, para ajudar a reconhecer o momento de procurar o dentista.</p>
        </div>
        <ul className="mt-14 grid gap-x-10 border-t border-cream-line sm:grid-cols-2">
          {ITENS.map(({ Icon, t, d }, i) => (
            <Reveal as="li" key={t} delay={(i % 2) * 90} className="flex gap-6 border-b border-cream-line py-9">
              <Icon size={30} className="mt-1 shrink-0 text-gold-deep" />
              <div>
                <h3 className="text-2xl font-normal">{t}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
