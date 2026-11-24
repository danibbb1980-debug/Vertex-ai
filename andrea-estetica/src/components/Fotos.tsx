import { CONFIG } from "../config";

/** Só aparece se houver fotos AUTORIZADAS em CONFIG.fotos. Recortes sóbrios, sem legenda promocional. */
export default function Fotos() {
  const fotos = CONFIG.fotos.filter((f) => f.src);
  if (!fotos.length) return null;
  return (
    <section aria-label="O espaço" className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8 sm:pb-32">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-12 sm:gap-5">
        {fotos.slice(0, 3).map((f, i) => (
          <li
            key={f.src}
            className={`overflow-hidden border border-grafite/25 ${
              i === 0 ? "col-span-2 aspect-[16/10] sm:col-span-7" : "aspect-[4/5] sm:col-span-5 sm:aspect-auto"
            } ${i === 2 ? "sm:col-span-5 sm:col-start-8" : ""}`}
          >
            <img src={f.src} alt={f.alt} loading="lazy" decoding="async" className="size-full object-cover" />
          </li>
        ))}
      </ul>
    </section>
  );
}
