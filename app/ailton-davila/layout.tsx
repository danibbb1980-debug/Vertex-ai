import { Anton, Instrument_Serif } from "next/font/google";
import "./ailton.css";

/*
  Fontes só desta rota — o site da Vertex não baixa nenhuma delas.
  Anton: títulos de impacto, peso único (400).
  Instrument Serif itálico: acentos editoriais pontuais (citações, destaques).
  O corpo usa a Inter já carregada pelo layout raiz.
*/
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
});

export default function AiltonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${anton.variable} ${instrumentSerif.variable} ad min-h-svh`}>{children}</div>
  );
}
