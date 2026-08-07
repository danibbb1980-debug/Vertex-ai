import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon generated from the Vertex mark — keeps brand and icon in one place. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06060a",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            background: "linear-gradient(135deg, #4f46e5, #a78bfa)",
            clipPath: "polygon(50% 4%, 100% 96%, 72% 96%, 50% 62%, 28% 96%, 0% 96%)",
          }}
        />
      </div>
    ),
    size,
  );
}
