import "./index.css";
// Entrada mínima: o HTML pré-renderizado pinta primeiro e o app (React + animações)
// é carregado logo em seguida, sem disputar a primeira pintura.
requestAnimationFrame(() => setTimeout(() => import("./main"), 0));
