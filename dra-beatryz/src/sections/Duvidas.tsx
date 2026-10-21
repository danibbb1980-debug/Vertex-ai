import { TituloSecao } from "../components/Base";
import { Accordion, type Item } from "../components/ui/Accordion";
import { Reveal } from "../components/ui/Reveal";
import { CONFIG } from "../config";
import { externo, linkWhatsapp } from "../lib/utils";

const link = "font-medium text-rosa-escuro underline decoration-rosa/40 underline-offset-4";

const itens: Item[] = [
  {
    pergunta: "Com que idade devo levar meu filho ao dentista?",
    resposta: (
      <p>
        Entidades de odontopediatria costumam recomendar a primeira visita quando nasce o primeiro dentinho, ou por
        volta do primeiro ano de vida. Começar cedo ajuda a criança a se acostumar com o consultório e dá aos pais
        orientações para o dia a dia. A doutora indica o melhor momento para o seu filho.
      </p>
    ),
  },
  {
    pergunta: "Como funciona a primeira consulta?",
    resposta: (
      <p>
        É um momento de conhecer a criança com calma. A doutora conversa com a família, avalia dentes e gengiva no
        ritmo da criança e explica aos pais o que viu e quais são os próximos passos.
      </p>
    ),
  },
  {
    pergunta: "Os pais participam da consulta?",
    resposta: (
      <p>
        Os pais fazem parte do cuidado: recebem explicações claras em cada etapa e orientações para casa. Se tiver
        alguma preferência sobre o acompanhamento na sala, é só comentar no agendamento.
      </p>
    ),
  },
  {
    pergunta: "Com que frequência são os retornos preventivos?",
    resposta: (
      <p>
        Depende de cada criança. A frequência é definida pela doutora na consulta, de acordo com as necessidades
        observadas. Nos retornos, além da limpeza e da prevenção, ela acompanha o crescimento e o desenvolvimento
        facial.
      </p>
    ),
  },
  {
    pergunta: "Como posso preparar meu filho para a consulta?",
    resposta: (
      <p>
        Fale da visita com naturalidade e de forma positiva, como mais um cuidado com a saúde. Vale evitar usar o
        dentista como ameaça e dar preferência a um horário em que a criança costuma estar descansada.
      </p>
    ),
  },
  {
    pergunta: "A doutora também atende adultos?",
    resposta: (
      <p>
        A Dra. Beatryz atua em clínica geral e odontopediatria. Para saber se o atendimento que você procura está
        disponível, chame no WhatsApp.
      </p>
    ),
  },
  {
    pergunta: "Onde a doutora atende e em quais dias?",
    resposta: (
      <p>
        Em São João da Boa Vista, Artur Nogueira e Casa Branca (SP). Os dias variam de acordo com a unidade. Veja os
        endereços em{" "}
        <a href="#onde-atendo" className={link}>
          Onde atendo
        </a>{" "}
        e confirme a agenda pelo WhatsApp.
      </p>
    ),
  },
  {
    pergunta: "Como faço para agendar?",
    resposta: (
      <p>
        Pelo{" "}
        <a href={linkWhatsapp()} {...externo} className={link}>
          WhatsApp {CONFIG.whatsappExibicao}
        </a>
        . Você envia a mensagem e a equipe responde com os horários disponíveis. O agendamento fica certo só depois
        dessa confirmação.
      </p>
    ),
  },
];

export function Duvidas() {
  return (
    <section id="duvidas" aria-label="Dúvidas frequentes" className="bg-creme/60 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <TituloSecao eyebrow="Dúvidas frequentes">
            Perguntas que os pais <em>sempre</em> fazem
          </TituloSecao>
          <Reveal index={1}>
            <p className="mt-6 max-w-sm text-suave">
              Respostas gerais, para orientar. Cada criança é única, e a avaliação na consulta é o que define o
              cuidado certo.
            </p>
          </Reveal>
        </div>
        <Accordion itens={itens} />
      </div>
    </section>
  );
}
