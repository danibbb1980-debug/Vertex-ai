import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const TONS_7 = ["#FFFDFB", "#FBF1EE", "#F8E6E9", "#F4D9E2", "#EFCBD7", "#E8BACB", "#DFA7BC"];
const COD_7 = ["A1", "A2", "B1", "B2", "C1", "C3", "D3"];
const TONS_5 = ["#FFFDFB", "#F8E6E9", "#F4D9E2", "#EBC2D1", "#DFA7BC"];
const COD_5 = ["A1", "B1", "B2", "C3", "D3"];

function useLargo() {
  const q = "(min-width: 768px)";
  const [largo, setLargo] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setLargo(m.matches);
    f();
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return largo;
}

interface Props {
  escolhidaCor?: string;
  escolhidaTexto?: string;
  legenda?: boolean;
}

/** Escala de cor em leque: momento de assinatura do site. Puramente decorativo. */
export function Leque({ escolhidaCor = "#B8336A", escolhidaTexto = "#FFFFFF", legenda = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.4 });
  const reduzir = useReducedMotion();
  const largo = useLargo();

  const tons = largo ? TONS_7 : TONS_5;
  const cods = largo ? COD_7 : COD_5;
  const n = tons.length;
  const meio = Math.floor(n / 2);
  const abrir = visto || !!reduzir;
  const total = n * 0.06 + 0.75;

  return (
    <div className="leque" ref={ref} aria-hidden="true">
      <div className="leque-palco">
        <div className="leque-base">
          {tons.map((tom, i) => {
            const ang = -34 + (68 * i) / (n - 1);
            const escolhida = i === meio;
            const z = 10 - Math.abs(i - meio);
            return (
              <motion.div
                key={cods[i]}
                className={"lamina" + (escolhida && abrir ? " escolhida" : "")}
                style={{ zIndex: escolhida ? 9 : z, backgroundColor: tom }}
                initial={reduzir ? false : { rotate: 0, y: 0 }}
                animate={
                  abrir
                    ? escolhida
                      ? { rotate: 0, y: -14, backgroundColor: escolhidaCor }
                      : { rotate: ang, y: 0 }
                    : { rotate: 0, y: 0 }
                }
                transition={
                  reduzir
                    ? { duration: 0 }
                    : escolhida
                      ? { delay: total, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                      : { type: "spring", stiffness: 60, damping: 13, mass: 1, delay: 0.25 + i * 0.06 }
                }
              >
                <span style={escolhida && abrir ? { color: escolhidaTexto } : undefined}>{cods[i]}</span>
              </motion.div>
            );
          })}
          <span className="leque-pino" />
        </div>
      </div>
      {legenda && (
        <div className="leque-legenda">
          <span>Escala de cor</span>
          <span>
            amostra <b>{cods[meio]}</b>
          </span>
        </div>
      )}
    </div>
  );
}
