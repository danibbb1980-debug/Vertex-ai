import { LOGO_ANEL, LOGO_Z } from '../logoPaths'

/** Símbolo definido uma vez e reutilizado (logo do topo, rodapé e o emblema 3D). */
export function LogoDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="logo-simbolo" viewBox="0 0 640 640">
          <path d={LOGO_ANEL} fill="var(--logo-anel, #fff)" />
          <path d={LOGO_Z} fill="var(--logo-z, #3cc8c0)" />
        </symbol>
      </defs>
    </svg>
  )
}

export function LogoQuadro({ tamanho }: { tamanho: number }) {
  return (
    <svg className="marca-quadro" width={tamanho} height={tamanho} viewBox="0 0 640 640" aria-hidden="true" focusable="false">
      <rect width="640" height="640" fill="#0b45a6" />
      <use href="#logo-simbolo" />
    </svg>
  )
}

const CAMADAS = 7

/** O logo como uma peça sólida em 3D: placa com espessura e símbolo em relevo. */
export function Logo3D() {
  return (
    <div className="emblema" aria-hidden="true">
      <div className="emblema-giro">
        <div className="emblema-placa">
          <span className="face face-frente" />
          <span className="face face-tras" />
          <span className="face face-dir" />
          <span className="face face-esq" />
          <span className="face face-topo" />
          <span className="face face-base" />
          {Array.from({ length: CAMADAS }, (_, i) => (
            <svg
              key={i}
              className={`emblema-camada${i === CAMADAS - 1 ? ' topo' : ''}`}
              style={{ ['--k' as string]: i + 1 }}
              viewBox="0 0 640 640"
              focusable="false"
            >
              <use href="#logo-simbolo" />
            </svg>
          ))}
        </div>
        <span className="emblema-sombra" />
      </div>
    </div>
  )
}
