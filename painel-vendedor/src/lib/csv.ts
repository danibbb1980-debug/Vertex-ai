/** CSV no padrão do Excel em português: separador ";" e BOM UTF-8. */
export function paraCSV(linhas: Record<string, unknown>[], colunas?: string[]): string {
  const cols = colunas ?? [...new Set(linhas.flatMap((l) => Object.keys(l)))]
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return ''
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return '﻿' + [cols.join(';'), ...linhas.map((l) => cols.map((c) => esc(l[c])).join(';'))].join('\r\n')
}

export function baixar(nome: string, conteudo: string) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
