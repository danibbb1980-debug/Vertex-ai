import { hydrateRoot, createRoot } from 'react-dom/client'
import '@fontsource-variable/manrope/wght.css'
import './index.css'
import App from './App'
import { iniciarRevelacoes } from './lib/rolagem'

const root = document.getElementById('root')!
if (root.hasChildNodes()) hydrateRoot(root, <App />)
else createRoot(root).render(<App />)
requestAnimationFrame(iniciarRevelacoes)

// Rolagem suave só em desktop com mouse e sem preferência por movimento reduzido.
const podeSuavizar =
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.matchMedia('(pointer: fine)').matches

if (podeSuavizar) {
  const iniciar = () =>
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({ duration: 1.1, anchors: { offset: -88 } })
      const raf = (t: number) => {
        lenis.raf(t)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    })
  if ('requestIdleCallback' in window) requestIdleCallback(() => void iniciar(), { timeout: 2500 })
  else setTimeout(() => void iniciar(), 1500)
}
