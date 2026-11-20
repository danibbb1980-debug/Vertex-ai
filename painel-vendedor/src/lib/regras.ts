/**
 * Regras de negócio puras (sem React, sem Supabase), cobertas por testes.
 * As regras de SEGURANÇA ficam no banco (supabase/schema.sql); aqui ficam
 * as regras de exibição e de fluxo do vendedor.
 */
import { diaSP, proximoDiaUtil } from './datas'
import type {
  Lead, Ligacao, ResultadoLigacao, Reuniao, StatusVenda, Venda,
} from './types'

// ---------------------------------------------------------------------
// Tentativas de ligação
// ---------------------------------------------------------------------
export const LIMITE_TENTATIVAS = 2

export interface StatusTentativas {
  /** ligações já registradas para o lead */
  feitas: number
  /** número da próxima tentativa */
  proxima: number
  /** aviso quando a próxima for a terceira (ou mais) */
  aviso: string | null
}

export function contarTentativas(ligacoes: Pick<Ligacao, 'lead_id' | 'deleted_at'>[], leadId: string): number {
  return ligacoes.filter((l) => l.lead_id === leadId && !l.deleted_at).length
}

export function statusTentativas(feitas: number): StatusTentativas {
  const proxima = feitas + 1
  return {
    feitas,
    proxima,
    aviso:
      proxima > LIMITE_TENTATIVAS
        ? `Esta seria a ${proxima}ª tentativa. Regra: duas tentativas por lead.`
        : null,
  }
}

/** Mapa lead_id → quantidade de ligações, para listas. */
export function mapaTentativas(ligacoes: Pick<Ligacao, 'lead_id' | 'deleted_at'>[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const l of ligacoes) {
    if (l.deleted_at) continue
    m.set(l.lead_id, (m.get(l.lead_id) ?? 0) + 1)
  }
  return m
}

/**
 * Data de retorno sugerida depois de uma ligação.
 * - não atendeu / recepção: próximo dia útil, enquanto não estourar as duas tentativas;
 * - retornar depois: a data escolhida (ou 2 dias úteis);
 * - reunião marcada, sem interesse, não ligar mais: sai da lista (null).
 */
export function proximoRetorno(
  resultado: ResultadoLigacao,
  hoje: string,
  tentativasDepois: number,
  dataEscolhida?: string | null,
): string | null {
  switch (resultado) {
    case 'nao_atendeu':
    case 'recepcao':
      return tentativasDepois < LIMITE_TENTATIVAS ? proximoDiaUtil(hoje) : null
    case 'retornar_depois':
      return dataEscolhida || proximoDiaUtil(hoje, 2)
    default:
      return null
  }
}

// ---------------------------------------------------------------------
// Pacote completo da reunião
// ---------------------------------------------------------------------
export interface ItemPacote {
  campo: string
  rotulo: string
  ok: boolean
}

const preenchido = (v: string | null | undefined) => !!v && v.trim().length > 0

export function registroExigido(segmento: Lead['segmento']): 'CRO' | 'OAB' | null {
  if (segmento === 'odontologia') return 'CRO'
  if (segmento === 'advocacia') return 'OAB'
  return null
}

/** Mesma regra da view `reunioes_pacote` no banco. */
export function checklistPacote(
  lead: Pick<Lead, 'nome' | 'segmento' | 'segmento_outro' | 'cidade' | 'maps_link' | 'instagram' | 'telefone' | 'registro_numero' | 'areas'>,
  reuniao: Pick<Reuniao, 'data_hora'> | null,
): ItemPacote[] {
  const itens: ItemPacote[] = [
    { campo: 'nome', rotulo: 'Nome', ok: preenchido(lead.nome) },
    {
      campo: 'segmento',
      rotulo: 'Segmento',
      ok: lead.segmento !== 'outro' || preenchido(lead.segmento_outro),
    },
    { campo: 'cidade', rotulo: 'Cidade', ok: preenchido(lead.cidade) },
    { campo: 'maps_link', rotulo: 'Google Maps', ok: preenchido(lead.maps_link) },
    { campo: 'instagram', rotulo: 'Instagram', ok: preenchido(lead.instagram) },
    { campo: 'telefone', rotulo: 'Telefone', ok: preenchido(lead.telefone) },
  ]
  const reg = registroExigido(lead.segmento)
  if (reg) itens.push({ campo: 'registro_numero', rotulo: reg, ok: preenchido(lead.registro_numero) })
  itens.push({ campo: 'areas', rotulo: 'Áreas ou atendimentos', ok: preenchido(lead.areas) })
  itens.push({ campo: 'data_hora', rotulo: 'Data e hora da reunião', ok: !!reuniao?.data_hora })
  return itens
}

export function pacoteCompleto(...args: Parameters<typeof checklistPacote>): boolean {
  return checklistPacote(...args).every((i) => i.ok)
}

// ---------------------------------------------------------------------
// Comissão
// ---------------------------------------------------------------------
/**
 * Valor da comissão em reais: percentual sobre a base líquida recebida
 * pelo Pedro, arredondado ao centavo. Venda cancelada/reembolsada = 0.
 * Venda que ainda não foi paga não gera comissão (null).
 */
export function calcularComissao(
  baseLiquida: number,
  percentual: number,
  statusVenda: StatusVenda,
): number | null {
  if (statusVenda === 'cancelada') return 0
  if (statusVenda !== 'paga') return null
  return Math.round(baseLiquida * percentual) / 100
}

// ---------------------------------------------------------------------
// Lista "Hoje"
// ---------------------------------------------------------------------
export function leadAtivo(l: Pick<Lead, 'nao_ligar' | 'arquivado_em' | 'deleted_at' | 'ja_tem_site'>): boolean {
  return !l.nao_ligar && !l.arquivado_em && !l.deleted_at && !l.ja_tem_site
}

/** Leads com retorno vencido ou de hoje, fora os "não ligar mais". Vencidos primeiro. */
export function listaHoje<T extends Pick<Lead, 'retornar_em' | 'nao_ligar' | 'arquivado_em' | 'deleted_at' | 'ja_tem_site' | 'nome'>>(
  leads: T[],
  hoje: string,
): T[] {
  return leads
    .filter((l) => leadAtivo(l) && !!l.retornar_em && l.retornar_em <= hoje)
    .sort((a, b) => (a.retornar_em! < b.retornar_em! ? -1 : a.retornar_em! > b.retornar_em! ? 1 : a.nome.localeCompare(b.nome, 'pt-BR')))
}

export function reunioesDoDia<T extends Pick<Reuniao, 'data_hora' | 'deleted_at'>>(reunioes: T[], hoje: string): T[] {
  return reunioes
    .filter((r) => !r.deleted_at && r.data_hora && diaSP(r.data_hora) === hoje)
    .sort((a, b) => a.data_hora!.localeCompare(b.data_hora!))
}

export interface Pendencia {
  reuniaoId: string
  leadNome: string
  dia: string | null
  faltando: string[]
}

/** Reuniões futuras (ou de hoje), sem resultado, com pacote incompleto. */
export function pendenciasPacote(
  reunioes: Pick<Reuniao, 'id' | 'lead_id' | 'data_hora' | 'resultado' | 'deleted_at'>[],
  leadsPorId: Map<string, Lead>,
  hoje: string,
): Pendencia[] {
  const out: Pendencia[] = []
  for (const r of reunioes) {
    if (r.deleted_at || r.resultado) continue
    if (r.data_hora && diaSP(r.data_hora) < hoje) continue
    const lead = leadsPorId.get(r.lead_id)
    if (!lead) continue
    const faltando = checklistPacote(lead, r).filter((i) => !i.ok).map((i) => i.rotulo)
    if (faltando.length) {
      out.push({ reuniaoId: r.id, leadNome: lead.nome, dia: r.data_hora ? diaSP(r.data_hora) : null, faltando })
    }
  }
  return out.sort((a, b) => (a.dia ?? '9999').localeCompare(b.dia ?? '9999'))
}

// ---------------------------------------------------------------------
// Funil
// ---------------------------------------------------------------------
export interface Periodo {
  /** yyyy-MM-dd inclusive */
  inicio: string
  /** yyyy-MM-dd inclusive */
  fim: string
}

export interface EtapaFunil {
  chave: 'ligacoes' | 'atendidas' | 'reunioes' | 'comparecimentos' | 'vendas'
  rotulo: string
  total: number
  /** taxa em relação à etapa anterior (0–1), null na primeira ou com anterior 0 */
  taxa: number | null
}

const noPeriodo = (dia: string, p: Periodo) => dia >= p.inicio && dia <= p.fim

export function calcularFunil(
  ligacoes: Pick<Ligacao, 'data_hora' | 'resultado' | 'deleted_at'>[],
  reunioes: Pick<Reuniao, 'created_at' | 'data_hora' | 'resultado' | 'deleted_at'>[],
  vendas: Pick<Venda, 'status' | 'data_pagamento' | 'deleted_at'>[],
  p: Periodo,
): EtapaFunil[] {
  const ligs = ligacoes.filter((l) => !l.deleted_at && noPeriodo(diaSP(l.data_hora), p))
  const atendidas = ligs.filter((l) => l.resultado !== 'nao_atendeu')
  const marcadas = reunioes.filter((r) => !r.deleted_at && noPeriodo(diaSP(r.created_at), p))
  const compareceu = reunioes.filter(
    (r) =>
      !r.deleted_at &&
      r.data_hora &&
      noPeriodo(diaSP(r.data_hora), p) &&
      (r.resultado === 'fechou' || r.resultado === 'pediu_tempo' || r.resultado === 'recusou'),
  )
  const pagas = vendas.filter((v) => !v.deleted_at && v.status === 'paga' && v.data_pagamento && noPeriodo(v.data_pagamento, p))

  const totais: [EtapaFunil['chave'], string, number][] = [
    ['ligacoes', 'Ligações', ligs.length],
    ['atendidas', 'Atendidas', atendidas.length],
    ['reunioes', 'Reuniões marcadas', marcadas.length],
    ['comparecimentos', 'Comparecimentos', compareceu.length],
    ['vendas', 'Vendas pagas', pagas.length],
  ]
  return totais.map(([chave, rotulo, total], i) => {
    const anterior = i === 0 ? null : totais[i - 1][2]
    return { chave, rotulo, total, taxa: anterior ? total / anterior : null }
  })
}

export interface MotivoPerda {
  motivo: string
  vezes: number
}

/** Motivos de perda mais citados, agrupando textos iguais (sem diferenciar maiúsculas/acentos). */
export function motivosDePerda(
  reunioes: Pick<Reuniao, 'motivo_perda' | 'data_hora' | 'deleted_at'>[],
  p: Periodo,
  limite = 5,
): MotivoPerda[] {
  const grupos = new Map<string, MotivoPerda>()
  for (const r of reunioes) {
    if (r.deleted_at || !r.motivo_perda?.trim()) continue
    if (r.data_hora && !noPeriodo(diaSP(r.data_hora), p)) continue
    const texto = r.motivo_perda.trim().replace(/\s+/g, ' ')
    const chave = texto.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.!]+$/, '')
    const g = grupos.get(chave)
    if (g) g.vezes++
    else grupos.set(chave, { motivo: texto, vezes: 1 })
  }
  return [...grupos.values()].sort((a, b) => b.vezes - a.vezes || a.motivo.localeCompare(b.motivo, 'pt-BR')).slice(0, limite)
}

// ---------------------------------------------------------------------
// Texto "Copiar pacote para o Pedro"
// ---------------------------------------------------------------------
export function textoPacote(lead: Lead, reuniao: Reuniao, fmt: {
  segmento: string
  dataHora: string
  formato: string
  whatsapp: string
}): string {
  const linha = (rotulo: string, valor: string | null | undefined) => `*${rotulo}:* ${valor?.trim() ? valor.trim() : '(falta)'}`
  const reg = registroExigido(lead.segmento)
  const local = [lead.cidade, lead.uf].filter(Boolean).join(' - ')
  const linhas = [
    `Pacote para rascunho · ${lead.nome}`,
    '',
    linha('Nome', lead.nome),
    linha('Segmento', fmt.segmento),
    linha('Cidade', local),
    linha('Telefone', lead.telefone),
    `*WhatsApp:* ${fmt.whatsapp}`,
    linha('Instagram', lead.instagram),
    linha('Google Maps', lead.maps_link),
  ]
  if (reg || lead.registro_numero) {
    linhas.push(linha(lead.registro_tipo ?? reg ?? 'Registro', lead.registro_numero))
  }
  linhas.push(linha('Áreas ou atendimentos', lead.areas))
  if (lead.estilo?.trim()) linhas.push(linha('Cor ou estilo', lead.estilo))
  linhas.push(linha('Reunião', reuniao.data_hora ? `${fmt.dataHora} (${fmt.formato})` : null))
  if (lead.observacoes?.trim()) linhas.push('', `*Observações:* ${lead.observacoes.trim()}`)
  return linhas.join('\n')
}

// ---------------------------------------------------------------------
// Somas por mês (comissão)
// ---------------------------------------------------------------------
export interface ResumoMes {
  mes: string // yyyy-MM
  aReceber: number
  recebida: number
}

export function comissaoPorMes(
  comissoes: { valor: number; status: 'a_pagar' | 'paga'; data_pagamento: string | null; created_at: string; cancelada: boolean }[],
): ResumoMes[] {
  const m = new Map<string, ResumoMes>()
  for (const c of comissoes) {
    if (c.cancelada) continue
    const mes = (c.status === 'paga' && c.data_pagamento ? c.data_pagamento : diaSP(c.created_at)).slice(0, 7)
    const r = m.get(mes) ?? { mes, aReceber: 0, recebida: 0 }
    if (c.status === 'paga') r.recebida = Math.round((r.recebida + Number(c.valor)) * 100) / 100
    else r.aReceber = Math.round((r.aReceber + Number(c.valor)) * 100) / 100
    m.set(mes, r)
  }
  return [...m.values()].sort((a, b) => b.mes.localeCompare(a.mes))
}
