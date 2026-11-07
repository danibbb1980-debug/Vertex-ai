import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// o HTML já vem pré-renderizado no build; sem ele (npm run dev), renderiza do zero
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
