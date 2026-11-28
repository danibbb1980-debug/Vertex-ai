// Todos os dados do site. Campo vazio ou ausente = o bloco não aparece.

export type Dia = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = domingo

export interface Servico {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

export interface Foto {
  // Arquivos em public/fotos: {arquivo}-480.webp e, se existir, {arquivo}-720.webp
  arquivo: string
  largura: number // largura do arquivo de 480 (ou menor, se a foto original é pequena)
  altura: number
  temGrande: boolean
  alt: string
  legenda?: string
}

export interface Trabalho {
  id: string
  titulo: string
  veiculo: string
  pares: { antes: Foto; depois: Foto }[]
  extras: Foto[]
}

export const CONFIG = {
  rascunho: true,
  intro: true, // splash do hero (só ≥ 1024 px, uma vez por sessão)

  nome: 'Chronos | Estética Automotiva',
  marca: 'Chronos',
  cidade: 'Poços de Caldas',
  uf: 'MG',

  // Atualize depois do primeiro deploy definitivo
  siteUrl: 'https://chronos-rascunho.vercel.app',

  endereco: {
    rua: 'R. Acácia, 518',
    ruaCompleta: 'Rua Acácia, nº 518',
    bairro: 'São João',
    cep: '37701-125',
    linhaCurta: 'R. Acácia, 518 · São João',
    completo: 'R. Acácia, nº 518, São João, Poços de Caldas - MG, CEP 37701-125'
  },
  rotaUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Rua%20Ac%C3%A1cia%2C%20518%2C%20S%C3%A3o%20Jo%C3%A3o%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG%2C%2037701-125',
  mapsUrl: 'https://maps.app.goo.gl/BzNUBN4ry8AMk4ddA',
  mapaEmbed:
    'https://www.google.com/maps?q=Rua%20Ac%C3%A1cia%2C%20518%2C%20S%C3%A3o%20Jo%C3%A3o%2C%20Po%C3%A7os%20de%20Caldas%20-%20MG&output=embed',

  usarWhatsapp: true,
  whatsapp: '553591267375',
  whatsappExibicao: '(35) 9126-7375',
  telefoneFixo: '',
  email: '',
  proprietario: '',

  instagram: {
    usuario: '@chronos_estetica_auto',
    url: 'https://www.instagram.com/chronos_estetica_auto/'
  },

  // Horário de Brasília. null = fechado
  horarios: {
    1: { abre: 8, fecha: 17 },
    2: { abre: 8, fecha: 17 },
    3: { abre: 8, fecha: 17 },
    4: { abre: 8, fecha: 17 },
    5: { abre: 8, fecha: 16 },
    6: { abre: 8, fecha: 16 },
    0: null
  } as Record<Dia, { abre: number; fecha: number } | null>,
  fusoHorario: 'America/Sao_Paulo',
  avisoFeriados: 'Horários podem variar em feriados.',

  servicos: [
    {
      id: 'estetica',
      nome: 'Estética automotiva',
      descricao:
        'Cuidado com a aparência do seu veículo, conforme a necessidade de cada um. Para saber o que cabe no seu, fale com a Chronos pelo WhatsApp.',
      ativo: true
    },
    // Desligados até a empresa confirmar o que oferece e como quer divulgar
    { id: 'lavagem', nome: 'Lavagem', descricao: '', ativo: false },
    { id: 'higienizacao', nome: 'Higienização', descricao: '', ativo: false },
    { id: 'polimento', nome: 'Polimento', descricao: '', ativo: false },
    { id: 'vitrificacao', nome: 'Vitrificação', descricao: '', ativo: false },
    { id: 'cristalizacao', nome: 'Cristalização', descricao: '', ativo: false },
    { id: 'pelicula', nome: 'Película', descricao: '', ativo: false },
    { id: 'protecao', nome: 'Proteção de pintura', descricao: '', ativo: false },
    { id: 'motor', nome: 'Limpeza de motor', descricao: '', ativo: false },
    { id: 'detalhamento', nome: 'Detalhamento', descricao: '', ativo: false }
  ] as Servico[],

  // Trabalhos enviados pela Chronos: cada um é um carro, com pares de antes e depois do mesmo ângulo.
  // Fotos recortadas dos prints do Instagram, placas borradas. Lista vazia = seção "Trabalhos" não existe
  trabalhos: [
    {
      id: 'farois',
      titulo: 'Faróis',
      veiculo: 'Hatch vinho',
      pares: [
        { antes: { arquivo: 'chronos-08', largura: 480, altura: 648, temGrande: true, alt: 'Antes: farol do carro vinho amarelado e opaco' }, depois: { arquivo: 'chronos-13', largura: 480, altura: 649, temGrande: true, alt: 'Depois: o mesmo farol, transparente' } },
        { antes: { arquivo: 'chronos-02', largura: 480, altura: 643, temGrande: true, alt: 'Antes: farol do carro vinho visto de frente, com a lente embaçada' }, depois: { arquivo: 'chronos-17', largura: 480, altura: 649, temGrande: true, alt: 'Depois: o mesmo farol, do mesmo ângulo, com a lente transparente' } }
      ],
      extras: [{ arquivo: 'chronos-01', largura: 480, altura: 648, temGrande: true, alt: 'O carro vinho de frente, no espaço da Chronos, sob as luzes hexagonais do teto' }]
    },
    {
      id: 'caixa-de-roda',
      titulo: 'Caixa de roda',
      veiculo: 'Utilitário prata',
      pares: [
        { antes: { arquivo: 'chronos-05', largura: 480, altura: 516, temGrande: true, alt: 'Antes: caixa de roda com sujeira e barro na parte interna' }, depois: { arquivo: 'chronos-15', largura: 480, altura: 522, temGrande: true, alt: 'Depois: a mesma caixa de roda, limpa e escura' } }
      ],
      extras: [{ arquivo: 'chronos-11', largura: 480, altura: 503, temGrande: true, alt: 'Roda de liga leve em preto e prata do mesmo carro' }, { arquivo: 'chronos-04', largura: 480, altura: 501, temGrande: true, alt: 'A mesma roda, de outro ângulo' }]
    },
    {
      id: 'utilitario-cinza',
      titulo: 'Interior e rodas',
      veiculo: 'Utilitário cinza',
      pares: [
        { antes: { arquivo: 'chronos-06', largura: 480, altura: 644, temGrande: true, alt: 'Antes: tapetes e assoalho do motorista com sujeira' }, depois: { arquivo: 'chronos-12', largura: 480, altura: 645, temGrande: true, alt: 'Depois: o mesmo interior, com o assoalho limpo' } },
        { antes: { arquivo: 'chronos-14', largura: 480, altura: 648, temGrande: true, alt: 'Antes: pneu e caixa de roda com poeira e barro' }, depois: { arquivo: 'chronos-19', largura: 480, altura: 650, temGrande: true, alt: 'Depois: o mesmo pneu, escuro e limpo' } }
      ],
      extras: [
        { arquivo: 'chronos-07', largura: 480, altura: 644, temGrande: true, alt: 'O utilitário cinza de frente, em diagonal' },
        { arquivo: 'chronos-03', largura: 480, altura: 648, temGrande: true, alt: 'Capô do utilitário cinza refletindo as luzes do teto' },
        { arquivo: 'chronos-09', largura: 480, altura: 644, temGrande: true, alt: 'Lanterna traseira do utilitário cinza' },
        { arquivo: 'chronos-16', largura: 480, altura: 547, temGrande: true, alt: 'Traseira do utilitário cinza, de perto' },
        { arquivo: 'chronos-10', largura: 480, altura: 645, temGrande: true, alt: 'Porta aberta, com o vão e a borracha de vedação' },
        { arquivo: 'chronos-18', largura: 480, altura: 644, temGrande: true, alt: 'Detalhe da borracha de vedação da porta' }
      ]
    }
  ] as Trabalho[],

  secoes: {
    estetica: true,
    traco: true,
    trabalhos: true,
    silencio: true,
    comoFunciona: true,
    horarios: true,
    duvidas: true,
    contato: true,
    agendar: true,
    ctaFinal: true
  }
}

// Ajustes do hero no estilo Forge, sem mexer no componente
export const HERO_CONFIG = {
  theme: {
    page: '#0A0B0D',
    ink: '#ECEAE4',
    accent: '#5DB3C4'
  },
  splash: {
    enabled: CONFIG.intro,
    skipBelow: 1024,
    firstStrike: 0.3,
    strikeEvery: 0.15,
    hold: 0.45,
    flight: 0.9,
    filetes: 6,
    storageKey: 'chronos-splash-visto'
  },
  shader: {
    base: [0.039, 0.043, 0.051] as [number, number, number],
    light: [0.93, 0.92, 0.89] as [number, number, number],
    intensity: 0.13,
    dust: 0.45,
    grain: 0.025,
    cursor: 0.3,
    speed: 1,
    resolution: 0.75,
    resolutionMobile: 0.5,
    beam: 1.8
  }
}

export const servicosAtivos = () => CONFIG.servicos.filter(s => s.ativo)

export const waLink = (texto: string) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`

export const MSG_GERAL = 'Olá! Vi o site da Chronos Estética Automotiva e gostaria de pedir um horário.'
export const msgServico = (nome: string) =>
  `Olá! Vi o site da Chronos Estética Automotiva e gostaria de pedir um horário para ${nome.toLowerCase()}.`

export const NOMES_DIA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export const hh = (h: number) => `${String(h).padStart(2, '0')}h`
