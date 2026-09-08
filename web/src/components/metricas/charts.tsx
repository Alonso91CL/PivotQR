import type { ReactNode } from "react";
import type { Item, PuntoMapa } from "@/components/metricas/agregacion";
import type { ReporteScan } from "@/lib/reporte";
import { descargarScansCsv } from "@/lib/csv";

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

// Mapa de burbujas por ciudad: proyecta las coordenadas al lienzo con una
// escala lineal corregida por latitud (para que las burbujas sean circulares)
// y conserva el listado rankeado como respaldo accesible.
export function MapaCiudades({ puntos }: { puntos: PuntoMapa[] }) {
  if (puntos.length === 0) return <Vacío />;

  const W = 320;
  const H = 200;
  const PAD = 18;

  const lats = puntos.map((p) => p.latitud);
  const lngs = puntos.map((p) => p.longitud);
  let minLat = Math.min(...lats);
  let maxLat = Math.max(...lats);
  let minLng = Math.min(...lngs);
  let maxLng = Math.max(...lngs);
  if (maxLat - minLat < 0.001) {
    minLat -= 0.5;
    maxLat += 0.5;
  }
  if (maxLng - minLng < 0.001) {
    minLng -= 0.5;
    maxLng += 0.5;
  }

  const midLat = (minLat + maxLat) / 2;
  const cosMid = Math.max(0.3, Math.abs(Math.cos((midLat * Math.PI) / 180)));
  const spanX = (maxLng - minLng) * cosMid;
  const spanY = maxLat - minLat;
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
  const x = (lng: number) => PAD + (lng - minLng) * cosMid * scale;
  const y = (lat: number) => H - PAD - (lat - minLat) * scale;

  const maxCant = Math.max(...puntos.map((p) => p.cantidad));
  const radio = (n: number) => Math.max(4, 12 * Math.sqrt(n / maxCant));

  return (
    <svg
      role="img"
      aria-label={`Mapa de ciudades: ${puntos.map((p) => `${p.ciudad} (${p.cantidad})`).join(", ")}`}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
    >
      <title>Mapa de ciudades con escaneos</title>
      {puntos.map((p) => {
        const px = x(p.longitud);
        const py = y(p.latitud);
        const r = radio(p.cantidad);
        const anchoTexto = p.ciudad.length * 5;
        const aLaDerecha = px + r + 6 + anchoTexto <= W - 4;
        const lx = aLaDerecha ? px + r + 6 : px - r - 6;
        return (
          <g key={`${p.ciudad} ${p.pais ?? ""}`}>
            <circle cx={px} cy={py} r={r} className="fill-brand-500/25 stroke-brand-500" strokeWidth={1.5}>
              <title>{`${p.ciudad}${p.pais ? ` (${p.pais})` : ""}: ${p.cantidad} escaneos`}</title>
            </circle>
            <text
              x={lx}
              y={py + 3}
              fontSize={9}
              textAnchor={aLaDerecha ? "start" : "end"}
              className="fill-gray-300"
            >
              {p.ciudad}
            </text>
          </g>
        );
      })}
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