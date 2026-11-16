import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/** Pré-renderização no build: o HTML já chega pronto e o React só hidrata. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
