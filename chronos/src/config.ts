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

  // Fotos enviadas pela Chronos (recortadas dos prints do Instagram, placas borradas). Lista vazia = seção "Trabalhos" não existe
  fotos: [
    { arquivo: 'chronos-01', largura: 480, altura: 648, temGrande: true, alt: 'Hatch vinho de frente, no espaço da Chronos, com as luzes hexagonais do teto refletidas no capô e no para-brisa', legenda: 'Frente, sob a luz do espaço' },
    { arquivo: 'chronos-02', largura: 480, altura: 643, temGrande: true, alt: 'Farol de um carro vinho, com o reflexo das luzes hexagonais no capô', legenda: 'Farol' },
    { arquivo: 'chronos-03', largura: 480, altura: 648, temGrande: true, alt: 'Capô de um utilitário cinza refletindo as luzes hexagonais do teto', legenda: 'Capô cinza' },
    { arquivo: 'chronos-04', largura: 480, altura: 501, temGrande: true, alt: 'Roda de liga leve em preto e prata, de perto', legenda: 'Roda' },
    { arquivo: 'chronos-05', largura: 480, altura: 516, temGrande: true, alt: 'Caixa de roda aberta, com a suspensão e o disco de freio à vista', legenda: 'Caixa de roda' },
    { arquivo: 'chronos-06', largura: 480, altura: 644, temGrande: true, alt: 'Interior de um utilitário: volante, painel e tapetes', legenda: 'Interior' },
    { arquivo: 'chronos-07', largura: 480, altura: 644, temGrande: true, alt: 'Utilitário cinza visto de frente, em diagonal, dentro do espaço', legenda: 'Frente, em diagonal' },
    { arquivo: 'chronos-08', largura: 480, altura: 648, temGrande: true, alt: 'Farol de um carro vinho, de perto', legenda: 'Farol, de perto' },
    { arquivo: 'chronos-09', largura: 480, altura: 644, temGrande: true, alt: 'Lanterna traseira de um utilitário cinza', legenda: 'Lanterna traseira' },
    { arquivo: 'chronos-10', largura: 480, altura: 645, temGrande: true, alt: 'Porta aberta de um utilitário cinza, mostrando o vão e a borracha de vedação', legenda: 'Vão da porta' },
    { arquivo: 'chronos-11', largura: 480, altura: 503, temGrande: true, alt: 'Roda de liga leve com pneu, iluminada de lado', legenda: 'Roda, em detalhe' },
    { arquivo: 'chronos-12', largura: 480, altura: 645, temGrande: true, alt: 'Banco do motorista e painel de um utilitário, vistos pela porta aberta', legenda: 'Painel e bancos' },
    { arquivo: 'chronos-13', largura: 480, altura: 649, temGrande: true, alt: 'Farol de um carro vinho visto de lado', legenda: 'Farol, outro ângulo' },
    { arquivo: 'chronos-14', largura: 480, altura: 648, temGrande: true, alt: 'Roda dianteira e para-lama de um utilitário cinza', legenda: 'Roda e para-lama' },
    { arquivo: 'chronos-15', largura: 480, altura: 522, temGrande: true, alt: 'Caixa de roda com amortecedor e freio à vista, carro vermelho ao fundo', legenda: 'Suspensão à vista' },
    { arquivo: 'chronos-16', largura: 480, altura: 547, temGrande: true, alt: 'Traseira de um utilitário cinza, com a lanterna acesa', legenda: 'Traseira' },
    { arquivo: 'chronos-17', largura: 480, altura: 649, temGrande: true, alt: 'Farol e capô de um carro vinho refletindo as luzes do teto', legenda: 'Farol e capô' },
    { arquivo: 'chronos-18', largura: 480, altura: 644, temGrande: true, alt: 'Detalhe da borracha de vedação da porta de um utilitário cinza', legenda: 'Borracha da porta' },
    { arquivo: 'chronos-19', largura: 480, altura: 650, temGrande: true, alt: 'Roda traseira de um utilitário cinza, de perto', legenda: 'Roda traseira' }
  ] as Foto[],

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
