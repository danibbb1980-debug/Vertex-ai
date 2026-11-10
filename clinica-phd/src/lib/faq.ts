import { CONFIG, areasAtivas } from "../config";
import { resumoHorarios } from "./horarios";
import { temWhatsapp } from "./contato";

const lista = (n: string[]) => (n.length <= 1 ? n.join("") : `${n.slice(0, -1).join(", ")} e ${n[n.length - 1]}`);

export type Pergunta = { p: string; r: string };

/** Perguntas educativas. Sem preço, prazo, convênio, promessa ou orientação clínica. */
export function perguntas(): Pergunta[] {
  const canal = temWhatsapp ? `pelo WhatsApp ou pelo telefone ${CONFIG.telefoneExibicao}` : `pelo telefone ${CONFIG.telefoneExibicao}`;
  const horarios = resumoHorarios()
    .map((g) => `${g.dias}: ${g.aberto ? g.texto : "fechado"}`)
    .join(". ");
  const temPediatria = areasAtivas.some((a) => a.slug === "pediatria");
  const e = CONFIG.endereco;

  const itens: (Pergunta | null)[] = [
    {
      p: "Preciso agendar para ser atendido?",
      r: `Sim. O atendimento é feito com hora marcada. Você pode pedir um horário ${canal}, e a equipe confirma a disponibilidade.`,
    },
    areasAtivas.length
      ? { p: "Quais áreas a clínica atende?", r: `Hoje a clínica atende nas áreas de ${lista(areasAtivas.map((a) => a.nome.toLowerCase()))}.` }
      : null,
    { p: "Quais são os horários de atendimento?", r: `${horarios}. ${CONFIG.avisoFeriados}` },
    {
      p: "Onde fica a clínica?",
      r: `${e.logradouro}, ${e.complemento}, ${e.edificio}, ${e.bairro}, ${e.cidade} - ${e.uf}, CEP ${e.cep}.`,
    },
    temPediatria
      ? {
          p: "A clínica atende crianças?",
          r: "Sim, há atendimento na área de pediatria. A criança deve vir acompanhada do responsável legal, com o cartão de vacinação.",
        }
      : null,
    {
      p: "Como solicito um horário?",
      r: temWhatsapp
        ? "Envie uma mensagem pelo WhatsApp, ligue para a clínica ou use o formulário “Solicitar agendamento” desta página. O formulário apenas prepara a mensagem: quem confirma o dia e o horário é a equipe da clínica."
        : `Ligue para ${CONFIG.telefoneExibicao}. A equipe verifica a agenda e confirma o dia e o horário.`,
    },
    {
      p: "O que levar na consulta?",
      r: `Um documento de identidade com foto e, se tiver, exames, receitas e relatórios anteriores. Avise sobre alergias e medicamentos em uso.${
        temPediatria ? " Para consultas de crianças, leve também o cartão de vacinação." : ""
      }`,
    },
    {
      p: "Posso escolher com qual profissional quero ser atendido?",
      r: "Sim, você pode indicar uma preferência ao pedir o horário. A equipe informa a disponibilidade de cada agenda.",
    },
    {
      p: "O site marca a consulta automaticamente?",
      r: "Não. O site ajuda você a enviar o pedido. A consulta só fica marcada depois que a equipe da clínica confirma o dia e o horário.",
    },
    {
      p: "Posso tirar dúvidas de saúde por mensagem?",
      r: "Dúvidas sobre sintomas, exames e tratamentos são conversadas na consulta, com avaliação médica. Por mensagem, a equipe ajuda com agendamento e informações gerais.",
    },
  ];
  return itens.filter(Boolean) as Pergunta[];
}
