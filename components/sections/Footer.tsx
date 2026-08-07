import { Mail, MessageCircle } from "lucide-react";
import { LinkButton } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { InstagramIcon, LinkedInIcon, TikTokIcon } from "../ui/SocialIcons";
import { footer } from "@/lib/content";
import { site, whatsappUrl } from "@/lib/site";

const socials = [
  { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
  { label: "TikTok", href: site.social.tiktok, Icon: TikTokIcon },
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedInIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2/50 px-5 pt-16 pb-28 sm:px-8 lg:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="size-7" />
              <span className="font-display text-[0.95rem] font-semibold">{site.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">{footer.tagline}</p>
          </div>

          <nav aria-label={footer.services.title}>
            <h2 className="text-sm font-semibold text-cloud">{footer.services.title}</h2>
            <ul className="mt-2">
              {footer.services.items.map((item) => (
                <li key={item.label}>
                  {/* min-h-11 keeps footer links tappable — they're visible on
                      mobile, where a 17px text link is a miss-prone target. */}
                  <a
                    href={item.href}
                    className="flex min-h-11 items-center text-sm text-mist transition-colors duration-200 hover:text-cloud"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={footer.company.title}>
            <h2 className="text-sm font-semibold text-cloud">{footer.company.title}</h2>
            <ul className="mt-2">
              {footer.company.items.map((item) => (
                <li key={item.label}>
                  {/* min-h-11 keeps footer links tappable — they're visible on
                      mobile, where a 17px text link is a miss-prone target. */}
                  <a
                    href={item.href}
                    className="flex min-h-11 items-center text-sm text-mist transition-colors duration-200 hover:text-cloud"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-cloud">{footer.contactTitle}</h2>
            <LinkButton
              href={whatsappUrl("rodape")}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              className="mt-4 w-full sm:w-auto"
              trackAs="rodape"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {footer.whatsappCta}
            </LinkButton>

            <a
              href={`mailto:${site.email}`}
              className="mt-3 flex min-h-11 items-center gap-2 text-sm text-mist transition-colors duration-200 hover:text-cloud"
            >
              <Mail className="size-4" aria-hidden="true" />
              {site.email}
            </a>

            <h2 className="mt-7 text-sm font-semibold text-cloud">{footer.socialTitle}</h2>
            <ul className="mt-3 flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full border border-line text-mist transition-colors duration-200 hover:border-white/25 hover:bg-white/5 hover:text-cloud"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-mist-dim">{footer.legal}</p>
          <p className="max-w-md text-xs text-mist-dim">{footer.legalNote}</p>
        </div>
      </div>
    </footer>
  );
}
