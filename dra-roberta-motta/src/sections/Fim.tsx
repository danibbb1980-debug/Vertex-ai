import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { CONFIG, DIAS, DIA_POR_INDICE, hora, waLink, type Dia } from '../config';
import { LogoCompleto, MonogramaContorno } from '../components/Marca';
import { BotaoWhats, IconeWhats } from '../components/ui';

/* ── Localização e contato ──────────────────────────────── */
function Mapa() {
  const ref = useRef<HTMLDivElement>(null);
  const [carregar, setCarregar] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCarregar(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative aspect-[4/3] w-full border border-linha bg-nevoa-2 lg:aspect-auto lg:h-full lg:min-h-[420px]">
      {carregar && (
        <iframe
          title={`Mapa: ${CONFIG.endereco.rua}, ${CONFIG.endereco.bairro}, ${CONFIG.endereco.cidade}`}
          src={CONFIG.endereco.mapaEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 grayscale-[0.4]"
        />
      )}
    </div>
  );
}

export function Local() {
  const e = CONFIG.endereco;
  const fotos = CONFIG.fotosConsultorio;
  return (
    <section id="local" aria-labelledby="local-titulo" className="border-t border-ouro">
      <div className="mx-auto max-w-[1320px] px-4 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="rotulo text-ouro-texto lg:col-span-3 lg:pt-4">Localização e contato</p>
          <h2 id="local-titulo" className="display text-[clamp(42px,7vw,96px)] lg:col-span-9">
            Venha nos <em>visitar</em>.
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <address className="not-italic">
              <p className="display text-[clamp(28px,3vw,38px)] leading-tight">{e.rua}</p>
              <p className="mt-2 text-[18px] text-apoio">
                {e.bairro}, {e.cidade} - {e.uf}
                <br />
                CEP <span className="num">{e.cep}</span>
              </p>
            </address>

            <h3 className="rotulo mt-12 text-apoio">Horários</h3>
            <table className="mt-4 w-full max-w-md border-collapse text-[17px]">
              <caption className="sr-only">Horário de atendimento por dia da semana</caption>
              <tbody>
                {DIAS.map((d) => {
                  const h = CONFIG.horarios[d.id];
                  return (
                    <tr key={d.id} className="border-t border-linha last:border-b">
                      <th scope="row" className="py-2.5 text-left font-normal">
                        {d.nome}
                      </th>
                      <td className={`num py-2.5 text-right ${h.length ? '' : 'text-apoio'}`}>
                        {h.length ? h.map(([a, b]) => `${hora(a)} às ${hora(b)}`).join(', ') : 'Fechado'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-3 text-[15px] text-apoio">{CONFIG.avisoHorarios}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BotaoWhats>
                <IconeWhats />
                Agendar pelo WhatsApp
              </BotaoWhats>
              <a href={e.rota} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
                Como chegar
              </a>
              {CONFIG.instagram && (
                <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-secundario">
                  Ver no Instagram
                </a>
              )}
            </div>
            <p className="mt-6 text-[15px] text-apoio">
              WhatsApp <span className="num">{CONFIG.whatsappExibicao}</span>
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Mapa />
          </div>
        </div>

        {fotos.length > 0 && (
          <figure className="mt-20 lg:mt-28">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-12 sm:gap-4">
              {fotos.map((f, i) => (
                <img
                  key={f.src480}
                  src={f.src960}
                  srcSet={`${f.src480} 480w, ${f.src960} 960w`}
                  sizes={i === 0 ? '(min-width: 640px) 45vw, 100vw' : '(min-width: 640px) 30vw, 50vw'}
                  width={f.largura}
                  height={f.altura}
                  alt={f.alt}
                  loading="lazy"
                  decoding="async"
                  className={
                    i === 0
                      ? 'col-span-2 h-auto w-full sm:col-span-6 sm:row-span-2'
                      : i === 1
                        ? 'h-full w-full object-cover sm:col-span-4 sm:col-start-8 sm:mt-24'
                        : 'h-full w-full object-cover sm:col-span-3 sm:col-start-8 sm:self-end'
                  }
                />
              ))}
            </div>
            <figcaption className="mt-4 text-[14px] text-apoio">O consultório, na {e.bairro}.</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

/* ── Solicitar agendamento (monta a mensagem e abre o WhatsApp) ── */
const hoje = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const lerData = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
};

/** Blocos de 1 hora a partir do horário do dia, sem incluir o horário de fechamento. */
function blocos(dia: Dia | null): string[] {
  const dias: Dia[] = dia ? [dia] : (Object.keys(CONFIG.horarios) as Dia[]);
  const set = new Set<string>();
  for (const d of dias)
    for (const [a, b] of CONFIG.horarios[d]) {
      const ini = Number(a.slice(0, 2));
      const fim = Number(b.slice(0, 2));
      for (let h = ini; h < fim; h++) set.add(`${String(h).padStart(2, '0')}:00`);
    }
  return [...set].sort();
}

type Erros = Partial<Record<'nome' | 'data', string>>;

export function Agendar() {
  const [nome, setNome] = useState('');
  const [atend, setAtend] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [obs, setObs] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [url, setUrl] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');
  const nomeRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);

  const opcoesAtendimento = useMemo(() => {
    const nomes = CONFIG.atendimentos.map((a) => a.nome);
    return ['Avaliação facial', ...nomes.filter((n) => n !== 'Avaliação facial'), 'Ainda não sei, quero conversar'];
  }, []);

  const min = iso(hoje());
  const validarData = (s: string): string | undefined => {
    if (!s) return;
    const d = lerData(s);
    if (!d) return 'Data inválida. Use o formato dia/mês/ano.';
    if (d < hoje()) return 'Escolha uma data a partir de hoje.';
    if (!CONFIG.horarios[DIA_POR_INDICE[d.getDay()]].length) return 'Dia sem atendimento, escolha outra data.';
  };
  const diaEscolhido = (() => {
    const d = lerData(data);
    return d && !validarData(data) ? DIA_POR_INDICE[d.getDay()] : null;
  })();
  const horarios = blocos(diaEscolhido);

  useEffect(() => {
    if (horario && !horarios.includes(horario)) setHorario('');
  }, [horario, horarios]);

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = 'Informe seu nome completo.';
    const ed = validarData(data);
    if (ed) e.data = ed;
    setErros(e);
    if (e.nome) {
      setAviso(e.nome);
      nomeRef.current?.focus();
      return;
    }
    if (e.data) {
      setAviso(e.data);
      dataRef.current?.focus();
      return;
    }
    const d = lerData(data);
    const dataBR = d ? d.toLocaleDateString('pt-BR') : 'a combinar';
    const msg = [
      'Olá! Vim pelo site da Dra. Roberta Motta e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atend || 'a definir'}`,
      `Data preferida: ${dataBR}`,
      `Horário preferido: ${horario || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n');
    const link = waLink(msg);
    setUrl(link);
    setAviso('');
    const w = window.open('', '_blank');
    if (w) {
      w.opener = null;
      w.location.href = link;
    }
  };

  const erroId = (k: keyof Erros) => (erros[k] ? `erro-${k}` : undefined);

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="bg-nevoa-2/60">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-5">
          <p className="rotulo text-ouro-texto">Praticidade</p>
          <h2 id="agendar-titulo" className="display mt-5 text-[clamp(38px,5vw,64px)]">
            Peça sua avaliação em poucos <em>cliques</em>.
          </h2>
          <p className="mt-6 max-w-[40ch] text-[18px] text-apoio">
            Escolha o atendimento, o dia e o horário de sua preferência. A solicitação chega pelo WhatsApp, e a equipe
            confirma a disponibilidade.
          </p>
        </div>

        <div className="relative border border-ouro bg-nevoa p-6 sm:p-10 lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute -top-px left-8 h-px w-24 bg-ameixa" />
          {url ? (
            <div role="status" className="py-4">
              <p className="display text-[34px] leading-tight">Pronto!</p>
              <p className="mt-4 max-w-[46ch]">
                Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A clínica confirma a disponibilidade.
              </p>
              <p className="mt-6 text-[15px] text-apoio">O WhatsApp não abriu?</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primario mt-3">
                <IconeWhats />
                Abrir WhatsApp
              </a>
              <button type="button" onClick={() => setUrl(null)} className="link-sublinhado ml-0 mt-6 block min-h-12 sm:inline sm:ml-6">
                Editar solicitação
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={enviar}>
              <p aria-live="assertive" className="sr-only">
                {aviso}
              </p>
              <div className="grid gap-6">
                <div>
                  <label htmlFor="f-nome" className="mb-2 block font-medium">
                    Nome completo <span className="text-apoio">(obrigatório)</span>
                  </label>
                  <input
                    ref={nomeRef}
                    id="f-nome"
                    name="nome"
                    autoComplete="name"
                    required
                    className="campo"
                    placeholder="Como devemos te chamar?"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    aria-invalid={Boolean(erros.nome)}
                    aria-describedby={erroId('nome')}
                  />
                  {erros.nome && (
                    <p id="erro-nome" className="mt-2 text-[15px] text-erro">
                      {erros.nome}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="f-atend" className="mb-2 block font-medium">
                    Atendimento desejado
                  </label>
                  <select id="f-atend" className="campo" value={atend} onChange={(e) => setAtend(e.target.value)}>
                    <option value="">Escolha um atendimento</option>
                    {opcoesAtendimento.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-data" className="mb-2 block font-medium">
                      Data preferida
                    </label>
                    <input
                      ref={dataRef}
                      id="f-data"
                      type="date"
                      min={min}
                      className="campo"
                      value={data}
                      onChange={(e) => {
                        setData(e.target.value);
                        setErros((x) => ({ ...x, data: validarData(e.target.value) }));
                      }}
                      aria-invalid={Boolean(erros.data)}
                      aria-describedby={['ajuda-data', erroId('data')].filter(Boolean).join(' ')}
                    />
                    <p id="ajuda-data" className="mt-2 text-[14px] text-apoio">
                      Segunda a sexta.
                    </p>
                    {erros.data && (
                      <p id="erro-data" role="alert" className="mt-1 text-[15px] text-erro">
                        {erros.data}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="f-hora" className="mb-2 block font-medium">
                      Horário preferido
                    </label>
                    <select id="f-hora" className="campo" value={horario} onChange={(e) => setHorario(e.target.value)}>
                      <option value="">Escolha um horário</option>
                      {horarios.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-[14px] text-apoio">Preferência, sujeita à confirmação.</p>
                  </div>
                </div>
                <div>
                  <label htmlFor="f-obs" className="mb-2 block font-medium">
                    Observações <span className="text-apoio">(opcional)</span>
                  </label>
                  <textarea
                    id="f-obs"
                    rows={3}
                    maxLength={300}
                    className="campo resize-y"
                    placeholder="Se quiser, conte o que você procura."
                    value={obs}
                    onChange={(e) => setObs(e.target.value)}
                    aria-describedby="ajuda-obs"
                  />
                  <p id="ajuda-obs" className="mt-2 flex justify-between gap-4 text-[14px] text-apoio">
                    <span>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.</span>
                    <span className="num shrink-0">{obs.length}/300</span>
                  </p>
                </div>
              </div>
              <button type="submit" className="btn btn-primario mt-8 w-full">
                <IconeWhats />
                Enviar solicitação pelo WhatsApp
              </button>
              <p className="mt-4 text-[14px] text-apoio">
                Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                <a href="/privacidade.html" className="link-sublinhado text-ameixa">
                  Privacidade
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── CTA final ──────────────────────────────────────────── */
export function CtaFinal() {
  return (
    <section aria-labelledby="cta-titulo" className="grao relative overflow-hidden bg-ameixa text-nevoa">
      <MonogramaContorno className="pointer-events-none absolute -left-[20%] -top-6 w-[95%] opacity-40 sm:-left-[8%] sm:w-[62%]" />
      <div className="relative mx-auto max-w-[1320px] px-4 py-28 sm:px-8 lg:py-40">
        <div className="lg:ml-[42%]">
          <h2 id="cta-titulo" className="display text-[clamp(44px,7vw,96px)]">
            A avaliação é o primeiro <em className="text-ouro">passo</em>.
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <BotaoWhats variante="claro" />
            {CONFIG.instagram && (
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-contorno-claro">
                Ver no Instagram
              </a>
            )}
          </div>
        </div>
      </div>
      <svg aria-hidden="true" viewBox="0 0 1000 60" preserveAspectRatio="none" className="relative block h-12 w-full">
        <path d="M0 0 C 25 0 40 59 100 59 L 1000 59" fill="none" stroke="var(--color-ouro)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}

/* ── Rodapé ─────────────────────────────────────────────── */
export function Rodape() {
  const p = CONFIG.profissionais[0];
  const e = CONFIG.endereco;
  const rt = CONFIG.responsavelTecnico;
  return (
    <footer className="bg-ameixa text-nevoa">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 pb-16 pt-6 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <LogoCompleto className="h-auto w-44" />
        </div>
        <div className="space-y-6 text-[15px] lg:col-span-8">
          <p className="text-[17px]">
            {p.nome} · {p.profissao} · {p.registro}
          </p>
          {rt.nome && rt.registro && (
            <p>
              Responsável técnico: {rt.nome} · {rt.registro}
            </p>
          )}
          <address className="not-italic text-apoio-escuro">
            {e.rua}, {e.bairro}, {e.cidade} - {e.uf}, CEP {e.cep}
            <br />
            WhatsApp{' '}
            <a className="link-sublinhado text-nevoa" href={waLink()} target="_blank" rel="noopener noreferrer">
              {CONFIG.whatsappExibicao}
            </a>
            {CONFIG.instagram && (
              <>
                {' · '}
                <a className="link-sublinhado text-nevoa" href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </>
            )}
            {' · '}
            <a className="link-sublinhado text-nevoa" href="/privacidade.html">
              Privacidade
            </a>
          </address>
          <p className="max-w-[70ch] border-t border-ouro/40 pt-6 text-[14px] text-apoio-escuro">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada procedimento depende de avaliação
            individual por profissional habilitada.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Atalhos de agendamento: barra no celular, botão flutuante no desktop ── */
export function AtalhosAgendamento() {
  const [mostrar, setMostrar] = useState(false);
  useEffect(() => {
    const f = () => setMostrar(window.scrollY > window.innerHeight * 0.8);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ouro/60 bg-ameixa p-3 lg:hidden">
        <BotaoWhats variante="claro" className="w-full">
          <IconeWhats />
          Agendar avaliação
        </BotaoWhats>
      </div>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agendar avaliação pelo WhatsApp"
        tabIndex={mostrar ? 0 : -1}
        aria-hidden={!mostrar}
        className={`fixed bottom-6 right-6 z-30 hidden h-14 items-center gap-2 border border-ouro bg-ameixa px-5 text-[14px] text-nevoa transition-[opacity,transform] duration-500 hover:text-ouro lg:flex ${
          mostrar ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <IconeWhats className="h-5 w-5" />
        WhatsApp
      </a>
    </>
  );
}
