// As definições SVG (<symbol>) do logo são inseridas no HTML pelo prerender
// (scripts/prerender.mjs, via logoDefs.ts), fora do React: não pesam no JS.
export const LOGO_VB = '56 62 942 316';
const [, , vbW, vbH] = LOGO_VB.split(' ').map(Number);

export function Logo({ className = '', title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${vbW} ${vbH}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="currentColor"
    >
      <use href="#bb-logo" width={vbW} height={vbH} />
    </svg>
  );
}

export function Pear({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 340 340" aria-hidden="true" focusable="false" fill="currentColor">
      <use href="#bb-pear" width="340" height="340" />
    </svg>
  );
}
