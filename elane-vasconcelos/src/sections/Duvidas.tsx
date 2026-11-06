import { CONFIG } from "../config";
import { Acordeao } from "../components/Acordeao";
import { Revelar, TituloSecao } from "../components/Revelar";
import { pausaAlmoco, resumoSemanal } from "../lib/horarios";

export function Duvidas() {
  if (!CONFIG.secoes.duvidas) return null;
  const e = CONFIG.endereco;
  const itens = [
    { id: "agendar", titulo: "Preciso agendar?", conteudo: <p>Sim. Os atendimentos são com hora marcada. Você pode pedir um horário pelo WhatsApp ou pelo formulário desta página, e a equipe confirma a disponibilidade.</p> },
    { id: "quais", titulo: "Quais atendimentos há?", conteudo: <p>{CONFIG.atendimentos.map((a) => a.nome).join(" e ")}. Na estética, a indicação depende de avaliação individual.</p> },
    { id: "criancas", titulo: "Atendem bebês e crianças no furo de orelha?", conteudo: <p>Sim. O furo de orelha infantil é voltado a bebês e crianças, sempre mediante avaliação. As orientações são passadas na conversa de agendamento e no atendimento.</p> },
    { id: "primeira", titulo: "Como é a primeira conversa?", conteudo: <p>Você conta o que procura, tira suas dúvidas e recebe explicações sobre o que é possível no seu caso. Nada é decidido sem que você entenda cada etapa.</p> },
    { id: "duvida-antes", titulo: "Posso tirar dúvidas antes de agendar?", conteudo: <p>Pode. Mande uma mensagem pelo WhatsApp contando o que você procura.</p> },
    {
      id: "horarios", titulo: "Quais são os horários?", conteudo: (
        <p>{resumoSemanal().map((g) => `${g.dias}: ${g.texto.toLowerCase()}`).join("; ")}.{pausaAlmoco() ? ` Pausa para almoço das ${pausaAlmoco()}.` : ""} {CONFIG.avisoHorarios}</p>
      ),
    },
    { id: "onde", titulo: "Onde fica?", conteudo: <p>{e.rua}, {e.bairro}, {e.cidade} - {e.uf}, CEP {e.cep}. <a className="text-mauve underline underline-offset-4" href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">Abrir no Google Maps<span className="sr-only"> (abre em nova aba)</span></a></p> },
    { id: "acessivel", titulo: "A entrada é acessível?", conteudo: <p>Sim. {CONFIG.acessibilidade}.</p> },
    { id: "valores", titulo: "Os valores estão no site?", conteudo: <p>Não. Valores não são divulgados no site. Para informações, fale pelo WhatsApp.</p> },
    { id: "form", titulo: "O formulário já marca o horário?", conteudo: <p>Não. Ele monta uma mensagem de solicitação e abre o WhatsApp. A equipe confirma a disponibilidade. Este site não guarda os dados digitados.</p> },
  ].filter((i) => i.id !== "acessivel" || CONFIG.acessibilidade);

  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="bg-marfim-2 py-24 sm:py-32">
      <div className="container-site relative z-[1] grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <TituloSecao id="titulo-duvidas" rotulo="Dúvidas frequentes" antes="Perguntas que costumam" enfase="chegar." />
          <Revelar atraso={0.1}>
            <p className="mt-6 max-w-sm text-texto">Conteúdo informativo. Para o seu caso, vale conversar no atendimento.</p>
          </Revelar>
        </div>
        <Revelar atraso={0.1}><Acordeao itens={itens} /></Revelar>
      </div>
    </section>
  );
}
