import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const raiz = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// O HTML já vem pré-renderizado no build; aqui o React só "acorda" a página.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app);
else createRoot(raiz).render(app);
