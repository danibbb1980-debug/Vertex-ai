/** Vertex mark — an upward apex, drawn as an inline SVG so it stays crisp and adds no request. */
export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      role="img"
      aria-label="Vertex Web Studios"
    >
      <defs>
        <linearGradient id="vertex-mark" x1="0" y1="32" x2="32" y2="0">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="55%" stopColor="#7c6cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path
        d="M16 3.5 30 28.5H21.4L16 18.9l-5.4 9.6H2L16 3.5Z"
        fill="url(#vertex-mark)"
      />
      <path d="M16 3.5 30 28.5H21.4L16 18.9V3.5Z" fill="#fff" fillOpacity="0.16" />
    </svg>
  );
}
