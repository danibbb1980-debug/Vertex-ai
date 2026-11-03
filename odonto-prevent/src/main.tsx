import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/outfit/wght.css'
import '@fontsource-variable/inter-tight/wght.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import './index.css'
import App from './App'

const raiz = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// O HTML pré-renderizado usa a versão com movimento. Com "reduzir movimento" a árvore muda,
// então renderizamos do zero em vez de hidratar (evita aviso de divergência).
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (raiz.firstElementChild && !reduzir) {
  hydrateRoot(raiz, app)
} else {
  raiz.textContent = ''
  createRoot(raiz).render(app)
}
