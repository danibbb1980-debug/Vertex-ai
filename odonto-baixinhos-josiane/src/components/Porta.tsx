import type { Profissional } from "../config";
import { Foto } from "./Foto";
import { Ameias, Brilho } from "./Ornamentos";

interface Props {
  pro: Profissional;
  href: string;
  rotulo: string;
  prioridade?: boolean;
  sizes: string;
}

/**
 * Momento de assinatura: uma porta entreaberta que abre um pouco mais no hover/foco
 * e revela a profissional. No toque, o link leva direto à seção.
 * Só anima transform e opacity.
 */
export function Porta({ pro, href, rotulo, prioridade, sizes }: Props) {
  const baixinhos = pro.id === "aline";
  return (
    <a href={href} className={`porta group block ${baixinhos ? "porta-baixinhos" : "porta-josiane"}`} aria-label={rotulo}>
      <div className="porta-moldura">
        {baixinhos ? (
          <Ameias className="porta-ameias" />
        ) : (
          <Brilho className="porta-brilho" />
        )}
        <div className="porta-vao">
          <Foto
            base={pro.foto.base}
            larguras={pro.foto.larguras}
            alt=""
            sizes={sizes}
            prioridade={prioridade}
            largura={480}
            altura={600}
            className="porta-foto"
          />
          <div className="porta-sombra" />
          <div className="porta-folha">
            <span className="porta-macaneta" />
          </div>
        </div>
      </div>
    </a>
  );
}
