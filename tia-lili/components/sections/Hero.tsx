import Image from "next/image";
import { photos, site, whatsappUrl } from "@/lib/site-data";
import { Button } from "@/components/ui/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28">
      {/* Formas orgânicas de fundo, puramente decorativas. */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-32 h-[28rem] w-[28rem] rounded-full bg-mint-50 sm:-right-16 lg:top-10 lg:right-[-6rem] lg:h-[40rem] lg:w-[40rem]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-[60%] -left-24 h-56 w-56 rounded-full bg-lilac-100/70 blur-2xl" />

      <div className="container-site relative grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="eyebrow hero-rise">Odontopediatria</p>
          <h1 id="hero-title" className="hero-rise mt-5 text-[2.6rem] sm:text-6xl lg:text-[4.25rem]" style={{ "--d": "80ms" } as React.CSSProperties}>
            Cuidado com os dentinhos, <em className="text-teal">carinho</em> em cada etapa.
          </h1>
          <p className="hero-rise mt-6 max-w-lg text-lg text-muted sm:text-xl" style={{ "--d": "160ms" } as React.CSSProperties}>
            Um atendimento acolhedor, pensado para que a criança se sinta segura e a família fique tranquila do primeiro
            contato até a consulta.
          </p>
          <div className="hero-rise mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6" style={{ "--d": "240ms" } as React.CSSProperties}>
            <Button href={whatsappUrl} external icon={<WhatsAppIcon className="h-5 w-5" />} className="w-full sm:w-auto">
              Agendar pelo WhatsApp
            </Button>
            <Button href={site.links.instagram} external variant="link" icon={<InstagramIcon className="h-5 w-5" />}>
              Ver o Instagram
            </Button>
          </div>
        </div>

        {/* Composição assimétrica: foto principal + recorte circular sobreposto. */}
        <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <div aria-hidden="true" className="absolute -top-4 -left-5 h-16 w-16 rounded-full bg-butter sm:-left-8" />
          <div aria-hidden="true" className="absolute top-1/3 -right-3 h-6 w-6 rounded-full bg-coral-200 sm:-right-6" />
          <div className="relative overflow-hidden rounded-[2.5rem] rounded-tr-[7rem] bg-mint-200 shadow-[0_30px_60px_-30px_rgb(46_42_48/0.45)]">
            <Image
              src={photos.consultorioSorriso.src}
              width={photos.consultorioSorriso.width}
              height={photos.consultorioSorriso.height}
              alt={photos.consultorioSorriso.alt}
              priority
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 448px, 88vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -left-4 w-[42%] overflow-hidden rounded-full border-[6px] border-cream shadow-[0_18px_40px_-20px_rgb(46_42_48/0.5)] sm:-left-12">
            <Image
              src={photos.brinquedos.src}
              width={photos.brinquedos.width}
              height={photos.brinquedos.height}
              alt={photos.brinquedos.alt}
              sizes="(min-width: 1024px) 180px, 40vw"
              className="aspect-square w-full object-cover object-[50%_35%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
