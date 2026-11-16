import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/besley/latin-500.css";
import "@fontsource/besley/latin-500-italic.css";
import "@fontsource/hanken-grotesk/latin-400.css";
import "@fontsource/hanken-grotesk/latin-600.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
