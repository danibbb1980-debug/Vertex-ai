import { CONFIG } from "../../config";
import { useUnidade } from "../../lib/unidade";
import { linkWhatsApp } from "../../lib/whatsapp";
import { resumoHorarios } from "../../lib/horarios";
import { Acordeao, type ItemAcordeao } from "../ui/Acordeao";
import { Botao } from "../ui/Botao";
import { IconeWhatsApp } from "../ui/Icones";
import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

const lista = (itens: string[]) =>
  itens.length <= 1 ? itens.join("") : `${itens.slice(0, -1).join(", ")} e ${itens[itens.length - 1]}`;

export function Faq() {
  const { unidade } = useUnidade();
  const horarios = resumoHorarios(unidade.horarios);
  const atend = CONFIG.atendimentos.map((a) => a.nome.toLowerCase());

  const itens: (ItemAcordeao | false)[] = [
    {
      id: "agendar",
      titulo: "Preciso agendar antes de ir?",
      conteudo: (
        <p>
          Sim, é recomendado marcar hora. Você pode chamar a clínica pelo WhatsApp {unidade.telefoneExibicao} ou usar o
          formulário de solicitação nesta página. A equipe confirma a disponibilidade.
        </p>
      ),
    },
    {
      id: "avaliacao",
      titulo: "Como é a avaliação?",
      conteudo: (
        <p>
          É uma consulta para entender o que você procura, examinar a boca com atenção e tirar dúvidas. Quando necessário,
          podem ser pedidos exames complementares. Ao final, as possibilidades são explicadas com clareza.
        </p>
      ),
    },
    atend.length > 0 && {
      id: "atendimentos",
      titulo: "Quais atendimentos a unidade oferece?",
      conteudo: (
        <p>
          A {unidade.nomeCurto} atende em {lista(atend)}. A indicação de cada tratamento depende de avaliação individual.
        </p>
      ),
    },
    {
      id: "horarios",
      titulo: "Quais são os horários de atendimento?",
      conteudo: (
        <div>
          <ul className="space-y-1">
            {horarios.map((h) => (
              <li key={h.rotulo}>
                <strong className="font-semibold text-ink">{h.rotulo}:</strong> {h.texto.toLowerCase()}
              </li>
            ))}
          </ul>
          <p className="mt-2">{unidade.avisoHorarios}</p>
        </div>
      ),
    },
    {
      id: "onde",
      titulo: "Onde fica a clínica?",
      conteudo: (
        <p>
          {unidade.endereco.linha}. O link{" "}
          <a href={unidade.maps.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline underline-offset-4">
            Como chegar<span className="sr-only"> (abre o Google Maps em nova aba)</span>
          </a>{" "}
          abre a rota no Google Maps.
        </p>
      ),
    },
    unidade.pagamentos.length > 0 && {
      id: "pagamento",
      titulo: "Quais formas de pagamento são aceitas?",
      conteudo: (
        <p>
          {lista(unidade.pagamentos.map((p, i) => (i === 0 ? p : p.toLowerCase())))}. Dúvidas sobre valores e condições são
          tratadas diretamente com a equipe.
        </p>
      ),
    },
    {
      id: "levar",
      titulo: "O que levar na primeira consulta?",
      conteudo: (
        <p>
          De forma geral: um documento com foto, exames ou radiografias recentes (se tiver), a lista de medicamentos que
          você usa e as dúvidas que quiser conversar. Se houver algo específico, a equipe avisa quando combinar o horário com você.
        </p>
      ),
    },
    {
      id: "duracao",
      titulo: "Quanto tempo leva um tratamento?",
      conteudo: (
        <p>Depende de cada caso. Só a avaliação permite indicar as etapas e o acompanhamento adequados para você.</p>
      ),
    },
    CONFIG.secoes.agendamento && {
      id: "formulario",
      titulo: "O formulário do site já marca a consulta?",
      conteudo: (
        <p>
          Não. Ele apenas monta uma mensagem e abre o WhatsApp da clínica. A consulta só fica marcada depois que a equipe
          confirma a disponibilidade com você. O site não guarda os dados digitados.
        </p>
      ),
    },
  ];

  return (
    <section id="duvidas" aria-labelledby="titulo-duvidas" className="py-24 sm:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Revelar className="lg:sticky lg:top-40 lg:self-start">
          <TituloSecao id="titulo-duvidas" rotulo="Dúvidas frequentes" titulo="Perguntas que costumam *surgir*." />
          <p className="mt-6 text-ink-soft">Não encontrou o que procurava? A equipe responde pelo WhatsApp.</p>
          <Botao
            href={linkWhatsApp(unidade.whatsapp, CONFIG.mensagens.geral)}
            externo
            variante="contorno"
            icone={<IconeWhatsApp tamanho={18} className="text-teal-600" />}
            className="mt-6"
          >
            Conversar pelo WhatsApp
          </Botao>
        </Revelar>
        <Revelar atraso={0.1}>
          <Acordeao itens={itens.filter(Boolean) as ItemAcordeao[]} />
        </Revelar>
      </div>
    </section>
  );
}
