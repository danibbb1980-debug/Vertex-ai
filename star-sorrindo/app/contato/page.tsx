import { pageMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/site-data";
import { breadcrumbJsonLd, dentistJsonLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/ui/ContactForm";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { PageHero } from "@/components/sections/PageHero";
import { Location } from "@/components/sections/Location";

export const metadata = pageMetadata({
  title: "Contato e agendamento",
  description:
    "Agende sua avaliação na Star Sorrindo pelo WhatsApp. Av. Francisco Salles, 615 — Centro, Poços de Caldas, MG. Veja horários, mapa e como chegar.",
  path: "/contato/",
});

const crumbs = [
  { name: "Início", path: "/" },
  { name: "Contato", path: "/contato/" },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={dentistJsonLd()} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        eyebrow="Contato"
        crumbs={crumbs}
        title={
          <>
            Vamos conversar sobre <em className="text-gold-ink">o seu sorriso.</em>
          </>
        }
        intro="A forma mais rápida de agendar é pelo WhatsApp. Se preferir, preencha o formulário: ele monta a mensagem para você e abre a conversa com a equipe."
        aside={<ContactForm />}
      >
        <Button href={whatsappUrl("default")} external icon={<WhatsAppIcon className="h-5 w-5" />}>
          Abrir o WhatsApp agora
        </Button>
      </PageHero>
      <Location />
    </>
  );
}
