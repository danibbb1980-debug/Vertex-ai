import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-sun px-5 text-center">
      <Logo variant="vertical" className="h-auto w-44" />
      <p className="eyebrow mt-12 text-coral-ink">Erro 404</p>
      <h1 className="font-display mt-4 text-5xl font-[420] text-navy-deep sm:text-6xl">Página não encontrada.</h1>
      <p className="mt-5 max-w-md text-navy/75">O endereço que você acessou não existe no site da {site.name}.</p>
      <Link
        href="/"
        className="mt-9 inline-flex min-h-13 items-center rounded-full bg-navy px-7 font-semibold text-white hover:bg-navy-deep"
      >
        Voltar para o início
      </Link>
    </main>
  );
}
