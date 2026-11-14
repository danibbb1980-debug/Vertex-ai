import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/jost/wght.css'
import '@fontsource/newsreader/latin-400-italic.css'
import './index.css'
import App from './App'

const el = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
if (el.hasChildNodes()) hydrateRoot(el, app)
else createRoot(el).render(app)
