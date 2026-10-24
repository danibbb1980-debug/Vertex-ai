import { useEffect, useRef } from "react";

/**
 * Vídeo gravado da própria cena 3D do hero (scripts/gravar-hero.mjs), para
 * aparelhos sem aceleração de GPU. Loop sem emenda, mudo, sem controles.
 * Com movimento reduzido, mostra só a imagem parada.
 * Pausa quando o hero sai da tela.
 */
export function HeroVideo({ mode, onReady }: { mode: "play" | "still"; onReady: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    const hero = document.getElementById("topo");
    if (!v || !hero || mode === "still") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [mode]);

  if (mode === "still") {
    return <img className="hero-video" src="/hero/hero-poster.webp" alt="" width={1600} height={900} decoding="async" onLoad={onReady} />;
  }
  return (
    <video
      ref={ref}
      className="hero-video"
      poster="/hero/hero-poster.webp"
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      onPlaying={onReady}
    >
      <source src="/hero/hero-loop.webm" type="video/webm" />
      <source src="/hero/hero-loop.mp4" type="video/mp4" />
    </video>
  );
}
