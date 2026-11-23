import type { Metadata } from "next";
import { TreatmentPage } from "@/components/sections/TreatmentPage";

export const metadata: Metadata = {
  title: "Depilação masculina",
  description:
    "Depilação para todos os homens com a tecnologia Sun&Safe, exclusiva Não+Pelo: virilha, axilas, barriga, meia perna e mais. Atendemos peles bronzeadas.",
  alternates: { canonical: "/depilacao-masculina" },
  openGraph: { url: "/depilacao-masculina", title: "Depilação masculina — Não+Pelo" },
};

export default function Page() {
  return <TreatmentPage gender="masculino" />;
}
