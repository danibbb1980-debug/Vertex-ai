import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/manrope/wght.css";
import "./index.css";
import { Raiz } from "./Raiz";

const raiz = document.getElementById("root")!;
// O HTML já vem pré-renderizado no build; aqui o React só assume o controle.
if (raiz.hasChildNodes()) hydrateRoot(raiz, <Raiz />);
else createRoot(raiz).render(<Raiz />);
