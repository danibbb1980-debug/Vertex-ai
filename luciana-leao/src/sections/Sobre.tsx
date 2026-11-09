import { CONFIG } from '../config'
import { Logo } from '../brand/Logo'
import { OrquideaTraco } from '../brand/OrquideaTraco'
import { Rotulo } from '../components/Comum'
import { registro } from '../lib/dados'

export function Sobre() {
  return (
    <section id="sobre" className="secao" aria-labelledby="titulo-sobre">
      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="order-2 lg:order-1 lg:col-span-5" data-revelar>
            <div className="relative overflow-hidden rounded-[2rem] border border-filete bg-pedra-50 px-8 pb-10 pt-14 shadow-leve">
              <OrquideaTraco className="pointer-events-none absolute -right-14 -top-10 w-72 text-rose" espessura={0.8} />
              <Logo variante="empilhado" className="relative mx-auto h-auto w-full max-w-[22rem]" />
              <div className="filete relative my-8" />
              <dl className="relative grid gap-5 text-center sm:grid-cols-[auto_auto] sm:justify-center sm:gap-x-10">
                <div>
                  <dt className="rotulo !tracking-[0.16em]">Especialidade</dt>
                  <dd className="mt-2 font-serif text-xl text-vinho">{CONFIG.descritor}</dd>
                </div>
                <div>
                  <dt className="rotulo !tracking-[0.16em]">Registro</dt>
                  <dd className="mt-2 whitespace-nowrap font-serif text-xl text-vinho">{registro()}</dd>
                </div>
              </dl>
            </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-7" data-revelar>
          <Rotulo className="mb-6">Sobre o atendimento</Rotulo>
          <h2 id="titulo-sobre" className="titulo-secao max-w-2xl">
            Uma conversa <em>atenta</em> antes de qualquer indicação.
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-lg text-tinta-suave">
            <p>
              Cada atendimento começa ouvindo você. A consulta é individual, com hora marcada, e reserva tempo para entender o que você
              procura e responder às suas dúvidas.
            </p>
            <p>
              Antes de qualquer indicação, há uma avaliação médica. Depois dela, tudo é explicado com clareza, para que você entenda cada
              etapa e participe das decisões sobre o seu cuidado.
            </p>
          </div>
          <p className="mt-10 border-l-2 border-lilas pl-5 text-tinta">
            <span className="block font-serif text-2xl text-vinho">{CONFIG.nome}</span>
            <span className="mt-1 block text-[0.95rem] tracking-wide text-tinta-suave">
              {CONFIG.descritor}, {registro()}
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
