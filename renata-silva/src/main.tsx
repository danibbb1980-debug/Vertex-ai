import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import { Root } from "./Root";

const el = document.getElementById("root")!;
// O HTML já vem pré-renderizado no build (scripts/prerender.mjs); aqui só hidrata.
if (el.hasChildNodes()) hydrateRoot(el, <Root />);
else createRoot(el).render(<Root />);
