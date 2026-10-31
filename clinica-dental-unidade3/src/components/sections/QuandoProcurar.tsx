import { Revelar } from "../ui/Revelar";
import { TituloSecao } from "../ui/TituloSecao";

const ITENS = [
  {
    titulo: "Check-up e limpeza periódica",
    texto: "Consultas regulares ajudam a acompanhar a saúde da boca e a perceber cedo o que merece atenção. A frequência é orientada em consulta.",
  },
  {
    titulo: "Quando um dente foi perdido",
    texto: "Há diferentes formas de repor um dente. Conhecer as opções ajuda a decidir com calma e informação.",
  },
  {
    titulo: "Se o alinhamento incomoda",
    texto: "Dentes desalinhados ou mudanças na mordida podem ser avaliados para entender se há indicação de tratamento.",
  },
  {
    titulo: "Para cuidar da estética do sorriso",
    texto: "Cor, forma e proporção dos dentes podem ser avaliadas, sempre a partir da saúde de dentes e gengivas.",
  },
];

export function QuandoProcurar() {
  return (
    <section aria-labelledby="titulo-quando" className="escuro relative isolate overflow-hidden bg-navy-900 py-24 text-white sm:py-32">
      <svg aria-hidden="true" className="absolute -right-24 top-10 -z-10 h-[520px] w-[520px] opacity-[0.07]" viewBox="0 0 200 200" fill="none">
        {[90, 70, 50, 30].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} stroke="var(--color-teal-300)" strokeWidth="0.6" />
        ))}
      </svg>
      <div className="container-site">
        <Revelar>
          <TituloSecao
            escuro
            id="titulo-quando"
            rotulo="Quando procurar"
            titulo="Momentos em que vale *marcar* uma avaliação."
          />
        </Revelar>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] bg-white/10 sm:grid-cols-2">
          {ITENS.map((item, i) => (
            <li key={item.titulo} className="bg-navy-900">
              <Revelar atraso={i * 0.08} className="h-full p-8 sm:p-10">
                <div className="flex items-baseline gap-4">
                  <span aria-hidden="true" className="font-serif text-lg italic text-gold-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl text-white sm:text-[1.7rem]">{item.titulo}</h3>
                </div>
                <p className="mt-4 text-white/72 sm:pl-10">{item.texto}</p>
              </Revelar>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-white/60">Conteúdo informativo. Ele não substitui a avaliação individual.</p>
      </div>
    </section>
  );
}
