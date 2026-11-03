// Efeitos de rolagem sem biblioteca: revelações, parallax do símbolo e progresso da linha do tempo.
// Só altera transform/opacity (via classes e variáveis CSS) e pausa fora da tela.

export function iniciarEfeitos() {
  ;(window as unknown as { __efeitos: boolean }).__efeitos = true
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const alvos = document.querySelectorAll<HTMLElement>('[data-revela], [data-revela-palavras]')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add('visivel')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    alvos.forEach((el) => io.observe(el))
  } else {
    alvos.forEach((el) => el.classList.add('visivel'))
  }

  if (reduzir) return

  // parallax leve do símbolo no hero e progresso da linha do tempo
  const parallax = document.querySelector<HTMLElement>('[data-parallax]')
  const linha = document.querySelector<HTMLElement>('[data-progresso]')
  const barra = linha?.querySelector<HTMLElement>('[data-progresso-barra]')
  let pedido = 0
  const atualizar = () => {
    pedido = 0
    const vh = window.innerHeight
    if (parallax) {
      const r = parallax.getBoundingClientRect()
      if (r.bottom > 0) {
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height + 200)))
        parallax.style.setProperty('--rolagem', p.toFixed(3))
      }
    }
    if (linha && barra) {
      const r = linha.getBoundingClientRect()
      if (r.top < vh && r.bottom > 0) {
        const inicio = vh * 0.7
        const fim = vh * 0.55
        const p = Math.min(1, Math.max(0, (inicio - r.top) / Math.max(1, r.height - (inicio - fim))))
        barra.style.transform = `scaleY(${p.toFixed(3)})`
      }
    }
  }
  window.addEventListener('scroll', () => {
    if (!pedido) pedido = requestAnimationFrame(atualizar)
  }, { passive: true })
  atualizar()
}
