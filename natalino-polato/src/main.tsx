import { createRoot, hydrateRoot } from 'react-dom/client'
import { Root } from './Root'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource/cormorant-garamond/latin-600-italic.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/latin-600.css'
import './index.css'

const el = document.getElementById('root')!

// O HTML vem pré-renderizado no build; em desenvolvimento a raiz chega vazia.
if (el.hasChildNodes()) hydrateRoot(el, <Root />)
else createRoot(el).render(<Root />)
