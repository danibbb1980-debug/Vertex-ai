import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces/standard.css'
import '@fontsource-variable/fraunces/standard-italic.css'
import '@fontsource-variable/dm-sans/index.css'
import './index.css'
import App from './App'
import { iniciarEfeitos } from './lib/efeitos'

iniciarEfeitos()
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <App />
  </StrictMode>,
)
