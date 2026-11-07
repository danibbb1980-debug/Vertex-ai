// Usado só no build: gera o HTML inicial da página (pré-renderização) para pintar mais rápido.
import { renderToString } from "react-dom/server";
import App from "./App";

export function render() {
  return renderToString(<App />);
}
