import { useState } from "react";
import { CONFIG, credencial, type Unidade } from "../config";
import { cn, externo, linkWhatsapp, srcSet } from "../lib/utils";
import { Botao, BotaoWhatsapp, Eyebrow, TituloSecao } from "../components/Base";
import {
  Brilho,
  Conversa,
  Coracao,
  Crescimento,
  Dente,
  Escudo,
  Estrela,
  Familia,
  Gengiva,
  Lupa,
  Pin,
  Prancheta,
  Relogio,
  Seta,
  Sorriso,
  Telefone,
} from "../components/icons";
import { MaskedTextReveal } from "../components/ui/MaskedTextReveal";
import { Reveal } from "../components/ui/Reveal";
import { Marquee } from "../components/ui/Marquee";

const semUF = (c: string) => c.replace(/\s*-\s*SP$/, "");

/* ---------------------------------- Faixa ---------------------------------- */
export function Faixa() {
  return (
    <div aria-hidden className="border-y border-rosa-100/80 bg-white/40">
      <Marquee
        itens={[
          "Clínica geral e odontopediatria",
          "Prevenção desde cedo",
          "Explicações claras para os pais",
          "São João da Boa Vista",
          "Artur Nogueira",
          "Casa Branca",
        ]}
      />
    </div>
  );
}

/* ---------------------------------- Sobre ---------------------------------- */
export function Sobre() {
  const f = CONFIG.fotos.sobre;
  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="relative order-2 mx-auto w-full max-w-[380px] lg:order-1">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-lilas-50">
            <img
              src={`${f.base}-800.webp`}
              srcSet={srcSet(f.base)}
              sizes="(min-width: 1024px) 380px, 86vw"
              width={f.largura}
              height={f.altura}
              alt={f.alt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] h-auto w-full object-cover object-[50%_20%]"
            />
          </div>
          <div aria-hidden className="absolute -right-5 -top-5 -z-10 h-full w-full rounded-[2.5rem] bg-rosa-50" />
          <p aria-hidden className="absolute -bottom-12 left-2 rotate-[-5deg] font-hand text-[1.9rem] text-lilas">
            cuidado de pertinho
          </p>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Eyebrow>Sobre a doutora</Eyebrow>
          <h2 id="titulo-sobre" className="text-[2.1rem] leading-[1.08] md:text-5xl">
            Quem cuida do sorriso do seu <span className="manuscrita">filho</span>
          </h2>
          <MaskedTextReveal className="mt-8 font-serif text-[1.45rem] leading-[1.4] text-tinta/85 md:text-[1.75rem]">
            Cirurgiã-dentista, com atuação em clínica geral e odontopediatria. Cuida do sorriso das crianças com{" "}
            <em>atenção,</em> <em>paciência</em> e explicações claras para os pais.
          </MaskedTextReveal>
          <Reveal index={1}>
            <p className="mt-7 max-w-xl text-suave">
              A Dra. Beatryz Furlaneto atende em São João da Boa Vista, Artur Nogueira e Casa Branca. Nos retornos
              preventivos, além da limpeza e da avaliação dos dentes, ela acompanha como está o crescimento e o
              desenvolvimento facial da criança.
            </p>
          </Reveal>
          <Reveal index={2}>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-tinta/10 bg-tinta/10 sm:grid-cols-2">
              <div className="bg-marfim p-5">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-suave">Registro</dt>
                <dd className="mt-1.5 font-serif text-xl text-tinta">{CONFIG.cro}</dd>
              </div>
              <div className="bg-marfim p-5">
                <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-suave">Atuação</dt>
                <dd className="mt-1.5 font-serif text-xl text-tinta">{credencial}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Atendimento ------------------------------- */
const servicos = [
  {
    icone: Lupa,
    titulo: "Avaliação odontológica infantil",
    texto: "Um olhar atento para os dentes, a gengiva e os hábitos da criança, com tudo explicado aos pais.",
  },
  {
    icone: Brilho,
    titulo: "Limpeza e prevenção",
    texto: "Limpeza profissional e orientações de escovação para manter o sorriso saudável no dia a dia.",
  },
  {
    icone: Crescimento,
    titulo: "Crescimento e desenvolvimento facial",
    texto: "Nos retornos preventivos, a doutora acompanha como está o crescimento e o desenvolvimento facial.",
  },
  {
    icone: Familia,
    titulo: "Todas as idades infantis",
    texto: "Crianças de todas as idades são bem-vindas, sempre com atendimento no ritmo de cada uma.",
    confirmar: true,
  },
];

export function Atendimento() {
  return (
    <section id="atendimento" aria-label="Atendimento" className="relative bg-creme/60 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-end gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <TituloSecao eyebrow="Atendimento">
            Cuidado do sorriso em cada <em>fase</em> da infância
          </TituloSecao>
          <Reveal>
            <p className="text-suave md:pb-2">
              Consultas tranquilas, no tempo da criança, e pais bem informados sobre cada passo.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((s, i) => (
            <Reveal as="li" index={i % 3} key={s.titulo}>
              <article className="group relative h-full overflow-hidden rounded-[2rem] border border-tinta/[0.07] bg-white/80 p-7 transition-all duration-500 ease-[var(--ease-suave)] hover:-translate-y-1 hover:border-rosa-100 hover:bg-white hover:shadow-[0_30px_60px_-36px_rgba(111,40,67,0.4)]">
                <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rosa-50 transition-transform duration-700 ease-[var(--ease-suave)] group-hover:scale-125" />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-rosa-50 text-rosa-escuro ring-1 ring-rosa-100 transition-colors duration-500 group-hover:bg-rosa-escuro group-hover:text-white">
                  <s.icone className="h-6 w-6" />
                </span>
                <h3 className="relative mt-8 text-[1.45rem] leading-tight text-tinta">{s.titulo}</h3>
                <p className="relative mt-3 text-[0.98rem] text-suave">{s.texto}</p>
                {/* CONFIRMAR COM A DOUTORA: faixas etárias atendidas */}
                {s.confirmar && (
                  <p className="relative mt-4 inline-block rounded-full bg-sol/30 px-3 py-1 text-xs font-medium text-tinta">
                    [A CONFIRMAR] faixas etárias
                  </p>
                )}
              </article>
            </Reveal>
          ))}
          <Reveal as="li" index={1}>
            <article className="flex h-full flex-col justify-between rounded-[2rem] bg-lilas-profundo p-7 text-marfim sm:col-span-2 lg:col-span-2">
              <div>
                <Coracao className="h-7 w-7 text-rosa-100" />
                <h3 className="mt-8 text-[1.45rem] leading-tight">Outros cuidados</h3>
                <p className="mt-3 text-[0.98rem] text-lilas-50/85">
                  Tem uma dúvida sobre outro tratamento? Fale com a doutora e ela orienta o melhor caminho.
                </p>
              </div>
              <a
                href={linkWhatsapp()}
                {...externo}
                className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-marfim px-5 py-3 text-sm font-semibold text-lilas-profundo transition-transform duration-300 hover:-translate-y-0.5"
              >
                Falar com a doutora <Seta className="h-4 w-4" />
              </a>
            </article>
          </Reveal>
        </ul>

        <Reveal className="mt-12 flex justify-center">
          <BotaoWhatsapp>Agendar avaliação</BotaoWhatsapp>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- Primeira consulta ---------------------------- */
const etapas = [
  {
    icone: Conversa,
    titulo: "Conversa pelo WhatsApp",
    texto: "Você conta um pouco sobre seu filho e combina o melhor dia e a unidade mais perto.",
  },
  {
    icone: Dente,
    titulo: "Avaliação com calma",
    texto: "A doutora conhece a criança no ritmo dela, avalia o sorriso e explica tudo aos pais.",
  },
  {
    icone: Prancheta,
    titulo: "Plano combinado com clareza",
    texto: "Vocês saem sabendo o que foi visto, os próximos passos e os cuidados em casa.",
  },
];

export function PrimeiraConsulta() {
  return (
    <section aria-label="Como é a primeira consulta" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <TituloSecao eyebrow="Primeira consulta" centro className="mx-auto max-w-2xl">
          Como é a primeira <em>visita</em>
        </TituloSecao>
        <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          <span aria-hidden className="absolute left-[16.6%] right-[16.6%] top-8 hidden border-t border-dashed border-rosa/40 md:block" />
          {etapas.map((e, i) => (
            <Reveal as="li" index={i} key={e.titulo} className="relative text-center">
              <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border border-rosa-100 bg-marfim text-rosa-escuro shadow-[0_0_0_8px_var(--color-marfim)]">
                <e.icone className="h-7 w-7" />
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-lilas-profundo text-[0.72rem] font-semibold text-white">
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-6 text-[1.4rem] text-tinta">{e.titulo}</h3>
              <p className="mx-auto mt-2 max-w-[19rem] text-[0.98rem] text-suave">{e.texto}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------- Para os pais ------------------------------ */
const beneficios = [
  { icone: Dente, texto: "Ajuda a prevenir cáries e o acúmulo de placa bacteriana." },
  { icone: Gengiva, texto: "Contribui para manter a gengiva saudável." },
  { icone: Sorriso, texto: "Ajuda a evitar o mau hálito." },
  { icone: Coracao, texto: "Apoia o desenvolvimento de um sorriso saudável." },
];

export function ParaOsPais() {
  return (
    <section aria-label="Para os pais" className="px-3 md:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-rosa-50 px-5 py-20 md:rounded-[3.5rem] md:px-12 md:py-24">
        <Estrela aria-hidden className="flutuar absolute right-10 top-10 h-6 w-6 text-rosa/50" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <TituloSecao eyebrow="Para os pais">
              Por que a limpeza e os retornos <em>importam</em>
            </TituloSecao>
            <Reveal index={1}>
              <p className="mt-6 max-w-md text-suave">
                Os retornos preventivos são o momento de cuidar antes que algo incomode. Em linguagem simples, é isso
                que a limpeza profissional faz pela saúde bucal das crianças:
              </p>
            </Reveal>
            <Reveal index={2}>
              <p className="mt-6 max-w-md text-sm text-suave/90">
                Cada criança é única. A frequência dos retornos é definida pela doutora na consulta.
              </p>
            </Reveal>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {beneficios.map((b, i) => (
              <Reveal as="li" index={i} key={b.texto}>
                <div className="flex h-full flex-col gap-5 rounded-[1.75rem] bg-white/80 p-6 ring-1 ring-rosa-100/80">
                  <b.icone className="h-7 w-7 text-rosa-escuro" />
                  <p className="font-serif text-[1.2rem] leading-snug text-tinta">{b.texto}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Onde atendo ------------------------------- */
function Confirmar({ children = "A CONFIRMAR" }: { children?: string }) {
  return (
    <span className="inline-block rounded-full bg-sol/30 px-2.5 py-0.5 text-xs font-medium text-tinta">[{children}]</span>
  );
}

function CartaoUnidade({ u, i }: { u: Unidade; i: number }) {
  const cidade = semUF(u.cidade);
  return (
    <Reveal as="li" index={i} className="h-full">
      <article className="group flex h-full flex-col rounded-[2rem] border border-tinta/[0.08] bg-white/85 p-7 transition-all duration-500 ease-[var(--ease-suave)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgba(69,48,94,0.45)]">
        <div className="flex items-center justify-between">
          <span className="font-hand text-[1.6rem] leading-none text-lilas">0{i + 1}</span>
          <Pin className="h-6 w-6 text-rosa-escuro transition-transform duration-500 group-hover:-translate-y-0.5" />
        </div>
        <h3 className="mt-5 text-[1.6rem] leading-tight text-tinta">{u.cidade}</h3>
        <p className="mt-1 font-medium text-rosa-escuro">
          {/* CONFIRMAR COM A DOUTORA: nome da unidade */}
          {u.clinica ?? <Confirmar>Unidade a confirmar</Confirmar>}
        </p>

        <dl className="mt-6 space-y-4 text-[0.95rem]">
          <div className="flex gap-3">
            <dt className="sr-only">Endereço</dt>
            <Pin aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-suave" />
            <dd className="text-suave">
              {u.endereco ? (
                <>
                  {u.endereco}
                  {u.cep && <span className="block">CEP {u.cep}</span>}
                </>
              ) : (
                // CONFIRMAR COM A DOUTORA: endereço
                <Confirmar>Endereço a confirmar</Confirmar>
              )}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="sr-only">Dias e horários</dt>
            <Relogio aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-suave" />
            <dd className="w-full text-suave">
              {u.horarios ? (
                <>
                  <ul className="space-y-0.5">
                    {u.horarios.map((h) => (
                      <li key={h.dias} className="flex justify-between gap-3">
                        <span>{h.dias}</span>
                        <span className="text-tinta">{h.horas}</span>
                      </li>
                    ))}
                  </ul>
                  {!u.horariosConfirmados && (
                    <span className="mt-2 block">
                      <Confirmar /> <span className="text-xs">horários da ficha do Google</span>
                    </span>
                  )}
                </>
              ) : (
                // CONFIRMAR COM A DOUTORA: dias e horários desta unidade
                <Confirmar>Dias e horários a confirmar</Confirmar>
              )}
            </dd>
          </div>
          {u.telefone && (
            <div className="flex gap-3">
              <dt className="sr-only">{u.telefone.rotulo}</dt>
              <Telefone aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-suave" />
              <dd className="text-suave">
                {u.telefone.rotulo}:{" "}
                <a href={`tel:${u.telefone.tel}`} className="font-medium text-tinta underline decoration-rosa/40 underline-offset-4 hover:text-rosa-escuro">
                  {u.telefone.numero}
                </a>
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex flex-col gap-2.5 pt-8">
          <BotaoWhatsapp cidade={cidade} className="w-full">
            Agendar nesta unidade
          </BotaoWhatsapp>
          {u.mapsUrl && (
            <Botao href={u.mapsUrl} externoLink variante="secundario" className="w-full">
              Ver no mapa
            </Botao>
          )}
        </div>
      </article>
    </Reveal>
  );
}

function Mapa({ endereco }: { endereco: string }) {
  const [carregar, setCarregar] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`;
  return (
    <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-[2rem] border border-tinta/[0.08] bg-lilas-50 sm:aspect-[16/6]">
      {carregar ? (
        <iframe
          title="Mapa da unidade de São João da Boa Vista"
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <svg aria-hidden viewBox="0 0 400 200" className="absolute inset-0 h-full w-full text-lilas/20" preserveAspectRatio="xMidYMid slice">
            <path d="M-10 140 C80 110 120 170 210 120 S330 60 410 90" fill="none" stroke="currentColor" strokeWidth="14" />
            <path d="M120 -10 C140 60 100 120 150 210" fill="none" stroke="currentColor" strokeWidth="8" />
            <path d="M290 -10 C270 80 320 120 300 210" fill="none" stroke="currentColor" strokeWidth="6" />
          </svg>
          <Pin className="relative h-9 w-9 text-rosa-escuro" />
          <p className="relative max-w-sm text-sm text-suave">
            São João da Boa Vista · {endereco.split(",")[0]}
          </p>
          <button
            type="button"
            onClick={() => setCarregar(true)}
            className="relative cursor-pointer rounded-full border border-tinta/15 bg-white px-5 py-2.5 text-sm font-semibold text-tinta transition-colors hover:border-rosa-escuro/40"
          >
            Carregar mapa
          </button>
          <p className="relative text-xs text-suave">O mapa do Google só carrega depois do seu toque.</p>
        </div>
      )}
    </div>
  );
}

export function OndeAtendo() {
  const sj = CONFIG.unidades.find((u) => u.mapaEmbed);
  return (
    <section id="onde-atendo" aria-label="Onde atendo" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-end gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <TituloSecao eyebrow="Onde atendo">
            Três cidades, o mesmo <em>cuidado</em>
          </TituloSecao>
          <Reveal>
            <p className="text-suave md:pb-2">
              Escolha a unidade mais perto de vocês. A mensagem do WhatsApp já vai com a cidade escolhida.
            </p>
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-4 lg:grid-cols-3">
          {CONFIG.unidades.map((u, i) => (
            <CartaoUnidade key={u.id} u={u} i={i} />
          ))}
        </ul>
        {sj?.mapaEmbed && (
          <Reveal>
            <Mapa endereco={sj.mapaEmbed} />
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------- CTA ---------------------------------- */
export function CtaFinal() {
  return (
    <section id="contato" aria-labelledby="titulo-cta" className="px-3 py-6 md:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-lilas-profundo px-6 py-20 text-center text-marfim md:rounded-[3.5rem] md:py-28">
        <div aria-hidden className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rosa-escuro/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-lilas/30 blur-3xl" />
        <Estrela aria-hidden className="flutuar absolute left-[12%] top-16 h-5 w-5 text-sol/80" />
        <Estrela aria-hidden className="flutuar absolute bottom-20 right-[14%] h-4 w-4 text-rosa-100/70 [animation-delay:-4s]" />
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-rosa-100">Agende uma avaliação</p>
          <h2 id="titulo-cta" className="text-[2.3rem] leading-[1.08] md:text-[3.4rem]">
            Vamos cuidar do sorriso do seu filho <span className="manuscrita !text-rosa-100">juntos?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lilas-50/85">
            Mande uma mensagem e combine o melhor dia e a unidade mais perto de vocês.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <BotaoWhatsapp variante="claro">Agendar pelo WhatsApp</BotaoWhatsapp>
            <Botao href={CONFIG.instagram} externoLink variante="contorno-claro">
              Ver no Instagram
            </Botao>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Rodapé -------------------------------- */
export function Rodape() {
  return (
    <footer className="mt-16 border-t border-tinta/[0.08]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-serif text-2xl text-tinta">
            Dra. Beatryz <span className="italic">Furlaneto</span>
          </p>
          <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-rosa-escuro">Odontopediatria</p>
          <p className="mt-5 flex items-center gap-2 text-sm text-suave">
            <Escudo className="h-4 w-4 text-rosa-escuro" /> {CONFIG.profissao} · {CONFIG.cro}
          </p>
          <p className="mt-1 text-sm text-suave">{credencial}</p>
        </div>
        <div>
          <h2 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-suave">Contato</h2>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            <li>
              <a href={linkWhatsapp()} {...externo} className="text-tinta hover:text-rosa-escuro">
                WhatsApp {CONFIG.whatsappExibicao}
              </a>
            </li>
            <li>
              <a href={CONFIG.instagram} {...externo} className="text-tinta hover:text-rosa-escuro">
                Instagram {CONFIG.instagramUsuario}
              </a>
            </li>
            <li>
              <a href={CONFIG.googleMaps} {...externo} className="text-tinta hover:text-rosa-escuro">
                Google Maps
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-suave">Unidades</h2>
          <ul className="mt-4 space-y-2.5 text-[0.95rem] text-tinta">
            {CONFIG.unidades.map((u) => (
              <li key={u.id}>{u.cidade}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-tinta/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-suave md:flex-row md:items-center md:justify-between md:px-8">
          {/* CONFIRMAR COM A DOUTORA: responsável técnico e registro de especialidade */}
          <p>{CONFIG.responsavelTecnico}</p>
          <p className="flex gap-5">
            <a href="/privacidade.html" className="underline underline-offset-4 hover:text-rosa-escuro">
              Privacidade
            </a>
            <span>© {new Date().getFullYear()} {CONFIG.nome}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------- WhatsApp flutuante/fixo ------------------------ */
export function WhatsappFixo() {
  return (
    <>
      <a
        href={linkWhatsapp()}
        {...externo}
        aria-label="Agendar avaliação pelo WhatsApp"
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-rosa-escuro text-white shadow-[0_18px_40px_-14px_rgba(111,40,67,0.7)] transition-transform duration-300 hover:-translate-y-1 md:grid"
      >
        <Conversa className="h-6 w-6" />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-tinta/[0.08] bg-marfim/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden">
        <a
          href={linkWhatsapp()}
          {...externo}
          className={cn("flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-rosa-escuro px-6 text-[0.97rem] font-semibold text-white")}
        >
          <Conversa className="h-5 w-5" /> Agendar avaliação pelo WhatsApp
        </a>
      </div>
    </>
  );
}
