import Image from "next/image";
import logo from "@/public/studio-vip/logo.png";
import { addressLine, studio, vipWhatsapp } from "@/lib/studio-vip";
import { InstagramIcon, PinIcon, WhatsAppIcon } from "./ui";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-hide-float className="bg-vip-950 pt-14 pb-10 text-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Image src={logo} alt="Studio VIP" width={56} height={60} className="h-14 w-auto" />
          <div>
            <p className="font-vip-display text-2xl leading-none font-extrabold text-white uppercase italic">
              {studio.fullName}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed">
              {addressLine} · CEP {studio.address.postalCode}
            </p>
          </div>
        </div>

        <ul className="flex gap-3" aria-label="Canais do Studio VIP">
          {[
            { href: vipWhatsapp("main"), label: "WhatsApp", Icon: WhatsAppIcon, track: "whatsapp" },
            {
              href: studio.links.instagram,
              label: "Instagram",
              Icon: InstagramIcon,
              track: "instagram",
            },
            { href: studio.links.maps, label: "Google Maps", Icon: PinIcon, track: "maps" },
          ].map(({ href, label, Icon, track }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} do Studio VIP`}
                data-track={track}
                data-track-label="rodape"
                className="flex size-12 items-center justify-center rounded-[0_0.9rem_0_0.9rem] border border-white/15 text-white transition-colors hover:border-vip-green hover:text-vip-green"
              >
                <Icon className="size-5" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-4 pt-6 text-xs sm:flex-row sm:justify-between sm:px-8">
        <p>
          © {year} {studio.name}. Todos os direitos reservados.
        </p>
        <p>WhatsApp {studio.phone.display}</p>
      </div>
    </footer>
  );
}
