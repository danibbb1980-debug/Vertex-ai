import imagens from "../imagens.json";

type Manifesto = Record<string, { largura: number; altura: number; larguras: number[] }>;
const manifesto = imagens as Manifesto;

type Props = {
  nome: string;
  alt: string;
  sizes: string;
  className?: string;
  prioridade?: boolean;
  /** Texto do bloco reservado quando a foto ainda não existe. */
  reserva?: string;
};

/** Foto real em AVIF/WebP com tamanhos responsivos. Sem foto, mostra um bloco reservado elegante. */
export function Foto({ nome, alt, sizes, className = "", prioridade = false, reserva }: Props) {
  const info = manifesto[nome];
  if (!info) {
    return (
      <div
        className={`grid place-items-center bg-creme-2 text-center text-sm font-semibold text-taupe-texto ${className}`}
        role="img"
        aria-label={reserva ?? "Foto do consultório (substituir)"}
      >
        <span className="px-6">{reserva ?? "Foto do consultório (substituir)"}</span>
      </div>
    );
  }
  const src = (w: number, ext: string) => `/fotos/${nome}-${w}.${ext}`;
  const set = (ext: string) => info.larguras.map((w) => `${src(w, ext)} ${w}w`).join(", ");
  const media = info.larguras.find((w) => w >= 800) ?? info.larguras.at(-1)!;
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={src(media, "webp")}
        alt={alt}
        width={info.largura}
        height={info.altura}
        loading={prioridade ? "eager" : "lazy"}
        decoding={prioridade ? "sync" : "async"}
        fetchPriority={prioridade ? "high" : "auto"}
        className={className}
      />
    </picture>
  );
}

export function Logo({ className = "", largura = 200, prioridade = false }: { className?: string; largura?: number; prioridade?: boolean }) {
  const info = manifesto.logo;
  const altura = info ? Math.round((largura * info.altura) / info.largura) : largura;
  return (
    <picture>
      <source type="image/webp" srcSet="/marca/logo-100.webp 100w, /marca/logo-200.webp 200w, /marca/logo-400.webp 400w" sizes={`${largura}px`} />
      <img
        src="/marca/logo-200.png"
        srcSet="/marca/logo-100.png 100w, /marca/logo-200.png 200w, /marca/logo-400.png 400w"
        sizes={`${largura}px`}
        alt="Tia Lili Odontopediatra"
        width={largura}
        height={altura}
        loading={prioridade ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
