import { useId, type ReactNode } from "react";
import type { Item, PuntoMapa } from "@/components/metricas/agregacion";
import type { ReporteScan } from "@/lib/reporte";
import { descargarScansCsv } from "@/lib/csv";
import { MAPAMUNDI_PATH } from "@/components/metricas/mapamundi";

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

// Mapa de calor de escaneos: proyecta las ciudades agregadas (promedio de
// lat/long por ciudad, nunca coordenadas exactas) sobre un mapamundi real
// (proyección equirectangular) y las difumina con un desenfoque gaussiano
// para que se vea una mancha de densidad, no un punto de ubicación precisa.
// Conserva el listado rankeado como respaldo accesible.
export function MapaCalor({ puntos }: { puntos: PuntoMapa[] }) {
  const filtro = useId();

  if (puntos.length === 0) return <Vacío />;

  const W = 720;
  const H = 360;

  const x = (lng: number) => ((lng + 180) / 360) * W;
  const y = (lat: number) => ((90 - lat) / 180) * H;

  const maxCant = Math.max(1, ...puntos.map((p) => p.cantidad));
  const radio = (n: number) => Math.max(10, 26 * Math.sqrt(n / maxCant));

  return (
    <svg
      role="img"
      aria-label={`Mapa de calor de escaneos: ${puntos.map((p) => `${p.ciudad} (${p.cantidad})`).join(", ")}`}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full rounded-xl border border-gray-800 bg-gray-950"
    >
      <title>Mapa de calor de escaneos</title>
      <defs>
        <filter id={filtro} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
        <radialGradient id="calor-grad" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#465fff" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#ff6d3b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff6d3b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Mapamundi base (Natural Earth 110m, dominio público, equirectangular) */}
      <circle cx={180} cy={180} r={178} fill="#0f172a" />
      <circle cx={540} cy={180} r={178} fill="#0f172a" />
      <path d={MAPAMUNDI_PATH} fill="#1f2937" stroke="#374151" strokeWidth="0.5" aria-hidden />

      {/* Manchas difuminadas: cada ciudad es una zona de densidad, sin coordenadas exactas */}
      <g filter={`url(#${filtro})`}>
        {puntos.map((p) => (
          <circle
            key={`${p.ciudad} ${p.pais ?? ""}`}
            cx={x(p.longitud)}
            cy={y(p.latitud)}
            r={radio(p.cantidad)}
            fill="url(#calor-grad)"
            opacity={0.45 + 0.55 * (p.cantidad / maxCant)}
          >
            <title>{`${p.ciudad}${p.pais ? ` (${p.pais})` : ""}: ${p.cantidad} escaneos`}</title>
          </circle>
        ))}
      </g>
    </svg>
  );
}

export function BotónCsv({ scans, nombreArchivo }: { scans: ReporteScan[]; nombreArchivo: string }) {
  return (
    <button
      type="button"
      onClick={() => descargarScansCsv(scans, nombreArchivo)}
      disabled={scans.length === 0}
      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-200 transition hover:border-gray-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      Descargar CSV
    </button>
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