import { renderToString } from 'react-dom/server'
import App from './App'
import { Privacidade } from './pages/Privacidade'
import { NaoEncontrada } from './pages/NaoEncontrada'

export function render(page: 'home' | 'privacidade' | '404' = 'home') {
  if (page === 'privacidade') return renderToString(<Privacidade />)
  if (page === '404') return renderToString(<NaoEncontrada />)
  return renderToString(<App />)
}
export { headTags } from './seo'
export { CONFIG } from './config'
