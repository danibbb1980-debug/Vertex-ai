import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { studio } from "@/lib/studio-vip";

export default function sitemap(): MetadataRoute.Sitemap {
  const studioEntry = {
    url: studio.url,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  };

  // No projeto próprio do estúdio, a raiz é a página dele: só ela entra.
  if (studio.standalone) return [{ ...studioEntry, priority: 1 }];

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    studioEntry,
  ];
}
