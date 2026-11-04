import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Hidratação em transição: o React trabalha em fatias e não trava a página.
if (root.hasChildNodes()) startTransition(() => void hydrateRoot(root, app));
else createRoot(root).render(app);
