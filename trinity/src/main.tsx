import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '@fontsource/brygada-1918/latin-400.css'
import '@fontsource/brygada-1918/latin-400-italic.css'
import '@fontsource/schibsted-grotesk/latin-400.css'
import '@fontsource/schibsted-grotesk/latin-500.css'
import './index.css'
import App from './App'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
