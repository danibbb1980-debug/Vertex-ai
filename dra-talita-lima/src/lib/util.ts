import { CONFIG, type DiaHorario } from '../config'

/** Link wa.me com mensagem codificada. */
export function linkWhatsApp(mensagem: string = CONFIG.mensagens.geral): string {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function mensagemAtendimento(nome: string): string {
  return CONFIG.mensagens.porAtendimento.replace('{atendimento}', nome)
}

/** "08:00" -> "08h00" */
export function hora(h: string): string {
  return h.replace(':', 'h')
}

export function minutos(h: string): number {
  const [hh, mm] = h.split(':').map(Number)
  return hh * 60 + mm
}

export function hhmm(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
}

export function horarioDoDia(dia: number): DiaHorario | undefined {
  return CONFIG.horarios.find((h) => h.dia === dia && h.periodos.length > 0)
}

/** Blocos de N minutos que terminam dentro de cada período (exclui almoço e fechamento). */
export function blocosDoDia(dia: number, duracao = CONFIG.agendamento.duracaoBlocoMin): string[] {
  const h = horarioDoDia(dia)
  if (!h) return []
  const blocos: string[] = []
  for (const p of h.periodos) {
    for (let t = minutos(p.inicio); t + duracao <= minutos(p.fim); t += duracao) blocos.push(hhmm(t))
  }
  return blocos
}

export const endereco = CONFIG.endereco
export const enderecoLinha1 = [endereco.logradouro, endereco.complemento].filter(Boolean).join(', ')
export const enderecoLinha2 = `${endereco.cidade} - ${endereco.uf}`
export const enderecoCompleto = [endereco.predio, enderecoLinha1, enderecoLinha2].filter(Boolean).join(', ')

const NOMES_CURTOS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

/** Agrupa dias com os mesmos períodos: [{ dias: 'Segunda a sexta', periodos }] e dias fechados. */
export function resumoHorarios() {
  const grupos: { dias: number[]; chave: string; periodos: DiaHorario['periodos'] }[] = []
  for (const h of [...CONFIG.horarios].sort((a, b) => a.dia - b.dia)) {
    if (!h.periodos.length) continue
    const chave = h.periodos.map((p) => p.inicio + p.fim).join('|')
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.chave === chave && ultimo.dias[ultimo.dias.length - 1] === h.dia - 1) ultimo.dias.push(h.dia)
    else grupos.push({ dias: [h.dia], chave, periodos: h.periodos })
  }
  const abertos = new Set(grupos.flatMap((g) => g.dias))
  const fechados = [6, 0].filter((d) => !abertos.has(d)).concat([1, 2, 3, 4, 5].filter((d) => !abertos.has(d)))
  const nomeGrupo = (dias: number[]) => {
    const a = NOMES_CURTOS[dias[0]]
    const cap = a.charAt(0).toUpperCase() + a.slice(1)
    return dias.length === 1 ? cap : `${cap} a ${NOMES_CURTOS[dias[dias.length - 1]]}`
  }
  const nomeFechados = fechados.map((d, i) => (i === 0 ? NOMES_CURTOS[d].charAt(0).toUpperCase() + NOMES_CURTOS[d].slice(1) : NOMES_CURTOS[d]))
  return {
    grupos: grupos.map((g) => ({ dias: nomeGrupo(g.dias), periodos: g.periodos })),
    fechados: nomeFechados.length ? nomeFechados.join(' e ') : '',
    pausas: grupos.flatMap((g) =>
      g.periodos.slice(1).map((p, i) => ({ inicio: g.periodos[i].fim, fim: p.inicio })),
    ),
  }
}

export function textoHorarios(): string {
  const r = resumoHorarios()
  const partes = r.grupos.map(
    (g) => `${g.dias}, ${g.periodos.map((p) => `das ${hora(p.inicio)} às ${hora(p.fim)}`).join(' e ')}`,
  )
  let t = partes.join('. ') + '.'
  if (r.fechados) t += ` ${r.fechados}, fechado.`
  if (CONFIG.avisoFeriados) t += ` ${CONFIG.avisoFeriados}`
  return t
}

export function preencherTokens(t: string): string {
  return t
    .replace('{telefone}', CONFIG.telefone)
    .replace('{horarios}', textoHorarios())
    .replace('{endereco}', `${enderecoCompleto}`)
}

export const temTexto = (v: unknown): boolean => typeof v === 'string' && v.trim().length > 0
