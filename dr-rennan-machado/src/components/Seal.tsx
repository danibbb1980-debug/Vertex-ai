import { useId } from 'react';
import { CONFIG } from '../config';
import { Tooth } from './Icons';

/** Selo circular: o "C" do monograma como selo, com nome e CRO em texto circular. */
export function Seal({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  const id = useId().replace(/:/g, '');
  const txt = `${CONFIG.nome} · ${CONFIG.cro} · `;
  return (
    <div className={`relative ${className}`} role="img" aria-label={`${CONFIG.nome} · ${CONFIG.cro}`}>
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true" focusable="false">
        <defs>
          <path id={`c-${id}`} d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill={dark ? '#1E1913' : '#FFFDF7'} stroke="#D9AE3F" strokeOpacity=".7" />
        <circle cx="60" cy="60" r="33" fill="none" stroke="#D9AE3F" strokeWidth="1.2" />
        <text
          fill={dark ? '#ECCF7E' : '#7E5C12'}
          fontSize="8.6"
          fontWeight="600"
          letterSpacing="1.55"
          style={{ fontFamily: 'Manrope Variable, sans-serif', textTransform: 'uppercase' }}
        >
          <textPath href={`#c-${id}`}>{txt.toUpperCase()}</textPath>
        </text>
      </svg>
      <Tooth size={30} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${dark ? 'text-cream' : 'text-ink'}`} />
    </div>
  );
}
