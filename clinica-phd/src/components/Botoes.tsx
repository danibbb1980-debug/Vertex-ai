import type { ReactNode } from "react";
import { contatoExterno, contatoHref, rotuloAgendar, telHref, temTelefone, temWhatsapp } from "../lib/contato";
import { CONFIG } from "../config";
import { IconeTelefone, IconeWhatsapp } from "./Icones";

type Variante = "primario" | "claro" | "contorno";

type Props = {
  mensagem?: string;
  rotulo?: string;
  variante?: Variante;
  className?: string;
  /** Texto para leitores de tela quando o rótulo visível for curto */
  ariaLabel?: string;
  dataSig?: boolean;
};

/** Botão de agendamento: WhatsApp quando ativo, senão "Ligar". */
export function BotaoAgendar({ mensagem, rotulo, variante = "primario", className = "", ariaLabel, dataSig }: Props) {
  const externo = contatoExterno;
  const texto = temWhatsapp ? rotulo ?? rotuloAgendar : rotulo && /ligar/i.test(rotulo) ? rotulo : "Ligar para a clínica";
  return (
    <a
      href={contatoHref(mensagem)}
      className={`botao botao-${variante} ${className}`}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={ariaLabel ? `${ariaLabel}${externo ? " (abre o WhatsApp em nova aba)" : ""}` : externo ? `${texto} (abre em nova aba)` : undefined}
      {...(dataSig ? { "data-sig-fim": "" } : {})}
    >
      {temWhatsapp ? <IconeWhatsapp className="size-5 shrink-0" /> : <IconeTelefone className="size-5 shrink-0" />}
      <span>{texto}</span>
    </a>
  );
}

/** Link de telefone exibido ao lado do botão de WhatsApp. */
export function LinkTelefone({ className = "", children }: { className?: string; children?: ReactNode }) {
  if (!temTelefone) return null;
  return (
    <a href={telHref} className={`inline-flex min-h-12 items-center gap-2 font-medium ${className}`}>
      <IconeTelefone className="size-[1.15rem] shrink-0" />
      {children ?? (
        <span>
          <span className="sr-only">Ligar para </span>
          {CONFIG.telefoneExibicao}
        </span>
      )}
    </a>
  );
}
