import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { QuizContexto } from './quizContexto'
import { useLenis } from './motion/useLenis'
import { config } from './config'
import { Header } from './components/Header'
import { ProgressoLeitura } from './components/ProgressoLeitura'
import { Hero } from './components/Hero'
import { Conceito } from './components/Conceito'
import { Vitrine } from './components/Vitrine'
import { ProcessoPilha } from './components/ProcessoPilha'
import { SeletorDispositivo } from './components/SeletorDispositivo'
import { Servicos } from './components/Servicos'
import { Metodo } from './components/Metodo'
import { CardCTA } from './components/CardCTA'
import { Sobre } from './components/Sobre'
import { Rodape } from './components/Rodape'

const Quiz = lazy(() => import('./components/quiz/Quiz'))
const carregarRecursos = () => import('./motion/features').then((r) => r.default)

export function App() {
  useLenis()
  const [quizAberto, setQuizAberto] = useState(false)
  const gatilho = useRef<HTMLElement | null>(null)

  const abrirQuiz = useCallback((el: HTMLElement | null) => {
    gatilho.current = el
    setQuizAberto(true)
  }, [])

  const fecharQuiz = useCallback(() => {
    setQuizAberto(false)
    gatilho.current?.focus()
  }, [])

  return (
    <LazyMotion features={carregarRecursos} strict>
      <MotionConfig reducedMotion="user">
        <QuizContexto.Provider value={abrirQuiz}>
          {config.site.rascunho && <div className="faixa-rascunho">Rascunho para avaliação</div>}
          <a className="pular" href="#conteudo">
            Pular para o conteúdo
          </a>
          <Header />
          <ProgressoLeitura />
          <main id="conteudo">
            <Hero />
            <Conceito />
            <Vitrine />
            <ProcessoPilha />
            <SeletorDispositivo />
            <Servicos />
            <Metodo />
            <CardCTA />
            <Sobre />
          </main>
          <Rodape />
          {quizAberto && (
            <Suspense fallback={null}>
              <Quiz onFechar={fecharQuiz} />
            </Suspense>
          )}
        </QuizContexto.Provider>
      </MotionConfig>
    </LazyMotion>
  )
}
