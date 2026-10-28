import { CONFIG } from "../config";
import { Secao } from "../components/Secao";
import { Foto, Logo } from "../components/Foto";
import { BotaoInstagram, ComPlaceholder, AConfirmar } from "../components/Botoes";
import { Brilho, Lua } from "../components/Icones";

export function Profissional() {
  return (
    <Secao id="profissional">
      <div className="container-site">
        <article className="revelar relative grid overflow-hidden rounded-xl3 bg-white/90 ring-1 ring-areia md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative min-h-[22rem] bg-rosa-claro md:min-h-full">
            <Foto
              nome={CONFIG.fotos.doutora.arquivo}
              alt={CONFIG.fotos.doutora.alt}
              sizes="(min-width: 768px) 40vw, 92vw"
              className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
            />
          </div>
          <div className="relative p-8 md:p-12 lg:p-16">
            <Lua tamanho={36} strokeWidth={1.3} className="absolute right-8 top-8 text-taupe/70" />
            <p className="eyebrow">A profissional</p>
            <h2 id="profissional-titulo" className="mt-4 text-[clamp(2rem,1.5rem+2.4vw,3.2rem)] font-medium">
              {CONFIG.nome}
            </h2>
            <p className="mt-2 font-display text-2xl italic text-menta-escuro">a {CONFIG.apelido}</p>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[0.98rem]">
              <div>
                <dt className="text-sm font-semibold text-taupe-texto">Profissão</dt>
                <dd className="font-bold">{CONFIG.profissao}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-taupe-texto">Registro</dt>
                <dd className="font-bold">
                  <ComPlaceholder texto={CONFIG.cro} />
                </dd>
              </div>
              {CONFIG.mostrarEspecialidades && (
                <div>
                  <dt className="text-sm font-semibold text-taupe-texto">Especialidade</dt>
                  <dd className="font-bold">
                    <ComPlaceholder texto={CONFIG.especialidade} />
                  </dd>
                </div>
              )}
            </dl>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-cacau-2">
              A Dra. Liliane Ormeneze, a Tia Lili, atende bebês, crianças e adolescentes no Centro de Poços de Caldas, sempre
              com horário agendado.
            </p>
            <p className="mt-4 max-w-xl text-cacau-2">
              {/* CONFIRMAR COM A CLÍNICA: incluir somente formação e trajetória informadas e comprovadas pela doutora. */}
              <AConfirmar>[Formação e trajetória: incluir somente dados informados pela doutora]</AConfirmar>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <BotaoInstagram>{CONFIG.instagram.usuario}</BotaoInstagram>
              <Logo largura={72} className="h-auto w-[60px] opacity-95" />
            </div>
            <Brilho tamanho={22} className="absolute bottom-10 right-10 text-manteiga" />
          </div>
        </article>
      </div>
    </Secao>
  );
}
