import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Arrow } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <>
      <Header over="none" />
      <main id="conteudo" className="bg-bone">
        <section className="container-x flex min-h-[80svh] flex-col justify-end pb-24 pt-40">
          <p className="eyebrow text-stone">Erro 404</p>
          <h1 className="mt-8 text-display tracking-[-0.035em]">
            Página <em>não encontrada.</em>
          </h1>
          <p className="mt-8 max-w-md text-stone">O endereço pode ter mudado com o novo site. Comece pela página inicial ou encontre uma unidade.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn btn-solid-dark">
              <span>Ir para o início</span>
              <Arrow />
            </Link>
            <Link href="/unidades" className="btn btn-outline-dark">
              <span>Ver unidades</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
