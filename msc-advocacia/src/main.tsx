import { createRoot, hydrateRoot } from "react-dom/client";
import { Root } from "./Root";

const el = document.getElementById("root")!;
// Em produção o HTML já vem pré-renderizado (scripts/prerender.mjs); em dev, renderiza do zero.
if (el.hasChildNodes()) hydrateRoot(el, <Root />);
else createRoot(el).render(<Root />);
