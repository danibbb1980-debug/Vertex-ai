/** Orquídea em traço fino (linhas-guia do logo, para desenho animado). viewBox 0 0 200 140. */
export const PETALA_TOPO = ['M100 88 C84 66 82 32 92 10', 'M100 88 C116 66 118 32 108 10']
export const LATERAIS = [
  'M88 46 C62 40 34 50 18 68',
  'M18 68 C32 96 66 104 100 88',
  'M112 46 C138 40 166 50 182 68',
  'M182 68 C168 96 134 104 100 88',
]
export const INFERIORES = [
  'M96 96 C72 100 42 110 24 124',
  'M24 124 C48 128 76 118 94 102',
  'M104 96 C128 100 158 110 176 124',
  'M176 124 C152 128 124 118 106 102',
]
export const COLUNA = ['M100 88 C92 92 87 108 88 126', 'M100 88 C108 92 113 108 112 126']
export const TODAS = [...PETALA_TOPO, ...LATERAIS, ...COLUNA, ...INFERIORES]
