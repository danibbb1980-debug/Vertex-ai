import { CONFIG, temRegistro } from "../config";
import { Foto } from "../components/Foto";
import { Monograma } from "../components/Marca";
import { Revelar, TituloSecao } from "../components/Revelar";

export function Sobre() {
  if (!CONFIG.secoes.sobre) return null;
  const foto = CONFIG.fotos.sobre;
  const { titulo, registro, formacao } = CONFIG.profissional;
  return (
    <section aria-labelledby="titulo-sobre" className="py-24 sm:py-32">
      <div className="container-site relative z-[1] grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Revelar className="relative mx-auto w-full max-w-sm lg:max-w-none">
          {foto ? (
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-3 rounded-[2.4rem] border border-ouro/50 sm:-inset-4" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <Foto foto={foto} sizes="(min-width: 1024px) 36vw, 90vw" imgClassName="object-[50%_25%]" />
              </div>
            </div>
          ) : (
            <div className="grid aspect-[4/5] place-items-center rounded-[2rem] bg-blush-2">
              <Monograma className="w-1/2" />
            </div>
          )}
        </Revelar>
        <div>
          <TituloSecao id="titulo-sobre" rotulo="Sobre o atendimento" antes="Um cuidado feito com" enfase="calma." />
          <Revelar atraso={0.1} className="mt-8 space-y-5 text-[1.08rem] text-texto">
            <p>
              Elane Vasconcelos atende em {CONFIG.cidade}, com hora marcada, em um espaço pensado para receber com tranquilidade.
              Cada atendimento é individual e começa por uma conversa: entender o que você procura, ouvir suas dúvidas e explicar com clareza cada etapa.
            </p>
            <p>
              No furo de orelha infantil, o acolhimento se estende à criança e a quem a acompanha. Tudo é conversado antes, com tempo para perguntar.
            </p>
            {registro && (
              <p className="text-cacau">
                <strong className="font-medium">{titulo}</strong> · {registro}
              </p>
            )}
            {temRegistro() && formacao.length > 0 && (
              <ul className="list-inside list-disc text-[0.98rem]">
                {formacao.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
          </Revelar>
          <Revelar atraso={0.2} className="mt-10 grid gap-6 border-t border-ouro/40 pt-8 sm:grid-cols-3">
            {[
              ["Individual", "Um atendimento por vez, com hora marcada."],
              ["Explicado", "Você entende cada etapa antes de decidir."],
              ["Acolhedor", "Para você e para quem vem com você."],
            ].map(([t, d]) => (
              <div key={t}>
                <p className="font-serif text-2xl text-mauve">{t}</p>
                <p className="mt-1 text-[0.95rem] text-texto">{d}</p>
              </div>
            ))}
          </Revelar>
        </div>
      </div>
    </section>
  );
}
