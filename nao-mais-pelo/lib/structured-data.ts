import { site } from "./site";
import { units } from "./units";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    taxID: site.cnpj,
    url: site.url,
    logo: `${site.url}/icon.png`,
    email: site.contacts[1].email,
    telephone: "+55-11-2667-1194",
    sameAs: site.social.map((s) => s.href),
  };
}

/** Lista das unidades como estabelecimentos (para a página /unidades). */
export function unitsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Unidades Não+Pelo",
    itemListElement: units.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "BeautySalon",
        name: `Não+Pelo ${u.nome}`,
        address: { "@type": "PostalAddress", streetAddress: u.endereco, addressLocality: u.cidade, addressRegion: u.uf, addressCountry: "BR" },
        ...(u.telefone ? { telephone: u.telefone } : {}),
      },
    })),
  };
}
