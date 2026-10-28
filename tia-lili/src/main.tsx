import { hydrate, render } from "preact";
import "./index.css";
import App from "./App";

const raiz = document.getElementById("root")!;
const app = <App />;

// Em produção o HTML já vem pré-renderizado (scripts/prerender.mjs); no dev, renderiza do zero.
if (raiz.hasChildNodes()) hydrate(app, raiz);
else render(app, raiz);
