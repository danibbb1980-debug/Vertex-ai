import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { setLenis } from "../lib/lenisStore";
import { useFinePointer, useMotionOk } from "../lib/useMotionOk";

/** Rolagem suave (Lenis). Desligada com reduced-motion. */
function SmoothScroll() {
  const ok = useMotionOk();
  useEffect(() => {
    if (!ok) return;
    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -88 }, autoRaf: true });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, [ok]);
  return null;
}

/** Cursor discreto: ponto + anel. Só com mouse e sem reduced-motion. */
function Cursor() {
  const fine = useFinePointer();
  const ok = useMotionOk();
  const on = fine && ok;
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 300, damping: 30, mass: 0.5 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest("a, button, summary, select, input, textarea, label, [data-cursor]"));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [on, x, y]);

  if (!on) return null;
  return (
    <>
      <m.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] h-1.5 w-1.5 rounded-full bg-wine mix-blend-multiply"
        style={{ x, y, translateX: "-50%", translateY: "-50%", opacity: visible ? 1 : 0 }}
      />
      <m.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] h-9 w-9 rounded-full border border-wine/50"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hover ? 1.6 : 1, opacity: visible ? (hover ? 0.9 : 0.55) : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}


/** Carregado depois da página pronta: não pesa no carregamento inicial. */
export default function Extras() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
    </>
  );
}
