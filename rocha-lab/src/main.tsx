import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { CONFIG } from './config'
import App from './App'
import './index.css'

// Altura da faixa de rascunho (o CSS já parte de 2.25rem para não haver salto de layout).
if (!CONFIG.rascunho) document.documentElement.style.setProperty('--faixa', '0px')

const raiz = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// No build o HTML já vem pré-renderizado; no `npm run dev` a raiz está vazia.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
