import { CONFIG } from '../config';
import { Reveal, TextReveal } from './Motion';
import { CardIcon, Clock, Contactless, Door, Heart } from './Icons';

export function Structure() {
  const e = CONFIG.estrutura;
  const itens = [
    e.horaMarcada && { Icon: Clock, t: 'Hora marcada', d: 'O atendimento é recomendado com agendamento prévio, para que cada consulta tenha o tempo necessário.' },
    e.banheiro && { Icon: Door, t: 'Banheiro', d: 'O consultório conta com banheiro à disposição dos pacientes.' },
    e.pagamentos.length > 0 && {
      Icon: e.pagamentos.some((p) => /aproxima/i.test(p)) ? Contactless : CardIcon,
      t: 'Formas de pagamento',
      d: e.pagamentos.map((p, i) => (i ? p.charAt(0).toLowerCase() + p.slice(1) : p)).join(', ').replace(/, ([^,]*)$/, ' e $1') + '.',
    },
  ].filter(Boolean) as { Icon: typeof Clock; t: string; d: string }[];
  const fotos = CONFIG.fotosConsultorio;
  if (!itens.length && !CONFIG.mostrarAcolhimento && !fotos.length) return null;

  return (
    <section id="estrutura" aria-labelledby="estrutura-titulo" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="max-w-3xl">
          <p className="eyebrow">Acolhimento e estrutura</p>
          <TextReveal id="estrutura-titulo" className="h2 mt-5" parts={['Um consultório pensado para você se sentir ', { em: 'à vontade' }, '.']} />
        </div>

        {CONFIG.mostrarAcolhimento && (
          <Reveal className="mt-12">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/40 bg-cream-ivory p-8 sm:p-10">
              <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-gold-light via-gold to-gold-deep" />
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold-deep">
                  <Heart size={26} />
                </span>
                <div>
                  <h3 className="text-2xl font-normal">Um espaço que acolhe a comunidade LGBTQ+</h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-ink-muted">
                    Aqui, todas as pessoas são atendidas com respeito, privacidade e atenção. Pode chegar como você é.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {itens.length > 0 && (
          <ul className={`mt-5 grid gap-5 ${itens.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {itens.map(({ Icon, t, d }, i) => (
              <Reveal as="li" key={t} delay={i * 90} className="card p-8">
                <Icon size={28} className="text-gold-deep" />
                <h3 className="mt-5 text-xl">{t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{d}</p>
              </Reveal>
            ))}
          </ul>
        )}

        {fotos.length > 0 && (
          <div className="mt-16">
            <h3 className="sr-only">Fotos do consultório</h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              {fotos.map((f, i) => (
                <Reveal as="li" key={f.src} delay={i * 90} className="overflow-hidden rounded-[1.5rem] bg-cream-sand">
                  <img
                    src={f.src}
                    srcSet={f.srcSet}
                    sizes="(min-width: 1216px) 600px, (min-width: 640px) 50vw, 100vw"
                    width={f.width}
                    height={f.height}
                    alt={f.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/2] h-full w-full object-cover"
                  />
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
