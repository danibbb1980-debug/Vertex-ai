import type { ElementType, ComponentPropsWithoutRef } from "react";

type Props<T extends ElementType> = {
  como?: T;
  /** atraso em ms */
  atraso?: number;
} & ComponentPropsWithoutRef<T>;

/** Revela o conteúdo ao entrar na tela (opacity + transform). Sem JS ou com movimento reduzido, aparece direto. */
export function Revelar<T extends ElementType = "div">({ como, atraso = 0, style, ...resto }: Props<T>) {
  const Tag = (como ?? "div") as ElementType;
  return <Tag data-revelar="" style={{ ...style, ["--atraso" as string]: atraso }} {...resto} />;
}
