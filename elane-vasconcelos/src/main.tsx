import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/dm-sans/wght.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";

const raiz = document.getElementById("root")!;
const app = <StrictMode><App /></StrictMode>;
// Com "reduzir movimento", renderiza do zero no cliente: o HTML pré-renderizado
// traz os estados iniciais das animações, que a hidratação não corrigiria.
const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (raiz.hasChildNodes() && !reduzido) hydrateRoot(raiz, app);
else createRoot(raiz).render(app);
