import { Fragment } from "react";

/** Converte "*palavra*" em <em>palavra</em>. */
export function italico(texto: string) {
  return texto.split(/(\*[^*]+\*)/g).map((parte, i) =>
    parte.startsWith("*") ? <em key={i}>{parte.slice(1, -1)}</em> : <Fragment key={i}>{parte}</Fragment>,
  );
}

/** Título de área com a palavra de destaque em itálico. */
export function comDestaque(titulo: string, destaque: string) {
  const i = titulo.lastIndexOf(destaque);
  if (i < 0) return titulo;
  return (
    <>
      {titulo.slice(0, i)}
      <em>{destaque}</em>
      {titulo.slice(i + destaque.length)}
    </>
  );
}
