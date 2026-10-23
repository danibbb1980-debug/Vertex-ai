/**
 * Fonte única de dados do site do Laboratório de Prótese Dentária Rocha.
 *
 * Origem dos dados: Instagram (@rochalab_protesedentaria) e ficha do Google Maps.
 * Tudo marcado com "CONFIRMAR COM O LABORATÓRIO" ainda precisa de validação
 * antes de o site sair do modo rascunho. Valores `null` não aparecem no site.
 *
 * Este arquivo também é lido pelo vite.config.ts (metas, canonical e JSON-LD
 * do index.html), por isso deve conter apenas dados, sem imports.
 */

export type Trabalho = {
  id: string
  nome: string
  categoria: 'Prótese fixa' | 'Prótese removível' | 'Sobre implantes' | 'Planejamento' | 'Acabamento'
  descricao: string
  tags: string[]
  /** Nome da foto em public/fotos (sem extensão). null = bloco reservado. */
  foto: string | null
  /** Largura e altura originais da foto, para evitar ampliação e CLS. */
  fotoTamanho?: [number, number]
  fotoAlt?: string
  /** false = veio só da ficha do Google ou de posts. CONFIRMAR COM O LABORATÓRIO. */
  confirmado: boolean
}

export const CONFIG = {
  /** true mostra a faixa de rascunho e mantém o noindex nas metas. */
  rascunho: true,

  /** URL pública do site, sem barra no final. CONFIRMAR COM O LABORATÓRIO (domínio definitivo). */
  siteUrl: 'https://rocha-lab-rascunho.netlify.app',

  nome: 'Laboratório de Prótese Dentária Rocha',
  nomeCurto: 'Laboratório Rocha',
  nomeMaps: 'Prótese Dentária - Laboratório Rocha',
  cidade: 'São João da Boa Vista',
  uf: 'SP',

  responsavel: 'Matheus Rocha',
  /** Informado pelo responsável em story do Instagram. CONFIRMAR COM O LABORATÓRIO. */
  anosExperiencia: 16,

  /** CONFIRMAR COM O LABORATÓRIO: registros no CRO-SP. null = mostra placeholder. */
  croLaboratorio: null as string | null,
  croResponsavel: null as string | null,
  /** CONFIRMAR COM O LABORATÓRIO: formação do responsável. */
  formacaoResponsavel: null as string | null,

  endereco: {
    rua: 'R. Miguel Jacob, Fundos, 2B',
    bairro: 'Jardim Santa Rita',
    cidade: 'São João da Boa Vista',
    uf: 'SP',
    cep: '13871-060',
  },

  /** Ficha do Google. CONFIRMAR COM O LABORATÓRIO. */
  horarios: [
    { dias: 'Segunda a sexta', faixas: ['08h00 – 12h00', '13h30 – 18h00'] },
    { dias: 'Sábado e domingo', faixas: [] as string[] },
  ],
  /** Mesmo horário, em formato schema.org, para o JSON-LD. */
  horariosSchema: [
    { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '08:00', fecha: '12:00' },
    { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '13:30', fecha: '18:00' },
  ],

  /** Apenas dígitos, com DDI e DDD. Igual ao link da bio do Instagram. */
  whatsapp: '5519992439085',
  telefoneExibicao: '(19) 99243-9085',
  instagram: 'https://www.instagram.com/rochalab_protesedentaria',
  instagramUsuario: '@rochalab_protesedentaria',
  googleMaps: 'https://maps.app.goo.gl/3Zbo6F1GMuqNsGVM9',
  /** Embed do mapa (busca pelo endereço; não exige chave de API). */
  mapaEmbed:
    'https://www.google.com/maps?q=R.+Miguel+Jacob,+2B,+Jardim+Santa+Rita,+S%C3%A3o+Jo%C3%A3o+da+Boa+Vista+-+SP,+13871-060&output=embed',

  /** CONFIRMAR COM O LABORATÓRIO: só preencha com os valores reais do Google. */
  google: {
    nota: null as number | null,
    avaliacoes: null as number | null,
  },

  /** CONFIRMAR COM O LABORATÓRIO: bloco "Fluxo digital". */
  mostrarFluxoDigital: true,

  mensagens: {
    geral: 'Olá! Sou cirurgião-dentista e gostaria de conhecer o trabalho do Laboratório Rocha.',
    enviarCaso: 'Olá! Sou cirurgião-dentista e gostaria de saber como enviar um caso para o Laboratório Rocha.',
    fluxoDigital:
      'Olá! Sou cirurgião-dentista e gostaria de saber como funciona o envio de casos em fluxo digital para o Laboratório Rocha.',
    visita: 'Olá! Sou cirurgião-dentista e gostaria de combinar uma visita ao Laboratório Rocha.',
    trabalho: (nome: string) =>
      `Olá! Sou cirurgião-dentista e gostaria de conversar sobre ${nome} com o Laboratório Rocha.`,
  },

  /** Ordem de exibição na seção Trabalhos. */
  trabalhos: [
    {
      id: 'metaloceramica',
      nome: 'Metalocerâmica',
      categoria: 'Prótese fixa',
      descricao:
        'Infraestrutura metálica recoberta por cerâmica, para coroas unitárias e próteses fixas. Estrutura e cerâmica são trabalhadas por etapas, conforme o modelo e a prescrição do caso.',
      tags: ['Coroas', 'Próteses fixas'],
      foto: 'metaloceramica-ponte',
      fotoTamanho: [1080, 1080],
      fotoAlt: 'Prótese fixa metalocerâmica posicionada sobre modelo de gesso, segurada na mão.',
      confirmado: true,
    },
    {
      id: 'ceromero',
      nome: 'Coroa em cerômero',
      categoria: 'Prótese fixa',
      descricao:
        'Restauração indireta em cerômero, compósito processado em laboratório. Confeccionada a partir do modelo e da prescrição, com atenção à anatomia, aos pontos de contato e ao acabamento de superfície.',
      tags: ['Cerômero', 'Unitária'],
      foto: null,
      confirmado: true,
    },
    {
      // CONFIRMAR COM O LABORATÓRIO (consta na ficha do Google)
      id: 'emax',
      nome: 'Coroa E.max',
      categoria: 'Prótese fixa',
      descricao:
        'Coroa em cerâmica de dissilicato de lítio, confeccionada de acordo com a cor, a forma e as orientações registradas na prescrição do dentista.',
      tags: ['Dissilicato de lítio', 'Cerâmica'],
      foto: null,
      confirmado: false,
    },
    {
      id: 'enceramento',
      nome: 'Enceramento diagnóstico',
      categoria: 'Planejamento',
      descricao:
        'Reprodução em cera, sobre o modelo, da forma proposta para os dentes. Ajuda a visualizar o planejamento, a conversar com o paciente e a orientar as etapas seguintes.',
      tags: ['Cera', 'Planejamento'],
      foto: 'enceramento-diagnostico',
      fotoTamanho: [1080, 1080],
      fotoAlt: 'Enceramento diagnóstico em cera cinza nos dentes anteriores de um modelo de gesso.',
      confirmado: true,
    },
    {
      id: 'ppr',
      nome: 'Prótese parcial removível',
      categoria: 'Prótese removível',
      descricao:
        'PPR com estrutura metálica, base em resina e dentes de estoque, confeccionada sobre o modelo a partir do planejamento definido pelo dentista.',
      tags: ['PPR', 'Estrutura metálica'],
      foto: 'ppr-estrutura',
      fotoTamanho: [195, 139],
      fotoAlt: 'Prótese parcial removível superior com estrutura metálica e dentes em resina.',
      confirmado: true,
    },
    {
      id: 'protese-total',
      nome: 'Prótese total',
      categoria: 'Prótese removível',
      descricao:
        'Prótese total confeccionada por etapas, da base de prova à acrilização, com montagem de dentes guiada pelos registros e referências enviados pelo dentista.',
      tags: ['PT', 'Montagem de dentes'],
      foto: 'protese-total-modelo',
      fotoTamanho: [1080, 1080],
      fotoAlt: 'Par de próteses totais com gengiva em resina rosada, montadas sobre modelos de gesso.',
      confirmado: true,
    },
    {
      // CONFIRMAR COM O LABORATÓRIO (consta na ficha do Google)
      id: 'protocolo',
      nome: 'Protocolo sobre implantes',
      categoria: 'Sobre implantes',
      descricao:
        'Prótese fixa sobre implantes do tipo protocolo, confeccionada sobre o modelo de trabalho conforme o planejamento protético do caso.',
      tags: ['Implantes', 'Prótese fixa'],
      foto: 'protocolo-barra',
      fotoTamanho: [195, 163],
      fotoAlt: 'Prótese do tipo protocolo com barra metálica e dentes, vista pela face interna sobre o modelo.',
      confirmado: false,
    },
    {
      // CONFIRMAR COM O LABORATÓRIO (aparece em posts do Instagram)
      id: 'provisorios-impressos',
      nome: 'Provisórios impressos sobre implantes',
      categoria: 'Sobre implantes',
      descricao:
        'Provisórios produzidos por impressão a partir de planejamento digital, em casos selecionados e conforme combinado com o dentista.',
      tags: ['Impressão', 'Fluxo digital'],
      foto: null,
      confirmado: false,
    },
    {
      // CONFIRMAR COM O LABORATÓRIO (aparece em posts do Instagram)
      id: 'acabamento',
      nome: 'Glaze, finalização e estratificação de facetas',
      categoria: 'Acabamento',
      descricao:
        'Etapas finais da cerâmica: estratificação em camadas, caracterização e glaze, em busca de integração de cor e textura com o caso.',
      tags: ['Estratificação', 'Glaze'],
      foto: 'coroas-acabamento',
      fotoTamanho: [224, 298],
      fotoAlt: 'Coroas cerâmicas com acabamento brilhante, vistas de perfil sobre o modelo de gesso.',
      confirmado: false,
    },
  ] satisfies Trabalho[],
}

export type Config = typeof CONFIG
