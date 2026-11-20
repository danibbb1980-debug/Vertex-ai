export type Papel = 'admin' | 'vendedor'
export type Segmento = 'estetica' | 'odontologia' | 'advocacia' | 'outro'
export type Whatsapp = 'sim' | 'nao' | 'nao_sei'
export type RegistroTipo = 'CRO' | 'OAB' | 'outro'
export type ResultadoLigacao =
  | 'nao_atendeu'
  | 'recepcao'
  | 'reuniao_marcada'
  | 'retornar_depois'
  | 'sem_interesse'
  | 'nao_ligar_mais'
export type Formato = 'video' | 'presencial'
export type RascunhoStatus = 'aguardando_pacote' | 'em_producao' | 'pronto' | 'enviado'
export type ResultadoReuniao = 'fechou' | 'pediu_tempo' | 'recusou' | 'faltou' | 'remarcou'
export type FormaPagamento = 'pix' | 'cartao' | 'boleto' | 'outro'
export type StatusVenda = 'aguardando_aprovacao' | 'aguardando_pagamento' | 'paga' | 'cancelada'
export type StatusComissao = 'a_pagar' | 'paga'

export interface Profile {
  user_id: string
  nome: string
  papel: Papel
  ativo: boolean
  created_at: string
}

export interface Lead {
  id: string
  vendedor_id: string
  nome: string
  segmento: Segmento
  segmento_outro: string | null
  cidade: string | null
  uf: string | null
  telefone: string | null
  whatsapp: Whatsapp
  instagram: string | null
  maps_link: string | null
  registro_tipo: RegistroTipo | null
  registro_numero: string | null
  areas: string | null
  estilo: string | null
  nao_ligar: boolean
  ja_tem_site: boolean
  /** yyyy-MM-dd */
  retornar_em: string | null
  observacoes: string | null
  arquivado_em: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Ligacao {
  id: string
  lead_id: string
  vendedor_id: string
  data_hora: string
  resultado: ResultadoLigacao
  observacao: string | null
  deleted_at: string | null
  created_at: string
}

export interface Reuniao {
  id: string
  lead_id: string
  vendedor_id: string
  data_hora: string | null
  formato: Formato
  rascunho_status: RascunhoStatus
  rascunho_link: string | null
  resultado: ResultadoReuniao | null
  motivo_perda: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  /** calculado pela view reunioes_pacote */
  pacote_completo?: boolean
}

export interface Venda {
  id: string
  lead_id: string
  vendedor_id: string
  valor_combinado: number
  valor_fechado: number | null
  forma_pagamento: FormaPagamento
  parcelas: number
  status: StatusVenda
  data_pagamento: string | null
  observacao: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Comissao {
  id: string
  venda_id: string
  vendedor_id: string
  percentual: number
  base_calculo: number
  cancelada: boolean
  valor: number
  status: StatusComissao
  data_pagamento: string | null
  created_at: string
}

export interface Configuracoes {
  id: number
  percentual_comissao: number
  meta_ligacoes_dia: number | null
  preco_padrao: number
  preco_piso: number
}
