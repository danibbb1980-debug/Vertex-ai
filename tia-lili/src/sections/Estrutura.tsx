import { Accessibility, CalendarCheck, CreditCard, DoorOpen } from "lucide-react";
import { CONFIG } from "../config";
import { Secao, Cabecalho } from "../components/Secao";
import { Foto } from "../components/Foto";

// Somente fatos da ficha do Google. Sem parcelamento nem desconto.
const FATOS = [
  { Icone: CalendarCheck, titulo: "Atendimento com agendamento", texto: "Horário marcado, para que cada consulta aconteça sem pressa." },
  { Icone: Accessibility, titulo: "Acessibilidade", texto: "Assento com acessibilidade para pessoas em cadeira de rodas." },
  { Icone: DoorOpen, titulo: "Banheiro", texto: "Banheiro disponível no consultório." },
  { Icone: CreditCard, titulo: "Formas de pagamento", texto: `${CONFIG.pagamentos.join(", ").replace(/, ([^,]*)$/, " e $1")}.` },
];

export function Estrutura() {
  const { fachada, consultorio } = CONFIG.fotos;
  return (
    <Secao id="estrutura">
      <div className="container-site">
        <Cabecalho
          id="estrutura"
          eyebrow="Estrutura e conforto"
          titulo="Um espaço pensado para *receber* bem."
          texto={<p>Um consultório claro e tranquilo, no Centro de Poços de Caldas.</p>}
        />

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:gap-5">
          <figure className="revelar relative overflow-hidden rounded-xl3 md:col-span-5">
            <Foto nome={fachada.arquivo} alt={fachada.alt} sizes="(min-width: 768px) 40vw, 92vw" className="aspect-[4/5] h-full w-full object-cover md:aspect-auto" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-creme/95 px-4 py-2 text-sm font-bold">Fachada · {CONFIG.endereco.rua}</figcaption>
          </figure>
          <figure className="revelar relative overflow-hidden rounded-xl3 md:col-span-7" style={{ ["--atraso" as string]: ".1s" }}>
            <Foto nome={consultorio.arquivo} alt={consultorio.alt} sizes="(min-width: 768px) 56vw, 92vw" className="aspect-[4/3] h-full w-full object-cover md:aspect-auto" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-creme/95 px-4 py-2 text-sm font-bold">Sala de atendimento</figcaption>
          </figure>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {FATOS.map(({ Icone, titulo, texto }, i) => (
            <li key={titulo} className="revelar rounded-xl2 bg-white/85 p-5 ring-1 ring-areia md:p-6" style={{ ["--atraso" as string]: `${i * 0.08}s` }}>
              <Icone size={26} strokeWidth={1.6} className="text-menta-escuro" aria-hidden />
              <h3 className="mt-4 text-lg font-medium md:text-xl">{titulo}</h3>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-taupe-texto md:text-[0.98rem]">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </Secao>
  );
}
