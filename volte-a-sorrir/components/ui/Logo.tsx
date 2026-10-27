import Image from "next/image";

type LogoProps = {
  /** horizontal: cabeçalho (versão derivada); vertical: rodapé, sobre amarelo. */
  variant?: "horizontal" | "vertical";
  className?: string;
  /** Acima da dobra: carrega sem lazy-loading. */
  eager?: boolean;
};

/**
 * Logotipo a partir do arquivo enviado pela clínica (public/brand/logo-original.jpg).
 * Os PNGs foram gerados por scripts/process-brand.py: fundo removido, desenho e
 * lettering intactos. As raízes do dente são brancas sem contorno, então o logo
 * deve ficar sempre sobre amarelo ou fundo claro e quente — nunca sobre branco
 * puro ou azul.
 */
export function Logo({ variant = "horizontal", className = "", eager = false }: LogoProps) {
  const loading = eager ? "eager" : "lazy";
  if (variant === "vertical") {
    return (
      <Image
        src="/brand/logo-vertical.png"
        alt="Dentista Volte a Sorrir"
        width={364}
        height={320}
        loading={loading}
        className={className}
      />
    );
  }
  return (
    <Image
      src="/brand/logo-horizontal.png"
      alt="Dentista Volte a Sorrir"
      width={493}
      height={129}
      loading={loading}
      className={className}
    />
  );
}
