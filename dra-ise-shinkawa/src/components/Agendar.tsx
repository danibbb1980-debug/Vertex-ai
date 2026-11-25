import { useEffect, useId, useState, type FormEvent } from 'react';
import { CONFIG, atendimentosAtivos, waLink } from '../config';
import { Rotulo, Titulo } from './Comuns';

const NAO_SEI = 'Ainda não sei, quero conversar';

function hojeSP(): string {
  // AAAA-MM-DD no fuso de São Paulo
  return new Intl.DateTimeFormat('en-CA', { timeZone: CONFIG.fuso, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
function diaSemana(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}
export function horariosDoDia(iso: string): string[] {
  if (!iso) return [];
  const h = CONFIG.horarios[diaSemana(iso)];
  if (!h) return [];
  const [ha] = h.abre.split(':').map(Number);
  const [hf] = h.fecha.split(':').map(Number);
  const out: string[] = [];
  for (let x = ha; x <= hf - 1; x++) out.push(`${String(x).padStart(2, '0')}:00`);
  return out;
}
const br = (iso: string) => iso.split('-').reverse().join('/');

type Erros = Partial<Record<'nome' | 'data' | 'hora', string>>;

export function Agendar() {
  const uid = useId();
  const opcoes = Array.from(new Set(['Avaliação', ...atendimentosAtivos().map((a) => a.nome), NAO_SEI]));
  const [min, setMin] = useState<string | undefined>(undefined);
  const [nome, setNome] = useState('');
  const [at, setAt] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [obs, setObs] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState<string | null>(null);

  useEffect(() => setMin(hojeSP()), []);

  const horas = horariosDoDia(data);

  const validarData = (v: string): string | undefined => {
    if (!v) return undefined;
    if (min && v < min) return 'Escolha uma data a partir de hoje.';
    if (!CONFIG.horarios[diaSemana(v)]) return 'Dia sem atendimento, escolha outra data.';
    return undefined;
  };

  const onData = (v: string) => {
    setData(v);
    setHora('');
    setErros((e) => ({ ...e, data: validarData(v) }));
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Erros = {};
    if (nome.trim().length < 2) e.nome = 'Escreva seu nome para a Dra. Ise saber com quem vai falar.';
    const ed = validarData(data);
    if (ed) e.data = ed;
    if (hora && !horas.includes(hora)) e.hora = 'Escolha um horário da lista.';
    setErros(e);
    if (Object.keys(e).length) {
      const primeiro = document.getElementById(`${uid}-${Object.keys(e)[0]}`);
      primeiro?.focus();
      return;
    }
    const msg = [
      'Olá! Vim pelo site da Dra. Ise Shinkawa e gostaria de solicitar um agendamento.',
      `Nome: ${nome.trim()}`,
      `Atendimento: ${at && at !== NAO_SEI ? at : 'a definir'}`,
      `Data preferida: ${data ? br(data) : 'a combinar'}`,
      `Horário preferido: ${hora || 'a combinar'}`,
      `Observações: ${obs.trim() || '-'}`,
    ].join('\n');
    const url = waLink(msg);
    window.open(url, '_blank', 'noopener,noreferrer');
    setEnviado(url);
  };

  const err = (k: keyof Erros) => erros[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${uid}-${k}-e` } : {};

  return (
    <section id="agendar" className="secao abaixo revela" aria-labelledby="agendar-t">
      <div className="wrap grade">
        <div className="ag-a">
          <Rotulo>Praticidade</Rotulo>
          <Titulo id="agendar-t" linhas={['Peça sua avaliação', 'em poucos cliques.']} />
          <p className="lead apoio" style={{ marginTop: 'var(--e-4)' }}>
            Escolha o atendimento e o dia e horário que preferir. Sua solicitação chega pelo WhatsApp, e a confirmação da disponibilidade é feita por lá.
          </p>
        </div>
        <div className="ag-b">
          <form className="cartao" onSubmit={enviar} noValidate aria-describedby={`${uid}-priv`}>
            <div className="campo">
              <label htmlFor={`${uid}-nome`}>Nome completo</label>
              <input id={`${uid}-nome`} name="nome" autoComplete="name" placeholder="Como devemos te chamar?" value={nome}
                onChange={(e) => { setNome(e.target.value); if (erros.nome) setErros((x) => ({ ...x, nome: undefined })); }} required {...err('nome')} />
              {erros.nome && <span className="erro" id={`${uid}-nome-e`}>{erros.nome}</span>}
            </div>
            <div className="campo">
              <label htmlFor={`${uid}-at`}>Atendimento desejado <span className="opc">(opcional)</span></label>
              <select id={`${uid}-at`} name="atendimento" value={at} onChange={(e) => setAt(e.target.value)}>
                <option value="">Escolha um atendimento</option>
                {opcoes.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="dupla">
              <div className="campo">
                <label htmlFor={`${uid}-data`}>Data preferida <span className="opc">(opcional)</span></label>
                <input id={`${uid}-data`} type="date" name="data" min={min} value={data} onChange={(e) => onData(e.target.value)} {...err('data')} />
                {erros.data
                  ? <span className="erro" id={`${uid}-data-e`}>{erros.data}</span>
                  : <span className="ajuda">Segunda a sexta.</span>}
              </div>
              <div className="campo">
                <label htmlFor={`${uid}-hora`}>Horário preferido <span className="opc">(opcional)</span></label>
                <select id={`${uid}-hora`} name="hora" value={hora} onChange={(e) => setHora(e.target.value)} disabled={!!data && horas.length === 0} {...err('hora')}>
                  <option value="">Escolha um horário</option>
                  {(data ? horas : horariosDoDia('2026-01-05')).map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                {erros.hora && <span className="erro" id={`${uid}-hora-e`}>{erros.hora}</span>}
              </div>
            </div>
            <div className="campo">
              <label htmlFor={`${uid}-obs`}>Observações <span className="opc">(opcional)</span></label>
              <textarea id={`${uid}-obs`} name="obs" maxLength={300} placeholder="Se quiser, conte o que você procura." value={obs}
                onChange={(e) => setObs(e.target.value)} aria-describedby={`${uid}-obs-a`} />
              <span className="ajuda" id={`${uid}-obs-a`}>Não é preciso informar dados de saúde aqui. Conversamos com calma pelo WhatsApp. {obs.length}/300</span>
            </div>
            <button type="submit" className="btn btn-cheio" style={{ width: '100%' }}>
              Enviar solicitação pelo WhatsApp<span className="ponto" aria-hidden="true" />
            </button>
            <div aria-live="polite" role="status">
              {Object.values(erros).some(Boolean) && <p className="sr-only">Revise os campos indicados.</p>}
              {enviado && (
                <div className="form-ok">
                  <p>Pronto! Abrimos o WhatsApp com sua solicitação. É só enviar a mensagem. A confirmação da disponibilidade é feita pelo WhatsApp.</p>
                  <a className="link" href={enviado} target="_blank" rel="noopener noreferrer"><span className="marc" aria-hidden="true">·</span><span className="t">Abrir WhatsApp</span></a>
                </div>
              )}
            </div>
            <p className="letra-miuda" id={`${uid}-priv`}>
              Ao enviar, você abre uma conversa no WhatsApp com a Dra. Ise Shinkawa. Este site não guarda os dados digitados. <a href="/privacidade.html" style={{ textDecoration: 'underline' }}>Privacidade</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
