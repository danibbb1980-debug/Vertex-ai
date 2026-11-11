import { StrictMode } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import App from './App'

/** Árvore raiz compartilhada pelo navegador (main.tsx) e pela pré-renderização (entry-server.tsx). */
export function Root() {
  return (
    <StrictMode>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </LazyMotion>
    </StrictMode>
  )
}
