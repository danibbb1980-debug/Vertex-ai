import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fmtDataCurta } from '../lib/datas'
import { telefoneE164 } from '../lib/formato'
import { SEGMENTOS } from '../lib/rotulos'
import type { Lead } from '../lib/types'
import RegistrarLigacao from './RegistrarLigacao'
import { Tentativas } from './ui'

function IconeTelefone() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-[18px]" fill="currentColor">
      <path d="M6.6 2.2c.5-.2 1 0 1.3.4l1.6 2.6c.3.5.2 1.1-.2 1.4l-1.2 1c.8 1.7 2.2 3.1 3.9 3.9l1-1.2c.4-.4 1-.5 1.4-.2l2.6 1.6c.5.3.6.8.4 1.3l-.7 1.8c-.3.8-1.1 1.3-2 1.2C8.5 15.4 4.6 11.5 4 5.4c-.1-.9.4-1.7 1.2-2z" />
    </svg>
  )
}

export default function LinhaLigacao({
  lead, feitas, hoje, podeEditar,
}: { lead: Lead; feitas: number; hoje: string; podeEditar: boolean }) {
  const [aberto, setAberto] = useState(false)
  const tel = telefoneE164(lead.telefone)
  const vencido = lead.retornar_em && lead.retornar_em < hoje
  const segmento = lead.segmento === 'outro' && lead.segmento_outro ? lead.segmento_outro : SEGMENTOS[lead.segmento]

  return (
    <li className="border-b border-fio py-3.5">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/leads/${lead.id}`} className="min-w-0 flex-1 rounded">
          <span className="block truncate text-[1.0625rem] font-semibold leading-snug">{lead.nome}</span>
          <span className="block truncate text-[0.9375rem] text-tinta-2">
            {segmento}
            {lead.cidade ? `, ${lead.cidade}` : ''}
          </span>
        </Link>
        <div className="shrink-0 pt-1 text-right">
          <Tentativas feitas={feitas} />
          {vencido && <p className="num mt-0.5 text-micro font-semibold text-ambar">desde {fmtDataCurta(lead.retornar_em)}</p>}
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="num min-w-0 flex-1 text-[1.5rem] font-medium leading-tight tracking-[0.01em]">
          {lead.telefone || <span className="text-base text-tinta-2">Sem telefone</span>}
        </p>
        {podeEditar && (
          <div className="flex gap-2">
            {tel ? (
              <a
                href={`tel:${tel}`}
                onClick={() => setAberto(true)}
                className="botao-primario !min-h-13 flex-1 !px-6 text-[1.0625rem] sm:flex-none"
                aria-label={`Ligar para ${lead.nome}`}
              >
                <IconeTelefone />
                Ligar
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setAberto(true)}
              className={`botao-secundario !min-h-13 !px-4 text-[0.9375rem] ${tel ? '' : 'flex-1 sm:flex-none'}`}
              aria-label={`Registrar resultado de ligação para ${lead.nome}`}
            >
              Registrar
            </button>
          </div>
        )}
      </div>

      {podeEditar && <RegistrarLigacao lead={lead} feitas={feitas} aberto={aberto} onFechar={() => setAberto(false)} />}
    </li>
  )
}
