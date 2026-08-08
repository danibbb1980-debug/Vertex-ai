import { site, brl, pricePerDay } from "./site";

/**
 * All page copy, in pt-BR.
 *
 * CRO notes are inline so the reasoning survives the next person who edits a
 * headline. The rule applied throughout: every claim is either specific,
 * verifiable by the reader, or explicitly labelled as illustrative.
 */

export const nav = {
  links: [
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Segmentos", href: "#segmentos" },
    { label: "Projetos", href: "#projetos" },
    { label: "Planos", href: "#planos" },
    { label: "Dúvidas", href: "#duvidas" },
  ],
  cta: "Quero meu site",
};

export const hero = {
  /* Risk reversal moved ABOVE the headline: the three objections that kill this
     offer (lock-in, hidden setup fee, vague timeline) are answered before the
     visitor has finished reading the H1. */
  assurances: [
    "Sem fidelidade",
    "Sem taxa de setup",
    `No ar em ${site.launchDays} dias`,
  ],
  eyebrow: "Sites profissionais por assinatura",
  headline: "Seu site profissional sem o alto custo inicial.",
  headlineAccent: "sem o alto custo inicial",
  sub: "Transforme seu negócio em uma experiência digital que atrai mais clientes.",
  description:
    "A Vertex Web Studios cria sites premium para negócios que querem crescer online. Você recebe um site profissional e mantém sua presença digital sempre atualizada com uma assinatura mensal simples.",
  ctaPrimary: "Quero meu site",
  ctaSecondary: "Ver projetos",
  /* Sets expectations for what happens after the click. Ambiguity about the
     next step is one of the largest sources of CTA abandonment. */
  ctaMicrocopy: "Resposta em até 2 horas úteis. Sem compromisso.",
  priceTag: `A partir de ${brl(site.price)}/mês`,
  /* Concrete, checkable trust signals — no invented client counts or logos. */
  trust: [
    "Você é dono do domínio e do conteúdo",
    "Cancele quando quiser",
    "Suporte direto no WhatsApp",
  ],
};

export const problem = {
  title: "Seus clientes estão procurando online. Seu negócio está pronto?",
  lead: "Todo dia, alguém procura exatamente o que você faz — e escolhe quem encontra primeiro.",
  /* Each problem is written as a moment of loss the owner can picture, not an
     abstract feature gap. Concrete scenarios outperform generic bullets. */
  items: [
    {
      title: "Sem site profissional",
      body: "O cliente pesquisa seu nome, encontra só uma rede social parada há meses e conclui que você fechou.",
      cost: "Cliente perdido antes do primeiro contato",
    },
    {
      title: "Presença online desatualizada",
      body: "Preço antigo, horário errado, serviço que você nem oferece mais. Cada informação desatualizada é uma desculpa para desistir.",
      cost: "Credibilidade em queda",
    },
    {
      title: "Perdendo espaço para o concorrente",
      body: "O concorrente da esquina aparece primeiro no Google, com fotos boas e botão de contato. O trabalho dele não é melhor. A vitrine é.",
      cost: "Vendas indo para o vizinho",
    },
    {
      title: "Contato difícil",
      body: "Sem WhatsApp visível, sem botão de agendamento, sem endereço claro. Quem está com pressa não insiste — vai embora.",
      cost: "Interesse que não vira conversa",
    },
  ],
  transition: "Nós resolvemos isso criando uma presença digital profissional para o seu negócio.",
  transitionSub:
    "Você cuida do que sabe fazer. A gente cuida de como o seu negócio aparece online — todos os meses.",
};

export const offer = {
  eyebrow: "O plano",
  title: "Site profissional sem investimento inicial.",
  sub: "Um único plano. Tudo incluído. Sem surpresa na fatura.",
  /* Price anchoring is the strongest single lever on this page: R$197 only
     reads as "premium at low risk" when the alternative price is visible next
     to it. Without the anchor, R$197 reads as "cheap website". */
  anchor: {
    label: "Site tradicional, pago à vista",
    range: "R$ 3.500 a R$ 8.000",
    note: "Mais hospedagem, manutenção e cada alteração cobrada à parte.",
  },
  price: brl(site.price),
  period: "/mês",
  perDay: `Menos de ${pricePerDay} por dia`,
  planName: "Plano Presença Digital",
  features: [
    { label: "Site profissional personalizado", detail: "Projetado para o seu negócio, não um modelo pronto trocado de cor." },
    { label: "Design otimizado para celular", detail: "Onde 8 em cada 10 clientes locais vão abrir seu site." },
    { label: "Hospedagem gerenciada", detail: "Servidor, certificado de segurança e backups por nossa conta." },
    { label: "Atualizações de conteúdo", detail: "Mudou preço, horário ou serviço? Manda no WhatsApp que a gente atualiza." },
    { label: "Suporte técnico", detail: "Canal direto com quem construiu o seu site." },
    { label: "Melhorias contínuas", detail: "Seu site não envelhece: evolui junto com o negócio." },
    { label: "Design focado em conversão", detail: "Cada página com um objetivo claro: gerar contato." },
  ],
  /* Stating what is NOT included costs a few conversions up front and prevents
     the churn and disputes that come from a surprise later. */
  notIncluded: {
    title: "O que não está incluso",
    items: [
      "Registro do domínio (~R$40/ano, pago direto no registro.br, em seu nome)",
      "Produção de fotos e vídeos profissionais",
      "Gestão de tráfego pago e redes sociais",
    ],
    note: "Se precisar de algo disso, indicamos parceiros ou orçamos à parte — nunca embutido sem você saber.",
  },
  guarantees: [
    { title: "Sem fidelidade", body: "Cancele quando quiser, com um aviso de 30 dias. Sem multa." },
    { title: "Sem taxa de setup", body: "A criação do site está inclusa na mensalidade. Você não paga nada para começar." },
    { title: `Garantia de ${site.guaranteeDays} dias`, body: "Não gostou do site entregue? Devolvemos a mensalidade." },
    { title: "O domínio é seu", body: "Registrado no seu CNPJ. Se sair, ele vai com você." },
  ],
  cta: "Começar meu site",
  ctaMicrocopy: "Sem cartão de crédito. Começa com uma conversa de 15 minutos.",
  explanation:
    "Em vez de investir milhares de reais de uma vez, seu negócio tem um site profissional com um plano mensal simples — e alguém responsável por ele todo mês.",
};

export const howItWorks = {
  eyebrow: "Como funciona",
  title: "Do primeiro contato ao site no ar em uma semana.",
  sub: `Processo definido, prazo claro e uma pessoa responsável pelo seu projeto do início ao fim.`,
  /* A timeline label on every step answers "quanto tempo demora?" without the
     visitor having to ask — the most common pre-sale question for this service. */
  steps: [
    {
      number: "01",
      when: "Dia 1",
      title: "Análise do negócio",
      body: "Entendemos sua empresa, seus objetivos e seus clientes.",
      detail: "Uma conversa de 15 minutos no WhatsApp ou por vídeo. Você não precisa preparar nada.",
    },
    {
      number: "02",
      when: "Dias 2 a 5",
      title: "Criação do site",
      body: "Projetamos um site personalizado para a sua marca.",
      detail: "Você acompanha o rascunho e pede ajustes antes de qualquer coisa ir ao ar.",
    },
    {
      number: "03",
      when: `Dia ${site.launchDays}`,
      title: "Lançamento",
      body: "Seu negócio ganha uma presença online profissional.",
      detail: "Publicamos, configuramos o domínio, o WhatsApp e o Google. Você recebe tudo funcionando.",
    },
    {
      number: "04",
      when: "Todo mês",
      title: "Crescimento contínuo",
      body: "Mantemos e melhoramos seu site ao longo do tempo.",
      detail: "Atualizações, ajustes de performance e melhorias de conversão — sem custo extra.",
    },
  ],
};

export const industries = {
  eyebrow: "Segmentos",
  title: "Feito para o seu tipo de negócio.",
  sub: "Cada segmento converte de um jeito. O site é construído em cima do que faz sentido para o seu.",
  items: [
    {
      slug: "clinicas",
      name: "Clínicas de Estética",
      outcome: "Transforme visitantes em agendamentos.",
      features: [
        "Vitrine de procedimentos",
        "Botão de agendamento",
        "Galeria antes e depois",
        "Conversão direta no WhatsApp",
      ],
    },
    {
      slug: "imobiliarias",
      name: "Imobiliárias",
      outcome: "Capture interessados antes da concorrência.",
      features: [
        "Vitrine de imóveis",
        "Captação de leads qualificados",
        "Apresentação moderna",
        "Filtro por bairro e tipo",
      ],
    },
    {
      slug: "restaurantes",
      name: "Restaurantes",
      outcome: "Menos ligação, mais mesa cheia.",
      features: [
        "Cardápio digital",
        "Reservas online",
        "Experiência do cliente",
        "Integração com delivery",
      ],
    },
    {
      slug: "locais",
      name: "Negócios Locais",
      outcome: "Seja encontrado por quem está perto.",
      features: [
        "Presença profissional",
        "Aquisição de clientes",
        "Google Meu Negócio",
        "Prova social e avaliações",
      ],
    },
  ],
  /* Catch-all so visitors outside the four named verticals don't self-reject. */
  fallback: {
    text: "Não achou o seu segmento?",
    cta: "Fale com a gente — atendemos qualquer negócio local.",
  },
};

export const portfolio = {
  eyebrow: "Projetos",
  title: "O padrão de site que entregamos.",
  sub: "Projetos conceituais criados pela nossa equipe para demonstrar nosso padrão de design e estratégia.",
  /* Explicit, non-negotiable disclosure: these are concepts, not client work. */
  disclaimer: "Projetos conceituais — criados internamente para demonstração, não são clientes reais.",
  items: [
    {
      slug: "clinica",
      name: "Clínica de Estética de Luxo",
      category: "Saúde e Estética",
      description:
        "Uma vitrine sofisticada de procedimentos, com agendamento em dois toques e galeria de resultados que sustenta o preço premium.",
      benefits: [
        "Agendamento direto sem ligação",
        "Procedimentos apresentados com clareza",
        "Percepção de valor que justifica o preço",
      ],
      glow: "#a855f7",
    },
    {
      slug: "imobiliaria",
      name: "Imobiliária Moderna",
      category: "Mercado Imobiliário",
      description:
        "Busca de imóveis rápida, fichas completas e captura de contato em cada anúncio — para o corretor falar só com quem tem interesse real.",
      benefits: [
        "Leads qualificados por imóvel",
        "Imóveis apresentados com destaque",
        "Menos tempo perdido com curioso",
      ],
      glow: "#6366f1",
    },
    {
      slug: "restaurante",
      name: "Experiência Digital para Restaurante",
      category: "Gastronomia",
      description:
        "Cardápio digital que abre instantâneo no celular, reserva online e um caminho curto entre a fome e a mesa reservada.",
      benefits: [
        "Cardápio sempre atualizado",
        "Reservas sem depender do telefone",
        "Experiência que combina com a casa",
      ],
      glow: "#f59e0b",
    },
  ],
};

export const whyVertex = {
  eyebrow: "Por que a Vertex",
  title: "Mais do que um site. Um parceiro de crescimento digital.",
  sub: "A diferença entre um site que existe e um site que trabalha para o seu negócio.",
  cards: [
    {
      title: "Design personalizado",
      body: "Sem modelos genéricos. Cada projeto é desenhado com estratégia.",
      detail: "Começamos pelo seu cliente e pelo que ele precisa decidir — não por um tema comprado pronto.",
    },
    {
      title: "Modelo por assinatura",
      body: "Site profissional sem grande investimento inicial.",
      detail: "O custo previsível entra no orçamento mensal como qualquer outra conta do negócio.",
    },
    {
      title: "Tecnologia moderna",
      body: "Construído com ferramentas modernas e performance otimizada.",
      detail: "Carregamento rápido, segurança e boas práticas que o Google reconhece.",
    },
    {
      title: "Suporte contínuo",
      body: "Seu site evolui junto com o seu negócio.",
      detail: "Mudou o serviço, a equipe ou o preço? Uma mensagem resolve.",
    },
  ],
};

export const comparison = {
  eyebrow: "Comparação",
  title: "Três formas de ter um site. Só uma não te deixa sozinho depois.",
  sub: "A diferença raramente está no primeiro dia. Está no sexto mês.",
  /* The brief compared only against a traditional agency. The real alternative
     a local owner considers is doing it themselves on a site builder — leaving
     it out would let the strongest competing option go unaddressed. */
  columns: [
    {
      name: "Agência tradicional",
      highlight: false,
      rows: [
        { text: "Milhares de reais à vista", ok: false },
        { text: "Manutenção difícil de contratar", ok: false },
        { text: "Cada alteração é orçada à parte", ok: false },
        { text: "Design profissional", ok: true },
        { text: "Some depois da entrega", ok: false },
      ],
    },
    {
      name: "Fazer sozinho (construtor ou IA)",
      highlight: false,
      rows: [
        { text: "Mensalidade da plataforma", ok: false },
        { text: "Você vira o suporte técnico", ok: false },
        { text: "Horas do seu tempo todo mês", ok: false },
        { text: "Cara de modelo pronto", ok: false },
        { text: "Para de ser atualizado em 2 meses", ok: false },
      ],
    },
    {
      name: "Assinatura Vertex",
      highlight: true,
      rows: [
        { text: "Sem investimento inicial alto", ok: true },
        { text: "Suporte contínuo incluído", ok: true },
        { text: "Alterações incluídas na mensalidade", ok: true },
        { text: "Design profissional e exclusivo", ok: true },
        { text: "Custo mensal previsível", ok: true },
      ],
    },
  ],
};

/**
 * FAQ — the largest gap in the original brief.
 *
 * For a subscription offer sold to small-business owners, unresolved objections
 * are the primary reason a warm visitor leaves. Each question below is one a
 * real prospect asks in the first WhatsApp message.
 */
export const faq = {
  eyebrow: "Dúvidas",
  title: "As perguntas que todo mundo faz antes de começar.",
  sub: "Se a sua não estiver aqui, chame no WhatsApp. Respondemos direto, sem script.",
  items: [
    {
      q: "Se eu cancelar, perco o site?",
      a: `O domínio é registrado no seu nome ou CNPJ e é sempre seu — todo o conteúdo, textos e imagens também. O que encerra é o serviço: hospedagem, manutenção e suporte. Ao cancelar, entregamos os arquivos do site e o conteúdo para você levar para onde quiser. Sem multa e sem fidelidade, com aviso de 30 dias.`,
    },
    {
      q: "Por que assinatura em vez de pagar uma vez?",
      a: `Porque um site não é um produto que acaba na entrega. Ele precisa de hospedagem, certificado de segurança, atualização e alguém para arrumar quando quebra. No modelo tradicional você paga ${brl(site.anchorLow)} ou mais à vista e depois paga de novo a cada alteração. Aqui, ${brl(site.price)}/mês cobre a criação e tudo o que vem depois.`,
    },
    {
      q: "Tem taxa de setup ou cobrança escondida?",
      a: "Não. A criação do site está inclusa na primeira mensalidade. As únicas coisas fora do plano estão listadas abertamente na seção de planos: registro do domínio (cerca de R$40 por ano, pago por você direto no registro.br), produção de fotos e vídeos, e gestão de tráfego pago.",
    },
    {
      q: "Quanto tempo até o site estar no ar?",
      a: `Em média ${site.launchDays} dias a partir da nossa conversa inicial, quando você já tem as informações do negócio em mãos. Se depender de fotos novas ou de textos que ainda serão escritos, combinamos um prazo realista logo no primeiro contato — nunca prometemos data que não dá para cumprir.`,
    },
    {
      q: "Preciso entender de tecnologia?",
      a: "Não precisa. Você não vai mexer em painel, plugin ou hospedagem. Para mudar qualquer coisa no site, você manda uma mensagem no WhatsApp descrevendo o que quer e a gente faz.",
    },
    {
      q: "Quantas alterações estão incluídas?",
      a: "Alterações de conteúdo — texto, preço, horário, fotos, serviços, novas seções — são ilimitadas dentro do bom senso, com prazo de até 2 dias úteis. O que sai do plano é reconstruir o site do zero ou desenvolver sistemas sob medida, como área de login, e-commerce completo ou integração com ERP. Nesses casos a gente orça antes e você decide.",
    },
    {
      q: "E se eu já tenho um site?",
      a: "Melhor ainda. Avaliamos o que existe, migramos o que vale a pena manter e refazemos o resto. Seu endereço atual continua funcionando e quem já te encontrava no Google continua encontrando.",
    },
    {
      q: "Vocês garantem primeiro lugar no Google?",
      a: "Não, e desconfie de quem garante. Ninguém controla o algoritmo do Google. O que fazemos é o trabalho que sustenta o resultado: site rápido, estrutura correta, conteúdo relevante, versão mobile impecável e Google Meu Negócio configurado. Isso melhora sua posição de forma consistente ao longo do tempo.",
    },
    {
      q: "Como funciona o pagamento?",
      a: `${brl(site.price)} por mês, no cartão ou por Pix, com a primeira cobrança só depois que você aprovar o rascunho do site. Se não gostar do que foi entregue, tem ${site.guaranteeDays} dias para pedir a devolução da mensalidade.`,
    },
  ],
};

export const finalCta = {
  eyebrow: "Vamos começar",
  title: "Pronto para dar ao seu negócio a presença online que ele merece?",
  description:
    "Comece hoje o seu site profissional com um plano mensal simples. A primeira conversa leva 15 minutos e não custa nada.",
  cta: "Quero meu site",
  whatsappCta: "Prefiro falar no WhatsApp",
  assurances: [
    "Sem fidelidade",
    "Sem taxa de setup",
    `Garantia de ${site.guaranteeDays} dias`,
    "Resposta em até 2h úteis",
  ],
};

export const footer = {
  tagline: "Sites profissionais por assinatura para negócios que querem crescer online.",
  services: {
    title: "Serviços",
    items: [
      { label: "Criação de Sites", href: "#planos" },
      { label: "Landing Pages", href: "#planos" },
      { label: "Presença Digital", href: "#como-funciona" },
    ],
  },
  company: {
    title: "Navegação",
    items: [
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Projetos", href: "#projetos" },
      { label: "Planos", href: "#planos" },
      { label: "Dúvidas", href: "#duvidas" },
    ],
  },
  socialTitle: "Redes",
  contactTitle: "Contato",
  whatsappCta: "Falar no WhatsApp",
  legal: `© ${new Date().getFullYear()} ${site.name}. Todos os direitos reservados.`,
  legalNote:
    "Os projetos exibidos neste site são conceituais e estão identificados como tal.",
};

export const leadForm = {
  title: "Comece pelo diagnóstico gratuito",
  sub: "Preencha os dados e o WhatsApp abre com tudo pronto. Respondemos em até 2 horas úteis com uma proposta para o seu negócio.",
  fields: {
    name: { label: "Seu nome", placeholder: "Como podemos te chamar?" },
    company: { label: "Nome do seu negócio", placeholder: "Ex: Clínica Bella" },
    phone: { label: "Seu WhatsApp", placeholder: "(35) 98448-7206" },
    segment: { label: "Tipo de negócio", placeholder: "Selecione" },
    needs: {
      label: "O que você precisa",
      placeholder:
        "Ex: quero um site com agendamento online e galeria de resultados.",
    },
  },
  segments: [
    "Clínica de estética",
    "Imobiliária",
    "Restaurante",
    "Serviços profissionais",
    "Outro negócio local",
  ],
  submit: "Enviar pelo WhatsApp",
  submitting: "Abrindo WhatsApp...",
  /*
   * Honest wording: with no backend, nothing has been received until the person
   * taps send inside WhatsApp. Claiming receipt would strand the leads who
   * think they already talked to us.
   */
  successTitle: "Só falta enviar.",
  successBody:
    "Abrimos o WhatsApp com seus dados já preenchidos. É só apertar enviar que a conversa chega para a gente. Se a janela não abriu, use o botão abaixo:",
  privacy:
    "Seus dados vão direto para a nossa conversa no WhatsApp. Não guardamos nada em lista de e-mail.",
};
