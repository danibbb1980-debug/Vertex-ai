// Adaptado de "Spotlight" (21st.dev, @kevingirelli): uma luz suave segue o ponteiro
// sobre o cartão e acende a borda mais próxima. Sem dependências extras (sem Radix);
// só atualiza duas variáveis CSS por quadro, ignora toque e respeita movimento reduzido.
import { useEffect, useRef, type ReactNode } from "react";

const RING_MASK = "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)";

type Props = {
  children: ReactNode;
  className?: string;
  size?: number;
  color?: string;
  as?: "article" | "div" | "li";
};

export function Spotlight({ children, className = "", size = 340, color = "#4a3459", as: Tag = "div" }: Props) {
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const circle = `${size}px circle at var(--sx, 50%) var(--sy, 0%)`;
  const luz = "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100 group-focus-within/spot:opacity-100 motion-reduce:hidden";

  return (
    <Tag
      className={`group/spot relative isolate ${className}`}
      onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
        if (e.pointerType === "touch") return;
        const t = e.currentTarget;
        const { clientX, clientY } = e;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          const r = t.getBoundingClientRect();
          t.style.setProperty("--sx", `${clientX - r.left}px`);
          t.style.setProperty("--sy", `${clientY - r.top}px`);
        });
      }}
    >
      <span
        aria-hidden="true"
        className={luz}
        style={{ background: `radial-gradient(${circle}, color-mix(in oklab, #f2d8cb 70%, transparent), transparent 70%)` }}
      />
      <span
        aria-hidden="true"
        className={`${luz} -inset-px p-px`}
        style={{
          background: `radial-gradient(${circle}, color-mix(in oklab, ${color} 55%, transparent), transparent 60%)`,
          mask: RING_MASK,
          maskComposite: "exclude",
          WebkitMask: RING_MASK,
          WebkitMaskComposite: "xor",
        }}
      />
      {children}
    </Tag>
  );
}
