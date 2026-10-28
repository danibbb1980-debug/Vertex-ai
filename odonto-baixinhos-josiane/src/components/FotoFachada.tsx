import { modoAtual } from "../config";
import { Foto } from "./Foto";

/** Fachada conforme o modo: as duas portas, só o castelo ou só o consultório. */
export function FotoFachada({ className = "", compacta = false }: { className?: string; compacta?: boolean }) {
  const modo = modoAtual();
  // CONFIRMAR COM A CLÍNICA: autorização de uso da foto (a Dra. Aline aparece à porta)
  if (modo === "aline")
    return (
      <Foto
        base="/img/fachada-baixinhos"
        larguras={[480, 866]}
        largura={866}
        altura={1016}
        sizes="(min-width: 768px) 560px, 92vw"
        alt="Fachada do Odonto Baixinhos, um castelo em tons pastel com torres azuis e telhados rosa, e a Dra. Aline à porta"
        className={className}
      />
    );
  if (modo === "josiane")
    return (
      <Foto
        base="/img/fachada-consultorio"
        larguras={[362]}
        largura={362}
        altura={840}
        sizes="(min-width: 768px) 360px, 80vw"
        alt="Fachada do consultório odontológico: letreiro em dourado sobre fundo escuro, portão dourado e madeira"
        className={compacta ? className : "mx-auto h-auto max-h-[36rem] w-auto max-w-full"}
      />
    );
  return (
    <Foto
      base="/img/fachada"
      larguras={[640, 1206]}
      largura={1206}
      altura={1016}
      sizes="(min-width: 768px) 560px, 92vw"
      alt="Fachada na Av. Afonso Pena, 997: à esquerda o consultório odontológico em preto, dourado e madeira; à direita o castelo pastel do Odonto Baixinhos, com a Dra. Aline à porta"
      className={className}
    />
  );
}
