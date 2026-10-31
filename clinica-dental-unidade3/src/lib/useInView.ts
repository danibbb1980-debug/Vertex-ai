import { useEffect, useRef, useState } from "react";

/** true enquanto o elemento está perto da viewport (para pausar animações fora da tela). */
export function useInView<T extends Element>(rootMargin = "100px") {
  const ref = useRef<T>(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, visivel] as const;
}
