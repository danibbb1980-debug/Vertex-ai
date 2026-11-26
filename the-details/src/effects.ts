// Comportamentos só do navegador. Todos partem do estado final já renderizado no HTML.
import { prefersReducedMotion } from './lib';

const EASE_IO = 'cubic-bezier(0.65, 0, 0.35, 1)';

function lens(reduced: boolean) {
  const root = document.querySelector<HTMLElement>('[data-lens]');
  const html = document.documentElement;
  if (!root) return;
  const done = () => html.classList.remove('lens-pending');
  if (reduced || !root.animate) return done();

  const run = () => {
    const trail = root.querySelector<HTMLElement>('[data-lens-trail]')!;
    const trailIn = root.querySelector<HTMLElement>('[data-lens-trail-in]')!;
    const glass = root.querySelector<HTMLElement>('[data-lens-glass]')!;
    const glassIn = root.querySelector<HTMLElement>('[data-lens-glass-in]')!;
    const outline = root.querySelector<HTMLElement>('.lens__outline')!;
    const W = outline.getBoundingClientRect().width;
    const D = glass.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(glass).marginLeft) || 0;
    const E = gap + D / 2; // a janela do rastro é W + E de largura
    trail.style.width = `${W + E}px`;
    glassIn.style.left = `${-(W + gap)}px`;

    const c0 = -D; // centro da lente no início (fora, à esquerda)
    const c1 = W + gap + D / 2; // centro em repouso (à direita do nome)
    const opts: KeyframeAnimationOptions = { duration: 1600, delay: 200, easing: EASE_IO, fill: 'both' };
    const L = (c: number) => c - D / 2 - (W + gap); // deslocamento da lente em relação ao repouso
    const T = (c: number) => c - (W + E); // deslocamento da janela do rastro

    html.classList.add('lens-run');
    done();
    const a = glass.animate([{ transform: `translateX(${L(c0)}px)` }, { transform: 'translateX(0px)' }], opts);
    glassIn.animate([{ transform: `translateX(${-L(c0)}px)` }, { transform: 'translateX(0px)' }], opts);
    trail.animate([{ transform: `translateX(${T(c0)}px)` }, { transform: 'translateX(0px)' }], opts);
    trailIn.animate([{ transform: `translateX(${-T(c0)}px)` }, { transform: 'translateX(0px)' }], opts);
    a.onfinish = () => html.classList.remove('lens-run');
    void c1;
  };

  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    requestAnimationFrame(run);
  };
  if (fonts?.ready) fonts.ready.then(start);
  setTimeout(start, 1800); // fonte lenta: anima assim mesmo, com o layout já estável
}

function observeOnce(sel: string, cls: string, reduced: boolean) {
  const els = Array.from(document.querySelectorAll<HTMLElement>(sel));
  if (reduced || !('IntersectionObserver' in window)) return;
  const vh = window.innerHeight;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.remove(cls);
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  for (const el of els) {
    if (el.getBoundingClientRect().top > vh * 0.9) {
      el.classList.add(cls);
      io.observe(el);
    }
  }
}

function scrollFx(reduced: boolean) {
  const html = document.documentElement;
  const drift = document.querySelector<HTMLElement>('[data-drift]');
  const bar = document.querySelector<HTMLElement>('[data-timeline-bar]');
  const tl = document.querySelector<HTMLElement>('[data-timeline]');
  const hero = document.querySelector<HTMLElement>('.hero');
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    html.classList.toggle('is-scrolled', y > 24);
    html.classList.toggle('past-hero', hero ? y > hero.offsetHeight * 0.7 : y > 600);
    if (reduced) return;
    if (drift) {
      const r = drift.parentElement!.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        const p = (vh - r.top) / (vh + r.height); // 0..1
        drift.style.transform = `translate3d(${(p - 0.5) * -8}%, ${(p - 0.5) * 8}%, 0)`;
      }
    }
    if (bar && tl) {
      const r = tl.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
      bar.style.transform = `scaleY(${p})`;
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  if (!reduced && bar) html.classList.add('tl-js');
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

function videos(reduced: boolean) {
  const vids = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]'));
  if (reduced || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (v.dataset.user === 'pause') continue;
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      }
    },
    { threshold: 0.35 },
  );
  vids.forEach((v) => io.observe(v));
}

export function startEffects() {
  const reduced = prefersReducedMotion();
  lens(reduced);
  observeOnce('[data-reveal]', 'is-pending', reduced);
  observeOnce('[data-ring]', 'is-pending', reduced);
  scrollFx(reduced);
  videos(reduced);
}
