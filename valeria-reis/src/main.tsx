import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '@fontsource/gilda-display/latin-400.css'
import '@fontsource/hanken-grotesk/latin-400.css'
import '@fontsource/hanken-grotesk/latin-500.css'
import './index.css'
import App from './App'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
)
