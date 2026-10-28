/**
 * Logo oficial (só o símbolo: dente + GB + traço, sem a assinatura).
 * Vetorizado a partir de referencias/logo-dr-gustavo-alta.png.
 * Versões: public/marca/logo.svg (escuro) e logo-claro.svg (claro).
 */
export function Logo({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light'; className?: string }) {
  return (
    <img
      src={tone === 'dark' ? '/marca/logo.svg' : '/marca/logo-claro.svg'}
      width={934}
      height={365}
      alt="GB, Gustavo Borges Andrade Odontologia"
      className={`block h-auto ${className}`}
      decoding="async"
    />
  )
}
