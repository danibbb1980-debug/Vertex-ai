import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/schibsted-grotesk/latin-500.css";
import "@fontsource/schibsted-grotesk/latin-400-italic.css";
import "@fontsource/hanken-grotesk/latin-400.css";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
