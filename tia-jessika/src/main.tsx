import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/soft.css'
import '@fontsource-variable/fraunces/soft-italic.css'
import '@fontsource-variable/nunito-sans/wght.css'
import '@fontsource/caveat/latin-600.css'
import './index.css'
import App from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// Com "movimento reduzido" a árvore muda (versão estática), então renderiza do zero em vez de hidratar.
const reduzMov = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (root.hasChildNodes() && !reduzMov) hydrateRoot(root, app)
else createRoot(root).render(app)

// Rolagem suave (Lenis) somente sem "movimento reduzido" e em ponteiro fino (desktop).
const fino = window.matchMedia('(pointer: fine)').matches
if (!reduzMov && fino) {
  const iniciar = () =>
    Promise.all([import('lenis'), import('lenis/dist/lenis.css')]).then(([{ default: Lenis }]) => {
      const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -96 }, autoRaf: true })
      void lenis
    })
  if ('requestIdleCallback' in window) window.requestIdleCallback(iniciar, { timeout: 2500 })
  else setTimeout(iniciar, 1500)
}
