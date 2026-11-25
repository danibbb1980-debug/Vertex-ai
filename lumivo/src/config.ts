/**
 * Todo o conteúdo do site vive aqui. Regra: campo vazio = bloco não renderiza.
 * Não inventar números, clientes, depoimentos ou promessas.
 */

export type Ilustracao = 'toggle' | 'switch' | 'caixas' | 'tipografia'
export type IconeMetodo = 'conversa' | 'rascunho' | 'ajustes' | 'publicacao'

export interface Projeto {
  nome: string
  tipo: string
  imagem: string
  url: string
  destaque: boolean
}

export const config = {
  site: {
    url: 'https://lumivoweb.com.br',
    titulo: 'Lumivo Web | Sites profissionais em Poços de Caldas',
    descricao:
      'Sites profissionais para negócios de Poços de Caldas e região. Você vê o rascunho funcionando no celular e só paga se aprovar.',
    /** true = noindex em 3 camadas + faixa de rascunho visível */
    rascunho: false,
  },
  secoes: {
    projetos: false,
  },
  mostrarPreco: false,
  preco: 'Site completo em pagamento único, parcelável',

  marca: {
    nome: 'Lumivo Web',
    tagline: 'Seu site pronto antes de você pagar.',
  },
  contato: {
    whatsapp: '5535984487206',
    whatsappExibicao: '(35) 98448-7206',
    instagram: '@lumivoweb',
    email: 'pedrobbb1980@gmail.com',
    cidade: 'Poços de Caldas, MG',
    cnpj: '69.778.493/0001-91',
  },
  hero: {
    rotulo: 'Sites profissionais · Poços de Caldas',
    linhasTitulo: ['Veja seu site', 'pronto antes', 'de pagar.'],
    palavraEnfase: 'antes de pagar',
    texto:
      'Criamos o rascunho do seu site profissional, você vê funcionando no celular e só paga se aprovar. Pensado para o seu negócio, com contato direto pelo WhatsApp.',
    provas: [
      { rotulo: 'Rascunho primeiro', dado: 'você vê pronto, sem compromisso' },
      { rotulo: 'Pagamento depois', dado: 'só depois de aprovar' },
      { rotulo: 'Após publicar', dado: '30 dias de ajustes sem custo' },
    ],
    ctaPrincipal: 'Quero ver meu rascunho',
    ctaSecundario: 'Ver como funciona',
    microtexto: 'Sem compromisso · atendimento pelo WhatsApp',
  },
  conceito: {
    rotulo: '(00) Conceito',
    texto:
      'Site bonito é só o começo. A Lumivo cria páginas que passam confiança, aparecem no Google e levam o cliente direto para o seu WhatsApp. E você vê tudo pronto antes de decidir.',
  },
  processo: {
    rotulo: '(01) Para que serve',
    titulo: 'Cada página tem quatro trabalhos.',
    itens: [
      { numero: '01', titulo: 'Atrair', texto: 'SEO técnico e página rápida para ser encontrado.' },
      { numero: '02', titulo: 'Convencer', texto: 'Design e texto específicos para o seu serviço.' },
      { numero: '03', titulo: 'Converter', texto: 'Botão e formulário que abrem o WhatsApp.' },
      { numero: '04', titulo: 'Manter', texto: '30 dias de ajustes sem custo depois de publicar.' },
    ],
  },
  tecnologia: {
    rotulo: '(02) Tecnologia',
    titulo: 'Código feito à mão, hospedagem sem mensalidade.',
    itens: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vite', 'Cloudflare Pages', 'WhatsApp'],
  },
  seletorDispositivo: {
    rotulo: '(03) Responsivo',
    titulo: 'telas, uma página',
    numeral: 3,
    texto:
      'A maior parte dos clientes chega pelo celular. Por isso cada página nasce pensada nas três telas ao mesmo tempo: o layout se reorganiza e o botão do WhatsApp fica sempre ao alcance.',
  },
  servicos: {
    rotulo: '(04) O que está incluído',
    titulo: 'O que você recebe',
    itens: [
      { numero: '01', titulo: 'Site profissional', texto: 'Completo, rápido e feito para o seu segmento.', ilustracao: 'toggle' },
      { numero: '02', titulo: 'Agendamento pelo WhatsApp', texto: 'Formulário com serviço, dia e horário que abre a conversa já preenchida.', ilustracao: 'switch' },
      { numero: '03', titulo: 'Pronto para o Google', texto: 'SEO técnico básico, sem promessa de posição.', ilustracao: 'caixas' },
      { numero: '04', titulo: 'Domínio no seu nome', texto: 'Você é dono do endereço. Hospedagem sem mensalidade.', ilustracao: 'tipografia' },
    ] as { numero: string; titulo: string; texto: string; ilustracao: Ilustracao }[],
  },
  metodo: {
    rotulo: '(05) Método',
    titulo: 'Da conversa ao site no ar',
    passos: [
      { titulo: 'Conversa', texto: 'Pelo WhatsApp: você manda logo, Instagram e Google Maps.', icone: 'conversa' },
      { titulo: 'Rascunho', texto: 'Você recebe o link do site funcionando, sem compromisso.', icone: 'rascunho' },
      { titulo: 'Ajustes', texto: 'Pedimos o que você quiser mudar até ficar do seu jeito.', icone: 'ajustes' },
      { titulo: 'Publicação', texto: 'Aprovou? Pagamento, publicação no seu domínio e 30 dias de ajustes.', icone: 'publicacao' },
    ] as { titulo: string; texto: string; icone: IconeMetodo }[],
  },
  projetos: [] as Projeto[],
  cta: {
    titulo: 'Quer ver o seu site pronto?',
    texto: 'Responda cinco perguntas rápidas. Eu monto o rascunho e te mando o link pelo WhatsApp. Você só decide depois de ver.',
    botao: 'Quero ver meu rascunho',
  },
  sobre: {
    rotulo: '(06) Sobre',
    // PEDRO: revise este texto; ele só usa fatos já confirmados.
    texto:
      'Sou o Pedro, da Lumivo, em Poços de Caldas. Crio sites para profissionais e empresas locais, com um combinado simples: você vê pronto antes de decidir.',
    foto: '', // vazio = sem foto
  },
  quiz: {
    areas: [
      'Estética e beleza',
      'Odontologia e saúde',
      'Advocacia e serviços profissionais',
      'Comércio e alimentação',
      'Outra área',
    ],
    temSite: ['Não tenho', 'Tenho, mas está desatualizado', 'Tenho e quero refazer'],
  },
}

export type Config = typeof config
