import { CONFIG, enderecoCompleto } from "../config";
import { Assinatura } from "../components/Logo";
import { IconStar } from "../components/Icons";
import { Confirmar } from "../components/ui";
import { LINKS } from "../components/Header";

/** Só aparece com nota real do Google e CONFIG.mostrarNotaGoogle = true. Sem depoimentos. */
export function Avaliacoes() {
  if (!CONFIG.mostrarNotaGoogle || !CONFIG.notaGoogle) return null;
  return (
    <section aria-label="Avaliações no Google" className="py-12">
      <div className="container-site flex flex-col items-center gap-3 text-center">
        <p className="flex items-center gap-2 font-display text-4xl text-ink">
          <IconStar size={28} className="text-coral" /> {CONFIG.notaGoogle.nota}
        </p>
        <p className="text-muted">{CONFIG.notaGoogle.total} avaliações no Google</p>
        <a href={CONFIG.googleMaps} target="_blank" rel="noopener noreferrer" className="link-underline font-bold text-ink">
          Ver no Google Maps
        </a>
      </div>
    </section>
  );
}

export function Rodape() {
  const ano = 2026;
  return (
    <footer className="border-t border-line bg-cream-2 pt-16 pb-28 md:pb-16">
      <div className="container-site grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Assinatura />
          <p className="mt-5 max-w-sm text-[0.95rem]">
            {CONFIG.nome}, {CONFIG.profissao}
            <br />
            Responsável técnica: {CONFIG.nome}, {CONFIG.cro}
            <Confirmar />
          </p>
        </div>
        <nav aria-label="Rodapé" className="md:col-span-3">
          <h2 className="font-sans text-sm font-extrabold tracking-[0.14em] text-ink uppercase">Navegação</h2>
          <ul className="mt-3">
            {LINKS.filter((l) => CONFIG.secoes[l.secao]).map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-11 items-center text-[0.95rem] hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <h2 className="font-sans text-sm font-extrabold tracking-[0.14em] text-ink uppercase">Contato</h2>
          <ul className="mt-3 space-y-1 text-[0.95rem]">
            <li>
              <a
                href={`https://wa.me/${CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center hover:text-ink"
              >
                WhatsApp {CONFIG.whatsappExibicao}
              </a>
            </li>
            <li>
              <a
                href={CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center hover:text-ink"
              >
                Instagram {CONFIG.instagramUsuario}
              </a>
            </li>
            <li className="pt-2">{enderecoCompleto}</li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[0.85rem] text-muted md:flex-row md:items-center md:justify-between">
        <p>Conteúdo informativo; a indicação de cada atendimento depende de avaliação individual.</p>
        <p className="flex gap-4">
          <a href="/privacidade.html" className="link-underline inline-flex min-h-11 items-center">
            Privacidade
          </a>
          <span className="inline-flex min-h-11 items-center">© {ano} {CONFIG.nome}</span>
        </p>
      </div>
    </footer>
  );
}
