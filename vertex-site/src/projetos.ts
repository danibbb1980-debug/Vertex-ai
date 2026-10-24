/**
 * Projetos da Vertex mostrados no site.
 *
 * Tudo aqui vem do próprio material de cada projeto (capturas em public/).
 * Não invente resultados, números ou depoimentos.
 *
 * - `status`: deixe vazio quando não quiser rotular.
 * - `link`: só publique endereços abertos ao público. Rascunhos protegidos por
 *   login na Vercel ficam sem link.
 */
export type Projeto = {
  id: string;
  nome: string;
  segmento: string;
  cidade?: string;
  status?: string;
  objetivo: string;
  decisao: string;
  link?: string;
  /** Captura de desktop (16:10), base do nome em /exemplos: -640 e -1200 */
  desktop: string;
  alt: string;
};

export const projetos: Projeto[] = [
  {
    id: "vip-shape",
    nome: "VIP Shape Academia",
    segmento: "Academia",
    cidade: "Poços de Caldas · MG",
    objetivo: "Levar quem procura academia na cidade direto para uma conversa no WhatsApp.",
    decisao:
      "A foto da própria área de cárdio ocupa a primeira dobra, e uma faixa laranja traz o vocabulário do treino: força, disciplina, movimento.",
    desktop: "academia",
    alt: "Primeira dobra do site da VIP Shape Academia: título em caixa-alta branco e laranja sobre fundo preto, ao lado da foto da área de cárdio",
  },
  {
    id: "star-sorrindo",
    nome: "Star Sorrindo",
    segmento: "Clínica odontológica · implantes",
    cidade: "Poços de Caldas · MG",
    objetivo: "Apresentar implantes, próteses e clínica geral com clareza e levar ao agendamento da avaliação.",
    decisao: "Uma foto real do consultório, recortada em arco, ocupa metade da tela: o paciente conhece o lugar antes de ir.",
    desktop: "clinica",
    alt: "Primeira dobra do site da Star Sorrindo: título em serif azul-marinho e dourado ao lado da foto do consultório em arco",
  },
  {
    id: "dra-beatryz",
    nome: "Dra. Beatryz Furlaneto",
    segmento: "Odontopediatria",
    cidade: "São João da Boa Vista · SP",
    objetivo: "Falar com os pais: acolhimento e explicações claras sobre o atendimento infantil.",
    decisao: "Uma palavra manuscrita, carinho, e o número do CRO logo abaixo do botão, como pede a publicidade odontológica.",
    desktop: "odontopediatria",
    alt: "Primeira dobra do site da Dra. Beatryz Furlaneto: título em serif com a palavra carinho manuscrita, ao lado da foto da dentista no consultório",
  },
  {
    id: "rocha",
    nome: "Rocha",
    segmento: "Laboratório de prótese dentária",
    cidade: "São João da Boa Vista · SP",
    status: "Rascunho",
    objetivo: "Ser o parceiro técnico do dentista: mostrar trabalhos e explicar como enviar um caso.",
    decisao: "As fotos dos trabalhos entram legendadas como figuras de catálogo (Fig. 01, Fig. 02), num tom de ateliê.",
    desktop: "laboratorio",
    alt: "Primeira dobra do site do laboratório Rocha: título em serif verde-escuro sobre creme, com fotos de um enceramento e de uma metalocerâmica",
  },
  {
    id: "natalino-polato",
    nome: "Natalino Polato",
    segmento: "Advocacia criminal",
    cidade: "Mogi Guaçu · SP",
    status: "Rascunho",
    objetivo: "Apresentar a atuação em Direito Penal com sobriedade e oferecer um contato direto.",
    decisao: "Nenhuma promessa de resultado: um cartão com nome, OAB e área de atuação, dentro das regras de publicidade da advocacia.",
    desktop: "advocacia",
    alt: "Primeira dobra do site do advogado Natalino Polato: título em serif sobre azul-noite e um cartão com logo, foto, OAB e área de atuação",
  },
];
