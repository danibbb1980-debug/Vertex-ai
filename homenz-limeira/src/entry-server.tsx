import { renderToString } from 'react-dom/server'
import { App, jsonLd } from './App'
import { CONFIG } from './config'

export function render() {
  return { html: renderToString(<App />), jsonLd: JSON.stringify(jsonLd()), siteUrl: CONFIG.siteUrl }
}
