import { hydrateRoot, createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

const raiz = document.getElementById('root')!
if (raiz.hasChildNodes()) hydrateRoot(raiz, <App />)
else createRoot(raiz).render(<App />)
