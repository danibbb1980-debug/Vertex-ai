import { Markers } from '../components/Markers';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CONFIG, atendimentosAtivos } from '../config';
import { diaDaSemana, hojeNoFuso, horariosDoDia } from '../lib';

type Erros = Partial<Record<'nome' | 'data' | 'hora', string>>;

const fmtData = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export function montarMensagem(v: { nome: string; atendimento: string; data: string; hora: string; obs: string }) {
  return [
    'Olá! Vim pelo site da Bianca Bassoto e gostaria de solicitar um agendamento.',
    `Nome: ${v.nome.trim()}`,
    `Atendimento: ${v.atendimento || 'a definir'}`,
    `Data preferida: ${v.data ? fmtData(v.data) : 'a combinar'}`,
    `Horário preferido: ${v.hora || 'a combinar'}`,
    `Observações: ${v.obs.trim() || '-'}`,
  ].join('\n');
}

export function Agendar({ num }: { num: string }) {
  const opcoes = useMemo(
    () => ['Consulta', ...atendimentosAtivos().map((a) => a.nome), 'Ainda não sei, quero conversar'],
    [],
  );
  const [nome, setNome] = useState('');
  const [atendimento, setAtendimento] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [obs, setObs] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [estado, setEstado] = useState<'idle' | 'abrindo' | 'ok'>('idle');
  const [url, setUrl] = useState('');
  const [bloqueado, setBloqueado] = useState(false);
  const [aviso, setAviso] = useState('');
  const nomeRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);
  const horaRef = useRef<HTMLSelectElement>(null);

  const [min, setMin] = useState<string>();
  useEffect(() => setMin(hojeNoFuso().iso), []);
  const diaCfg = data ? CONFIG.horarios.find((h) => h.dia === diaDaSemana(data)) : undefined;
  // sem data escolhida: mostra os blocos do dia útil mais longo
  const slots = data
    ? horariosDoDia(diaCfg)
    : horariosDoDia(CONFIG.horarios.find((h) => h.dia === 1));

  function validarData(v: string): string | undefined {
    if (!v) return;
    const hoje = hojeNoFuso().iso;
    if (v < hoje) return 'Escolha uma data a partir de hoje.';
    const d = CONFIG.horarios.find((h) => h.dia === diaDaSemana(v));
    if (!d?.abre) return 'Dia sem atendimento, escolha outra data.';
  }

  function onData(v: string) {
    setData(v);
    const e = validarData(v);
    setErros((x) => ({ ...x, data: e }));
    const d = v ? CONFIG.horarios.find((h) => h.dia === diaDaSemana(v)) : undefined;
    const novos = horariosDoDia(d);
    if (hora && v && !novos.includes(hora)) {
      setHora('');
      setAviso(`O horário ${hora} não está disponível nesse dia. Escolha outro.`);
    } else setAviso('');
  }

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = 'Escreva seu nome para a Bianca saber com quem está falando.';
    const de = validarData(data);
    if (de) e.data = de;
    if (hora && data && !slots.includes(hora)) e.hora = 'Escolha um horário dentro do atendimento desse dia.';
    setErros(e);
    if (e.nome) return nomeRef.current?.focus();
    if (e.data) return dataRef.current?.focus();
    if (e.hora) return horaRef.current?.focus();

    const msg = montarMensagem({ nome, atendimento, data, hora, obs });
    const link = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    setUrl(link);
    setEstado('abrindo');
    const w = window.open(link, '_blank');
    if (w) {
      try {
        w.opener = null;
      } catch {
        /* ignora */
      }
      setBloqueado(false);
    } else setBloqueado(true);
    setEstado('ok');
  }

  const desc = (campo: keyof Erros, extra?: string) =>
    [erros[campo] ? `err-${campo}` : '', extra || ''].filter(Boolean).join(' ') || undefined;

  return (
    <section className="sec agendar" id="agendar" aria-labelledby="agendar-h">
      <div className="wrap agendar__grid">
        <div className="agendar__intro">
          <p className="shead__meta">
            <span className="shead__num">{num}</span>
            <Markers />
            <span className="shead__label">Praticidade</span>
          </p>
          <h2 className="shead__title" id="agendar-h">
            <span className="mask">
              <span className="mask__in">Peça sua consulta</span>{' '}
            </span>
            <span className="mask">
              <span className="mask__in" style={{ ['--i' as string]: 1 }}>
                em poucos <em>cliques</em>.
              </span>
            </span>
          </h2>
          <p className="agendar__lead">
            Escolha o atendimento, o dia e o horário que você prefere. Sua solicitação chega pelo WhatsApp, e a
            confirmação da disponibilidade é feita pelo WhatsApp.
          </p>
        </div>

        <form className="card" onSubmit={enviar} noValidate aria-describedby="form-privacidade">
          <span className="card__ticks" aria-hidden="true" />
          <div className="field">
            <label htmlFor="f-nome">Nome completo</label>
            <input
              ref={nomeRef}
              id="f-nome"
              name="nome"
              autoComplete="name"
              placeholder="Como devemos te chamar?"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              aria-invalid={!!erros.nome}
              aria-describedby={desc('nome')}
              aria-required="true"
              required
              maxLength={80}
            />
            {erros.nome && (
              <p className="field__err" id="err-nome">
                {erros.nome}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="f-at">Atendimento desejado</label>
            <select id="f-at" name="atendimento" value={atendimento} onChange={(e) => setAtendimento(e.target.value)}>
              <option value="">Escolha um atendimento</option>
              {opcoes.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="f-data">Data preferida</label>
              <input
                ref={dataRef}
                id="f-data"
                type="date"
                name="data"
                min={min}
                value={data}
                onChange={(e) => onData(e.target.value)}
                aria-invalid={!!erros.data}
                aria-describedby={desc('data', 'hint-data')}
              />
              <p className="field__hint" id="hint-data">
                Atendimento de segunda a sábado.
              </p>
              {erros.data && (
                <p className="field__err" id="err-data">
                  {erros.data}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="f-hora">Horário preferido</label>
              <select
                ref={horaRef}
                id="f-hora"
                name="hora"
                value={hora}
                onChange={(e) => {
                  setHora(e.target.value);
                  setErros((x) => ({ ...x, hora: undefined }));
                }}
                aria-invalid={!!erros.hora}
                aria-describedby={desc('hora')}
                disabled={!!data && !!erros.data}
              >
                <option value="">Escolha um horário</option>
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {erros.hora && (
                <p className="field__err" id="err-hora">
                  {erros.hora}
                </p>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="f-obs">
              Observações <span className="field__opt">(opcional)</span>
            </label>
            <textarea
              id="f-obs"
              name="obs"
              rows={3}
              maxLength={300}
              placeholder="Se quiser, conte o que você procura."
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              aria-describedby="hint-obs count-obs"
            />
            <div className="field__foot">
              <p className="field__hint" id="hint-obs">
                Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp.
              </p>
              <span className="field__count" id="count-obs">
                {obs.length}/300
              </span>
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            {aviso}
          </p>
          {aviso && <p className="field__hint field__hint--warn">{aviso}</p>}

          <button className="btn btn--ink btn--block" type="submit" disabled={estado === 'abrindo'}>
            {estado === 'abrindo' ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}
          </button>

          <div className="card__status" aria-live="polite">
            {estado === 'ok' && (
              <div className="done">
                <p>
                  Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A confirmação da
                  disponibilidade é feita pelo WhatsApp.
                </p>
                <p>
                  {bloqueado ? 'O navegador bloqueou a nova aba. ' : 'Se o WhatsApp não abriu, '}
                  <a className="tlink" href={url} target="_blank" rel="noopener noreferrer">
                    Abrir WhatsApp
                  </a>
                </p>
              </div>
            )}
          </div>

          <p className="card__legal" id="form-privacidade">
            Ao enviar, você abre uma conversa no WhatsApp com a Bianca Bassoto. Este site não guarda os dados digitados.{' '}
            <a className="tlink" href="/privacidade.html">
              Privacidade
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
