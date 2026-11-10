import { useState } from "react";
import { CONFIG, preenchido } from "../config";
import { Titulo } from "../components/Titulo";
import { Revela } from "../components/Revela";
import { BotaoAgendar, LinkTelefone } from "../components/Botoes";
import { IconeEmail, IconeInstagram, IconeLocal, IconeSeta } from "../components/Icones";
import { Monograma } from "../components/Monograma";
import { enderecoLinha2, enderecoLinha3, temWhatsapp } from "../lib/contato";
import { resumoHorarios } from "../lib/horarios";

/** Mapa do Google carregado só quando a pessoa pede (sem cookies de terceiros antes disso). */
function Mapa() {
  const [carregar, setCarregar] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.maps.consulta)}&z=16&output=embed`;
  return (
    <div className="canto-d relative aspect-[4/3] w-full overflow-hidden bg-chumbo lg:aspect-auto lg:h-full lg:min-h-[28rem]">
      {carregar ? (
        <iframe
          title={`Mapa com a localização da ${CONFIG.nome}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
          allowFullScreen
        />
      ) : (
        <div className="escuro absolute inset-0 flex flex-col items-start justify-end gap-5 p-7 sm:p-9">
          <svg aria-hidden="true" className="absolute inset-0 size-full opacity-[0.22]" preserveAspectRatio="none" viewBox="0 0 400 300">
            <g fill="none" stroke="#C49A6C" strokeWidth="1">
              <path d="M-10 210 C 90 190, 150 120, 250 130 S 380 60, 420 70" />
              <path d="M-10 216 C 90 196, 150 126, 250 136 S 380 66, 420 76" />
              <path d="M120 -10 L 160 320" />
              <path d="M126 -10 L 166 320" />
              <path d="M-10 90 L 420 160" />
            </g>
          </svg>
          <Monograma className="absolute right-8 top-8 h-14 w-auto" cor="#C49A6C" espessura={9} />
          <p className="relative max-w-xs text-creme">
            <span className="font-serif text-2xl">{CONFIG.endereco.bairro}</span>
            <span className="mt-1 block text-[0.95rem] text-creme/80">
              {CONFIG.endereco.cidade} - {CONFIG.endereco.uf}
            </span>
          </p>
          <button type="button" onClick={() => setCarregar(true)} className="botao botao-claro relative">
            <IconeLocal className="size-5" /> Mostrar mapa
          </button>
          <p className="relative text-[0.8rem] text-creme/75">Ao mostrar o mapa, o Google pode usar cookies.</p>
        </div>
      )}
    </div>
  );
}

export function Localizacao() {
  const grupos = resumoHorarios();
  return (
    <section id="contato" aria-labelledby="titulo-contato" className="py-24 lg:py-32">
      <div className="container-phd">
        <Titulo id="titulo-contato" rotulo="Localização e contato">
          Venha nos <em>visitar</em>
        </Titulo>
        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <Revela className="lg:col-span-5">
            <address className="not-italic">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-bronze-texto">Endereço</p>
              <p className="mt-3 font-serif text-[1.6rem] leading-snug">{CONFIG.endereco.logradouro}</p>
              <p className="mt-1 text-cinza-texto">
                {CONFIG.endereco.complemento} · {enderecoLinha2}
                <br />
                {enderecoLinha3}
              </p>
            </address>
            {preenchido(CONFIG.maps.url) ? (
              <a href={CONFIG.maps.url} target="_blank" rel="noopener noreferrer" className="botao botao-contorno mt-6">
                Como chegar <IconeSeta />
                <span className="sr-only">(abre o Google Maps em nova aba)</span>
              </a>
            ) : null}

            <div className="filete mt-10" aria-hidden="true" />

            <p className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-bronze-texto">Horários</p>
            <dl className="mt-3 space-y-1.5">
              {grupos.map((g) => (
                <div key={g.dias} className="flex justify-between gap-6">
                  <dt>{g.dias}</dt>
                  <dd className={g.aberto ? "" : "text-cinza-texto"}>{g.aberto ? g.texto : "Fechado"}</dd>
                </div>
              ))}
            </dl>
            {CONFIG.avisoFeriados ? <p className="mt-3 text-[0.95rem] text-cinza-texto">{CONFIG.avisoFeriados}</p> : null}

            <div className="filete mt-10" aria-hidden="true" />

            <p className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-bronze-texto">Contato</p>
            <div className="mt-4 flex flex-col items-start gap-1">
              {temWhatsapp ? <BotaoAgendar className="mb-3" /> : null}
              <LinkTelefone className="hover:text-bronze-texto" />
              {preenchido(CONFIG.email) ? (
                <a href={`mailto:${CONFIG.email}`} className="inline-flex min-h-12 items-center gap-2 break-all font-medium hover:text-bronze-texto">
                  <IconeEmail className="size-[1.15rem] shrink-0" /> {CONFIG.email}
                </a>
              ) : null}
              {preenchido(CONFIG.instagram.url) ? (
                <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 font-medium hover:text-bronze-texto">
                  <IconeInstagram className="size-[1.15rem]" /> {CONFIG.instagram.usuario}
                  <span className="sr-only">(Instagram, abre em nova aba)</span>
                </a>
              ) : null}
              {!temWhatsapp ? <BotaoAgendar className="mt-3" /> : null}
            </div>
          </Revela>
          <Revela className="lg:col-span-7" atraso={120}>
            <Mapa />
          </Revela>
        </div>
      </div>
    </section>
  );
}
