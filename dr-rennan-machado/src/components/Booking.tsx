import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { CONFIG } from '../config';
import { blocosHorario, brDate, diaDisponivel, isoDate, parseIso, resumoHorario } from '../lib/horarios';
import { waLink } from '../lib/whatsapp';
import { Reveal, TextReveal } from './Motion';
import { Check, WhatsApp } from './Icons';

const OBS_MAX = 300;
type Campo = 'nome' | 'atendimento' | 'data' | 'hora';
type Erros = Partial<Record<Campo, string>>;

const MSG_DIA_FECHADO = 'Dia sem atendimento, escolha outra data.';

function validarData(iso: string, hoje: Date, max: Date): string | undefined {
  if (!iso) return undefined;
  const d = parseIso(iso);
  if (Number.isNaN(d.getTime())) return 'Informe uma data válida.';
  const h0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  if (d < h0) return 'Escolha uma data a partir de hoje.';
  if (d > max) return `Escolha uma data nos próximos ${CONFIG.agendamento.diasAFrente} dias.`;
  if (!diaDisponivel(d)) return MSG_DIA_FECHADO;
  if (blocosHorario(d, hoje).length === 0) return 'Não há mais horários disponíveis nesse dia, escolha outra data.';
  return undefined;
}

export function Booking() {
  const opcoes = useMemo(
    () => [...CONFIG.atendimentos.map((a) => a.nome), 'Primeira avaliação', 'Ainda não sei, quero conversar'],
    [],
  );
  const [nome, setNome] = useState('');
  const [atendimento, setAtendimento] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [obs, setObs] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [status, setStatus] = useState<'idle' | 'abrindo' | 'enviado'>('idle');
  const [bloqueado, setBloqueado] = useState(false);
  const [url, setUrl] = useState('');
  const [aviso, setAviso] = useState('');
  const refs = {
    nome: useRef<HTMLInputElement>(null),
    atendimento: useRef<HTMLSelectElement>(null),
    data: useRef<HTMLInputElement>(null),
    hora: useRef<HTMLSelectElement>(null),
  };
  const sucessoRef = useRef<HTMLDivElement>(null);

  // datas calculadas no cliente (evita divergência entre build e navegador)
  const [hoje, setHoje] = useState<Date | null>(null);
  useEffect(() => setHoje(new Date()), []);
  const agora = hoje ?? new Date(2000, 0, 1);
  const max = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + CONFIG.agendamento.diasAFrente);
  const blocos = data && !validarData(data, agora, max) ? blocosHorario(parseIso(data), agora) : [];
  const resumo = resumoHorario();

  const validar = (): Erros => {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = 'Informe seu nome completo.';
    if (CONFIG.agendamento.exigirAtendimento && !atendimento) e.atendimento = 'Escolha o atendimento desejado.';
    const ed = validarData(data, agora, max);
    if (ed) e.data = ed;
    if (hora && !blocos.includes(hora)) e.hora = 'Escolha um horário da lista.';
    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const campos = Object.keys(e) as Campo[];
    if (campos.length) {
      setAviso(campos.length === 1 ? 'Há 1 campo para corrigir.' : `Há ${campos.length} campos para corrigir.`);
      refs[campos[0]].current?.focus();
      return;
    }
    const mensagem = [
      'Olá! Vim pelo site e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${atendimento || 'a definir'}`,
      `Data preferida: ${data ? brDate(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n');
    const link = waLink(mensagem);
    setUrl(link);
    // abre em nova aba sem dar acesso a esta janela (equivale a noopener) e detecta bloqueio de pop-up
    const w = window.open('', '_blank');
    if (w) {
      w.opener = null;
      w.location.href = link;
      setBloqueado(false);
    } else {
      setBloqueado(true);
    }
    setAviso('');
    setStatus('abrindo');
    window.setTimeout(() => {
      setStatus('enviado');
      requestAnimationFrame(() => sucessoRef.current?.focus());
    }, 650);
  };

  const onData = (v: string) => {
    setData(v);
    setHora('');
    setErros((e) => ({ ...e, data: validarData(v, agora, max) }));
  };

  const reiniciar = () => {
    setStatus('idle');
    setUrl('');
    requestAnimationFrame(() => refs.nome.current?.focus());
  };

  const campoCls = (erro?: string) =>
    `mt-2 block min-h-[52px] w-full rounded-2xl border bg-cream-ivory px-4 text-base text-ink transition-[border-color,box-shadow] placeholder:text-ink-muted/80 focus:outline-none focus:ring-4 focus:ring-gold/25 ${
      erro ? 'border-[#9B2C1F] focus:border-[#9B2C1F]' : 'border-ink/20 focus:border-gold-deep'
    }`;
  const Erro = ({ id, msg }: { id: string; msg?: string }) =>
    msg ? (
      <p id={id} className="mt-2 flex items-center gap-2 text-sm font-medium text-[#9B2C1F]">
        <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-[#9B2C1F]" />
        {msg}
      </p>
    ) : null;

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="relative overflow-hidden bg-cream-ivory py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-0 h-[520px] w-[520px] rounded-full border border-gold/25" />
      <div className="wrap relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">Praticidade</p>
          <TextReveal id="agendar-titulo" className="h2 mt-5" parts={['Peça seu horário em poucos ', { em: 'cliques' }, '.']} />
          <p className="lead mt-6">
            Escolha o atendimento, o dia e o horário de sua preferência. Sua solicitação chega à clínica pelo WhatsApp, e a
            equipe confirma a disponibilidade.
          </p>
          <ul className="mt-8 space-y-3 text-ink-soft">
            {[
              'Dia e horário são preferências, sujeitos à confirmação da clínica.',
              resumo && `Atendimento: ${resumo.charAt(0).toLowerCase() + resumo.slice(1)}.`,
              'Nenhum dado de saúde é pedido aqui.',
            ]
              .filter(Boolean)
              .map((t) => (
                <li key={t as string} className="flex gap-3">
                  <Check size={20} className="mt-0.5 shrink-0 text-gold-deep" />
                  <span>{t}</span>
                </li>
              ))}
          </ul>
        </div>

        <Reveal className="lg:col-span-7">
          {CONFIG.agendamento.urgencia && (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-ink bg-ink p-5 text-cream-ivory sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold">Está com dor ou urgência? Fale agora pelo WhatsApp.</p>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                <WhatsApp size={20} /> Falar agora
              </a>
            </div>
          )}
          <div className="relative rounded-[2rem] border border-cream-line bg-cream p-6 shadow-[0_40px_80px_-50px_rgba(30,25,19,.45)] sm:p-10">
            <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            {status === 'enviado' ? (
              <div ref={sucessoRef} tabIndex={-1} className="py-6 text-center focus:outline-none" role="status">
                <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-ink text-gold-light">
                  <Check size={28} />
                </span>
                <p className="mx-auto mt-6 max-w-md font-serif text-2xl leading-snug">
                  Pronto! Abrimos o WhatsApp com sua solicitação.
                </p>
                <p className="mx-auto mt-3 max-w-md text-ink-muted">
                  É só enviar a mensagem. A equipe confirma a disponibilidade.
                </p>
                {bloqueado && (
                  <p className="mx-auto mt-5 max-w-md text-sm font-medium text-ink-soft">
                    Parece que o navegador bloqueou a nova aba. Use o botão abaixo para abrir o WhatsApp.
                  </p>
                )}
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <WhatsApp size={20} /> Abrir WhatsApp
                  </a>
                  <button type="button" onClick={reiniciar} className="btn btn-ghost">
                    Fazer outra solicitação
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} aria-describedby="form-privacidade">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="f-nome" className="text-sm font-semibold text-ink">
                      Nome completo <span className="text-gold-deep">(obrigatório)</span>
                    </label>
                    <input
                      ref={refs.nome}
                      id="f-nome"
                      name="nome"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={80}
                      placeholder="Como devemos te chamar?"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      onBlur={() => erros.nome && setErros((x) => ({ ...x, nome: nome.trim().length < 2 ? x.nome : undefined }))}
                      aria-invalid={!!erros.nome}
                      aria-describedby={erros.nome ? 'e-nome' : undefined}
                      className={campoCls(erros.nome)}
                    />
                    <Erro id="e-nome" msg={erros.nome} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="f-atend" className="text-sm font-semibold text-ink">
                      Atendimento desejado{' '}
                      <span className="font-normal text-ink-muted">{CONFIG.agendamento.exigirAtendimento ? '(obrigatório)' : '(opcional)'}</span>
                    </label>
                    <select
                      ref={refs.atendimento}
                      id="f-atend"
                      name="atendimento"
                      value={atendimento}
                      onChange={(e) => {
                        setAtendimento(e.target.value);
                        setErros((x) => ({ ...x, atendimento: undefined }));
                      }}
                      aria-invalid={!!erros.atendimento}
                      aria-describedby={erros.atendimento ? 'e-atend' : undefined}
                      className={`${campoCls(erros.atendimento)} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%237E5C12' stroke-width='1.6'%3E%3Cpath d='m5 8 5 5 5-5'/%3E%3C/svg%3E")] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12`}
                    >
                      <option value="">Escolha um atendimento</option>
                      {opcoes.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <Erro id="e-atend" msg={erros.atendimento} />
                  </div>

                  <div>
                    <label htmlFor="f-data" className="text-sm font-semibold text-ink">
                      Data preferida <span className="font-normal text-ink-muted">(opcional)</span>
                    </label>
                    <input
                      ref={refs.data}
                      id="f-data"
                      name="data"
                      type="date"
                      min={hoje ? isoDate(hoje) : undefined}
                      max={hoje ? isoDate(max) : undefined}
                      value={data}
                      onChange={(e) => onData(e.target.value)}
                      aria-invalid={!!erros.data}
                      aria-describedby={`d-data${erros.data ? ' e-data' : ''}`}
                      className={campoCls(erros.data)}
                    />
                    <p id="d-data" className="mt-2 text-xs text-ink-muted">
                      {resumo ? `${resumo}.` : ''}
                    </p>
                    <Erro id="e-data" msg={erros.data} />
                  </div>

                  <div>
                    <label htmlFor="f-hora" className="text-sm font-semibold text-ink">
                      Horário preferido <span className="font-normal text-ink-muted">(opcional)</span>
                    </label>
                    <select
                      ref={refs.hora}
                      id="f-hora"
                      name="hora"
                      value={hora}
                      disabled={!blocos.length}
                      onChange={(e) => {
                        setHora(e.target.value);
                        setErros((x) => ({ ...x, hora: undefined }));
                      }}
                      aria-invalid={!!erros.hora}
                      aria-describedby={`d-hora${erros.hora ? ' e-hora' : ''}`}
                      className={`${campoCls(erros.hora)} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%237E5C12' stroke-width='1.6'%3E%3Cpath d='m5 8 5 5 5-5'/%3E%3C/svg%3E")] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-12 disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <option value="">Escolha um horário</option>
                      {blocos.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <p id="d-hora" className="mt-2 text-xs text-ink-muted">
                      {blocos.length ? 'Blocos de 1 hora, sujeitos à confirmação.' : 'Escolha uma data para ver os horários.'}
                    </p>
                    <Erro id="e-hora" msg={erros.hora} />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <label htmlFor="f-obs" className="text-sm font-semibold text-ink">
                        Observações <span className="font-normal text-ink-muted">(opcional)</span>
                      </label>
                      <span className="text-xs text-ink-muted" aria-hidden="true">
                        {obs.length}/{OBS_MAX}
                      </span>
                    </div>
                    <textarea
                      id="f-obs"
                      name="observacoes"
                      rows={3}
                      maxLength={OBS_MAX}
                      placeholder="Se quiser, conte o que você precisa."
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      aria-describedby="d-obs"
                      className={`${campoCls()} min-h-[110px] resize-y py-3`}
                    />
                    <p id="d-obs" className="mt-2 text-xs text-ink-muted">
                      Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp. Limite de {OBS_MAX} caracteres.
                    </p>
                  </div>
                </div>

                <p className="sr-only" aria-live="assertive">
                  {aviso}
                </p>

                <button type="submit" disabled={status === 'abrindo'} className="btn btn-primary mt-8 w-full text-base disabled:cursor-wait disabled:opacity-80">
                  {status === 'abrindo' ? (
                    <>
                      <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-gold-light" />
                      Abrindo o WhatsApp…
                    </>
                  ) : (
                    <>
                      <WhatsApp size={20} /> Enviar solicitação pelo WhatsApp
                    </>
                  )}
                </button>
                <p id="form-privacidade" className="mt-4 text-center text-xs leading-relaxed text-ink-muted">
                  Ao enviar, você abre uma conversa no WhatsApp com a clínica. Este site não guarda os dados digitados.{' '}
                  <a href="/privacidade.html" className="underline decoration-gold underline-offset-2 hover:text-ink">
                    Política de privacidade
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
