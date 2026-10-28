import { modoAtual } from "../config";
import { Foto } from "./Foto";

/** Fachada conforme o modo: as duas portas, só o castelo ou só o consultório. */
export function FotoFachada({ className = "", compacta = false }: { className?: string; compacta?: boolean }) {
  const modo = modoAtual();
  if (modo === "aline")
    return (
      <Foto
        base="/img/fachada-baixinhos"
        larguras={[318]}
        largura={318}
        altura={570}
        sizes="(min-width: 768px) 560px, 92vw"
        alt="Fachada do Odonto Baixinhos, um castelo em tons pastel com torres azuis e telhados rosa"
        className={compacta ? className : "mx-auto h-auto max-h-[36rem] w-auto max-w-full"}
      />
    );
  if (modo === "josiane")
    return (
      <Foto
        base="/img/fachada-consultorio"
        larguras={[228]}
        largura={228}
        altura={378}
        sizes="(min-width: 768px) 360px, 80vw"
        alt="Fachada do consultório odontológico: letreiro em dourado sobre fundo escuro, portão dourado e madeira"
        className={compacta ? className : "mx-auto h-auto max-h-[36rem] w-auto max-w-full"}
      />
    );
  return (
    <Foto
      base="/img/fachada"
      larguras={[606]}
      largura={606}
      altura={708}
      sizes="(min-width: 768px) 560px, 92vw"
      alt="Fachada na Av. Afonso Pena, 997: à esquerda o consultório odontológico em preto, dourado e madeira; à direita o castelo pastel do Odonto Baixinhos"
      className={className}
    />
  );
}
