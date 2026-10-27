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
// Em produção o HTML já vem pré-renderizado; aqui só "hidratamos".
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
