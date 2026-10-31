/**
 * Movimento leve, sem biblioteca:
 * - [data-reveal]: ganha .is-in ao entrar na viewport (CSS anima opacity/transform).
 * - [data-giro]: gira conforme a rolagem (só enquanto visível).
 * - [data-progresso]: linha da "Como funciona" preenche conforme a rolagem.
 * - [data-pausavel]: marquee pausado fora da viewport.
 * Tudo respeita prefers-reduced-motion.
 */
export function iniciarEfeitos() {
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const revelar = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          revelar.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  document.querySelectorAll('[data-reveal]').forEach((el) => revelar.observe(el))

  const pausaveis = new IntersectionObserver((entradas) => {
    for (const e of entradas) (e.target as HTMLElement).dataset.paused = String(!e.isIntersecting)
  })
  document.querySelectorAll('[data-pausavel]').forEach((el) => pausaveis.observe(el))

  if (reduz) return

  const ativos = new Set<HTMLElement>()
  const rolagem = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      const el = e.target as HTMLElement
      if (e.isIntersecting) ativos.add(el)
      else ativos.delete(el)
    }
    agendar()
  })
  document.querySelectorAll<HTMLElement>('[data-giro],[data-progresso-alvo]').forEach((el) => rolagem.observe(el))

  const clamp = (n: number) => Math.min(1, Math.max(0, n))
  let pendente = false
  function agendar() {
    if (pendente || !ativos.size) return
    pendente = true
    requestAnimationFrame(atualizar)
  }
  function atualizar() {
    pendente = false
    const vh = window.innerHeight
    for (const el of ativos) {
      const r = el.getBoundingClientRect()
      if (el.dataset.giro !== undefined) {
        const p = clamp(-r.top / r.height)
        el.style.transform = `rotate(${(p * Number(el.dataset.giro || 50)).toFixed(2)}deg)`
      } else {
        // começa quando o topo chega a 75% da tela e termina quando o fim chega a 55%
        const p = clamp((0.75 * vh - r.top) / (0.2 * vh + r.height))
        const barra = el.querySelector<HTMLElement>('[data-progresso]')
        if (barra) barra.style.transform = `scaleY(${p.toFixed(4)})`
      }
    }
  }
  window.addEventListener('scroll', agendar, { passive: true })
  window.addEventListener('resize', agendar, { passive: true })
}
