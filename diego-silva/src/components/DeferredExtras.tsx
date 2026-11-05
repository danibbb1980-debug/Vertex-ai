import { lazy, Suspense, useEffect, useState } from "react";

const Extras = lazy(() => import("./Extras"));

/** Lenis e cursor só entram depois do load + ocioso, fora do caminho crítico. */
export function DeferredExtras() {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const start = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
      if (idle) idle(() => setGo(true));
      else setTimeout(() => setGo(true), 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }, []);
  if (!go) return null;
  return (
    <Suspense fallback={null}>
      <Extras />
    </Suspense>
  );
}
