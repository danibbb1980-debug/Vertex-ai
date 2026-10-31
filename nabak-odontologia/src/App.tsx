import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { Suspense, lazy, startTransition, useEffect, useState } from 'react'
import { CONFIG } from './config'
import { DraftBar, Header, WhatsAppFixed } from './components/Chrome'
import { Marquee } from './components/motion'
import { Hero } from './sections/Hero'

const Below = lazy(() => import('./Below'))

export function App() {
  const s = CONFIG.secoes
  const [pronto, setPronto] = useState(false)

  // renderiza o restante da página depois da primeira pintura, sem travar a thread principal
  useEffect(() => {
    const go = () => startTransition(() => setPronto(true))
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(go, { timeout: 1200 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(go, 200)
    return () => clearTimeout(id)
  }, [])

  // se a página abriu com âncora (#agendar etc.), rola até ela quando a seção existir
  useEffect(() => {
    if (!pronto || !location.hash) return
    const t = window.setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 300)
    return () => window.clearTimeout(t)
  }, [pronto])

  const palavras = [
    ...CONFIG.atendimentos.map((a) => a.nome),
    'Planejamento individual',
    'Hora marcada',
    'Ambiente acessível',
    `${CONFIG.cidade} - ${CONFIG.uf}`,
  ]

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <DraftBar />
        <Header />
        <main id="conteudo">
          <Hero />
          {s.marquee && (
            <div className="border-y border-line bg-paper py-6" aria-label="Destaques da clínica">
              <Marquee>
                {palavras.map((p) => (
                  <span key={p} className="whitespace-nowrap font-serif text-[1.5rem] italic text-espresso/70 md:text-[1.75rem]">
                    {p}
                  </span>
                ))}
              </Marquee>
            </div>
          )}
          {pronto && (
            <Suspense fallback={null}>
              <Below main />
            </Suspense>
          )}
        </main>
        {pronto && (
          <Suspense fallback={null}>
            <Below main={false} />
          </Suspense>
        )}
        <WhatsAppFixed />
      </MotionConfig>
    </LazyMotion>
  )
}
