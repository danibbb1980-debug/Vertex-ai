import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const raiz = document.getElementById("raiz")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Em produção o HTML já vem pré-renderizado: só hidrata.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app);
else createRoot(raiz).render(app);
