/**
 * Movimento do site. Três mecanismos recorrentes, os mesmos em todo lugar:
 *  (a) títulos revelados por linha, com máscara  → classe .is-in na seção
 *  (b) marcadores em miniatura que se acendem em sequência → mesma classe .is-in
 *  (c) filete de tinta nas linhas de lista (hover/foco) → só CSS
 * Mais a linha do tempo de "Como funciona" (progresso pela rolagem).
 * A assinatura do hero é CSS puro (não depende deste arquivo).
 */
import { inView } from 'motion';

const reduz = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function iniciarMovimento() {
  const html = document.documentElement;
  if (reduz()) {
    html.classList.remove('js-motion');
    return;
  }

  // (a) + (b)
  document.querySelectorAll<HTMLElement>('.sec, .cta').forEach((el) => {
    inView(
      el,
      () => {
        el.classList.add('is-in');
      },
      { amount: 0.15 },
    );
  });

  // linha do tempo
  const tl = document.querySelector<HTMLElement>('[data-timeline]');
  if (tl) {
    const bar = tl.querySelector<HTMLElement>('.tl__progress');
    const steps = [...tl.querySelectorAll<HTMLElement>('[data-step]')];
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = tl.getBoundingClientRect();
      const alvo = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (alvo - r.top) / r.height));
      if (bar) bar.style.transform = `scaleY(${p})`;
      steps.forEach((s) => {
        const sr = s.getBoundingClientRect();
        s.classList.toggle('is-past', sr.top + 12 < alvo);
      });
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    let ativo = false;
    inView(tl, () => {
      ativo = true;
      window.addEventListener('scroll', on, { passive: true });
      on();
      return () => {
        ativo = false;
        window.removeEventListener('scroll', on);
      };
    });
    void ativo;
  }

  // botão flutuante: aparece depois do hero (desktop)
  const fl = document.querySelector<HTMLElement>('[data-float]');
  const hero = document.querySelector<HTMLElement>('.hero');
  const contato = document.querySelector<HTMLElement>('#agendar');
  if (fl && hero) {
    let passouHero = false;
    let noForm = false;
    const upd = () => fl.classList.toggle('is-on', passouHero && !noForm);
    inView(hero, () => {
      passouHero = false;
      upd();
      return () => {
        passouHero = true;
        upd();
      };
    });
    // some sobre o CTA final e o rodapé
    let sobre = 0;
    document.querySelectorAll<HTMLElement>('.cta, .footer').forEach((el) =>
      inView(el, () => {
        fl.classList.toggle('is-off', ++sobre > 0);
        return () => fl.classList.toggle('is-off', --sobre > 0);
      }),
    );
    if (contato)
      inView(contato, () => {
        noForm = true;
        upd();
        return () => {
          noForm = false;
          upd();
        };
      });
  }

  // rolagem suave só com ponteiro fino (desktop), carregada em idle
  if (window.matchMedia('(pointer: fine)').matches) {
    const carregar = () =>
      import('lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({ duration: 1.05, easing: (t: number) => 1 - Math.pow(1 - t, 3), anchors: { offset: -96 } });
        const loop = (t: number) => {
          lenis.raf(t);
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      });
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => void }).requestIdleCallback;
    if (ric) ric(carregar, { timeout: 3000 });
    else setTimeout(carregar, 1500);
  }
}
