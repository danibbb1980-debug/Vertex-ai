import { renderToString } from "react-dom/server";
import { App, Privacidade, NaoEncontrada } from "./App";

export const render = {
  index: () => renderToString(<App />),
  privacidade: () => renderToString(<Privacidade />),
  notFound: () => renderToString(<NaoEncontrada />),
};
export { CONFIG, servicosAtivos } from "./config";
