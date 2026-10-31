import { createContext, useContext, useState, type ReactNode } from "react";
import { UNIDADES_ATIVAS, type Unidade } from "../config";

type Ctx = { unidade: Unidade; unidades: Unidade[]; setUnidadeId: (id: string) => void };

const UnidadeContext = createContext<Ctx | null>(null);

export function UnidadeProvider({ children }: { children: ReactNode }) {
  const [id, setUnidadeId] = useState(UNIDADES_ATIVAS[0]?.id ?? "");
  const unidade = UNIDADES_ATIVAS.find((u) => u.id === id) ?? UNIDADES_ATIVAS[0];
  return (
    <UnidadeContext.Provider value={{ unidade, unidades: UNIDADES_ATIVAS, setUnidadeId }}>
      {children}
    </UnidadeContext.Provider>
  );
}

export function useUnidade() {
  const ctx = useContext(UnidadeContext);
  if (!ctx) throw new Error("useUnidade fora do UnidadeProvider");
  return ctx;
}
