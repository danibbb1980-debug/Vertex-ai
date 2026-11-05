import { CONFIG } from "../config";
import { Logo } from "../components/Logo";
import { InstagramIcon, WhatsAppIcon } from "../components/icons";
import { waLink } from "../lib/whatsapp";
import { faixa } from "../lib/horarios";

export function Footer() {
  const p = CONFIG.profissional;
  const ano = new Date().getFullYear();
  return (
    <footer className="on-dark bg-navy-900 pb-28 pt-20 text-mist md:pb-12">
      <div className="container-site">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo size="lg" />
            {p.registro && p.titulo && (
              <p className="mt-6 font-label text-sm tracking-[0.12em] text-pearl">
                {p.titulo} · {p.registro}
              </p>
            )}
          </div>
          <div>
            <h2 className="eyebrow text-rose-300">Endereço</h2>
            <address className="mt-4 not-italic leading-relaxed">
              {CONFIG.endereco.rua}
              <br />
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf} · CEP {CONFIG.endereco.cep}
            </address>
            <ul className="mt-4 space-y-1 text-sm">
              {CONFIG.horarios.map((h) => (
                <li key={h.rotulo}>
                  {h.rotulo}: {faixa(h)}
                </li>
              ))}
              {CONFIG.fechado.map((f) => (
                <li key={f.rotulo}>{f.rotulo}: fechado</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-rose-300">Contato</h2>
            <ul className="mt-2">
              <li>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 hover:text-pearl">
                  <WhatsAppIcon /> {CONFIG.telefoneExibicao}
                </a>
              </li>
              {CONFIG.instagram.url && (
                <li>
                  <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-3 break-all hover:text-pearl">
                    <InstagramIcon /> {CONFIG.instagram.usuario}
                  </a>
                </li>
              )}
              <li>
                <a href="/privacidade.html" className="inline-flex min-h-12 items-center hover:text-pearl">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="filete mt-16" aria-hidden="true" />
        <div className="mt-8 flex flex-col gap-3 text-[0.82rem] md:flex-row md:justify-between">
          <p className="max-w-[46rem]">
            Conteúdo informativo, sem finalidade de diagnóstico. A indicação de cada atendimento depende de avaliação individual.
          </p>
          <p className="shrink-0">
            © {ano} {CONFIG.nome}
          </p>
        </div>
      </div>
    </footer>
  );
}
