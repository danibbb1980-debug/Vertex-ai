import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/familjen-grotesk/latin-400.css";
import "@fontsource/familjen-grotesk/latin-500.css";
import "./index.css";
import App from "./App";

const raiz = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
if (raiz.hasChildNodes()) hydrateRoot(raiz, app);
else createRoot(raiz).render(app);
