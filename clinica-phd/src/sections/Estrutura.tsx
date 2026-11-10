import { CONFIG, preenchido } from "../config";
import { Titulo } from "../components/Titulo";
import { Revela } from "../components/Revela";
import { TabelaHorarios } from "../components/TabelaHorarios";
import { IconeEmail, IconeInstagram, IconeLocal, IconeTelefone, IconeWhatsapp } from "../components/Icones";
import { telHref, temTelefone, temWhatsapp, waHref } from "../lib/contato";

export function Estrutura() {
  return (
    <section id="estrutura" aria-labelledby="titulo-estrutura" className="bg-areia/55 py-24 lg:py-32">
      <div className="container-phd">
        <Titulo id="titulo-estrutura" rotulo="Estrutura">
          Quando e onde <em>atendemos</em>
        </Titulo>

        <div className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-12">
          <Revela className="canto-d bg-creme p-7 sm:p-9 lg:col-span-7" id="horarios">
            <h3 className="text-[1.75rem]">Horário por dia</h3>
            <div className="mt-6">
              <TabelaHorarios />
            </div>
            {CONFIG.avisoFeriados ? <p className="mt-5 text-[0.95rem] text-cinza-texto">{CONFIG.avisoFeriados}</p> : null}
          </Revela>

          <div className="grid gap-6 lg:col-span-5">
            <Revela className="bg-creme p-7 sm:p-9" atraso={100}>
              <h3 className="flex items-center gap-3 text-[1.75rem]">
                <IconeLocal className="size-6 text-bronze-escuro" />O espaço
              </h3>
              <p className="mt-5 font-semibold">{CONFIG.endereco.edificio}</p>
              <p className="text-cinza-texto">
                {CONFIG.endereco.complemento}
                <br />
                {CONFIG.endereco.logradouro} · {CONFIG.endereco.bairro}
              </p>
            </Revela>

            <Revela className="bg-creme p-7 sm:p-9" atraso={180}>
              <h3 className="text-[1.75rem]">Formas de contato</h3>
              <ul className="mt-4 divide-y divide-bronze/25">
                {temWhatsapp ? (
                  <li>
                    <a href={waHref()} target="_blank" rel="noopener noreferrer" className="flex min-h-13 items-center gap-3 py-2 hover:text-bronze-texto">
                      <IconeWhatsapp className="size-5 text-bronze-escuro" /> WhatsApp
                      <span className="sr-only">(abre em nova aba)</span>
                    </a>
                  </li>
                ) : null}
                {temTelefone ? (
                  <li>
                    <a href={telHref} className="flex min-h-13 items-center gap-3 py-2 hover:text-bronze-texto">
                      <IconeTelefone className="size-5 text-bronze-escuro" /> {CONFIG.telefoneExibicao}
                    </a>
                  </li>
                ) : null}
                {preenchido(CONFIG.email) ? (
                  <li>
                    <a href={`mailto:${CONFIG.email}`} className="flex min-h-13 items-center gap-3 break-all py-2 hover:text-bronze-texto">
                      <IconeEmail className="size-5 shrink-0 text-bronze-escuro" /> {CONFIG.email}
                    </a>
                  </li>
                ) : null}
                {preenchido(CONFIG.instagram.url) ? (
                  <li>
                    <a href={CONFIG.instagram.url} target="_blank" rel="noopener noreferrer" className="flex min-h-13 items-center gap-3 py-2 hover:text-bronze-texto">
                      <IconeInstagram className="size-5 text-bronze-escuro" /> {CONFIG.instagram.usuario}
                      <span className="sr-only">(Instagram, abre em nova aba)</span>
                    </a>
                  </li>
                ) : null}
              </ul>
            </Revela>
          </div>
        </div>

        {CONFIG.fotos.length ? (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIG.fotos.map((f) => (
              <Revela as="li" key={f.src}>
                <picture>
                  <source srcSet={`${f.src}.avif`} type="image/avif" />
                  <img
                    src={`${f.src}.webp`}
                    alt={f.alt}
                    width={f.largura}
                    height={f.altura}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover saturate-[0.9] sepia-[0.08]"
                  />
                </picture>
              </Revela>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
