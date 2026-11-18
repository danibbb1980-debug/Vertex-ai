import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../config';
import { MonogramaContorno, PerfilRamo } from '../components/Marca';
import { BotaoWhats, Numero, Recolhivel, Sinal, useIds, useReducedMotion } from '../components/ui';

/* ── A avaliação ─────────────────────────────────────────── */
const PASSOS_AVALIACAO = [
  {
    abre: 'Primeiro,',
    titulo: 'a avaliação individual.',
    texto: 'Você conta o que procura. O rosto é observado como um todo, com tempo para perguntas.',
  },
  {
    abre: 'Depois,',
    titulo: 'o planejamento explicado.',
    texto: 'O que é indicado, o que não é e por quê. Nada é feito sem que você entenda e concorde.',
  },
  {
    abre: 'Por fim,',
    titulo: 'o acompanhamento.',
    texto: 'Retornos combinados para observar a evolução e ajustar o que for preciso.',
  },
];

export function Avaliacao() {
  return (
    <section id="avaliacao" aria-labelledby="avaliacao-titulo" className="grao relative overflow-hidden bg-ameixa text-nevoa">
      <MonogramaContorno className="pointer-events-none absolute -right-[30%] top-10 w-[110%] opacity-40 sm:-right-[12%] sm:w-[70%]" />
      <div className="relative mx-auto max-w-[1320px] px-4 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="rotulo text-ouro lg:col-span-3 lg:pt-4">A avaliação</p>
          <h2 id="avaliacao-titulo" className="display text-[clamp(38px,6vw,76px)] lg:col-span-9">
            Antes de qualquer procedimento, uma <em>conversa</em>.
          </h2>
        </div>
        <ol className="mt-16 lg:mt-24">
          {PASSOS_AVALIACAO.map((p, i) => (
            <li
              key={p.abre}
              className={`grid gap-3 border-t border-ouro/50 py-9 lg:grid-cols-12 lg:gap-8 lg:py-12 ${
                i === 1 ? 'lg:pl-[8%]' : i === 2 ? 'lg:pl-[16%]' : ''
              }`}
            >
              <p className="display text-[clamp(30px,4.4vw,58px)] lg:col-span-7">
                <span className="text-ouro">{p.abre}</span> {p.titulo}
              </p>
              <p className="max-w-[40ch] text-[17px] text-apoio-escuro lg:col-span-5 lg:self-end">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Atendimento: índice editorial numerado ─────────────── */
export function Atendimento() {
  const [aberto, setAberto] = useState<string | null>(CONFIG.atendimentos[0]?.id ?? null);
  const id = useIds('atd');
  if (!CONFIG.atendimentos.length) return null;
  return (
    <section id="atendimento" aria-labelledby="atendimento-titulo" className="mx-auto max-w-[1320px] px-4 py-24 sm:px-8 lg:py-36">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--faixa)+var(--header)+48px)]">
            <p className="rotulo text-ouro-texto">Atendimento</p>
            <h2 id="atendimento-titulo" className="display mt-5 text-[clamp(38px,5vw,64px)]">
              Harmonização facial, a partir da <em>avaliação</em>.
            </h2>
            <p className="mt-6 max-w-[34ch] text-apoio">
              A indicação de cada procedimento depende de avaliação individual por profissional habilitada.
            </p>
          </div>
        </div>
        <ol className="border-b border-linha lg:col-span-7 lg:col-start-6">
          {CONFIG.atendimentos.map((a, i) => {
            const on = aberto === a.id;
            return (
              <li key={a.id} className="border-t border-linha">
                <h3>
                  <button
                    type="button"
                    id={id(`b${i}`)}
                    aria-expanded={on}
                    aria-controls={id(`p${i}`)}
                    onClick={() => setAberto(on ? null : a.id)}
                    className="group flex w-full items-baseline gap-5 py-8 text-left sm:gap-8"
                  >
                    <Numero n={String(i + 1).padStart(2, '0')} className="w-[1.6em] shrink-0 text-[clamp(40px,6vw,80px)] leading-none" />
                    <span className="display flex-1 text-[clamp(30px,4.2vw,56px)] group-hover:text-ouro-texto">{a.nome}</span>
                    <span className="self-center text-ouro-texto">
                      <Sinal aberto={on} />
                    </span>
                  </button>
                </h3>
                <Recolhivel aberto={on} id={id(`p${i}`)} labelledBy={id(`b${i}`)}>
                  <div className="pb-10">
                    <div className="sm:ml-[calc(clamp(40px,6vw,80px)*1.6+2rem)]">
                      <p className="max-w-[52ch] text-[18px]">{a.descricao}</p>
                      <p className="mt-4 max-w-[52ch] text-[15px] text-apoio">
                        A indicação depende de avaliação individual por profissional habilitada.
                      </p>
                      <BotaoWhats msg={CONFIG.mensagens.atendimento(a.nome)} className="mt-7" rotulo={`Agendar avaliação sobre ${a.nome.toLowerCase()} pelo WhatsApp`}>
                        Agendar avaliação
                      </BotaoWhats>
                    </div>
                  </div>
                </Recolhivel>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ── A profissional ──────────────────────────────────────── */
export function Profissional() {
  const p = CONFIG.profissionais[0];
  if (!p) return null;
  const [foto, foto2] = p.fotos;
  const temEspecialidade = Boolean(p.especialidade && p.registroEspecialidade);
  return (
    <section id="profissional" aria-labelledby="profissional-titulo" className="relative overflow-hidden border-t border-ouro bg-nevoa-2/60">
      <div className="mx-auto grid max-w-[1320px] gap-14 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="relative lg:col-span-6 lg:pt-10">
          <p className="rotulo text-ouro-texto">A profissional</p>
          <h2 id="profissional-titulo" className="display mt-6 text-[clamp(52px,9vw,128px)] leading-[0.92]">
            Dra. Roberta
            <br />
            <em>Motta</em>
          </h2>
          <dl className="mt-12 max-w-md">
            <div className="flex items-baseline justify-between gap-6 border-t border-linha py-4">
              <dt className="rotulo text-apoio">Profissão</dt>
              <dd className="text-right text-[18px]">{p.profissao}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-6 border-t border-linha py-4">
              <dt className="rotulo text-apoio">Registro</dt>
              <dd className="num text-right text-[19px]">{p.registro}</dd>
            </div>
            {temEspecialidade && (
              <div className="flex items-baseline justify-between gap-6 border-t border-linha py-4">
                <dt className="rotulo text-apoio">Especialidade</dt>
                <dd className="text-right text-[18px]">
                  {p.especialidade} · {p.registroEspecialidade}
                </dd>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-6 border-y border-linha py-4">
              <dt className="rotulo text-apoio">Atende em</dt>
              <dd className="text-right text-[18px]">
                {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade}
              </dd>
            </div>
          </dl>
          {!foto && <PerfilRamo className="mt-12 h-56 w-auto opacity-80" />}
        </div>
        {foto && (
          <div className="relative lg:col-span-5 lg:col-start-8">
            <PerfilRamo className="pointer-events-none absolute -left-10 -top-12 z-10 h-40 w-auto sm:-left-16 sm:h-56" />
            <figure className="relative ml-8 sm:ml-16">
              <img
                src={foto.src960}
                srcSet={`${foto.src480} 480w, ${foto.src960} 960w`}
                sizes="(min-width: 1024px) 38vw, 85vw"
                width={foto.largura}
                height={foto.altura}
                alt={foto.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
              <span aria-hidden="true" className="absolute -bottom-3 -right-3 h-full w-full border border-ouro" style={{ zIndex: -1 }} />
            </figure>
            {foto2 && (
              <img
                src={foto2.src480}
                width={foto2.largura}
                height={foto2.altura}
                alt={foto2.alt}
                loading="lazy"
                decoding="async"
                className="relative -mt-24 hidden h-auto w-[44%] border-[6px] border-nevoa sm:block lg:-ml-24"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Como funciona: linha do tempo com progresso ────────── */
const ETAPAS = [
  { titulo: 'Contato e agendamento', texto: 'Pelo WhatsApp ou pelo formulário do site. A equipe confirma o dia e o horário.' },
  { titulo: 'Avaliação individual', texto: 'Conversa sobre o que você procura e observação do rosto como um todo.' },
  { titulo: 'Planejamento explicado', texto: 'As possibilidades indicadas, as etapas e os cuidados, com espaço para dúvidas.' },
  { titulo: 'Acompanhamento', texto: 'Retornos combinados com a profissional, conforme o planejamento.' },
];

export function ComoFunciona() {
  const listaRef = useRef<HTMLOListElement>(null);
  const [progresso, setProgresso] = useState(0);
  const reduzido = useReducedMotion();

  useEffect(() => {
    if (reduzido) {
      setProgresso(1);
      return;
    }
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = listaRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const meio = window.innerHeight * 0.55;
      setProgresso(Math.max(0, Math.min(1, (meio - r.top) / r.height)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, [reduzido]);

  return (
    <section id="como-funciona" aria-labelledby="como-titulo" className="mx-auto max-w-[1320px] px-4 py-24 sm:px-8 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="rotulo text-ouro-texto">Como funciona</p>
          <h2 id="como-titulo" className="display mt-5 text-[clamp(38px,5vw,64px)]">
            Quatro etapas, no seu <em>tempo</em>.
          </h2>
        </div>
        <ol ref={listaRef} className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute bottom-2 left-[11px] top-2 w-px bg-linha" />
          <span
            aria-hidden="true"
            className="absolute left-[11px] top-2 w-px origin-top bg-ouro"
            style={{ height: 'calc(100% - 16px)', transform: `scaleY(${progresso})` }}
          />
          {ETAPAS.map((e, i) => {
            const ativo = progresso >= i / ETAPAS.length;
            return (
              <li key={e.titulo} className="relative pb-14 pl-14 last:pb-0">
                <span
                  aria-hidden="true"
                  className={`absolute left-[5px] top-3 h-[13px] w-[13px] rotate-45 border transition-colors duration-500 ${
                    ativo ? 'border-ouro bg-ouro' : 'border-ouro/60 bg-nevoa'
                  }`}
                />
                <p className={`num text-[15px] transition-colors duration-500 ${ativo ? 'text-ouro-texto' : 'text-apoio'}`}>
                  Etapa {i + 1}
                </p>
                <h3 className="display mt-1 text-[clamp(28px,3.4vw,42px)]">{e.titulo}</h3>
                <p className="mt-3 max-w-[44ch] text-apoio">{e.texto}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ── Dúvidas frequentes ─────────────────────────────────── */
function perguntas() {
  const e = CONFIG.endereco;
  const nomes = CONFIG.atendimentos.map((a) => a.nome.toLowerCase());
  const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : nomes[0];
  return [
    {
      q: 'Como agendar uma avaliação?',
      a: `Pelo WhatsApp ${CONFIG.whatsappExibicao}, pelos botões deste site ou pelo formulário de solicitação. A equipe responde e confirma o dia e o horário disponíveis.`,
    },
    {
      q: 'Como é a primeira avaliação?',
      a: 'É uma conversa sobre o que você procura, com a observação do rosto como um todo. Ao final, a profissional explica o que pode ou não ser indicado no seu caso. Não há compromisso de fazer nenhum procedimento.',
    },
    {
      q: 'O que levar?',
      a: 'Um documento com foto. Se você usa algum medicamento ou já fez procedimentos no rosto, conte durante a consulta.',
    },
    {
      q: 'Quais atendimentos o consultório oferece?',
      a: `Hoje o consultório oferece ${lista}. Qualquer indicação é definida depois da avaliação.`,
    },
    {
      q: 'A harmonização facial serve para todas as pessoas?',
      a: 'Não. Cada procedimento depende de avaliação individual por profissional habilitada. Em alguns casos, a orientação é não fazer nenhum procedimento.',
    },
    {
      q: 'Quais são os horários?',
      a: `De segunda a sexta, das 13h às 18h. ${CONFIG.avisoHorarios}`,
    },
    {
      q: 'O consultório atende aos sábados e domingos?',
      a: 'Não. O atendimento é de segunda a sexta-feira.',
    },
    {
      q: 'Onde fica o consultório?',
      a: `${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}.`,
    },
    {
      q: 'Posso agendar pelo site?',
      a: 'Pelo site você envia uma solicitação: o formulário monta a mensagem e abre o WhatsApp. O horário só fica marcado depois que a equipe confirma a disponibilidade na conversa.',
    },
    {
      q: 'Preciso enviar fotos ou informações de saúde antes da consulta?',
      a: 'Não. Essas informações são conversadas com calma durante a avaliação, no consultório.',
    },
  ];
}

export function Duvidas() {
  const [aberto, setAberto] = useState<number | null>(null);
  const id = useIds('faq');
  const lista = perguntas();
  return (
    <section id="duvidas" aria-labelledby="duvidas-titulo" className="border-t border-ouro">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:py-36">
        <div className="lg:col-span-4">
          <p className="rotulo text-ouro-texto">Dúvidas frequentes</p>
          <h2 id="duvidas-titulo" className="display mt-5 text-[clamp(38px,5vw,64px)]">
            O que costumam <em>perguntar</em>.
          </h2>
        </div>
        <ul className="border-b border-linha lg:col-span-7 lg:col-start-6">
          {lista.map((item, i) => {
            const on = aberto === i;
            return (
              <li key={item.q} className="border-t border-linha">
                <h3>
                  <button
                    type="button"
                    id={id(`b${i}`)}
                    aria-expanded={on}
                    aria-controls={id(`p${i}`)}
                    onClick={() => setAberto(on ? null : i)}
                    className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-[19px] hover:text-ouro-texto"
                  >
                    <span>{item.q}</span>
                    <span className="text-ouro-texto">
                      <Sinal aberto={on} />
                    </span>
                  </button>
                </h3>
                <Recolhivel aberto={on} id={id(`p${i}`)} labelledBy={id(`b${i}`)}>
                  <p className="max-w-[60ch] pb-7 pr-10 text-apoio">{item.a}</p>
                </Recolhivel>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
