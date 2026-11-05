import { StrictMode, startTransition } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const raiz = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// hidratação em transição: o React divide o trabalho e não bloqueia a página já visível (HTML pré-renderizado)
if (raiz.hasChildNodes()) startTransition(() => { hydrateRoot(raiz, app) })
else createRoot(raiz).render(app)
