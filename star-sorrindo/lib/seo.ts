import type { Metadata } from "next";
import { site } from "./site-data";

/**
 * Metadados por página. Canonical só quando o domínio oficial estiver
 * configurado (NEXT_PUBLIC_SITE_URL): um canonical para um domínio
 * provisório atrapalharia a indexação depois.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: site.hasOfficialDomain ? { canonical: path } : undefined,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: path,
      siteName: site.name,
      title,
      description,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Fachada da Star Sorrindo Implantes em Poços de Caldas" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
  };
}
