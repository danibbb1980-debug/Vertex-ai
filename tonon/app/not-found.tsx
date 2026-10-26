import Link from "next/link";
import { site } from "@/lib/site-data";

export default function NotFound() {
  return (
    <main className="hero-bg flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="label text-sage">Erro 404</p>
      <h1 className="display mt-6 text-5xl text-graphite sm:text-7xl">
        Página <em>não encontrada</em>.
      </h1>
      <p className="mt-6 max-w-md text-ink">O endereço que você acessou não existe no site do {site.name}.</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center rounded-[2px] bg-graphite px-7 text-[0.8rem] font-semibold tracking-[0.08em] text-paper uppercase transition-colors hover:bg-sage"
      >
        Voltar para o início
      </Link>
    </main>
  );
}
