import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

type Tom = 'ok' | 'erro'
interface AvisoCtx {
  avisar: (texto: string, tom?: Tom) => void
}
const Ctx = createContext<AvisoCtx>({ avisar: () => {} })

/** Confirmações curtas ("Ligação registrada") anunciadas por leitor de tela. */
export function AvisoProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ texto: string; tom: Tom; id: number } | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const avisar = useCallback((texto: string, tom: Tom = 'ok') => {
    window.clearTimeout(timer.current)
    setMsg({ texto, tom, id: Date.now() })
    timer.current = window.setTimeout(() => setMsg(null), tom === 'erro' ? 7000 : 3500)
  }, [])
  return (
    <Ctx.Provider value={{ avisar }}>
      {children}
      <div
        aria-live={msg?.tom === 'erro' ? 'assertive' : 'polite'}
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 lg:bottom-6"
      >
        {msg && (
          <div
            key={msg.id}
            className={`anima-subir pointer-events-auto max-w-md rounded-md px-4 py-3 text-[0.9375rem] font-medium text-white ${msg.tom === 'erro' ? 'bg-vermelho' : 'bg-tinta'}`}
          >
            {msg.texto}
          </div>
        )}
      </div>
    </Ctx.Provider>
  )
}

export const useAviso = () => useContext(Ctx)
