import { renderToString } from "react-dom/server";
import { Raiz } from "./Raiz";

export function render() {
  return renderToString(<Raiz />);
}
