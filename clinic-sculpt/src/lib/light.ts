/**
 * "A luz esculpe": gira lentamente a direção da luz conforme a rolagem.
 * Só atualiza duas variáveis CSS (--lx, --ly); as cópias da linha usam transform.
 */
export function iniciarLuz() {
  if (typeof window === "undefined") return () => {};
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduz.matches) return () => {};
  const raiz = document.documentElement;
  const DIST = 1.6; // px
  let pendente = false;
  const atualizar = () => {
    pendente = false;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    // começa com luz vindo do alto à esquerda e dá ~3/4 de volta até o fim da página
    const ang = (-135 + p * 270) * (Math.PI / 180);
    raiz.style.setProperty("--lx", `${(Math.cos(ang) * DIST).toFixed(2)}px`);
    raiz.style.setProperty("--ly", `${(Math.sin(ang) * DIST).toFixed(2)}px`);
  };
  const onScroll = () => {
    if (!pendente) {
      pendente = true;
      requestAnimationFrame(atualizar);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  atualizar();
  return () => window.removeEventListener("scroll", onScroll);
}
