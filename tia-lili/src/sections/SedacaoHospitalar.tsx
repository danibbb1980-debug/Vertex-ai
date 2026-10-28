import { CONFIG } from "../config";
import { Secao, Cabecalho } from "../components/Secao";

/**
 * Só aparece se CONFIG.mostrarSedacao ou CONFIG.mostrarHospitalar = true.
 * Informações da bio do Instagram. CONFIRMAR COM A CLÍNICA E COMPROVAR a habilitação antes de ligar.
 * Texto neutro e educativo: sem prometer ausência de dor ou segurança absoluta.
 */
export function SedacaoHospitalar() {
  const ligado = (v: boolean) => v;
  const itens: { titulo: string; texto: string }[] = [];
  if (ligado(CONFIG.mostrarSedacao))
    itens.push({
      titulo: "Atendimento com sedação",
      texto:
        "Atendimento com sedação (inclusive com óxido nitroso) quando indicado, conforme avaliação individual e protocolos de segurança. A indicação, os cuidados antes e depois e as alternativas são explicados à família com antecedência.",
    });
  if (ligado(CONFIG.mostrarHospitalar))
    itens.push({
      titulo: "Atendimento hospitalar",
      texto:
        "Atendimento odontológico em ambiente hospitalar, quando indicado. A necessidade é avaliada caso a caso, e a família recebe todas as orientações sobre como funciona.",
    });

  return (
    <Secao id="sedacao-e-hospitalar">
      <div className="container-site">
        <div className="rounded-xl3 bg-creme-2 p-8 md:p-14">
          <Cabecalho
            id="sedacao-e-hospitalar"
            eyebrow="Quando é indicado"
            titulo="Situações que pedem um *cuidado* diferente."
            texto={<p>Algumas crianças e adolescentes precisam de um caminho diferente para o atendimento. Essa decisão é sempre individual e tomada junto com a família.</p>}
          />
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {itens.map((i) => (
              <li key={i.titulo} className="revelar rounded-xl2 bg-white/85 p-7 ring-1 ring-areia">
                <h3 className="text-2xl font-medium">{i.titulo}</h3>
                <p className="mt-3 leading-relaxed text-cacau-2">{i.texto}</p>
                <p className="mt-4 text-sm italic text-taupe-texto">Conforme avaliação individual.</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Secao>
  );
}
