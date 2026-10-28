import { hydrateRoot, createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import "./styles.css";

const raiz = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// HTML pré-renderizado no build: hidrata. Em `npm run dev`, renderiza do zero.
if (raiz.firstElementChild) hydrateRoot(raiz, app);
else createRoot(raiz).render(app);
