import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection, MultiPolygon } from "geojson";

interface GeoFeatureCollection extends FeatureCollection {
  features: Array<{ type: "Feature"; geometry: MultiPolygon; properties: Record<string, unknown> }>;
}
import { feature } from "topojson-client";
import countriesTopo from "world-atlas/countries-110m.json";
import type { Item, PuntoMapa } from "@/components/metricas/agregacion";
import type { ReporteScan } from "@/lib/reporte";
import { descargarScansCsv } from "@/lib/csv";
import { MUNDO } from "@/components/metricas/mundo";

// Centroides de ~80 países (lat, lng) para etiquetas dinámicas.
// Solo se muestran los países cuyo centroide cae dentro del área visible.
const PAISES = [
  { n: "Chile", lat: -35.7, lng: -71.5 },
  { n: "Argentina", lat: -38.4, lng: -63.6 },
  { n: "Brasil", lat: -14.2, lng: -51.9 },
  { n: "Uruguay", lat: -32.5, lng: -55.8 },
  { n: "Paraguay", lat: -23.4, lng: -58.4 },
  { n: "Bolivia", lat: -16.3, lng: -63.6 },
  { n: "Perú", lat: -9.2, lng: -75.0 },
  { n: "Ecuador", lat: -1.8, lng: -78.2 },
  { n: "Colombia", lat: 4.6, lng: -74.3 },
  { n: "Venezuela", lat: 6.4, lng: -66.6 },
  { n: "Guyana", lat: 4.9, lng: -58.9 },
  { n: "Surinam", lat: 3.9, lng: -56.0 },
  { n: "Estados Unidos", lat: 39.8, lng: -98.6 },
  { n: "Canadá", lat: 56.1, lng: -106.4 },
  { n: "México", lat: 23.6, lng: -102.6 },
  { n: "Cuba", lat: 21.5, lng: -77.8 },
  { n: "Rep. Dominicana", lat: 18.7, lng: -70.2 },
  { n: "Guatemala", lat: 15.8, lng: -90.2 },
  { n: "Honduras", lat: 15.2, lng: -86.2 },
  { n: "El Salvador", lat: 13.8, lng: -88.9 },
  { n: "Nicaragua", lat: 12.9, lng: -85.2 },
  { n: "Costa Rica", lat: 9.7, lng: -83.8 },
  { n: "Panamá", lat: 8.5, lng: -80.8 },
  { n: "Jamaica", lat: 18.1, lng: -77.3 },
  { n: "Haití", lat: 19.0, lng: -72.3 },
  { n: "Puerto Rico", lat: 18.2, lng: -66.6 },
  { n: "Reino Unido", lat: 55.4, lng: -3.4 },
  { n: "Francia", lat: 46.6, lng: 2.2 },
  { n: "Alemania", lat: 51.2, lng: 10.5 },
  { n: "España", lat: 40.5, lng: -3.8 },
  { n: "Italia", lat: 41.9, lng: 12.6 },
  { n: "Portugal", lat: 39.4, lng: -8.2 },
  { n: "Países Bajos", lat: 52.1, lng: 5.3 },
  { n: "Bélgica", lat: 50.5, lng: 4.5 },
  { n: "Suiza", lat: 46.8, lng: 8.2 },
  { n: "Austria", lat: 47.5, lng: 14.6 },
  { n: "Polonia", lat: 51.9, lng: 19.1 },
  { n: "Rep. Checa", lat: 49.8, lng: 15.5 },
  { n: "Suecia", lat: 60.1, lng: 18.6 },
  { n: "Noruega", lat: 60.5, lng: 8.5 },
  { n: "Dinamarca", lat: 56.3, lng: 9.5 },
  { n: "Finlandia", lat: 61.9, lng: 25.8 },
  { n: "Irlanda", lat: 53.1, lng: -7.7 },
  { n: "Grecia", lat: 39.1, lng: 21.8 },
  { n: "Turquía", lat: 39.0, lng: 35.2 },
  { n: "Rusia", lat: 61.5, lng: 105.3 },
  { n: "China", lat: 35.9, lng: 104.2 },
  { n: "Japón", lat: 36.2, lng: 138.3 },
  { n: "Corea del Sur", lat: 35.9, lng: 127.8 },
  { n: "Corea del Norte", lat: 40.3, lng: 127.5 },
  { n: "India", lat: 20.6, lng: 79.0 },
  { n: "Pakistán", lat: 30.4, lng: 69.4 },
  { n: "Bangladesh", lat: 23.7, lng: 90.4 },
  { n: "Tailandia", lat: 15.9, lng: 101.0 },
  { n: "Vietnam", lat: 14.1, lng: 108.3 },
  { n: "Indonesia", lat: -0.8, lng: 113.9 },
  { n: "Filipinas", lat: 12.9, lng: 121.8 },
  { n: "Malasia", lat: 4.2, lng: 102.0 },
  { n: "Singapur", lat: 1.4, lng: 103.8 },
  { n: "Arabia Saudita", lat: 23.9, lng: 45.1 },
  { n: "Irán", lat: 32.4, lng: 53.7 },
  { n: "Irak", lat: 33.2, lng: 43.7 },
  { n: "Israel", lat: 31.1, lng: 34.9 },
  { n: "Emiratos Árabes", lat: 23.4, lng: 53.9 },
  { n: "Sudáfrica", lat: -30.6, lng: 22.9 },
  { n: "Egipto", lat: 26.8, lng: 30.8 },
  { n: "Nigeria", lat: 9.1, lng: 8.7 },
  { n: "Kenia", lat: -0.02, lng: 37.9 },
  { n: "Etiopía", lat: 9.1, lng: 40.5 },
  { n: "Marruecos", lat: 31.8, lng: -7.1 },
  { n: "Argelia", lat: 28.0, lng: 1.7 },
  { n: "Túnez", lat: 33.9, lng: 9.5 },
  { n: "Ghana", lat: 8.0, lng: -1.0 },
  { n: "Camerún", lat: 7.4, lng: 12.4 },
  { n: "Tanzania", lat: -6.4, lng: 34.9 },
  { n: "Madagascar", lat: -18.8, lng: 46.9 },
  { n: "Mozambique", lat: -18.7, lng: 35.5 },
  { n: "Angola", lat: -11.2, lng: 17.9 },
  { n: "Australia", lat: -25.3, lng: 133.8 },
  { n: "Nueva Zelanda", lat: -40.9, lng: 174.9 },
  { n: "Papúa N. Guinea", lat: -6.3, lng: 144.0 },
];

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

// Mapa de escaneos por intensidad con fronteras, etiquetas dinámicas,
// zoom (rueda + botones) y pan (drag).
export function MapaCalor({ puntos }: { puntos: PuntoMapa[] }) {
  const W = 720;
  const H = 400;
  const PAD = 10;

  const mercY = (lat: number) => Math.log(Math.tan((Math.PI / 2 + (lat * Math.PI) / 180) / 2));

  const init = useMemo(() => {
    if (puntos.length === 0) return { center: [0, 0] as [number, number], scale: 120 };
    const lngs = puntos.map((p) => p.longitud);
    const lats = puntos.map((p) => p.latitud);
    const dMinLng = Math.min(...lngs), dMaxLng = Math.max(...lngs);
    const dMinLat = Math.min(...lats), dMaxLat = Math.max(...lats);
    const cLng = (dMinLng + dMaxLng) / 2, cLat = (dMinLat + dMaxLat) / 2;
    const spanLng = dMaxLng - dMinLng, spanLat = dMaxLat - dMinLat;
    const padLat = Math.max(spanLat * 0.3, 1.5);
    const mSpanY = Math.abs(mercY(Math.min(85, dMaxLat + padLat)) - mercY(Math.max(-85, dMinLat - padLat)));
    const aW = W - PAD * 2, aH = H - PAD * 2;
    let s: number;
    if (mSpanY < 1e-10 && spanLng < 1e-10) s = 120;
    else if (mSpanY < 1e-10) s = aW / (spanLng * (Math.PI / 180));
    else if (spanLng < 1e-10) s = aH / mSpanY;
    else s = Math.min(aW / (spanLng * (Math.PI / 180)), aH / mSpanY);
    return { center: [cLng, cLat] as [number, number], scale: Math.max(60, Math.min(s, 1500)) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [center, setCenter] = useState<[number, number]>(init.center);
  const [scale, setScale] = useState(init.scale);
  const scaleRef = useRef(scale);
  const centerRef = useRef(center);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ px: number; py: number; cLng: number; cLat: number } | null>(null);
  const [hover, setHover] = useState<{ ciudad: string; pais?: string; cantidad: number; mx: number; my: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const proyeccion = useMemo(
    () => geoMercator().center(center).scale(scale).translate([W / 2, H / 2]).clipExtent([[PAD, PAD], [W - PAD, H - PAD]]),
    [center, scale]
  );
  const trazo = useMemo(() => geoPath(proyeccion), [proyeccion]);

  const pos = (lng: number, lat: number): [number, number] | null => {
    const p = proyeccion([lng, lat]);
    return p && Number.isFinite(p[0]) && Number.isFinite(p[1]) ? p : null;
  };
  const inv = (px: number, py: number): [number, number] | null => {
    const r = proyeccion.invert?.([px, py]);
    return r && Number.isFinite(r[0]) && Number.isFinite(r[1]) ? r : null;
  };

  const invTL = inv(PAD, PAD), invBR = inv(W - PAD, H - PAD);
  const visMinLng = invTL ? invTL[0] : -180, visMinLat = invBR ? invBR[1] : -90;
  const visMaxLng = invBR ? invBR[0] : 180, visMaxLat = invTL ? invTL[1] : 90;

  const maxCant = Math.max(1, ...puntos.map((p) => p.cantidad));
  const mundo: MultiPolygon = { type: "MultiPolygon", coordinates: MUNDO };
  const dMundo = trazo(mundo) ?? "";

  const countriesGeo = useMemo(() => {
    const topo = countriesTopo as unknown as Parameters<typeof feature>[0];
    return feature(topo, (countriesTopo as { objects: Record<string, unknown> }).objects.countries as Parameters<typeof feature>[1]);
  }, []);
  const dCountries = useMemo(() => {
    const fc = countriesGeo as unknown as GeoFeatureCollection;
    return fc.features.map((f) => trazo(f)).filter((d): d is string => d !== null);
  }, [countriesGeo, trazo]);

  const etiquetasPaises = useMemo(() => {
    const margen = (visMaxLng - visMinLng) * 0.05;
    return PAISES.filter((p) => p.lng >= visMinLng - margen && p.lng <= visMaxLng + margen && p.lat >= visMinLat - margen && p.lat <= visMaxLat + margen)
      .map((p) => ({ ...p, projected: pos(p.lng, p.lat) })).filter((p) => p.projected !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visMinLng, visMaxLng, visMinLat, visMaxLat, proyeccion]);

  const etiquetasCiudades = useMemo(() => {
    return puntos.map((p) => ({ ...p, projected: pos(p.longitud, p.latitud) })).filter((p) => p.projected !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puntos, proyeccion]);

  const zoom = useCallback((factor: number, focusPx?: [number, number]) => {
    const oldScale = scaleRef.current;
    const newScale = Math.max(30, Math.min(3000, oldScale * factor));
    if (focusPx) {
      const geo = inv(focusPx[0], focusPx[1]);
      if (geo) {
        const [gLng, gLat] = geo;
        const [cLng, cLat] = centerRef.current;
        const t = 1 - oldScale / newScale;
        const nc: [number, number] = [cLng + (gLng - cLng) * t, cLat + (gLat - cLat) * t];
        centerRef.current = nc;
        setCenter(nc);
      }
    }
    scaleRef.current = newScale;
    setScale(newScale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyeccion]);

  const handleWheel = useCallback((_e: React.WheelEvent) => {
    // zoom con rueda desactivado — solo controles +/−
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    dragStart.current = { px: e.clientX, py: e.clientY, cLng: centerRef.current[0], cLat: centerRef.current[1] };
  }, []);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dxPx = e.clientX - dragStart.current.px;
    const dyPx = e.clientY - dragStart.current.py;
    const geoPerPx = 1 / scaleRef.current * (W / rect.width) * 50;
    const nc: [number, number] = [
      dragStart.current.cLng - dxPx * geoPerPx,
      dragStart.current.cLat + dyPx * geoPerPx,
    ];
    centerRef.current = nc;
    setCenter(nc);
  }, [dragging]);
  const handleMouseUp = useCallback(() => { setDragging(false); dragStart.current = null; }, []);

  const reset = useCallback(() => {
    centerRef.current = init.center;
    scaleRef.current = init.scale;
    setCenter(init.center);
    setScale(init.scale);
  }, [init]);

  if (puntos.length === 0) return <Vacío />;

  const showCiudades = scale >= 200;
  const mobileMult = isMobile ? 1.6 : 1;
  const fsPais = (scale > 400 ? 13 : scale > 150 ? 11 : 9) * mobileMult;
  const fsCiudad = (scale > 400 ? 11 : 10) * mobileMult;

  const colorIntensidad = (ratio: number) => {
    // RGB: azul #1a5fff → naranja #f59e0b → rojo #ef4444
    // Evita verde que aparece con interpolación lineal de hue en HSL.
    const stops = [
      { r: 26, g: 95, b: 255 },
      { r: 245, g: 158, b: 11 },
      { r: 239, g: 68, b: 68 },
    ];
    const t = Math.max(0, Math.min(1, ratio)) * (stops.length - 1);
    const i = Math.min(Math.floor(t), stops.length - 2);
    const f = t - i;
    const a = stops[i], b = stops[i + 1];
    const r = Math.round(a.r + (b.r - a.r) * f);
    const g = Math.round(a.g + (b.g - a.g) * f);
    const bl = Math.round(a.b + (b.b - a.b) * f);
    return `rgb(${r},${g},${bl})`;
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        role="img"
        aria-label={`Mapa de escaneos por intensidad: ${puntos.map((p) => `${p.ciudad} (${p.cantidad})`).join(", ")}`}
        viewBox={`0 0 ${W} ${H}`}
        className={`h-auto w-full rounded-xl border border-gray-800 bg-gray-950 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <title>Mapa de escaneos por intensidad</title>
        <path d={dMundo} fill="#1f2937" stroke="none" aria-hidden />
        {dCountries.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#374151" strokeWidth="0.4" aria-hidden />
        ))}
        {etiquetasPaises.map((p) => {
          if (!p.projected) return null;
          return (
            <text key={`p-${p.n}`} x={p.projected[0]} y={p.projected[1]}
              textAnchor="middle" dominantBaseline="central" fontSize={fsPais} fontWeight={500}
              fill="#9ca3af" stroke="#0f172a" strokeWidth={3} paintOrder="stroke"
              style={{ pointerEvents: "none" }}>{p.n}</text>
          );
        })}
        {etiquetasCiudades.map((p) => {
          if (!p.projected) return null;
          const ratio = p.cantidad / maxCant;
          return (
            <g key={`${p.ciudad} ${p.pais ?? ""}`}>
              <circle cx={p.projected[0]} cy={p.projected[1]} r={6}
                fill={colorIntensidad(ratio)} stroke="#0f172a" strokeWidth="0.5"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => { const r = svgRef.current?.parentElement?.getBoundingClientRect(); if (r) setHover({ ciudad: p.ciudad, pais: p.pais ?? undefined, cantidad: p.cantidad, mx: e.clientX - r.left, my: e.clientY - r.top }); }}
                onMouseMove={(e) => { const r = svgRef.current?.parentElement?.getBoundingClientRect(); if (r) setHover({ ciudad: p.ciudad, pais: p.pais ?? undefined, cantidad: p.cantidad, mx: e.clientX - r.left, my: e.clientY - r.top }); }}
                onMouseLeave={() => setHover(null)} />
              {showCiudades && (
                <text x={p.projected[0] + 9} y={p.projected[1] - 1}
                  fontSize={fsCiudad} fill="#d1d5db" stroke="#0f172a" strokeWidth={2.5}
                  paintOrder="stroke" style={{ pointerEvents: "none" }}>{p.ciudad}</text>
              )}
            </g>
          );
        })}
      </svg>

      {hover && !dragging && (
        <div className="pointer-events-none absolute z-50 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-gray-100 shadow-lg"
          style={{ left: hover.mx, top: hover.my - 12, transform: "translate(-50%, -100%)" }}>
          <div className="font-semibold">{hover.ciudad}{hover.pais ? `, ${hover.pais}` : ""}</div>
          <div className="text-gray-400">{hover.cantidad} escaneos</div>
        </div>
      )}

      <div className="absolute right-2 top-2 flex flex-col gap-1">
        <button type="button" onClick={() => zoom(1.4)} aria-label="Acercar"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-700 bg-gray-800 text-sm font-bold text-gray-300 transition hover:bg-gray-700 hover:text-white">+</button>
        <button type="button" onClick={() => zoom(1 / 1.4)} aria-label="Alejar"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-700 bg-gray-800 text-sm font-bold text-gray-300 transition hover:bg-gray-700 hover:text-white">−</button>
        <button type="button" onClick={reset} aria-label="Restablecer vista"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-700 bg-gray-800 text-[10px] text-gray-400 transition hover:bg-gray-700 hover:text-white">⟳</button>
      </div>

      <div className="mt-2 flex items-center justify-end gap-2 text-[11px] text-gray-400">
        <span>menos</span>
        <div aria-hidden className="h-2 w-24 rounded-full" style={{ background: "linear-gradient(to right, rgb(26,95,255), rgb(245,158,11), rgb(239,68,68))" }} />
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