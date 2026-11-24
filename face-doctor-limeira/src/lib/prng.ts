/** Gerador determinístico (mulberry32): o reflexo do hero é sempre o mesmo. */
export const mulberry32 = (semente: number) => () => {
  semente |= 0
  semente = (semente + 0x6d2b79f5) | 0
  let t = Math.imul(semente ^ (semente >>> 15), 1 | semente)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/** Pesos entre 200 e 800, nenhum igual ao vizinho (diferença mínima de 90). */
export const pesosSorteados = (quantidade: number, semente = 1984) => {
  const r = mulberry32(semente)
  const out: number[] = []
  for (let i = 0; i < quantidade; i++) {
    let w = 0
    do {
      w = Math.round((200 + r() * 600) / 10) * 10
    } while (i > 0 && Math.abs(w - out[i - 1]) < 90)
    out.push(w)
  }
  return out
}
