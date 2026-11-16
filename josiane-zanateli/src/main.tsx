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
// O HTML vem pré-renderizado no build; o React só "hidrata" (assume) a página.
if (raiz.firstElementChild) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
