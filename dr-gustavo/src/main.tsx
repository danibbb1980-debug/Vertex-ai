import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/index.css'
import '@fontsource-variable/fraunces/wght-italic.css'
import '@fontsource-variable/manrope/index.css'
import '@fontsource/pinyon-script/latin-400.css'
import './index.css'
import App from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// Em produção o HTML já vem pré-renderizado; no dev, renderiza do zero.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
