import Link from "next/link";
import { site } from "@/lib/site-data";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="mt-5 text-5xl sm:text-6xl">Página não encontrada</h1>
      <p className="mt-5 max-w-md text-muted">O endereço que você acessou não existe no site da {site.name}.</p>
      <Link
        href="/"
        className="mt-9 inline-flex min-h-12 items-center rounded-full bg-teal px-7 font-semibold text-white hover:bg-teal-dark"
      >
        Voltar para o início
      </Link>
    </main>
  );
}
