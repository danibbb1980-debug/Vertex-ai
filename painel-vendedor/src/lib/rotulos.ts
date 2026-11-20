import type {
  FormaPagamento, Formato, RascunhoStatus, ResultadoLigacao, ResultadoReuniao,
  Segmento, StatusRepasse, StatusVenda, Whatsapp,
} from './types'

export const SEGMENTOS: Record<Segmento, string> = {
  estetica: 'Estética',
  odontologia: 'Odontologia',
  advocacia: 'Advocacia',
  outro: 'Outro',
}

export const WHATSAPP: Record<Whatsapp, string> = { sim: 'Sim', nao: 'Não', nao_sei: 'Não sei' }

/** Ordem pensada para o polegar: o mais frequente primeiro. */
export const RESULTADOS_LIGACAO: { valor: ResultadoLigacao; rotulo: string }[] = [
  { valor: 'nao_atendeu', rotulo: 'Não atendeu' },
  { valor: 'recepcao', rotulo: 'Recepção' },
  { valor: 'reuniao_marcada', rotulo: 'Reunião marcada' },
  { valor: 'retornar_depois', rotulo: 'Retornar depois' },
  { valor: 'sem_interesse', rotulo: 'Sem interesse' },
  { valor: 'nao_ligar_mais', rotulo: 'Não ligar mais' },
]
export const RESULTADO_LIGACAO: Record<ResultadoLigacao, string> = Object.fromEntries(
  RESULTADOS_LIGACAO.map((r) => [r.valor, r.rotulo]),
) as Record<ResultadoLigacao, string>

export const FORMATOS: Record<Formato, string> = { video: 'Vídeo', presencial: 'Presencial' }

export const RASCUNHO_STATUS: Record<RascunhoStatus, string> = {
  aguardando_pacote: 'Aguardando pacote',
  em_producao: 'Em produção',
  pronto: 'Pronto',
  enviado: 'Enviado',
}

export const RESULTADO_REUNIAO: Record<ResultadoReuniao, string> = {
  fechou: 'Compareceu e fechou',
  pediu_tempo: 'Compareceu e pediu tempo',
  recusou: 'Compareceu e recusou',
  faltou: 'Faltou',
  remarcou: 'Remarcou',
}

export const FORMA_PAGAMENTO: Record<FormaPagamento, string> = {
  pix: 'Pix',
  cartao: 'Cartão',
  boleto: 'Boleto',
  outro: 'Outro',
}

export const STATUS_VENDA: Record<StatusVenda, string> = {
  aguardando_pagamento: 'Aguardando pagamento',
  paga: 'Paga',
  cancelada: 'Cancelada ou reembolsada',
}

export const STATUS_REPASSE: Record<StatusRepasse, string> = {
  a_pagar: 'Repasse a pagar',
  paga: 'Repasse pago',
  estornar: 'Estornar',
}
