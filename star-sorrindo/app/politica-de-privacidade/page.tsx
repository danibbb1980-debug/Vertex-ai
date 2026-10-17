import { pageMetadata } from "@/lib/seo";
import { fullAddress, site, whatsappUrl } from "@/lib/site-data";
import { PageHero } from "@/components/sections/PageHero";

export const metadata = {
  ...pageMetadata({
    title: "Política de privacidade",
    description: "Como o site da Star Sorrindo trata dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).",
    path: "/politica-de-privacidade/",
  }),
  robots: { index: true, follow: true },
};

const crumbs = [
  { name: "Início", path: "/" },
  { name: "Política de privacidade", path: "/politica-de-privacidade/" },
];

/**
 * Texto-base, escrito para o funcionamento atual do site (sem cookies próprios,
 * sem analytics, sem banco de dados). Revise com a clínica — e, se possível,
 * com assessoria jurídica — e atualize ao instalar analytics, pixels ou um
 * formulário com backend.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="LGPD"
        crumbs={crumbs}
        title="Política de privacidade"
        intro={<>Última atualização: outubro de 2026.</>}
      />
      <section className="border-t border-line bg-white/60 py-20">
        <div className="container-site">
          <div className="max-w-3xl space-y-10 text-[1.02rem] leading-relaxed text-mineral [&_h2]:serif [&_h2]:text-3xl [&_h2]:text-navy">
            <div className="space-y-4">
              <h2>1. Quem somos</h2>
              <p>
                Este site pertence à {site.name}, clínica odontológica localizada em {fullAddress}. Para qualquer assunto sobre
                privacidade, fale conosco pelo telefone/WhatsApp {site.phone.display}.
              </p>
            </div>
            <div className="space-y-4">
              <h2>2. Quais dados o site coleta</h2>
              <p>
                O site não possui cadastro, banco de dados nem cookies próprios, e não utiliza ferramentas de análise de audiência
                ou publicidade.
              </p>
              <p>
                O formulário de contato não envia nada para um servidor: ele apenas monta uma mensagem com o seu nome, o assunto
                escolhido e o período de preferência, e abre o WhatsApp para que você decida se quer enviá-la. Pedimos o mínimo
                necessário e nenhuma informação de saúde pelo site.
              </p>
            </div>
            <div className="space-y-4">
              <h2>3. Serviços de terceiros</h2>
              <p>
                Ao clicar em links de WhatsApp, Instagram ou Google Maps, você é direcionado a serviços de outras empresas, que
                têm suas próprias políticas de privacidade. O mapa interativo do Google só é carregado quando você clica em
                “Carregar mapa interativo”; a partir daí, o Google pode utilizar cookies.
              </p>
              <p>
                As fontes tipográficas do site são servidas pelo próprio site, sem conexão com servidores externos durante a
                navegação.
              </p>
            </div>
            <div className="space-y-4">
              <h2>4. Como usamos as mensagens recebidas</h2>
              <p>
                As conversas iniciadas pelo WhatsApp são usadas exclusivamente para responder ao seu contato, informar
                disponibilidade e organizar o atendimento. Informações clínicas são tratadas com sigilo profissional, conforme o
                Código de Ética Odontológica.
              </p>
            </div>
            <div className="space-y-4">
              <h2>5. Seus direitos</h2>
              <p>
                Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar a confirmação, o acesso, a correção ou
                a eliminação dos seus dados pessoais tratados pela clínica, entre outros direitos.{" "}
                <a href={whatsappUrl("question")} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy underline underline-offset-4">
                  Fale conosco pelo WhatsApp<span className="sr-only"> (abre em nova aba)</span>
                </a>
                .
              </p>
            </div>
            <div className="space-y-4">
              <h2>6. Alterações</h2>
              <p>
                Esta política pode ser atualizada, por exemplo, se o site passar a usar ferramentas de análise. Nesse caso, a nova
                versão será publicada nesta página e, quando necessário, pediremos o seu consentimento.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
