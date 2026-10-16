import Link from "next/link";
import { site } from "@/lib/site-data";

export default function NotFound() {
  return (
    <main className="texture-grid flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="display mt-5 text-5xl sm:text-7xl">
        Página <span className="text-orange">não encontrada.</span>
      </h1>
      <p className="mt-5 max-w-md text-mist">O endereço que você acessou não existe no site da {site.name}.</p>
      <Link
        href="/"
        className="chamfer-sm mt-9 inline-flex min-h-12 items-center bg-orange px-7 text-sm font-semibold tracking-[0.08em] text-ink uppercase hover:bg-orange-hot"
      >
        Voltar para o início
      </Link>
    </main>
  );
}
