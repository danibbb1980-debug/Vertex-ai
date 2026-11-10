import { CONFIG, crmTexto, especialidadesVisiveis } from "../config";
import { IconCompass, IconConversation, IconRoute } from "../components/Icons";
import { LogoSymbol } from "../components/Logo";
import { Reveal, SectionTitle } from "../components/Reveal";

const PILARES = [
  { icon: IconConversation, t: "Avaliação individual", d: "Cada pessoa chega com uma história, uma rotina e um objetivo. A consulta começa por aí." },
  { icon: IconCompass, t: "Explicação com clareza", d: "Você entende o que foi avaliado, o que é indicado no seu caso e por quê." },
  { icon: IconRoute, t: "Acompanhamento", d: "Retornos para rever o plano e ajustar o que for necessário ao longo do caminho." },
];

export function Medico() {
  const fotos = CONFIG.fotosConsultorio;
  const esp = especialidadesVisiveis();
  return (
    <section id="medico" aria-labelledby="titulo-medico" className="relative py-20 sm:py-28">
      <span data-arc="1" data-arc-x="right" className="absolute top-10 block h-px w-px" />
      <span data-arc="1.5" data-arc-x="right" className="absolute bottom-6 block h-px w-px" />
      <div className="container-site relative z-10 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
        <div className="order-2 lg:order-1">
          {fotos.length > 0 ? (
            <div className="grid grid-cols-6 gap-3 sm:gap-4">
              {fotos.slice(0, 2).map((f, i) => (
                <Reveal key={f.src} delay={i * 0.12} className={i === 0 ? "col-span-6 sm:col-span-5" : "col-span-6 sm:col-span-5 sm:col-start-2 sm:-mt-10"}>
                  <figure className="overflow-hidden rounded-[var(--radius-card)] bg-nevoa shadow-alta">
                    <img
                      src={f.src}
                      srcSet={f.srcSmall ? `${f.srcSmall} 480w, ${f.src} ${f.width}w` : undefined}
                      sizes="(min-width: 1024px) 30rem, 92vw"
                      width={f.width}
                      height={f.height}
                      alt={f.alt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[3/2] h-auto w-full object-cover"
                    />
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="relative mx-auto aspect-square max-w-sm">
              <div className="absolute inset-0 rounded-full border border-linha" />
              <div className="absolute inset-[12%] flex items-center justify-center rounded-full bg-white shadow-alta">
                <LogoSymbol className="w-1/2" />
              </div>
            </Reveal>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <SectionTitle
            id="titulo-medico"
            rotulo="O médico"
            titulo="Atendimento individual, com tempo para conversar."
            enfase="individual"
            intro={
              <p>
                O <strong className="font-semibold text-petroleo-900">{CONFIG.nome}</strong> ({crmTexto()}
                {CONFIG.mostrarCrmSP && CONFIG.crmSP ? ` e CRM-SP ${CONFIG.crmSP}` : ""}) atende em consultório no {CONFIG.endereco.bairro} de {CONFIG.cidade}, com hora marcada. O
                acompanhamento é voltado a quem deseja emagrecer ou ganhar massa muscular com orientação médica.
              </p>
            }
          />
          {esp.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Especialidades com registro de qualificação">
              {esp.map((e) => (
                <li key={e.nome} className="rounded-full border border-linha bg-white px-3.5 py-1.5 text-sm text-petroleo-800">
                  {e.nome} · RQE {e.rqe}
                </li>
              ))}
            </ul>
          )}
          {CONFIG.formacao.length > 0 && (
            <ul className="mt-5 space-y-1 text-cinza">
              {CONFIG.formacao.map((f) => <li key={f}>{f}</li>)}
            </ul>
          )}
          <ul className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
            {PILARES.map((p, i) => (
              <Reveal as="li" key={p.t} delay={0.1 + i * 0.08} className="border-t border-linha pt-5 lg:grid lg:grid-cols-[3rem_1fr] lg:gap-x-5">
                <p.icon width={40} height={40} className="text-agua-600" />
                <div><h3 className="mt-3 text-[1.45rem] font-semibold lg:mt-0">{p.t}</h3>
                <p className="mt-1.5 text-[1rem] text-cinza">{p.d}</p></div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
