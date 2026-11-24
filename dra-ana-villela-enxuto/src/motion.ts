import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Sistema de movimento da página, num único laço de animação:
 * - rolagem suave (Lenis) com mouse/trackpad; no toque fica a rolagem nativa;
 * - revelações ao rolar ([data-reveal]);
 * - parallax ([data-parallax] move o elemento conforme a posição do pai);
 * - faixa de palavras ([data-marquee]) que acelera com a velocidade da rolagem;
 * - linha de progresso de leitura (--sp);
 * - botões magnéticos ([data-magnetic]) e etiqueta que segue o cursor na lista de tratamentos.
 * Com "reduzir movimento" ativado, só as revelações acontecem, e sem deslocamento (ver CSS).
 */
export function useMotionSystem() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;

    // Um elemento com clip-path totalmente fechado conta como invisível para o observador,
    // então a "cortina" é observada pelo elemento pai.
    const alvos = new Map<Element, Element>();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (alvos.get(e.target) ?? e.target).classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      const observado = el.dataset.reveal === "cortina" && el.parentElement ? el.parentElement : el;
      alvos.set(observado, el);
      io.observe(observado);
    });
    if (reduce) return () => io.disconnect();

    const lenis = fine ? new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true }) : null;

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || !lenis) return;
      const id = a.getAttribute("href")!;
      const alvo = id === "#inicio" ? 0 : document.querySelector<HTMLElement>(id);
      if (alvo === null) return;
      e.preventDefault();
      lenis.scrollTo(alvo, { offset: -88, duration: 1.4 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    // Botões magnéticos (só com mouse)
    const magneticos = fine ? [...document.querySelectorAll<HTMLElement>("[data-magnetic]")] : [];
    const mover = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      el.style.transform = `translate3d(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px, 0)`;
    };
    const soltar = (e: PointerEvent) => ((e.currentTarget as HTMLElement).style.transform = "");
    magneticos.forEach((el) => {
      el.addEventListener("pointermove", mover);
      el.addEventListener("pointerleave", soltar);
    });

    // Etiqueta "Agendar" que segue o cursor sobre a lista de tratamentos
    const lista = document.querySelector<HTMLElement>("[data-cursor-area]");
    const etiqueta = document.querySelector<HTMLElement>("[data-cursor-label]");
    const alvoCursor = { x: 0, y: 0, ativo: false };
    const posCursor = { x: 0, y: 0 };
    const entrar = (e: PointerEvent) => {
      alvoCursor.ativo = true;
      posCursor.x = alvoCursor.x = e.clientX;
      posCursor.y = alvoCursor.y = e.clientY;
    };
    const seguir = (e: PointerEvent) => {
      alvoCursor.x = e.clientX;
      alvoCursor.y = e.clientY;
    };
    const sair = () => (alvoCursor.ativo = false);
    if (fine && lista && etiqueta) {
      lista.addEventListener("pointerenter", entrar);
      lista.addEventListener("pointermove", seguir);
      lista.addEventListener("pointerleave", sair);
    }

    const parallax = [...document.querySelectorAll<HTMLElement>("[data-parallax]")];
    const faixas = [...document.querySelectorAll<HTMLElement>("[data-marquee]")];
    let ultimo = window.scrollY;
    let velocidade = 0;
    let deslocamento = 0;
    let t0 = performance.now();
    let raf = 0;

    const laco = (t: number) => {
      lenis?.raf(t);
      const y = lenis ? lenis.scroll : window.scrollY;
      const max = root.scrollHeight - innerHeight;
      root.style.setProperty("--sp", (max > 0 ? Math.min(1, y / max) : 0).toFixed(4));

      const dt = Math.min(64, t - t0);
      t0 = t;
      velocidade += (y - ultimo - velocidade) * 0.12;
      ultimo = y;

      const vh = innerHeight;
      for (const el of parallax) {
        const r = (el.parentElement ?? el).getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const f = parseFloat(el.dataset.parallax || "0.1");
        el.style.transform = `translate3d(0, ${(-(r.top + r.height / 2 - vh / 2) * f).toFixed(1)}px, 0)`;
      }

      deslocamento += dt * 0.035 + Math.abs(velocidade) * 0.4;
      for (const m of faixas) {
        const w = m.scrollWidth / 2;
        if (w > 0) m.style.transform = `translate3d(${-(deslocamento % w).toFixed(1)}px, 0, 0)`;
      }

      if (etiqueta) {
        posCursor.x += (alvoCursor.x - posCursor.x) * 0.18;
        posCursor.y += (alvoCursor.y - posCursor.y) * 0.18;
        etiqueta.style.transform = `translate3d(${posCursor.x}px, ${posCursor.y}px, 0) translate(-50%, -50%) scale(${alvoCursor.ativo ? 1 : 0})`;
      }
      raf = requestAnimationFrame(laco);
    };
    raf = requestAnimationFrame(laco);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      lenis?.destroy();
      document.removeEventListener("click", onClick);
      magneticos.forEach((el) => {
        el.removeEventListener("pointermove", mover);
        el.removeEventListener("pointerleave", soltar);
      });
      lista?.removeEventListener("pointerenter", entrar);
      lista?.removeEventListener("pointermove", seguir);
      lista?.removeEventListener("pointerleave", sair);
    };
  }, []);
}
