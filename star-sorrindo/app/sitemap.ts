import type { MetadataRoute } from "next";
import { site } from "@/lib/site-data";

export const dynamic = "force-static";

/** Páginas públicas. Ao criar uma página nova, adicione-a aqui. */
const pages = [
  { path: "/", priority: 1 },
  { path: "/implantes-dentarios/", priority: 0.9 },
  { path: "/proteses-dentarias/", priority: 0.8 },
  { path: "/contato/", priority: 0.7 },
  { path: "/politica-de-privacidade/", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Sem domínio oficial (NEXT_PUBLIC_SITE_URL), as URLs sairiam com um
  // endereço provisório. Melhor um sitemap vazio do que URLs erradas.
  if (!site.hasOfficialDomain) return [];
  return pages.map((p) => ({ url: `${site.url}${p.path}`, changeFrequency: "monthly", priority: p.priority }));
}
