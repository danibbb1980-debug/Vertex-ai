import { useCallback, useEffect, useRef, useState } from 'react';
import { CONFIG, type Foto } from './config';
import { SectionHead } from './ui';

const src = (f: string, w: 360 | 560 | 1100) => `/media/${f}-${w}.webp`;
const W = 1170;
const H = 2050;

function Img({ foto, sizes, className = '' }: { foto: Foto; sizes: string; className?: string }) {
  return (
    <img
      className={className}
      src={src(foto.arquivo, 560)}
      srcSet={`${src(foto.arquivo, 360)} 360w, ${src(foto.arquivo, 560)} 560w, ${src(foto.arquivo, 1100)} 1100w`}
      sizes={sizes}
      width={W}
      height={H}
      alt={foto.alt}
      loading="lazy"
      decoding="async"
    />
  );
}

function VideoCard({ v, i }: { v: (typeof CONFIG.videos)[number]; i: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.dataset.user = 'play';
      void el.play();
    } else {
      el.dataset.user = 'pause';
      el.pause();
    }
  };
  return (
    <figure className={`work-video work-video--${i}`}>
      <div className="work-video__frame">
        <video
          ref={ref}
          data-autoplay
          muted
          loop
          playsInline
          preload="none"
          poster={v.poster}
          width={720}
          height={1160}
          aria-label={v.alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={v.arquivo} type="video/mp4" />
        </video>
        <button type="button" className="work-video__btn" onClick={toggle} aria-pressed={playing}>
          <span className="work-video__icon" aria-hidden="true" data-state={playing ? 'pause' : 'play'} />
          <span className="sr-only">{playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}</span>
        </button>
      </div>
      <figcaption>{v.legenda}</figcaption>
    </figure>
  );
}

export function Trabalhos() {
  const grupos = CONFIG.trabalhos.filter((g) => g.fotos.length > 0);
  const temAlgo = grupos.length > 0 || CONFIG.videos.length > 0 || CONFIG.antesDepois;
  const todas = grupos.flatMap((g) => g.fotos);
  const [aberta, setAberta] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const abrir = (idx: number, el: HTMLElement) => {
    opener.current = el;
    setAberta(idx);
  };
  const fechar = useCallback(() => setAberta(null), []);
  const mover = useCallback(
    (d: number) => setAberta((a) => (a === null ? a : (a + d + todas.length) % todas.length)),
    [todas.length],
  );

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (aberta !== null && !d.open) d.showModal();
    if (aberta === null && d.open) {
      d.close();
      opener.current?.focus();
    }
  }, [aberta]);

  useEffect(() => {
    if (aberta === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aberta, mover]);

  if (!CONFIG.secoes.trabalhos || !temAlgo) return null;

  let k = -1;
  const ad = CONFIG.antesDepois;
  return (
    <section className="sec trabalhos" id="trabalhos" aria-labelledby="trabalhos-t">
      <div className="wrap">
        <SectionHead num="02" label="Trabalhos" title="O trabalho, visto de perto." id="trabalhos-t">
          <p>Registros feitos no box da The Details, em Poços de Caldas.</p>
        </SectionHead>

        {CONFIG.videos.length > 0 ? (
          <div className="work-videos">
            {CONFIG.videos.map((v, i) => (
              <VideoCard key={v.arquivo} v={v} i={i} />
            ))}
          </div>
        ) : null}

        {ad ? (
          <div className="ba">
            <h3 className="ba__t">{ad.titulo}</h3>
            <div className="ba__pair">
              <figure>
                <Img foto={ad.antes} sizes="(min-width: 900px) 34vw, 50vw" />
                <figcaption>Antes</figcaption>
              </figure>
              <figure>
                <Img foto={ad.depois} sizes="(min-width: 900px) 34vw, 50vw" />
                <figcaption>Depois</figcaption>
              </figure>
            </div>
          </div>
        ) : null}

        <div className="groups">
          {grupos.map((g) => (
            <div key={g.titulo} className="group">
              <div className="group__label">
                <h3 className="group__t">{g.titulo}</h3>
                <p className="group__c">
                  {g.fotos.length} {g.fotos.length === 1 ? 'foto' : 'fotos'}
                </p>
              </div>
              <ul className={`group__grid group__grid--${Math.min(g.fotos.length, 4)}`}>
                {g.fotos.map((f) => {
                  k += 1;
                  const idx = k;
                  return (
                    <li key={f.arquivo}>
                      <button
                        type="button"
                        className="thumb"
                        onClick={(e) => abrir(idx, e.currentTarget)}
                        aria-label={`Ampliar foto: ${f.alt}`}
                      >
                        <Img foto={f} sizes="(min-width: 900px) 20vw, 46vw" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <dialog ref={dlg} className="lightbox" aria-label="Foto ampliada" onClose={fechar} onClick={(e) => e.target === dlg.current && fechar()}>
        {aberta !== null ? (
          <div className="lightbox__in">
            <img src={src(todas[aberta].arquivo, 1100)} alt={todas[aberta].alt} width={W} height={H} />
            <div className="lightbox__bar">
              <p className="lightbox__count">
                {aberta + 1} de {todas.length}
              </p>
              <div className="lightbox__nav">
                <button type="button" className="btn btn--line" onClick={() => mover(-1)}>
                  <span>Anterior</span>
                </button>
                <button type="button" className="btn btn--line" onClick={() => mover(1)}>
                  <span>Próxima</span>
                </button>
                <button type="button" className="btn btn--solid" onClick={fechar} autoFocus>
                  <span>Fechar</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
