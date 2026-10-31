import { useId, useState, type ReactNode } from 'react';
import { CONFIG } from '../config';
import { linhasHorario } from '../lib/horarios';
import { Reveal, TextReveal } from './Motion';
import { Plus } from './Icons';

function lista(xs: string[]) {
  return xs.length > 1 ? `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}` : xs[0] ?? '';
}

function perguntas(): { q: string; a: ReactNode }[] {
  const e = CONFIG.endereco;
  const horas = linhasHorario();
  const atend = CONFIG.atendimentos.map((a) => a.nome.toLowerCase());
  const out: ({ q: string; a: ReactNode } | false)[] = [
    CONFIG.estrutura.horaMarcada && {
      q: 'Preciso agendar antes de ir?',
      a: 'Sim, é recomendado marcar hora. Assim a consulta acontece com o tempo necessário e sem espera. O agendamento pode ser feito pelo WhatsApp ou pelo formulário do site.',
    },
    {
      q: 'Como é a primeira avaliação?',
      a: 'É uma conversa seguida de exame clínico. O dentista ouve o que você sente e o que espera, examina dentes e gengiva e explica o que observou. Se necessário, pode pedir exames complementares antes de indicar um tratamento.',
    },
    atend.length > 0 && {
      q: 'Quais atendimentos são realizados?',
      a: `O consultório atende ${lista(atend)}. Em todos os casos, a indicação depende de avaliação individual.`,
    },
    horas.length > 0 && {
      q: 'Quais são os horários de atendimento?',
      a: (
        <>
          {horas.map((h) => (
            <span key={h.dias} className="block">
              {h.dias}: {h.texto}.
            </span>
          ))}
          <span className="block">{CONFIG.avisoFeriados}</span>
        </>
      ),
    },
    {
      q: 'Onde fica o consultório?',
      a: `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}. Na seção de contato há o mapa e o link para traçar a rota.`,
    },
    CONFIG.estrutura.pagamentos.length > 0 && {
      q: 'Quais formas de pagamento são aceitas?',
      a: `${lista(CONFIG.estrutura.pagamentos.map((p, i) => (i ? p.charAt(0).toLowerCase() + p.slice(1) : p)))}. Para outras dúvidas sobre pagamento, fale pelo WhatsApp.`,
    },
    {
      q: 'O que levar na primeira consulta?',
      a: 'De forma geral: um documento com foto, exames ou radiografias anteriores, se você tiver, e a lista dos medicamentos que usa. Se tiver alguma condição de saúde, conte ao dentista durante a consulta.',
    },
    {
      q: 'Como sei qual tratamento é indicado para mim?',
      a: 'Só uma avaliação individual permite indicar um tratamento. Cada caso é diferente, por isso o plano é explicado depois do exame, com as opções e as etapas de cada uma.',
    },
    CONFIG.mostrarAcolhimento && {
      q: 'O consultório acolhe a comunidade LGBTQ+?',
      a: 'Sim. Todas as pessoas são atendidas com respeito e privacidade, e você pode informar o nome pelo qual prefere ser chamado.',
    },
    {
      q: 'Enviar o formulário já confirma meu horário?',
      a: 'Não. O formulário apenas abre uma conversa no WhatsApp com a sua solicitação. O dia e o horário são combinados com a clínica, que confirma a disponibilidade.',
    },
  ];
  return out.filter(Boolean) as { q: string; a: ReactNode }[];
}

/** Acordeão acessível (botões com aria-expanded/aria-controls). Abre com fade + leve deslocamento. */
export function Faq() {
  const itens = perguntas();
  const [aberto, setAberto] = useState<number | null>(0);
  const base = useId().replace(/:/g, '');
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="bg-cream-sand/60 py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-36">
            <p className="eyebrow">Dúvidas frequentes</p>
            <TextReveal id="duvidas-titulo" className="h2 mt-5" parts={['Perguntas que ', { em: 'sempre', }, ' chegam.']} />
            <p className="lead mt-6">Respostas gerais. Para o seu caso, a conversa continua na consulta.</p>
          </div>
        </div>
        <Reveal className="lg:col-span-8">
          <ul className="border-t border-ink/15">
            {itens.map((it, i) => {
              const open = aberto === i;
              const bid = `${base}-b${i}`;
              const pid = `${base}-p${i}`;
              return (
                <li key={it.q} className="border-b border-ink/15">
                  <h3 className="font-sans text-base tracking-normal">
                    <button
                      id={bid}
                      type="button"
                      aria-expanded={open}
                      aria-controls={pid}
                      onClick={() => setAberto(open ? null : i)}
                      className="group flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className={`font-serif text-xl leading-snug transition-colors sm:text-[1.4rem] ${open ? 'text-gold-deep' : 'text-ink group-hover:text-gold-deep'}`}>
                        {it.q}
                      </span>
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ${
                          open ? 'rotate-45 border-ink bg-ink text-gold-light' : 'border-ink/20 text-ink'
                        }`}
                        aria-hidden="true"
                      >
                        <Plus size={18} />
                      </span>
                    </button>
                  </h3>
                  <div id={pid} role="region" aria-labelledby={bid} hidden={!open}>
                    <div className="faq-body max-w-2xl pb-7 pr-14 leading-relaxed text-ink-muted">{it.a}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
