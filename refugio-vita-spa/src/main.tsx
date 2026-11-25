import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const raiz = document.getElementById('raiz')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
