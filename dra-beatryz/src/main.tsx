import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CONFIG } from "./config";
import App from "./App";
import "./index.css";

document.documentElement.dataset.rascunho = String(CONFIG.rascunho);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
