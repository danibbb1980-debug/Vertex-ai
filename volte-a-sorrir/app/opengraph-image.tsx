import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — dentista em ${site.city} – ${site.state}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const toDataUrl = (file: Buffer) => `data:image/png;base64,${file.toString("base64")}`;

/** Imagem de compartilhamento gerada no build: logo original + o dente do hero. */
export default async function OpengraphImage() {
  // Caminhos estáticos: o build só rastreia esses dois arquivos.
  const [logo, tooth] = (
    await Promise.all([
      readFile(join(process.cwd(), "public", "brand", "logo-horizontal.png")),
      readFile(join(process.cwd(), "public", "images", "tooth-poster.png")),
    ])
  ).map(toDataUrl);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#ffdd58", color: "#0e2837" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 740, padding: "64px 0 64px 76px" }}>
          <img src={logo} width={330} height={86} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.02, letterSpacing: -2 }}>Seu sorriso merece</span>
            <span style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.02, letterSpacing: -2, color: "#b4442f" }}>
              cuidado de verdade.
            </span>
          </div>
          <span style={{ fontSize: 26, color: "#2b4766" }}>{`${site.city} — ${site.stateName} · Agende pelo WhatsApp`}</span>
        </div>
        <div style={{ display: "flex", position: "relative", width: 460, height: "100%", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", width: 420, height: 420, borderRadius: 999, background: "#fff6cf" }} />
          <img src={tooth} width={436} height={545} alt="" style={{ position: "relative" }} />
        </div>
      </div>
    ),
    size,
  );
}
