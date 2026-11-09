import { CONFIG } from '../config'
import { IconeRelogio } from '../components/Icones'
import { horariosResumidos } from '../lib/dados'

export function HorariosDestaque() {
  const grupos = horariosResumidos()
  if (!grupos.length) return null
  return (
    <section aria-label="Horários de atendimento" className="relative bg-vinho text-pedra em-escuro">
      <div className="container-site flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="flex items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#e6d3ea]">
          <IconeRelogio className="text-lilas" />
          Horários
        </p>
        <ul className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-10">
          {grupos.map((g) => (
            <li key={g.rotulo} className="flex items-baseline gap-3">
              <span className="text-pedra/80">{g.rotulo}</span>
              <span className={`font-serif text-xl ${g.fechado ? 'italic text-pedra/80' : 'text-pedra'}`}>{g.texto}</span>
            </li>
          ))}
        </ul>
        {CONFIG.avisoFeriados && <p className="text-sm text-pedra/75">{CONFIG.avisoFeriados}</p>}
      </div>
    </section>
  )
}
