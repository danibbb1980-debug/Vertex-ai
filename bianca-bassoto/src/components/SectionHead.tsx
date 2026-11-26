import { Markers } from './Markers';

type Props = {
  num: string;
  label: string;
  lines: React.ReactNode[];
  id: string;
  className?: string;
  as?: 'h2' | 'p';
};

/** Cabeçalho de seção: número + marcadores em miniatura + rótulo, e o título revelado por linha. */
export function SectionHead({ num, label, lines, id, className = '' }: Props) {
  return (
    <header className={`shead ${className}`}>
      <p className="shead__meta">
        <span className="shead__num">{num}</span>
        <Markers />
        <span className="shead__label">{label}</span>
      </p>
      <h2 className="shead__title" id={id}>
        {lines.map((l, i) => (
          <span className="mask" key={i}>
            <span className="mask__in" style={{ ['--i' as string]: i }}>
              {l}
            </span>{' '}
          </span>
        ))}
      </h2>
    </header>
  );
}
