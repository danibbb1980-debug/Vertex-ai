import { StrictMode, startTransition } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './fontes'
import './styles.css'
import { App } from './App'

const raiz = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// Em produção o HTML já vem pré-renderizado; no dev, renderiza do zero.
// Hidratação em transição: o React fatia o trabalho e não trava a página.
if (raiz.firstElementChild) startTransition(() => void hydrateRoot(raiz, app))
else createRoot(raiz).render(app)
