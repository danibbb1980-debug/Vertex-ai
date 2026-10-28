import { CONFIG } from "../config";
import { numeroDaSecao } from "../lib/secoes";
import { CabecalhoSecao } from "../components/CabecalhoSecao";
import { Confirmar } from "../components/Confirmar";
import { Revelar } from "../components/Revelar";
import { IconeEstacionamento } from "../components/Icones";
import { Foto } from "../components/Foto";

export function Estrutura() {
  const [semana, sabado] = CONFIG.horarios.linhas;
  const destaques = [
    { valor: semana.curto, rotulo: "Segunda a sexta", nota: "Horário estendido" },
    { valor: sabado.curto, rotulo: "Sábado", nota: "Atendimento pela manhã" },
  ];
  return (
    <section id="estrutura" aria-labelledby="titulo-estrutura" className="relative z-10 py-12 md:py-20">
      <div className="contem">
        <div className="grid overflow-hidden rounded-[32px] border border-tinta/10 bg-areia lg:grid-cols-12">
          <div className="p-7 md:p-14 lg:col-span-7">
            <CabecalhoSecao
              numero={numeroDaSecao("estrutura")}
              rotulo="Estrutura e conforto"
              id="titulo-estrutura"
              titulo={
                <>
                  Pensado para caber na sua <em>rotina</em>.
                </>
              }
            />
            <dl className="mt-12 grid gap-px overflow-hidden rounded-[20px] border border-tinta/10 bg-tinta/10 sm:grid-cols-3">
              {destaques.map((d, i) => (
                <Revelar key={d.rotulo} atraso={i * 100} className="flex flex-col bg-areia p-6">
                  <dt className="rotulo order-2 mt-3 text-cinza">{d.rotulo}</dt>
                  <dd className="order-1 font-display text-[2.6rem] leading-none font-medium tabular-nums">{d.valor}</dd>
                  <dd className="order-3 mt-1 text-[0.9rem] text-suave">{d.nota}</dd>
                </Revelar>
              ))}
              {CONFIG.comodidades.estacionamento && (
                <Revelar atraso={200} className="flex flex-col bg-areia p-6">
                  <dt className="rotulo order-2 mt-3 text-cinza">Comodidade</dt>
                  <dd className="order-1 flex h-[2.6rem] items-center">
                    <IconeEstacionamento tamanho={38} className="text-bronze" />
                  </dd>
                  <dd className="order-3 mt-1 text-[0.9rem] text-suave">Estacionamento no local</dd>
                </Revelar>
              )}
            </dl>
            <p className="mt-5 text-[0.88rem] text-cinza">
              {CONFIG.horarios.observacao} Domingo fechado.
              <Confirmar mostrar={!CONFIG.horarios.confirmado} />
            </p>
          </div>
          <div className="relative min-h-[420px] lg:col-span-5 lg:min-h-full">
            {CONFIG.fotos.estrutura ? (
              <Foto
                foto={CONFIG.fotos.estrutura}
                sizes="(min-width: 1024px) 40vw, 92vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[#e2d3ba]">
                <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <g fill="none" stroke="#7a5a2a" strokeOpacity="0.25" strokeWidth="0.8">
                    <path d="M80 400 V 170 A 120 120 0 0 1 320 170 V 400" />
                    <path d="M110 400 V 180 A 90 90 0 0 1 290 180 V 400" strokeOpacity="0.15" />
                    <line x1="0" y1="330" x2="400" y2="330" />
                  </g>
                  <circle cx="200" cy="322" r="7" fill="#1d1915" />
                </svg>
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-marfim/85 px-3 py-1 text-[0.7rem] tracking-[0.06em] whitespace-nowrap text-suave">
                  Foto do instituto (substituir)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
