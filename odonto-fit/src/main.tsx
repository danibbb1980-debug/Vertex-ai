import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const raiz = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// O build pré-renderiza o HTML (melhor para SEO e para a primeira pintura); no dev, renderiza do zero.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
