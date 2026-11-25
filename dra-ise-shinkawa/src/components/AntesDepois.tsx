import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Caso } from '../config';

/**
 * Comparação antes e depois. Ao entrar na tela, a linha varre da esquerda
 * (só o "antes") até o meio, uma única vez. Depois, arraste ou use as setas.
 * Anima apenas transform.
 */
export function AntesDepois({ caso, indice }: { caso: Caso; indice: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(50);
  const [anima, setAnima] = useState(false);
  const arrastando = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduz || !('IntersectionObserver' in window)) return;
    setP(100);
    const io = new IntersectionObserver((ents) => {
      if (ents.some((e) => e.isIntersecting)) {
        io.disconnect();
        window.setTimeout(() => {
          setAnima(true);
          requestAnimationFrame(() => setP(50));
          window.setTimeout(() => setAnima(false), 1300);
        }, 250 + indice * 140);
      }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, [indice]);

  const mover = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    const v = ((clientX - r.left) / r.width) * 100;
    setP(Math.max(0, Math.min(100, v)));
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    arrastando.current = true;
    setAnima(false);
    ref.current!.setPointerCapture(e.pointerId);
    mover(e.clientX);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => { if (arrastando.current) mover(e.clientX); };
  const up = () => { arrastando.current = false; };
  const tecla = (e: KeyboardEvent) => {
    const passo = e.shiftKey ? 20 : 5;
    let v = p;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = p - passo;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = p + passo;
    else if (e.key === 'Home') v = 0;
    else if (e.key === 'End') v = 100;
    else return;
    e.preventDefault();
    setP(Math.max(0, Math.min(100, v)));
  };

  return (
    <div
      ref={ref}
      className={`ba${anima ? ' anima' : ''}`}
      style={{ ['--p' as string]: p }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <img src={caso.depois} width={caso.w} height={caso.h} alt={`${caso.alt}, depois`} loading="lazy" decoding="async" draggable={false} />
      <div className="antes">
        <img src={caso.antes} width={caso.w} height={caso.h} alt={`${caso.alt}, antes`} loading="lazy" decoding="async" draggable={false} />
      </div>
      <span className="tag a" aria-hidden="true">Antes</span>
      <span className="tag d" aria-hidden="true">Depois</span>
      <div className="divisor">
        <div
          className="alca"
          role="slider"
          tabIndex={0}
          aria-label={`Comparar antes e depois do caso ${indice + 1}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(p)}
          aria-valuetext={`${Math.round(p)}% do antes visível`}
          onKeyDown={tecla}
        />
      </div>
    </div>
  );
}
