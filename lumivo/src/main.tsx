import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/globals.css'

const raiz = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
