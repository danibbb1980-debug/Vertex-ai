import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { CONFIG } from './config'
import App from './App'
import './index.css'

document.documentElement.style.setProperty('--banner-h', CONFIG.rascunho ? '32px' : '0px')

const raiz = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// HTML pré-renderizado no build: só hidrata. Em desenvolvimento, renderiza do zero.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
