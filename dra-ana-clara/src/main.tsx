import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const el = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
if (el.hasChildNodes()) hydrateRoot(el, app)
else createRoot(el).render(app)
