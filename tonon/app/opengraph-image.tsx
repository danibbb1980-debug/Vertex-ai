import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site-data";

export const alt = `${site.name} — ${site.focus}, em ${site.city} – ${site.state}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento gerada no build, com o objeto 3D do hero. */
export default async function OpengraphImage() {
  const object = await readFile(join(process.cwd(), "public/hero/poster-og.png"));
  const objectSrc = `data:image/png;base64,${object.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #e6ecf0 0%, #c9d4de 60%, #b4c3cf 100%)",
          color: "#171918",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 760, padding: "64px 72px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, letterSpacing: 10 }}>TONON</span>
            <span style={{ fontSize: 13, letterSpacing: 9, color: "#4a4e4b", marginTop: 6 }}>LABORATÓRIO</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 18, letterSpacing: 5, color: "#46584f" }}>
              {`${site.city.toUpperCase()} · ${site.state}`}
            </span>
            <span style={{ fontSize: 64, lineHeight: 1.05, marginTop: 20, letterSpacing: -2 }}>Reabilitação estética</span>
            <span style={{ fontSize: 64, lineHeight: 1.05, letterSpacing: -2 }}>com precisão de laboratório.</span>
          </div>
          <span style={{ fontSize: 22, color: "#4a4e4b" }}>{`${site.person} · ${site.role}`}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 440, height: "100%" }}>
          <img src={objectSrc} width={420} height={600} alt="" style={{ width: 420, height: 600 }} />
        </div>
      </div>
    ),
    size,
  );
}
