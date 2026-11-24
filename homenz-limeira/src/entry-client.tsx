import { hydrateRoot } from 'react-dom/client'
import '@fontsource/brygada-1918/latin-400.css'
import '@fontsource/brygada-1918/latin-400-italic.css'
import '@fontsource-variable/schibsted-grotesk/wght.css'
import './styles.css'
import { App } from './App'
import { iniciarEfeitos } from './efeitos'

hydrateRoot(document.getElementById('root')!, <App />)
requestAnimationFrame(() => iniciarEfeitos())
