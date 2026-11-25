import { renderToString } from 'react-dom/server'
import { App } from './App'
import { config } from './config'

export function render() {
  return renderToString(<App />)
}

export { config }
