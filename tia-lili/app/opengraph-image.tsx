import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site-data";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento gerada no build, com o logotipo e uma foto real. */
export default async function OpengraphImage() {
  const read = (path: string) => readFile(join(process.cwd(), "public", path));
  const [logo, photo] = await Promise.all([read("brand/logo-tia-lili.jpg"), read("images/consultorio-sorriso.jpg")]);
  const toSrc = (buffer: Buffer) => `data:image/jpeg;base64,${buffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#fbf7f1", color: "#2e2a30" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 700, padding: "60px 72px" }}>
          <img src={toSrc(logo)} width={178} height={160} alt="" style={{ marginLeft: -12 }} />
          <span style={{ fontSize: 60, lineHeight: 1.08, marginTop: 28, letterSpacing: -1.5 }}>
            Cuidado com os dentinhos, carinho em cada etapa.
          </span>
          <span style={{ fontSize: 24, color: "#1f6b5c", marginTop: 28 }}>Agende pelo WhatsApp</span>
        </div>
        <div style={{ display: "flex", width: 500, height: "100%", padding: "40px 48px 40px 0" }}>
          <img
            src={toSrc(photo)}
            width={452}
            height={550}
            alt=""
            style={{ objectFit: "cover", width: 452, height: 550, borderRadius: 40 }}
          />
        </div>
      </div>
    ),
    size,
  );
}
