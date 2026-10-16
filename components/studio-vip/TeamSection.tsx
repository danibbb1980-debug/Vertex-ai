import Image from "next/image";
import vando from "@/public/studio-vip/vando.jpg";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "./ui";

/*
  Só o que as peças oficiais do estúdio afirmam. Vando é identificado pela
  própria peça dele. Natália e Aline aparecem só em texto: as imagens
  fornecidas não dizem quem é quem na foto da equipe, e um nome trocado sob
  o rosto errado é pior do que nenhuma foto.
*/
const people = [
  {
    name: "Vando",
    role: "Sócio proprietário",
    text: "Atleta de handebol, graduado em Educação Física e certificado em Treinamento Funcional pela Connection (2025). Mais de 6 anos de experiência ministrando aulas.",
  },
  {
    name: "Natália",
    role: "Sócia proprietária",
    text: "Atleta de handebol e formada em Educação Física, com especialização em treinamento funcional.",
  },
  {
    name: "Aline",
    role: "Acompanhamento nutricional",
    text: "Profissional responsável pelo acompanhamento nutricional personalizado oferecido pelo estúdio.",
  },
];

export function TeamSection() {
  return (
    <section id="equipe" className="relative isolate overflow-hidden bg-[#03406d] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          {/* ── Foto do Vando, já sobre o azul da peça original ── */}
          <Reveal className="relative">
            <div className="vip-clip reveal relative mx-auto aspect-[530/615] w-full max-w-md overflow-hidden lg:max-w-none">
              <Image
                src={vando}
                alt="Vando, sócio proprietário do Studio VIP, sorrindo de braços cruzados com a camiseta do estúdio"
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 100vw"
                className="h-full w-full object-cover"
              />
              {/* Funde as bordas da foto com o fundo da seção (a foto já vem do azul da peça original) */}
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#03406d_0%,rgba(3,64,109,0)_26%),linear-gradient(to_right,#03406d_0%,rgba(3,64,109,0.6)_14%,rgba(3,64,109,0)_34%)]"
                aria-hidden="true"
              />
            </div>
            <div className="relative -mt-14 border-l-4 border-vip-green pl-4 sm:ml-4">
              <p className="font-vip-display text-5xl leading-none font-extrabold uppercase italic sm:text-6xl">
                Vando
              </p>
              <p className="mt-1 text-sm text-white/85">Sócio proprietário</p>
            </div>
          </Reveal>

          {/* ── Texto ── */}
          <div>
            <Reveal>
              <Eyebrow>Conheça quem está por trás do Studio VIP</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-[clamp(2.6rem,8vw,5rem)]">
                Profissionais que treinam <span className="text-vip-green">com propósito.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 text-lg leading-relaxed text-white/90">
                À frente do Studio VIP estão Vando e Natália, atletas de handebol que levaram sua
                experiência com performance e superação para o universo do treinamento
                personalizado.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-4 leading-relaxed text-white/70">
                Com formação em Educação Física e experiência no mercado, eles valorizam a
                orientação próxima, o respeito às necessidades de cada aluno e a construção de uma
                rotina de treino consistente.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-4 leading-relaxed text-white/70">
                A equipe também conta com Aline, profissional responsável pelo acompanhamento
                nutricional oferecido pelo estúdio.
              </p>
            </Reveal>

            <ul className="mt-10 divide-y divide-white/12 border-y border-white/12">
              {people.map((person, index) => (
                <Reveal
                  as="li"
                  key={person.name}
                  delay={0.08 * index}
                  className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6"
                >
                  <div>
                    <h3 className="text-3xl">{person.name}</h3>
                    <p className="mt-1 text-[0.7rem] font-bold tracking-[0.16em] text-vip-green uppercase">
                      {person.role}
                    </p>
                  </div>
                  <p className="text-[0.95rem] leading-relaxed text-white/70">{person.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
