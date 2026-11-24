import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Titulo } from "./Titulo";
import { CONFIG, whatsappLink } from "../config";
import { IconArrowUpRight, IconClock, IconInstagram, IconPin, IconWhatsapp } from "./Icons";

/*
 * Agendamento pelo WhatsApp.
 * Referência: "Time Slot Picker" (21st.dev): faixa de dias + horários como grupos de rádio navegáveis pelo teclado.
 * Nada é enviado nem guardado pelo site: as escolhas só montam a mensagem que a pessoa envia no próprio WhatsApp.
 */

export const TRATAMENTOS = [
  { id: "lentes", rotulo: "Lentes", mensagem: "lentes em resina ou porcelana" },
  { id: "clareamento", rotulo: "Clareamento", mensagem: "clareamento dental" },
  // CONFIRMAR COM A DOUTORA: credenciamento Invisalign antes de citar a marca.
  { id: "alinhadores", rotulo: "Alinhadores", mensagem: "alinhadores transparentes" },
  { id: "avaliacao", rotulo: "Ainda não sei", mensagem: "" },
] as const;

type TratamentoId = (typeof TRATAMENTOS)[number]["id"];

/** Evento usado pela lista de tratamentos para pré-selecionar uma opção aqui. */
export const EVENTO_TRATAMENTO = "escolher-tratamento";

const { manha, tarde } = CONFIG.horarios.semana;
const PERIODOS = [
  { id: "manha", rotulo: "Manhã", faixa: `${manha[0]} às ${manha[1]}`, mensagem: "pela manhã" },
  { id: "tarde", rotulo: "Tarde", faixa: `${tarde[0]} às ${tarde[1]}`, mensagem: "à tarde" },
] as const;

const SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const SEMANA_CURTA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type Dia = { id: string; curto: string; numero: string; mensagem: string };

/** Próximos 5 dias úteis a partir de amanhã (atendimento de segunda a sexta). */
function proximosDiasUteis(): Dia[] {
  const dias: Dia[] = [];
  const d = new Date();
  while (dias.length < 5) {
    d.setDate(d.getDate() + 1);
    const w = d.getDay();
    if (w === 0 || w === 6) continue;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    dias.push({ id: `${d.getFullYear()}-${mm}-${dd}`, curto: SEMANA_CURTA[w], numero: dd, mensagem: `${SEMANA[w]}, ${dd}/${mm}` });
  }
  return dias;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Grupo de opções com um marcador que desliza até a opção escolhida. */
function Grupo({ legenda, valor, children, i = 0 }: { legenda: string; valor: string | null; children: React.ReactNode; i?: number }) {
  const caixa = useRef<HTMLDivElement>(null);
  const marcador = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const posicionar = () => {
      const c = caixa.current;
      const m = marcador.current;
      if (!c || !m) return;
      const alvo = c.querySelector<HTMLElement>("input:checked + span");
      if (!alvo) {
        m.style.opacity = "0";
        return;
      }
      const a = alvo.getBoundingClientRect();
      const b = c.getBoundingClientRect();
      const primeira = m.style.opacity !== "1";
      if (primeira) m.style.transition = "none";
      m.style.width = `${a.width}px`;
      m.style.height = `${a.height}px`;
      m.style.transform = `translate(${a.left - b.left}px, ${a.top - b.top}px)`;
      m.style.opacity = "1";
      if (primeira) requestAnimationFrame(() => (m.style.transition = ""));
    };
    posicionar();
    window.addEventListener("resize", posicionar);
    return () => window.removeEventListener("resize", posicionar);
  }, [valor]);

  return (
    <fieldset data-reveal="sobe" style={{ ["--i" as string]: i }}>
      <legend className="text-[0.88rem] text-perola-claro/70">{legenda}</legend>
      <div ref={caixa} className="relative mt-3 flex flex-wrap gap-2">
        <span ref={marcador} aria-hidden className="marcador left-0 top-0" />
        {children}
      </div>
    </fieldset>
  );
}

function Opcao({
  nome,
  valor,
  marcado,
  onEscolher,
  children,
  className = "",
}: {
  nome: string;
  valor: string;
  marcado: boolean;
  onEscolher: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`opcao relative cursor-pointer ${className}`}>
      <input type="radio" name={nome} value={valor} checked={marcado} onChange={onEscolher} />
      <span className="flex h-full min-h-11 items-center justify-center rounded-full border border-perola-claro/18 px-4 text-[0.9rem] text-perola-claro/85 hover:border-perola-claro/45">
        {children}
      </span>
    </label>
  );
}

export function Agendamento() {
  const [tratamento, setTratamento] = useState<TratamentoId | null>(null);
  const [dia, setDia] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<(typeof PERIODOS)[number]["id"] | null>(null);
  // As datas dependem do dia de hoje: calculadas só no navegador (o HTML pré-renderizado mostra a faixa sem datas).
  const [dias, setDias] = useState<Dia[]>([]);

  useEffect(() => {
    setDias(proximosDiasUteis());
    const ouvir = (e: Event) => setTratamento((e as CustomEvent<TratamentoId>).detail);
    window.addEventListener(EVENTO_TRATAMENTO, ouvir);
    return () => window.removeEventListener(EVENTO_TRATAMENTO, ouvir);
  }, []);

  const [digitando, setDigitando] = useState(false);
  const primeira = useRef(true);
  const mensagem = useMemo(() => {
    const partes = ["Olá, Dra. Ana! Vi seu site e gostaria de agendar uma avaliação estética."];
    const t = TRATAMENTOS.find((x) => x.id === tratamento);
    if (t?.mensagem) partes.push(`Tenho interesse em ${t.mensagem}.`);
    const d = dias.find((x) => x.id === dia);
    const p = PERIODOS.find((x) => x.id === periodo);
    if (d && p) partes.push(`Prefiro ${d.mensagem}, ${p.mensagem}.`);
    else if (d) partes.push(`Prefiro ${d.mensagem}.`);
    else if (p) partes.push(`Prefiro ${p.mensagem}.`);
    return partes.join(" ");
  }, [tratamento, dia, periodo, dias]);

  // "digitando..." por um instante a cada escolha, depois a mensagem nova
  const [mostrada, setMostrada] = useState(mensagem);
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      setMostrada(mensagem);
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMostrada(mensagem);
      return;
    }
    setDigitando(true);
    const t = setTimeout(() => {
      setMostrada(mensagem);
      setDigitando(false);
    }, 650);
    return () => clearTimeout(t);
  }, [mensagem]);

  return (
    <section id="agendar" aria-labelledby="agendar-titulo" className="bg-noite on-dark relative overflow-hidden py-12 text-perola-claro sm:py-16 lg:py-16">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(64,86,128,0.35),rgba(17,26,43,0))]" />

      <div className="container-site relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Titulo
            id="agendar-titulo"
            partes={[{ t: "Agende sua" }, { t: "avaliação.", em: true }]}
            className="text-[2.3rem] text-perola-claro sm:text-5xl lg:text-[3.6rem] [&_.italic]:text-rose"
          />
          <p data-reveal="sobe" style={{ ["--i" as string]: 1 }} className="mt-3 max-w-md text-perola-claro/70">Escolha o que preferir e a mensagem já vai pronta.</p>

          <form className="mt-7 grid gap-6" onSubmit={(e) => e.preventDefault()}>
            <Grupo legenda="Tratamento" valor={tratamento} i={1}>
              {TRATAMENTOS.map((t) => (
                <Opcao key={t.id} nome="tratamento" valor={t.id} marcado={tratamento === t.id} onEscolher={() => setTratamento(t.id)}>
                  {t.rotulo}
                </Opcao>
              ))}
            </Grupo>

            <Grupo legenda="Melhor dia" valor={dia} i={2}>
              {(dias.length ? dias : SEMANA_CURTA.slice(1, 6).map((c) => ({ id: c, curto: c, numero: "", mensagem: "" }))).map((d) => (
                <Opcao
                  key={d.id}
                  nome="dia"
                  valor={d.id}
                  marcado={dia === d.id}
                  onEscolher={() => setDia(d.id)}
                  className="w-[calc(20%-0.4rem)] min-w-[3.6rem]"
                >
                  <span className="flex flex-col items-center py-1.5 leading-tight">
                    <span className="text-[0.72rem] opacity-75">{d.curto}</span>
                    <span className="font-display text-lg">{d.numero || "–"}</span>
                  </span>
                </Opcao>
              ))}
            </Grupo>

            <Grupo legenda="Período" valor={periodo} i={3}>
              {PERIODOS.map((p) => (
                <Opcao key={p.id} nome="periodo" valor={p.id} marcado={periodo === p.id} onEscolher={() => setPeriodo(p.id)} className="flex-1">
                  <span className="flex flex-col items-center py-1.5 leading-tight">
                    <span>{p.rotulo}</span>
                    <span className="text-[0.72rem] opacity-70">{p.faixa}</span>
                  </span>
                </Opcao>
              ))}
            </Grupo>
          </form>
        </div>

        {/* Prévia da mensagem, no formato de uma conversa, e depois endereço e horários */}
        <div className="flex flex-col gap-7 lg:pt-3">
          <div data-reveal="sobe" style={{ ["--i" as string]: 2 }} className="rounded-[1.75rem] border border-perola-claro/10 bg-noite-2 p-5 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.8)] sm:p-7">
            <div className="hidden items-center gap-3 border-b border-perola-claro/10 pb-4 sm:flex">
              <img
                src="/fotos/dra-ana-villela-retrato-480.webp"
                alt=""
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-10 rounded-full object-cover object-[50%_36%]"
              />
              <div className="leading-tight">
                <p className="text-[0.95rem] text-perola-claro">{CONFIG.nome}</p>
                <p className="text-[0.75rem] text-perola-claro/55">WhatsApp {CONFIG.telefone}</p>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              Mensagem que será enviada: {mensagem}
            </p>
            <div aria-hidden className="flex min-h-[6.5rem] flex-col items-end justify-end gap-2 sm:pt-5">
              <p key={mostrada} className="balao-anima max-w-[92%] rounded-[1.1rem] rounded-br-[0.3rem] bg-[#d9eadf] px-4 py-3 text-[0.92rem] leading-relaxed text-noite">
                {mostrada}
              </p>
              <span className={`digitando flex items-center gap-1 rounded-full bg-[#d9eadf] px-3 py-2 transition-opacity duration-200 ${digitando ? "opacity-100" : "h-0 overflow-hidden py-0 opacity-0"}`}>
                <i />
                <i />
                <i />
              </span>
            </div>
            <a
              href={whatsappLink(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              className="brilho mt-6 flex min-h-[3.25rem] items-center justify-center gap-2.5 rounded-full bg-champagne-claro text-[0.98rem] font-medium text-noite transition-colors hover:bg-perola-claro"
            >
              <IconWhatsapp width={19} height={19} />
              Enviar pelo WhatsApp
            </a>
            <p className="mt-3 text-center text-[0.8rem] text-perola-claro/55">O horário é confirmado na conversa.</p>
          </div>
          {/* Endereço e horários da ficha do Google. CONFIRMAR COM A DOUTORA */}
          <div data-reveal="sobe" style={{ ["--i" as string]: 3 }} className="grid gap-3 text-[0.9rem] text-perola-claro/75">
            <div className="flex gap-3">
              <IconPin className="mt-0.5 shrink-0 text-rose" />
              <p>
                {CONFIG.endereco.rua}, {CONFIG.endereco.bairro}, {CONFIG.endereco.cidade}
                <a href={CONFIG.maps} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-perola-claro hover:text-rose">
                  <span className="link-sublinhado">Como chegar</span>
                  <IconArrowUpRight width={14} height={14} />
                </a>
              </p>
            </div>
            <div className="flex gap-3">
              <IconClock className="mt-0.5 shrink-0 text-rose" />
              <p>
                Seg a sex, {manha[0]} às {manha[1]} e {tarde[0]} às {tarde[1]}
                <br />
                <span className="text-perola-claro/55">Almoço das {manha[1]} às {tarde[0]}. Sáb e dom, fechado.</span>
              </p>
            </div>
            <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer" className="flex w-fit items-center gap-3 text-perola-claro hover:text-rose">
              <IconInstagram className="shrink-0 text-rose" />
              <span className="link-sublinhado">{CONFIG.instagramUser}</span>
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
