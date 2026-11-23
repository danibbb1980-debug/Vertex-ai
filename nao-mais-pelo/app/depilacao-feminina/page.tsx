import type { Metadata } from "next";
import { TreatmentPage } from "@/components/sections/TreatmentPage";

export const metadata: Metadata = {
  title: "Depilação feminina",
  description:
    "Depilação para todas as mulheres com a tecnologia Sun&Safe, exclusiva Não+Pelo: virilha, axilas, buço, meia perna e mais. Atendemos peles bronzeadas.",
  alternates: { canonical: "/depilacao-feminina" },
  openGraph: { url: "/depilacao-feminina", title: "Depilação feminina — Não+Pelo" },
};

export default function Page() {
  return <TreatmentPage gender="feminino" />;
}
