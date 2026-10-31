import { StrictMode } from "react";
import { LazyMotion } from "motion/react";
import App from "./App";
import { UnidadeProvider } from "./lib/unidade";

const recursos = () => import("./lib/recursosMotion").then((r) => r.default);

export function Raiz() {
  return (
    <StrictMode>
      <LazyMotion features={recursos} strict>
        <UnidadeProvider>
          <App />
        </UnidadeProvider>
      </LazyMotion>
    </StrictMode>
  );
}
