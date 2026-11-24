import { hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

hydrateRoot(document.getElementById("root")!, <App />);

/* Mecanismos recorrentes: [data-reveal] recebe .is-in ao entrar na tela. */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
if (reduce || !("IntersectionObserver" in window)) {
  els.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  els.forEach((el) => io.observe(el));
}

/* Botão flutuante: aparece depois do hero, some perto do rodapé. */
const float = document.querySelector<HTMLElement>("[data-float]");
const hero = document.getElementById("inicio");
const footer = document.querySelector("footer");
if (float && hero && footer) {
  let pastHero = false;
  let atFooter = false;
  const upd = () => float.classList.toggle("is-on", pastHero && !atFooter);
  new IntersectionObserver(([e]) => {
    pastHero = !e.isIntersecting;
    upd();
  }).observe(hero);
  new IntersectionObserver(([e]) => {
    atFooter = e.isIntersecting;
    upd();
  }).observe(footer);
}
