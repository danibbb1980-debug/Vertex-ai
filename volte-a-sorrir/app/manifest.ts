import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#fffdf6",
    theme_color: "#ffdd58",
    icons: [{ src: "/icon.png", sizes: "256x256", type: "image/png" }],
  };
}
