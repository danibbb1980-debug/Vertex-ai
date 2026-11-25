/** Única fonte de tempos e curvas do projeto. */
export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
}

export const dur = {
  curta: 0.25,
  media: 0.6,
  longa: 1.1,
  morph: 0.7,
}

export const stagger = {
  linhas: 0.06,
  palavras: 0.04,
  opcoes: 0.04,
}

export const desloc = {
  mobile: 24,
  desktop: 40,
}

/** Variante padrão de entrada (fade + sobe). */
export const entrada = {
  oculto: { opacity: 0, y: desloc.mobile },
  visivel: { opacity: 1, y: 0, transition: { duration: dur.media, ease: ease.outExpo } },
}
