import { useEffect, useId, useState, type FormEvent } from 'react';
import { CONFIG, servicosAtivos } from './config';
import { horariosDoDia, dataHojeISO, waUrl } from './lib';

type Erros = Partial<Record<'nome' | 'veiculo' | 'data', string>>;
const A_DEFINIR = 'Ainda não sei, quero conversar';

const diaDaSemana = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
};
const fechado = (iso: string) => {
  const idx = diaDaSemana(iso);
  const d = CONFIG.horarios.find((h) => h.idx === idx);
  return !d?.abre;
};
const br = (iso: string) => iso.split('-').reverse().join('/');

export function Agendar() {
  const uid = useId();
  const [min, setMin] = useState<string | undefined>(undefined);
  const [nome, setNome] = useState('');
  const [servico, setServico] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [obs, setObs] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => setMin(dataHojeISO()), []);

  if (!CONFIG.secoes.agendar || !CONFIG.usarWhatsapp || !CONFIG.whatsapp) return null;

  const opcoesHora = data && !fechado(data) ? horariosDoDia(diaDaSemana(data)) : [];

  const validar = (): Erros => {
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = 'Escreva o seu nome para sabermos com quem falar.';
    if (veiculo.trim().length < 2) e.veiculo = 'Conte qual é o veículo: marca, modelo e ano.';
    if (data) {
      if (min && data < min) e.data = 'Escolha uma data a partir de hoje.';
      else if (fechado(data)) e.data = 'Dia sem atendimento, escolha outra data.';
    }
    return e;
  };

  const onData = (v: string) => {
    setData(v);
    setHora('');
    setErros((e) => ({ ...e, data: v && fechado(v) ? 'Dia sem atendimento, escolha outra data.' : undefined }));
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    const primeiro = (['nome', 'veiculo', 'data'] as const).find((k) => e[k]);
    if (primeiro) {
      document.getElementById(`${uid}-${primeiro}`)?.focus();
      return;
    }
    setEnviando(true);
    const msg = [
      'Olá! Vim pelo site da The Details Estética Automotiva e gostaria de pedir um horário.',
      `Nome: ${nome.trim()}`,
      `Serviço: ${servico && servico !== A_DEFINIR ? servico : 'a definir'}`,
      `Veículo: ${veiculo.trim()}`,
      `Data preferida: ${data ? br(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n');
    const url = waUrl(msg);
    window.open(url, '_blank', 'noopener');
    setEnviado(url);
    setEnviando(false);
  };

  const field = (k: keyof Erros) => ({
    id: `${uid}-${k}`,
    'aria-invalid': erros[k] ? true : undefined,
    'aria-describedby': erros[k] ? `${uid}-${k}-err` : undefined,
  });
  const Err = ({ k }: { k: keyof Erros }) =>
    erros[k] ? (
      <p className="field__err" id={`${uid}-${k}-err`}>
        {erros[k]}
      </p>
    ) : null;

  return (
    <section className="sec agendar" id="agendar" aria-labelledby="agendar-t">
      <div className="wrap agendar__grid">
        <div className="agendar__intro">
          <p className="shead__num" data-ring>
            <span className="ring" aria-hidden="true" />
            <span className="shead__n">08</span>
            <span className="shead__label">Pedir horário</span>
          </p>
          <h2 className="shead__title" id="agendar-t">
            <span className="mask" data-reveal>
              <span>Peça seu horário em poucos passos.</span>
            </span>
          </h2>
          <p className="agendar__lead">
            Escolha o atendimento, o dia e o horário que preferir. Sua solicitação chega pelo WhatsApp, e a
            confirmação da disponibilidade é feita por lá.
          </p>
        </div>

        <div className="formcard">
          {enviado ? (
            <div className="formcard__done" role="status">
              <p className="formcard__done-t">Pronto! Abrimos o WhatsApp com sua solicitação.</p>
              <p>É só enviar a mensagem. A confirmação da disponibilidade é feita pelo WhatsApp.</p>
              <p>
                Se a conversa não abriu,{' '}
                <a className="ulink" href={enviado} target="_blank" rel="noopener noreferrer">
                  Abrir WhatsApp
                </a>
                .
              </p>
              <button type="button" className="btn btn--line" onClick={() => setEnviado(null)}>
                <span>Editar a solicitação</span>
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} aria-describedby={`${uid}-priv`}>
              <div className="field">
                <label htmlFor={`${uid}-nome`}>Nome completo</label>
                <input
                  {...field('nome')}
                  name="nome"
                  autoComplete="name"
                  required
                  placeholder="Como devemos te chamar?"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (erros.nome) setErros((x) => ({ ...x, nome: undefined }));
                  }}
                />
                <Err k="nome" />
              </div>

              <div className="field">
                <label htmlFor={`${uid}-servico`}>Atendimento desejado</label>
                <select id={`${uid}-servico`} name="servico" value={servico} onChange={(e) => setServico(e.target.value)}>
                  <option value="">Escolha um atendimento</option>
                  {servicosAtivos().map((s) => (
                    <option key={s.id} value={s.nome}>
                      {s.nome}
                    </option>
                  ))}
                  <option value={A_DEFINIR}>{A_DEFINIR}</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor={`${uid}-veiculo`}>Veículo</label>
                <input
                  {...field('veiculo')}
                  name="veiculo"
                  required
                  maxLength={80}
                  placeholder="Marca, modelo e ano, por exemplo: Onix 2020"
                  value={veiculo}
                  onChange={(e) => {
                    setVeiculo(e.target.value);
                    if (erros.veiculo) setErros((x) => ({ ...x, veiculo: undefined }));
                  }}
                />
                <Err k="veiculo" />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor={`${uid}-data`}>
                    Data preferida <span className="field__opt">(opcional)</span>
                  </label>
                  <input
                    {...field('data')}
                    type="date"
                    name="data"
                    min={min}
                    value={data}
                    onChange={(e) => onData(e.target.value)}
                  />
                  <Err k="data" />
                </div>
                <div className="field">
                  <label htmlFor={`${uid}-hora`}>
                    Horário preferido <span className="field__opt">(opcional)</span>
                  </label>
                  <select
                    id={`${uid}-hora`}
                    name="hora"
                    value={hora}
                    disabled={opcoesHora.length === 0}
                    aria-describedby={`${uid}-hora-hint`}
                    onChange={(e) => setHora(e.target.value)}
                  >
                    <option value="">Escolha um horário</option>
                    {opcoesHora.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <p className="field__hint" id={`${uid}-hora-hint`}>
                    {opcoesHora.length ? 'Horários de início disponíveis para esse dia.' : 'Escolha uma data para ver os horários.'}
                  </p>
                </div>
              </div>

              <div className="field">
                <label htmlFor={`${uid}-obs`}>
                  Observações <span className="field__opt">(opcional)</span>
                </label>
                <textarea
                  id={`${uid}-obs`}
                  name="obs"
                  rows={3}
                  maxLength={300}
                  placeholder="Se quiser, conte o que o seu veículo precisa."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  aria-describedby={`${uid}-obs-count`}
                />
                <p className="field__hint" id={`${uid}-obs-count`}>
                  {obs.length} de 300 caracteres
                </p>
              </div>

              <div className="sr-only" aria-live="polite">
                {Object.values(erros).filter(Boolean).length
                  ? `Confira ${Object.values(erros).filter(Boolean).length === 1 ? 'o campo destacado' : 'os campos destacados'}.`
                  : ''}
              </div>

              <button type="submit" className="btn btn--solid formcard__submit" disabled={enviando} aria-busy={enviando}>
                <span>{enviando ? 'Abrindo o WhatsApp…' : 'Enviar solicitação pelo WhatsApp'}</span>
              </button>
              <p className="formcard__priv" id={`${uid}-priv`}>
                Ao enviar, você abre uma conversa no WhatsApp com a The Details Estética Automotiva. Este site não guarda os
                dados digitados. <a className="ulink" href="/privacidade.html">Privacidade</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
