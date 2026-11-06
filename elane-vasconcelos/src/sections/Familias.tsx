import { CONFIG } from "../config";
import { Acordeao } from "../components/Acordeao";
import { Revelar, TituloSecao } from "../components/Revelar";

const PERGUNTAS = [
  {
    id: "agendar",
    titulo: "Como faço para agendar o furo de orelha?",
    conteudo: <p>Pelo WhatsApp ou pelo formulário desta página. Basta o nome de quem acompanha e, se quiser, a idade aproximada da criança. A equipe responde com a disponibilidade.</p>,
  },
  {
    id: "antes",
    titulo: "Por que conversar antes do atendimento?",
    conteudo: <p>Cada criança tem o seu momento. A conversa prévia serve para você tirar dúvidas, entender como o atendimento acontece e combinar tudo com calma, sem surpresas.</p>,
  },
  {
    id: "levar",
    titulo: "O que levar no dia?",
    conteudo: <p>Na conversa de agendamento, a equipe explica o que é útil trazer. Se ficar alguma dúvida, é só perguntar pelo WhatsApp antes de vir.</p>,
  },
  {
    id: "horario",
    titulo: "Qual horário costuma funcionar para a criança?",
    conteudo: <p>Vale pensar em um momento do dia em que a criança costuma estar mais tranquila. No formulário você indica sua preferência, e a equipe confirma a disponibilidade.</p>,
  },
  {
    id: "depois",
    titulo: "E se eu tiver dúvidas depois?",
    conteudo: <p>O contato continua aberto pelo WhatsApp. Você pode retomar a conversa e perguntar sobre as orientações recebidas.</p>,
  },
];

export function ParaQuemAcompanha() {
  if (!CONFIG.secoes.paraQuemAcompanha || !CONFIG.atendimentos.some((a) => a.id === "furo")) return null;
  return (
    <section aria-labelledby="titulo-familias" className="py-24 sm:py-32">
      <div className="container-site relative z-[1] grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <TituloSecao id="titulo-familias" rotulo="Furo de orelha infantil" antes="Para quem" enfase="acompanha." />
          <Revelar atraso={0.1}>
            <p className="mt-6 max-w-md text-texto">
              Mães, pais e responsáveis costumam chegar com perguntas, e isso é ótimo. Reunimos aqui as mais comuns sobre como o atendimento é combinado.
            </p>
            <p className="mt-8 border-l border-ouro pl-5 font-serif text-2xl italic text-mauve">
              As orientações são dadas no atendimento.
            </p>
          </Revelar>
        </div>
        <Revelar atraso={0.1}>
          <Acordeao itens={PERGUNTAS} />
        </Revelar>
      </div>
    </section>
  );
}
