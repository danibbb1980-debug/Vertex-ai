import type { ReactNode } from "react";
import { Vertice } from "./Vertice";

/** Rótulo de seção: o vértice da marca + nome da seção em caixa-alta pequena. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 meta ${className}`}>
      <Vertice className="h-[10px] w-auto text-gold [.on-light_&]:text-bronze" />
      {children}
    </p>
  );
}

/** Itálico da serif, na cor do texto. Usado com parcimônia. */
export const Em = ({ children }: { children: ReactNode }) => <em className="font-serif italic">{children}</em>;
