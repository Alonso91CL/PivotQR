import type { ReactNode } from "react";
import type { Item } from "@/components/metricas/agregacion";

export function Columnas({ items, step = 1 }: { items: Item[]; step?: number }) {
  const max = Math.max(1, ...items.map((i) => i.valor));
  return (
    <div>
      <div className="flex h-36 items-end gap-[3px]">
        {items.map((it, i) => (
          <div
            key={i}
            role="img"
            aria-label={`${it.label}: ${it.valor} escaneos`}
            tabIndex={0}
            className="group relative flex h-full flex-1 flex-col justify-end rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70"
            title={`${it.label}: ${it.valor} escaneos`}
          >
            {it.valor > 0 && (
              <span
                aria-hidden
                className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 text-[11px] leading-4 text-gray-200 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {it.valor}
              </span>
            )}
            <div
              className={`w-full rounded-t-[3px] ${it.valor > 0 ? "bg-brand-500" : "bg-gray-800"}`}
              style={{ height: `${Math.max(it.valor > 0 ? 6 : 2, (it.valor / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-[3px] text-[11px] text-gray-400">
        {items.map((it, i) => (
          <span key={i} className="flex-1 text-center">
            {i % step === 0 ? it.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ListaBarras({ items }: { items: Item[] }) {
  const max = Math.max(1, ...items.map((i) => i.valor));
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it.label}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className="truncate text-gray-300">{it.label}</span>
            <span className="font-semibold text-white">{it.valor}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${(it.valor / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Card({
  titulo,
  children,
  className = "",
}: {
  titulo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-gray-800 bg-gray-900 p-5 ${className}`}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">{titulo}</h2>
      {children}
    </section>
  );
}

export function Vacío() {
  return <p className="py-4 text-center text-sm text-gray-400">Sin datos aún</p>;
}