/** Os três mecanismos recorrentes: revelação por linha, quadradinho que se desenha e progresso da linha do tempo. */
export function iniciarEfeitos() {
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const alvos = document.querySelectorAll<HTMLElement>('[data-io]')
  if (reduz || !('IntersectionObserver' in window)) {
    alvos.forEach((el) => el.classList.add('is-in'))
  } else {
    const io = new IntersectionObserver(
      (ents) =>
        ents.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -12% 0px' },
    )
    alvos.forEach((el) => io.observe(el))
  }

  const linha = document.querySelector<HTMLElement>('[data-progresso]')
  if (!linha) return
  if (reduz) {
    linha.style.setProperty('--p', '1')
    return
  }
  let pendente = false
  const atualizar = () => {
    pendente = false
    const r = linha.getBoundingClientRect()
    const meio = window.innerHeight * 0.6
    const p = Math.min(1, Math.max(0, (meio - r.top) / r.height))
    linha.style.setProperty('--p', p.toFixed(3))
  }
  const agendar = () => {
    if (!pendente) {
      pendente = true
      requestAnimationFrame(atualizar)
    }
  }
  window.addEventListener('scroll', agendar, { passive: true })
  window.addEventListener('resize', agendar)
  atualizar()
}
