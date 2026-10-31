import { CONFIG } from '../config';
import { waLink } from '../lib/whatsapp';
import { Logo } from './Logo';

export function Footer() {
  const e = CONFIG.endereco;
  return (
    <footer className="on-dark border-t border-white/10 bg-[#16120D] pb-28 pt-16 text-cream-sand lg:pb-12">
      <div className="wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4">
            <Logo size={56} />
            <p className="font-serif text-xl text-cream-ivory">{CONFIG.nome}</p>
          </div>
          <p className="mt-5 text-sm">
            {CONFIG.nome} · {CONFIG.titulo} · {CONFIG.cro}
          </p>
        </div>
        <div className="text-sm md:col-span-4">
          <h2 className="font-sans text-[0.7rem] font-semibold uppercase tracking-label text-gold-light">Endereço</h2>
          <address className="mt-3 not-italic leading-relaxed">
            {e.rua} - {e.bairro}
            <br />
            {e.cidade} - {e.uf}, {e.cep}
          </address>
        </div>
        <div className="text-sm md:col-span-3">
          <h2 className="font-sans text-[0.7rem] font-semibold uppercase tracking-label text-gold-light">Contato</h2>
          <ul className="mt-1">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center hover:text-gold-light">
                WhatsApp {CONFIG.whatsappExibicao}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center hover:text-gold-light">
                Instagram {CONFIG.instagramHandle}
              </a>
            </li>
            <li>
              <a href="/privacidade.html" className="inline-flex min-h-[44px] items-center hover:text-gold-light">
                Política de privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap mt-12">
        <div className="filete opacity-40" />
        <p className="mt-6 text-xs leading-relaxed text-cream-sand/75">
          Conteúdo informativo; a indicação de cada tratamento depende de avaliação individual.
        </p>
      </div>
    </footer>
  );
}
