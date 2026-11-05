import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { CONFIG, enderecoCompleto } from "./config";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export { CONFIG, enderecoCompleto };
