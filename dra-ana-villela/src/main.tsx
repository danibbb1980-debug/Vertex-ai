import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// O HTML vem pré-renderizado no build; aqui o React só assume a página.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
