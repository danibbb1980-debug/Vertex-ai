import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Não+Pelo — Liberdade, na sua pele.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento: a foto do hero com o título da campanha. */
export default async function OpenGraphImage() {
  const photo = await readFile(join(process.cwd(), "public/img/editorial/hero-pele.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#ecedf2" }}>
        <img src={src} alt="" width={1386} height={630} style={{ position: "absolute", right: -260, top: 0, height: 630, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, rgba(236,237,242,0.95) 0%, rgba(236,237,242,0.6) 45%, rgba(236,237,242,0) 70%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, position: "relative", color: "#12110f" }}>
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>Não+Pelo</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, lineHeight: 1, fontFamily: "sans-serif" }}>Liberdade,</div>
            <div style={{ fontSize: 96, lineHeight: 1.05, fontFamily: "sans-serif", color: "#467300" }}>na sua pele.</div>
            <div style={{ marginTop: 28, fontSize: 26, color: "#3a3631" }}>Depilação com tecnologia exclusiva Sun&Safe</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
