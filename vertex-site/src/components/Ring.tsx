/** Anel fino com quatro marcas, como na logo. Puramente decorativo. */
export function Ring({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <circle cx="200" cy="200" r="196" stroke="url(#ringg)" strokeWidth="1" />
      <path d="M200 0v10M200 390v10M0 200h10M390 200h10" stroke="#C9A24B" strokeWidth="1.4" />
      <defs>
        <linearGradient id="ringg" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C9A24B" stopOpacity=".55" />
          <stop offset=".5" stopColor="#C9A24B" stopOpacity=".18" />
          <stop offset="1" stopColor="#E9C876" stopOpacity=".55" />
        </linearGradient>
      </defs>
    </svg>
  );
}
