import { useEffect, useId, useRef, type ReactNode } from 'react'

/**
 * Diálogo modal nativo (<dialog>): prende o foco, fecha com Esc e devolve o
 * foco a quem abriu. No celular abre como folha a partir de baixo.
 */
export default function Dialogo({
  aberto, onFechar, titulo, children, largura = 'sm:max-w-md',
}: {
  aberto: boolean
  onFechar: () => void
  titulo: string
  children: ReactNode
  largura?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (aberto && !d.open) d.showModal()
    else if (!aberto && d.open) d.close()
  }, [aberto])
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onClose={onFechar}
      onClick={(e) => e.target === ref.current && onFechar()}
      className={`m-0 mt-auto w-full max-w-none bg-transparent p-0 backdrop:bg-tinta/40 sm:m-auto ${largura}`}
    >
      {aberto && (
        <div className="anima-subir max-h-[90dvh] overflow-y-auto rounded-t-xl border-t border-fio bg-papel px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:rounded-xl sm:border">
          <div className="flex items-start justify-between gap-3">
            <h2 id={id} className="text-[1.25rem] font-bold leading-snug">{titulo}</h2>
            <button type="button" onClick={onFechar} className="botao-texto -mr-1 shrink-0 text-tinta-2">
              Fechar
            </button>
          </div>
          <div className="mt-3">{children}</div>
        </div>
      )}
    </dialog>
  )
}
