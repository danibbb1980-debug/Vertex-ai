import { renderToString } from "react-dom/server";
import App from "./App";
import { CONFIG } from "./config";
export { head } from "./head";

export const render = () => renderToString(<App />);
export const rascunho = CONFIG.rascunho;
export const siteUrl = CONFIG.siteUrl;
