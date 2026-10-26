import type { MetadataRoute } from "next";
import { site } from "@/lib/site-data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Tonon",
    description: `${site.focus} em ${site.city} – ${site.state}.`,
    start_url: "/",
    display: "browser",
    background_color: "#f5f3ee",
    theme_color: "#e6ecf0",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
