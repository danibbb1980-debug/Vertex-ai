"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Arrow } from "@/components/ui/primitives";
import { normalize, states, UF_NAMES, unitBookingHref, unitMapsHref, units, type Unit } from "@/lib/units";

/**
 * Localizador de unidades: busca livre (cidade, bairro, endereço ou nome)
 * combinada com o filtro de estado. Todos os dados vêm de onde-estamos.
 * `compact` limita a lista e leva para a página completa.
 */
export function UnitLocator({ compact = false, tone = "light" }: { compact?: boolean; tone?: "light" | "dark" }) {
  const [query, setQuery] = useState("");
  const [uf, setUf] = useState("");
  const deferred = useDeferredValue(query);
  const dark = tone === "dark";

  const index = useMemo(
    () => units.map((u) => ({ unit: u, hay: normalize(`${u.nome} ${u.cidade} ${u.uf} ${UF_NAMES[u.uf] ?? ""} ${u.endereco}`) })),
    [],
  );

  const results = useMemo(() => {
    const terms = normalize(deferred).split(/\s+/).filter(Boolean);
    return index
      .filter(({ unit, hay }) => (!uf || unit.uf === uf) && terms.every((t) => hay.includes(t)))
      .map(({ unit }) => unit);
  }, [index, deferred, uf]);

  const limit = compact ? 6 : results.length;
  const shown = results.slice(0, limit);
  const filtering = Boolean(deferred.trim() || uf);
  const muted = dark ? "text-mist" : "text-stone";
  const line = dark ? "border-bone/15" : "border-ink/12";

  return (
    <div>
      <div className={`grid gap-6 md:grid-cols-[minmax(0,1fr)_14rem] md:items-end`}>
        <div className="relative">
          <input
            id="busca-unidade"
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder=" "
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`field pr-8 font-display text-[1.6rem] md:text-[2rem] ${dark ? "field-dark" : ""}`}
          />
          <label htmlFor="busca-unidade" className={`float-label font-display text-[1.6rem] md:text-[2rem] ${muted}`}>
            Cidade, bairro ou endereço
          </label>
          <svg aria-hidden="true" viewBox="0 0 20 20" className={`pointer-events-none absolute bottom-4 right-0 h-5 w-5 ${muted}`} fill="none">
            <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" />
            <path d="M13.5 13.5 19 19" stroke="currentColor" />
          </svg>
        </div>
        <div className="relative">
          <select
            id="filtro-estado"
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className={`field ${dark ? "field-dark [&>option]:text-ink" : ""}`}
          >
            <option value="">Todos os estados</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {UF_NAMES[s] ?? s} ({s})
              </option>
            ))}
          </select>
          <label htmlFor="filtro-estado" className={`float-label is-up ${muted}`}>
            Estado
          </label>
        </div>
      </div>

      <p className={`eyebrow mt-8 ${muted}`} aria-live="polite">
        {results.length === 0
          ? "Nenhuma unidade encontrada"
          : filtering
            ? `${results.length} ${results.length === 1 ? "unidade encontrada" : "unidades encontradas"}`
            : `${units.length} unidades publicadas`}
      </p>

      {results.length === 0 ? (
        <div className={`mt-6 border-t ${line} pt-8`}>
          <p className="max-w-md font-display text-2xl leading-snug">
            Ainda não encontramos uma unidade com esse termo. Tente o nome da cidade, ou fale com a nossa central.
          </p>
        </div>
      ) : (
        <ul className={`mt-6 border-t ${line}`}>
          {shown.map((u) => (
            <UnitRow key={u.id} unit={u} dark={dark} />
          ))}
        </ul>
      )}

      {compact && results.length > limit ? (
        <div className="mt-10">
          <Link href="/unidades" className={`btn ${dark ? "btn-outline-light" : "btn-outline-dark"}`}>
            <span>Ver todas as {results.length} unidades</span>
            <Arrow />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function UnitRow({ unit, dark }: { unit: Unit; dark: boolean }) {
  const muted = dark ? "text-mist" : "text-stone";
  return (
    <li className={`group grid gap-4 border-b py-6 md:grid-cols-12 md:items-center md:gap-6 ${dark ? "border-bone/15" : "border-ink/12"}`}>
      <div className="md:col-span-4">
        <p className={`eyebrow ${muted}`}>
          {unit.cidade} · {unit.uf}
        </p>
        <h3 className="mt-1.5 font-display text-[1.65rem] leading-tight transition-transform duration-500 ease-[var(--ease-out-expo)] md:group-hover:translate-x-1.5">
          {unit.nome}
        </h3>
      </div>
      <address className={`not-italic text-[0.9375rem] leading-relaxed md:col-span-4 ${muted}`}>
        {unit.endereco}
        {unit.telefone ? (
          <>
            <br />
            <a href={`tel:${unit.telefone.replace(/\D/g, "")}`} className="link-line">
              {unit.telefone}
            </a>
          </>
        ) : null}
      </address>
      <div className="flex flex-wrap gap-x-6 gap-y-3 md:col-span-4 md:justify-end">
        <a
          href={unitMapsHref(unit)}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow link-line inline-flex min-h-11 items-center"
          aria-label={`Ver ${unit.nome} no mapa`}
        >
          Como chegar
        </a>
        <a
          href={unitBookingHref(unit)}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn min-h-11 px-5 ${dark ? "btn-solid-light" : "btn-solid-dark"}`}
          aria-label={unit.whatsapp ? `Agendar na unidade ${unit.nome} pelo WhatsApp` : `Agendar pela central (a unidade ${unit.nome} não publicou WhatsApp)`}
        >
          <span>{unit.whatsapp ? "Agendar" : "Central"}</span>
          <Arrow />
        </a>
      </div>
    </li>
  );
}
