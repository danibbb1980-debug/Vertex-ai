const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const pct = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** R$ 1.234,56 (com espaço comum, não o espaço fino do Intl). */
export function fmtMoeda(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return '—'
  return brl.format(valor).replace(/ /g, ' ')
}

export function fmtPct(fracao: number | null): string {
  if (fracao === null || !Number.isFinite(fracao)) return '—'
  return `${pct.format(fracao * 100)}%`
}

/** Aceita "1.234,56", "1234,56" ou "1234.56". */
export function lerMoeda(texto: string): number | null {
  const limpo = texto.replace(/[R$\s]/g, '')
  if (!limpo) return null
  const normal = limpo.includes(',') ? limpo.replace(/\./g, '').replace(',', '.') : limpo
  const n = Number(normal)
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null
}

/** Só dígitos, com 55 na frente quando faltar, para tel: e wa.me. */
export function telefoneE164(tel: string | null | undefined): string | null {
  if (!tel) return null
  const d = tel.replace(/\D/g, '')
  if (d.length < 8) return null
  if (d.startsWith('55') && d.length >= 12) return `+${d}`
  return `+55${d}`
}

export function instagramUrl(ig: string | null | undefined): string | null {
  if (!ig) return null
  const t = ig.trim()
  if (/^https?:\/\//i.test(t)) return t
  return `https://instagram.com/${t.replace(/^@/, '')}`
}
