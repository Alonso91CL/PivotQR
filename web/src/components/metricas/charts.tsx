import type { ReactNode } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { MultiPolygon, Polygon } from "geojson";
import type { Item, PuntoMapa } from "@/components/metricas/agregacion";
import type { ReporteScan } from "@/lib/reporte";
import { descargarScansCsv } from "@/lib/csv";
import { MUNDO } from "@/components/metricas/mundo";

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

// Cajas aproximadas por continente (lng/lat) para elegir la vista. La
// proyección (Mercator, vía d3-geo) se ajusta con fitExtent a la unión de los
// continentes que tienen datos: si solo hay escaneos en Sudamérica, el mapa
// centra Sudamérica; si aparecen en Norteamérica, muestra América; y así va
// ajustándose a lo necesario sin mostrar todo el planeta.
const CONTINENTES = [
  { nombre: "Norteamérica", lng: [-170, -20], lat: [5, 84] },
  { nombre: "Sudamérica", lng: [-95, -30], lat: [-60, 15] },
  { nombre: "Europa", lng: [-12, 45], lat: [35, 72] },
  { nombre: "África", lng: [-18, 52], lat: [-37, 38] },
  { nombre: "Asia", lng: [26, 180], lat: [0, 84] },
  { nombre: "Oceanía", lng: [110, 180], lat: [-50, 0] },
];

function continenteDe(p: PuntoMapa): typeof CONTINENTES[number] | null {
  for (const c of CONTINENTES) {
    const enLng = p.longitud >= c.lng[0] && p.longitud <= c.lng[1];
    const enLat = p.latitud >= c.lat[0] && p.latitud <= c.lat[1];
    if (enLng && enLat) return c;
  }
  return null;
}

// Mapa de escaneos por intensidad: cada ciudad agregada (promedio de lat/long,
// nunca coordenadas exactas) se marca con un punto de color que va de tenue a
// intenso según la cantidad de escaneos. La vista se ajusta a los continentes
// con datos. Conserva el listado rankeado como respaldo accesible.
export function MapaCalor({ puntos }: { puntos: PuntoMapa[] }) {
  if (puntos.length === 0) return <Vacío />;

  const W = 720;
  const H = 400;
  const PAD = 10;

  const presentes = new Map<string, typeof CONTINENTES[number]>();
  for (const p of puntos) {
    const c = continenteDe(p);
    if (c && !presentes.has(c.nombre)) presentes.set(c.nombre, c);
  }
  const cajas = [...presentes.values()];

  let zona: Polygon;
  if (cajas.length > 0) {
    const minLng = Math.min(...cajas.map((c) => c.lng[0]));
    const maxLng = Math.max(...cajas.map((c) => c.lng[1]));
    const minLat = Math.min(...cajas.map((c) => c.lat[0]));
    const maxLat = Math.max(...cajas.map((c) => c.lat[1]));
    const inflaLng = Math.min((maxLng - minLng) * 0.08, 8);
    const inflaLat = Math.min((maxLat - minLat) * 0.08, 8);
    zona = {
      type: "Polygon",
      coordinates: [
        [
          [Math.max(-180, minLng - inflaLng), Math.max(-60, minLat - inflaLat)],
          [Math.min(180, maxLng + inflaLng), Math.max(-60, minLat - inflaLat)],
          [Math.min(180, maxLng + inflaLng), Math.min(84, maxLat + inflaLat)],
          [Math.max(-180, minLng - inflaLng), Math.min(84, maxLat + inflaLat)],
          [Math.max(-180, minLng - inflaLng), Math.max(-60, minLat - inflaLat)],
        ],
      ],
    };
  } else {
    const lats = puntos.map((p) => p.latitud);
    const lngs = puntos.map((p) => p.longitud);
    const spanY = Math.max(...lats) - Math.min(...lats);
    const spanX = Math.max(...lngs) - Math.min(...lngs);
    const padY = Math.max(spanY * 0.5, 2);
    const padX = Math.max(spanX * 0.5, 2);
    zona = {
      type: "Polygon",
      coordinates: [
        [
          [Math.max(-180, Math.min(...lngs) - padX), Math.max(-60, Math.min(...lats) - padY)],
          [Math.min(180, Math.max(...lngs) + padX), Math.max(-60, Math.min(...lats) - padY)],
          [Math.min(180, Math.max(...lngs) + padX), Math.min(84, Math.max(...lats) + padY)],
          [Math.max(-180, Math.min(...lngs) - padX), Math.min(84, Math.max(...lats) + padY)],
          [Math.max(-180, Math.min(...lngs) - padX), Math.max(-60, Math.min(...lats) - padY)],
        ],
      ],
    };
  }

  const proyeccion = geoMercator()
    .fitExtent(
      [
        [PAD, PAD],
        [W - PAD, H - PAD],
      ],
      zona
    )
    .clipExtent([
      [PAD, PAD],
      [W - PAD, H - PAD],
    ]);
  const trazo = geoPath(proyeccion);
  const mundo: MultiPolygon = { type: "MultiPolygon", coordinates: MUNDO };
  const dMundo = trazo(mundo) ?? "";

  const pos = (lng: number, lat: number): [number, number] | null => {
    const p = proyeccion([lng, lat]);
    return p && Number.isFinite(p[0]) && Number.isFinite(p[1]) ? [p[0], p[1]] : null;
  };
  const maxCant = Math.max(1, ...puntos.map((p) => p.cantidad));

  const colorIntensidad = (ratio: number) => {
    const hue = 220 - 210 * ratio;
    const light = 52 + 10 * ratio;
    const opacity = 0.45 + 0.55 * ratio;
    return `hsl(${hue} 95% ${light}% / ${opacity})`;
  };

  return (
    <div>
      <svg
        role="img"
        aria-label={`Mapa de escaneos por intensidad: ${puntos.map((p) => `${p.ciudad} (${p.cantidad})`).join(", ")}`}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-gray-800 bg-gray-950"
      >
        <title>Mapa de escaneos por intensidad</title>

        {/* Mapamundi base (Natural Earth 110m, dominio público, proyectado con d3-geo) */}
        <path d={dMundo} fill="#1f2937" stroke="#374151" strokeWidth="0.5" aria-hidden />

        {/* Ciudades según cantidad: color tenue (pocos) a intenso (muchos) */}
        <g>
          {puntos.map((p) => {
            const c = pos(p.longitud, p.latitud);
            if (!c) return null;
            const ratio = p.cantidad / maxCant;
            return (
              <circle
                key={`${p.ciudad} ${p.pais ?? ""}`}
                cx={c[0]}
                cy={c[1]}
                r={5}
                fill={colorIntensidad(ratio)}
                stroke="#0f172a"
                strokeWidth="0.5"
              >
                <title>{`${p.ciudad}${p.pais ? ` (${p.pais})` : ""}: ${p.cantidad} escaneos`}</title>
              </circle>
            );
          })}
        </g>
      </svg>

      {/* Leyenda de intensidad */}
      <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-gray-400">
        <span>menos</span>
        <div
          aria-hidden
          className="h-2 w-24 rounded-full"
          style={{
            background: `linear-gradient(to right, hsl(220 95% 52%), hsl(10 95% 62%))`,
          }}
        />
        <span>más escaneos</span>
      </div>
    </div>
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