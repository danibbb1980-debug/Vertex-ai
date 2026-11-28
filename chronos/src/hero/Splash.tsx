// Splash "forjando" o nome, portado do ForgeSplash: cada letra cai com um golpe, o anel cai por último,
// e a palavra voa até o logo do header. Sem fogo: branco, acento do logo, branco-osso.
import { useEffect, useRef, useState } from 'react'
import { HERO_CONFIG } from '../config'
import { Wordmark, useOpening } from '../ui'

const STRIKE = 0.42
const RING_DROP = 0.48
const SP = HERO_CONFIG.splash
const COOLING = ['#FFFFFF', HERO_CONFIG.theme.accent, HERO_CONFIG.theme.ink]
const N = 7

const strikeAt = (i: number) => SP.firstStrike + i * SP.strikeEvery
const impactAt = (i: number) => strikeAt(i) + STRIKE * 0.35
const RING_AT = strikeAt(N) + 0.06
const RING_IMPACT = RING_AT + RING_DROP
const HANDOFF_AT = RING_IMPACT + SP.hold

const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

type Stage = 'dark' | 'forge' | 'handoff' | 'skip' | 'done'

export default function Splash() {
  const { open } = useOpening()
  const [stage, setStage] = useState<Stage>('dark')
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const html = document.documentElement
    const cover = document.querySelector('.splash-cover')
    const timers: number[] = []
    const later = (s: number, fn: () => void) => timers.push(window.setTimeout(fn, s * 1000))
    let cancelled = false
    let handed = false

    if (doneRef.current) return
    const finish = () => {
      html.removeAttribute('data-splash')
      setStage('done')
    }
    const openHero = () => {
      if (doneRef.current) return
      doneRef.current = true
      open()
    }

    if (!SP.enabled || html.hasAttribute('data-nosplash')) {
      cover?.remove()
      openHero()
      finish()
      return
    }

    html.setAttribute('data-splash', 'on')
    cover?.remove()

    const word = wordRef.current
    const frame = frameRef.current
    const letters = word ? Array.from(word.querySelectorAll<HTMLElement>('.wm-g')) : []
    const ring = word?.querySelector<SVGElement>('.wm-ring')
    const anims: Animation[] = []

    const jolt = (px: number) => {
      frame?.animate(
        [{ transform: 'translateX(0)' }, { transform: `translateX(${-px}px)` }, { transform: `translateX(${px * 0.6}px)` }, { transform: 'translateX(0)' }],
        { duration: 160 }
      )
    }

    // Filetes de luz fria: traços de 1 px que saem do golpe e somem em 0,4 s
    const filetes = (host: HTMLElement, seed: number) => {
      for (let i = 0; i < SP.filetes; i++) {
        const el = document.createElement('span')
        el.className = 'splash-filete'
        const ang = -Math.PI * (0.12 + 0.76 * rand(seed * 31 + i))
        const len = 10 + 8 * rand(seed * 7 + i)
        const dist = 26 + 30 * rand(seed * 13 + i)
        el.style.height = `${len}px`
        el.style.rotate = `${(ang * 180) / Math.PI + 90}deg`
        host.appendChild(el)
        const dx = Math.cos(ang) * dist
        const dy = Math.sin(ang) * dist
        el.animate(
          [
            { opacity: 0, transform: 'translate(0,0)' },
            { opacity: 0.9, transform: `translate(${dx * 0.3}px, ${dy * 0.3}px)`, offset: 0.15 },
            { opacity: 0, transform: `translate(${dx}px, ${dy}px)` }
          ],
          { duration: 400, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }
        ).onfinish = () => el.remove()
      }
    }

    const begin = () => {
      setStage('forge')
      letters.forEach((g, i) => {
        anims.push(
          g.animate(
            [
              { opacity: 0, transform: 'translateY(-0.32em) scale(0.94, 1.1)' },
              { opacity: 1, transform: 'translateY(0) scale(1.14, 0.82)', offset: 0.35 },
              { opacity: 1, transform: 'translateY(0) scale(1, 1)' }
            ],
            { duration: STRIKE * 1000, delay: strikeAt(i) * 1000, easing: 'ease-out', fill: 'both' }
          ),
          g.animate(
            COOLING.map(color => ({ color })),
            { duration: 1100, delay: (strikeAt(i) + 0.1) * 1000, fill: 'both' }
          )
        )
        later(impactAt(i), () => {
          jolt(2)
          const host = g.parentElement
          if (host) filetes(host, i + 1)
        })
      })
      if (ring) {
        anims.push(
          ring.animate(
            [
              { opacity: 0, transform: 'translate(-50%, -50%) translateY(-1.4em) rotate(0deg)' },
              { opacity: 1, transform: 'translate(-50%, -50%) translateY(0) rotate(0deg)', offset: 0.6 },
              { opacity: 1, transform: 'translate(-50%, -50%) translateY(0) rotate(0deg)', offset: 0.75 },
              { opacity: 1, transform: 'translate(-50%, -50%) translateY(0) rotate(7.5deg)' }
            ],
            { duration: (RING_DROP + 0.32) * 1000, delay: RING_AT * 1000, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'both' }
          )
        )
      }
      later(RING_IMPACT, () => jolt(3))
      later(HANDOFF_AT, handoff)
    }

    const handoff = () => {
      if (handed) return
      handed = true
      setStage('handoff')
      openHero()
      try {
        sessionStorage.setItem(SP.storageKey, '1')
      } catch {
        /* armazenamento bloqueado: o splash só volta na próxima visita */
      }
      const logo = document.querySelector<HTMLElement>('.site-header .fg-logo')
      if (!word || !logo) {
        later(0.4, finish)
        return
      }
      const from = word.getBoundingClientRect()
      const to = logo.getBoundingClientRect()
      const s = to.height / from.height
      word.animate(
        [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${s})` }],
        { duration: SP.flight * 1000, easing: 'cubic-bezier(0.7,0,0.2,1)', fill: 'forwards' }
      ).onfinish = finish
    }

    let started = false
    const start = () => {
      if (started || cancelled) return
      started = true
      begin()
    }
    document.fonts.ready.then(() => start())
    later(0.7, start)

    const skip = () => {
      if (handed) return
      handed = true
      started = true
      timers.forEach(t => window.clearTimeout(t))
      timers.length = 0
      anims.forEach(a => a.finish())
      setStage('skip')
      openHero()
      try {
        sessionStorage.setItem(SP.storageKey, '1')
      } catch {
        /* ignorado */
      }
      later(0.35, finish)
    }
    const root = rootRef.current
    window.addEventListener('keydown', skip, { once: true })
    root?.addEventListener('pointerdown', skip, { once: true })

    return () => {
      cancelled = true
      timers.forEach(t => window.clearTimeout(t))
      window.removeEventListener('keydown', skip)
      root?.removeEventListener('pointerdown', skip)
      html.removeAttribute('data-splash')
    }
  }, [open])

  if (stage === 'done') return null

  return (
    <div ref={rootRef} className='splash' data-stage={stage} aria-hidden='true'>
      <div className='splash-bg' />
      <div ref={frameRef} className='splash-frame'>
        <div ref={wordRef} className='splash-word'>
          <Wordmark className='splash-wm' />
          <span className='splash-anvil' />
        </div>
        <p className='splash-label'>Estética automotiva</p>
      </div>
      <button type='button' className='splash-skip' tabIndex={-1}>
        Pular
      </button>
    </div>
  )
}
