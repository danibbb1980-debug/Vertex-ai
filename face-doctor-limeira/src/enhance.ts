/**
 * Camada de movimento. Carregada depois da hidratação, fora do caminho crítico.
 * Mecanismos: (A) títulos por linha com máscara, (B) filete nas linhas (só CSS),
 * (C) números que ganham peso. + assinatura do hero e progresso da linha do tempo.
 */
import { CONFIG } from './config'
import { agoraNaClinica } from './lib/horarios'

const reduz = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function revelar() {
  const alvos = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (reduz() || !('IntersectionObserver' in window)) {
    alvos.forEach((a) => a.classList.add('is-in'))
    return
  }
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
  document.documentElement.classList.add('mov')
  alvos.forEach((a) => {
    // o que já está visível na carga não anima de novo
    const r = a.getBoundingClientRect()
    if (r.top < innerHeight * 0.88 && r.bottom > 0) a.classList.add('is-in', 'sem-transicao')
    else io.observe(a)
  })
  requestAnimationFrame(() => document.querySelectorAll('.sem-transicao').forEach((a) => a.classList.remove('sem-transicao')))
}

/** Assinatura: o reflexo migra, letra a letra, para pesos próprios. */
function espelho() {
  const raiz = document.querySelector<HTMLElement>('.espelho')
  if (!raiz) return
  const fontes = (document as Document & { fonts?: FontFaceSet }).fonts
  const pronto = fontes ? Promise.race([fontes.ready, new Promise((r) => setTimeout(r, 2500))]) : Promise.resolve()
  pronto.then(() => {
    const letras = raiz.querySelectorAll<HTMLElement>('.l')
    // mede uma vez, no peso do título, e trava a largura em em (escala com a fonte)
    const fs = parseFloat(getComputedStyle(raiz).fontSize)
    const larguras = Array.from(letras, (l) => l.getBoundingClientRect().width / fs)
    letras.forEach((l, i) => (l.style.width = `${larguras[i]}em`))
    raiz.classList.add('is-medido')
    requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.add('is-on')))
  })
}

/** Marca o dia de hoje (fuso da clínica) na lista de horários. */
function hoje() {
  const { dia } = agoraNaClinica()
  document.querySelectorAll<HTMLElement>('.hor-linha').forEach((l) => {
    const dias = (l.dataset.dias ?? '').split(',').map(Number)
    if (dias.includes(dia)) {
      l.classList.add('is-hoje')
      l.querySelector<HTMLElement>('.hor-hoje')?.removeAttribute('hidden')
    }
  })
}

/** Barra/botão de agendamento: some enquanto o hero ou o formulário estão na tela. */
function fixo() {
  const el = document.querySelector<HTMLElement>('[data-fixo]')
  if (!el || !('IntersectionObserver' in window)) return
  const vistos = new Set<Element>()
  const alvos = ['.hero', '#agendar', '.cta', '.rod'].map((s) => document.querySelector(s)).filter(Boolean) as Element[]
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => (e.isIntersecting ? vistos.add(e.target) : vistos.delete(e.target)))
    el.classList.toggle('is-visivel', vistos.size === 0)
  })
  alvos.forEach((a) => io.observe(a))
}

/** Progresso da linha do tempo (motion: scroll ligado à rolagem). */
async function linhaDoTempo() {
  const lista = document.querySelector<HTMLElement>('[data-progresso]')
  const cheio = lista?.querySelector<HTMLElement>('.como-trilho-cheio')
  if (!lista || !cheio) return
  if (reduz()) {
    cheio.style.transform = 'scaleY(1)'
    return
  }
  const { scroll } = await import('motion')
  scroll(
    (p: number) => {
      cheio.style.transform = `scaleY(${p.toFixed(4)})`
    },
    { target: lista, offset: ['start 70%', 'end 55%'] },
  )
}

/** Rolagem suave só no desktop com ponteiro fino. */
async function rolagemSuave() {
  if (reduz() || !matchMedia('(pointer: fine) and (min-width: 64rem)').matches) return
  const { default: Lenis } = await import('lenis')
  const lenis = new Lenis({ anchors: { offset: -96 }, lerp: 0.12 })
  const quadro = (t: number) => {
    lenis.raf(t)
    requestAnimationFrame(quadro)
  }
  requestAnimationFrame(quadro)
}

function intro() {
  if (!CONFIG.intro || reduz()) return
  try {
    if (sessionStorage.getItem('fd-intro')) return
    sessionStorage.setItem('fd-intro', '1')
  } catch {
    /* sem storage: mostra mesmo assim */
  }
  const c = document.createElement('div')
  c.className = 'intro'
  c.setAttribute('aria-hidden', 'true')
  c.innerHTML = `<span class="intro-nome">${CONFIG.nomeCurto}</span>`
  const sair = () => c.classList.add('is-saindo')
  c.addEventListener('click', sair)
  addEventListener('keydown', sair, { once: true })
  c.addEventListener('animationend', (e) => e.animationName === 'intro-sai' && c.remove())
  document.body.append(c)
  setTimeout(sair, 700)
}

export function iniciar() {
  intro()
  revelar()
  espelho()
  hoje()
  fixo()
  const ocioso = (fn: () => void) =>
    'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 600)
  ocioso(() => {
    linhaDoTempo()
    rolagemSuave()
  })
}
