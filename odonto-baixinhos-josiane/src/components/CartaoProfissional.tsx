import { CONFIG, linkWhatsApp, type Profissional } from "../config";
import { IconeInstagram, IconeWhatsApp } from "./Icones";

export function CartaoProfissional({ pro, className = "" }: { pro: Profissional; className?: string }) {
  const baixinhos = pro.id === "aline";
  return (
    <div className={`rounded-[var(--radius-cartao)] border border-linha bg-marfim p-6 shadow-[0_20px_40px_-30px_rgba(27,36,64,.35)] md:p-7 ${className}`}>
      <p className="font-display text-2xl leading-tight">{pro.nome}</p>
      <p className="mt-1 text-sm font-semibold text-tinta-2">
        {pro.titulo}
        {baixinhos && CONFIG.mostrarEspecialidades ? ` · ${CONFIG.especialidadeAline}` : ""}
      </p>
      {pro.cro || (!baixinhos && CONFIG.mostrarAnosDeFormada) ? (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-tinta-2">
          {pro.cro ? <span>{pro.cro}</span> : null}
          {!baixinhos && CONFIG.mostrarAnosDeFormada ? <span>Cirurgiã-dentista desde {CONFIG.anoFormaturaJosiane}</span> : null}
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <a
          href={linkWhatsApp(pro.whatsapp, pro.mensagemWhatsApp)}
          target="_blank"
          rel="noopener"
          className={`btn flex-1 ${baixinhos ? "btn-ceu" : "btn-ouro"}`}
          aria-label={`Agendar com a ${pro.nome} pelo WhatsApp (abre em nova aba)`}
        >
          <IconeWhatsApp tamanho={18} /> Agendar avaliação
        </a>
        <a href={pro.instagram} target="_blank" rel="noopener" className="btn btn-contorno" aria-label={`Instagram ${pro.instagramUser} (abre em nova aba)`}>
          <IconeInstagram tamanho={18} /> Instagram
        </a>
      </div>
    </div>
  );
}
