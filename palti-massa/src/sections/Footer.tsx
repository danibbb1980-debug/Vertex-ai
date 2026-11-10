import { CONFIG, crmTexto, enderecoLinha, especialidadesVisiveis, waLink } from "../config";
import { Logo } from "../components/Logo";

export function Footer() {
  const esp = especialidadesVisiveis();
  return (
    <footer className="on-dark bg-petroleo-950 pb-28 pt-14 text-white/80 md:pb-12">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <a href="#inicio" className="inline-flex h-14" aria-label="Dr. Palti Massa, voltar ao início">
              <Logo dark className="h-full" />
            </a>
            <p className="mt-4 font-semibold text-white">
              {CONFIG.nome} · {crmTexto()}
              {CONFIG.mostrarCrmSP && CONFIG.crmSP ? ` · CRM-SP ${CONFIG.crmSP}` : ""}
            </p>
            {esp.length > 0 && <p className="mt-1 text-sm">{esp.map((e) => `${e.nome} · RQE ${e.rqe}`).join(" | ")}</p>}
            <p className="mt-1 text-sm">{CONFIG.titulo} · {CONFIG.cidade} - {CONFIG.uf}</p>
          </div>
          <div>
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-agua-300">Endereço</h2>
            <p className="mt-3 text-[0.95rem]">{enderecoLinha()}</p>
          </div>
          <div>
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-agua-300">Contato</h2>
            <ul className="mt-2 text-[0.95rem]">
              <li><a className="inline-flex min-h-12 items-center hover:text-white" href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp {CONFIG.whatsappExibicao}</a></li>
              {CONFIG.telefone && <li><a className="inline-flex min-h-12 items-center hover:text-white" href={`tel:+${CONFIG.telefone}`}>Telefone {CONFIG.telefoneExibicao}</a></li>}
              <li><a className="inline-flex min-h-12 items-center hover:text-white" href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer">Instagram {CONFIG.instagram.usuario}</a></li>
              <li><a className="inline-flex min-h-12 items-center hover:text-white" href={CONFIG.mapsUrl} target="_blank" rel="noopener noreferrer">Ver no Google Maps</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl">Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada tratamento depende de avaliação médica individual.</p>
          <a href="/privacidade.html" className="inline-flex min-h-12 items-center underline decoration-white/30 underline-offset-4 hover:text-white">Política de privacidade</a>
        </div>
      </div>
    </footer>
  );
}
