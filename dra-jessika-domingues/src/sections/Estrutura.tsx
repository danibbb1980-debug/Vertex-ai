import type { ReactNode } from "react";
import { CONFIG, enderecoCompleto } from "../config";
import { Moon, Sparkle } from "../components/Decor";
import { IconAccess, IconCalendar, IconCar, IconCard, IconClock, IconPin, IconShield } from "../components/Icons";
import { CabecalhoSecao, Confirmar, Pendente } from "../components/ui";

type Item = { Icone: (p: { size?: number }) => ReactNode; titulo: string; texto: ReactNode };

const ITENS: Item[] = [
  {
    Icone: IconCalendar,
    titulo: "Atendimento com hora marcada",
    texto: (
      <>
        Agendamento pelo WhatsApp.
        <Confirmar />
      </>
    ),
  },
  {
    Icone: IconPin,
    titulo: "Endereço",
    texto: (
      <>
        {enderecoCompleto}
        <Confirmar />
      </>
    ),
  },
  {
    Icone: IconClock,
    titulo: "Horários",
    texto: (
      <>
        {CONFIG.horarios.map((h) => `${h.dias}: ${h.horas}`).join(" · ")}
        <Confirmar />
      </>
    ),
  },
  { Icone: IconAccess, titulo: "Acessibilidade", texto: <Pendente /> },
  { Icone: IconCar, titulo: "Estacionamento", texto: <Pendente /> },
  { Icone: IconCard, titulo: "Formas de pagamento", texto: <Pendente /> },
  { Icone: IconShield, titulo: "Convênios", texto: <Pendente /> },
];

function FotoReservada({ legenda, className = "" }: { legenda: string; className?: string }) {
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-[2rem] border border-dashed border-sage-500 bg-sage-50 p-5 ${className}`}
      role="img"
      aria-label={`Espaço reservado: ${legenda}`}
    >
      <Moon className="absolute top-6 right-7 h-9 w-9 text-sage-500" />
      <Sparkle filled className="absolute top-14 right-20 h-4 w-4 text-coral" />
      <svg aria-hidden viewBox="0 0 200 80" className="absolute inset-x-0 bottom-0 w-full text-sage-100" preserveAspectRatio="none">
        <path d="M0 50c40-30 80-30 120-8s60 20 80 6v32H0Z" fill="currentColor" />
      </svg>
      <span className="relative rounded-full bg-paper/90 px-3 py-1.5 text-[0.8rem] font-bold text-ink-2">{legenda}</span>
    </div>
  );
}

export function Estrutura() {
  return (
    <section id="estrutura" aria-labelledby="titulo-estrutura" className="relative">
      <div className="bg-cream-2 py-20 md:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <CabecalhoSecao
              id="titulo-estrutura"
              eyebrow="Estrutura e conforto"
              titulo="O que você *encontra* aqui."
              texto={<p>Informações práticas para a sua visita. Alguns itens ainda estão em confirmação com a clínica.</p>}
            />
            <div className="reveal mt-10 grid grid-cols-2 gap-4" style={{ ["--d" as string]: "120ms" }}>
              <FotoReservada legenda="Foto do consultório (substituir)" className="col-span-2 h-48 md:h-56" />
              <FotoReservada legenda="Recepção (substituir)" className="h-36" />
              <FotoReservada legenda="Sala (substituir)" className="h-36" />
            </div>
          </div>
          <ul className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-7">
            {ITENS.map(({ Icone, titulo, texto }, i) => (
              <li
                key={titulo}
                className={`reveal card flex gap-4 p-6 ${i < 3 ? "sm:col-span-2" : ""}`}
                style={{ ["--d" as string]: `${i * 60}ms` }}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper text-sage-deep ring-1 ring-line">
                  <Icone size={22} />
                </span>
                <div>
                  <h3 className="font-sans text-[1.02rem] font-extrabold tracking-normal text-ink">{titulo}</h3>
                  <p className="mt-1 text-body">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
