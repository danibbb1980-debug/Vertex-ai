import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { path: "/", priority: 1 },
    { path: "/depilacao-feminina", priority: 0.9 },
    { path: "/depilacao-masculina", priority: 0.9 },
  ].map(({ path, priority }) => ({ url: `${site.url}${path}`, lastModified: now, changeFrequency: "monthly", priority }));
}
