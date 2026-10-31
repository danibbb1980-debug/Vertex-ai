import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../../config";
import { useUnidade } from "../../lib/unidade";
import { linkWhatsApp } from "../../lib/whatsapp";
import { cn } from "../../lib/cn";
import { IconeFechar, IconeMenu, IconeWhatsApp } from "../ui/Icones";

export function Header() {
  const { unidade, unidades, setUnidadeId } = useUnidade();
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);
  const s = CONFIG.secoes;

  const links = [
    s.clinica && { href: "#clinica", texto: "A clínica" },
    s.atendimentos && CONFIG.atendimentos.length > 0 && { href: "#atendimentos", texto: "Atendimentos" },
    s.comoFunciona && { href: "#como-funciona", texto: "Como funciona" },
    s.faq && { href: "#duvidas", texto: "Dúvidas" },
    s.contato && { href: "#contato", texto: "Contato" },
    s.agendamento && { href: "#agendar", texto: "Solicitar horário" },
  ].filter(Boolean) as { href: string; texto: string }[];

  useEffect(() => {
    const ao = () => setRolou(window.scrollY > 24);
    ao();
    window.addEventListener("scroll", ao, { passive: true });
    return () => window.removeEventListener("scroll", ao);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    document.body.style.overflow = "hidden";
    painel.current?.querySelector<HTMLElement>("a,button,select")?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
      if (e.key === "Tab" && painel.current) {
        const f = painel.current.querySelectorAll<HTMLElement>("a,button,select");
        const primeiro = f[0];
        const ultimo = f[f.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };
    document.addEventListener("keydown", tecla);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  const solido = rolou || aberto;
  const wa = linkWhatsApp(unidade.whatsapp, CONFIG.mensagens.geral);

  const Seletor = ({ className }: { className?: string }) =>
    unidades.length > 1 ? (
      <label className={cn("flex items-center gap-2 text-sm", className)}>
        <span className="sr-only">Unidade</span>
        <select
          value={unidade.id}
          onChange={(e) => setUnidadeId(e.target.value)}
          className={cn(
            "min-h-11 cursor-pointer rounded-full border px-4 text-sm font-medium",
            solido ? "border-line bg-white text-navy-900" : "border-white/25 bg-navy-900/40 text-white",
          )}
        >
          {unidades.map((u) => (
            <option key={u.id} value={u.id} className="text-navy-900">
              {u.nomeCurto}
            </option>
          ))}
        </select>
      </label>
    ) : null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-500",
        CONFIG.rascunho ? "top-8" : "top-0",
        solido
          ? "border-b border-line/70 bg-ice/92 shadow-[0_8px_30px_-20px_rgb(2_24_38/0.5)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-site flex h-[4.5rem] items-center gap-4">
        <a href="#inicio" className="flex shrink-0 items-center gap-3 rounded-lg" aria-label={`${CONFIG.marca}, ${unidade.nome}, voltar ao início`}>
          <img src={unidade.logo} alt="" width={44} height={44} className="size-11 rounded-[10px] ring-1 ring-gold-400/40" />
          <span className={cn("hidden leading-tight", unidades.length > 1 ? "sm:block xl:hidden 2xl:block" : "sm:block")}>
            <span className={cn("block font-serif text-[1.05rem]", solido ? "text-navy-900" : "text-white")}>{CONFIG.marca}</span>
            <span className={cn("rotulo block text-[0.62rem]", solido ? "text-teal-700" : "text-teal-300")}>{unidade.nome}</span>
          </span>
        </a>

        <nav aria-label="Principal" className="ml-auto hidden xl:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn(
                    "relative inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3 text-[0.9rem] font-medium transition-colors after:absolute after:inset-x-3 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-gold-400 after:transition-transform after:duration-300 hover:after:scale-x-100",
                    solido ? "text-ink hover:text-teal-700" : "text-white/85 hover:text-white",
                  )}
                >
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Seletor className="hidden xl:flex" />

        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brilho ml-auto hidden min-h-12 items-center gap-2 rounded-full bg-teal-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 sm:inline-flex xl:ml-2 whitespace-nowrap"
        >
          <IconeWhatsApp tamanho={18} />
          Agendar avaliação
          <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
        </a>

        <button
          ref={botaoMenu}
          type="button"
          className={cn(
            "ml-auto grid size-12 cursor-pointer place-items-center rounded-full border sm:ml-0 xl:hidden",
            solido ? "border-line text-navy-900" : "border-white/25 text-white",
          )}
          aria-expanded={aberto}
          aria-controls="menu-celular"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setAberto((a) => !a)}
        >
          {aberto ? <IconeFechar tamanho={22} /> : <IconeMenu tamanho={22} />}
        </button>
      </div>

      <div
        id="menu-celular"
        ref={painel}
        hidden={!aberto}
        className="h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-line bg-ice xl:hidden"
      >
        <nav aria-label="Menu do celular" className="container-site flex flex-col py-6">
          <Seletor className="mb-4" />
          <ul className="divide-y divide-line">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="flex min-h-14 items-center justify-between font-serif text-2xl text-navy-900"
                >
                  {l.texto}
                  <span aria-hidden="true" className="h-px w-6 bg-gold-400" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-teal-600 px-6 font-semibold text-white"
          >
            <IconeWhatsApp /> Agendar avaliação pelo WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
