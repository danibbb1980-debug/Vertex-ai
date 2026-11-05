import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Faixa de texto em movimento lento (adaptada do "Marquee" do 21st.dev).
 * Pausa fora da tela, no hover e pelo botão (WCAG 2.2.2). Parada com
 * movimento reduzido.
 */
export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className="eyebrow whitespace-nowrap px-7 text-mist">{t}</span>
          <svg width="7" height="10" viewBox="0 0 7 10" aria-hidden="true" className="text-rose-400">
            <path d="M3.5 0C5 3 7 5 3.5 10 0 5 2 3 3.5 0Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={ref}
      className="marquee relative z-[2] flex items-center border-y border-rose-300/15 bg-navy-950"
      data-paused={!visible || userPaused || hover}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <div className="flex-1 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setUserPaused((v) => !v)}
        className="mr-2 grid size-12 shrink-0 place-items-center rounded-full text-mist transition-colors hover:text-rose-300 motion-reduce:hidden"
        aria-label={userPaused ? "Retomar movimento da faixa" : "Pausar movimento da faixa"}
      >
        {userPaused ? <Play size={14} /> : <Pause size={14} />}
      </button>
    </div>
  );
}
