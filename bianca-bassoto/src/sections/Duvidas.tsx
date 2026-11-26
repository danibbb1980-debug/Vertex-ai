import { useId, useState } from 'react';
import { CONFIG, atendimentosAtivos, enderecoLinha, temCrn } from '../config';
import { horariosAgrupados } from '../lib';
import { SectionHead } from '../components/SectionHead';

function lista(xs: string[]) {
  if (xs.length <= 1) return xs.join('');
  return `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`;
}

export function faqs() {
  const at = atendimentosAtivos().map((a) => a.nome.toLowerCase());
  const g = horariosAgrupados();
  const sab = CONFIG.horarios.find((h) => h.dia === 6);
  const dom = CONFIG.horarios.find((h) => h.dia === 0);
  const abertos = g.filter((x) => x.abre).map((x) => `${x.nome.toLowerCase()}, das ${x.texto}`);
  const out: { q: string; a: string }[] = [];
  if (CONFIG.usarWhatsapp)
    out.push({
      q: 'Como agendar uma consulta com a nutricionista?',
      a: `Pelo WhatsApp ${CONFIG.telefoneExibicao}, pelo formulário desta página (ele monta a mensagem e abre o WhatsApp) ou por telefone, no mesmo número. O dia e o horário são confirmados pelo WhatsApp.`,
    });
  if (CONFIG.usarWhatsapp && CONFIG.secoes.agendar)
    out.push({
      q: 'Posso agendar pelo site?',
      a: 'Pode pedir. O formulário reúne o atendimento, o dia e o horário que você prefere e abre uma conversa no WhatsApp. O site não marca horários sozinho: a disponibilidade é confirmada nessa conversa.',
    });
  out.push({
    q: 'Como é a primeira consulta?',
    a: 'Começa por uma conversa sobre a sua rotina, a sua alimentação e o que você procura. Depois vem a avaliação individual e, a partir dela, a orientação para os próximos passos.',
  });
  out.push({
    q: 'O que levar na primeira consulta?',
    a: 'Se tiver exames recentes, pode levar. Vale anotar os medicamentos que você usa. Se ficar alguma dúvida, pergunte pelo WhatsApp ao agendar.',
  });
  if (at.length)
    out.push({
      q: 'Quais atendimentos a nutricionista oferece?',
      a: `${lista(at).replace(/^./, (c) => c.toUpperCase())}, sempre a partir de uma consulta individual.`,
    });
  out.push({
    q: 'Todo atendimento serve para todas as pessoas?',
    a: 'Não necessariamente. A indicação de cada atendimento depende da avaliação individual feita na consulta.',
  });
  if (abertos.length)
    out.push({
      q: 'Quais são os horários de atendimento?',
      a: `${lista(abertos).replace(/^./, (c) => c.toUpperCase())}. ${CONFIG.avisoHorarios}`,
    });
  if (sab?.abre) out.push({ q: 'Atende aos sábados?', a: `Sim, das ${g.find((x) => x.dias.includes(sab))?.texto}.` });
  if (dom && !dom.abre) out.push({ q: 'E aos domingos?', a: 'Não. O consultório fica fechado aos domingos.' });
  out.push({
    q: `Onde fica o consultório em ${CONFIG.cidade}?`,
    a: `${enderecoLinha()}.`,
  });
  if (temCrn())
    out.push({ q: 'Qual é o registro profissional?', a: `${CONFIG.nome}, ${CONFIG.descritor.toLowerCase()}, ${CONFIG.crn}.` });
  return out;
}

export function Duvidas({ num }: { num: string }) {
  const items = faqs();
  const [aberto, setAberto] = useState<number | null>(null);
  const base = useId();
  return (
    <section className="sec duvidas" id="duvidas" aria-labelledby="duvidas-h">
      <div className="wrap duvidas__grid">
        <div className="duvidas__side">
          <SectionHead num={num} label="Dúvidas" id="duvidas-h" lines={['Dúvidas sobre', 'a consulta']} />
        </div>
        <ul className="faq">
          {items.map((f, i) => {
            const open = aberto === i;
            return (
              <li className={`row faq__row ${open ? 'is-open' : ''}`} key={f.q}>
                <h3 className="faq__h">
                  <button
                    type="button"
                    id={`${base}-q${i}`}
                    className="faq__btn"
                    aria-expanded={open}
                    aria-controls={`${base}-a${i}`}
                    onClick={() => setAberto(open ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className="plus" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="faq__panel acc-panel"
                  id={`${base}-a${i}`}
                  role="region"
                  aria-labelledby={`${base}-q${i}`}
                  data-open={open}
                >
                  <p>{f.a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
