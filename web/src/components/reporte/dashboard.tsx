"use client";

import { useCallback, useEffect, useState } from "react";
import { agregarScans } from "@/components/metricas/agregacion";
import { BotónCsv, Card, Columnas, ListaBarras, Vacío } from "@/components/metricas/charts";
import { RangoDeFechas } from "@/components/metricas/rango-fechas";
import type { ReporteScan } from "@/lib/reporte";

interface EnlaceReporte {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  url_destino: string;
  pausado: boolean;
}

interface Payload {
  proyecto: { id: string; nombre: string; enlaces: EnlaceReporte[] };
  scans: ReporteScan[];
}

const INTERVALO_MS = 5000;

export function ReporteDashboard({
  proyectoId,
  codigo,
  nombre,
}: {
  proyectoId: string;
  codigo: string;
  nombre: string;
}) {
  const [data, setData] = useState<Payload | null>(null);
  const [desacceso, setDesacceso] = useState(false);
  const [error, setError] = useState(false);
  const [actualizadoEn, setActualizadoEn] = useState<Date | null>(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const cargar = useCallback(async () => {
    const params = new URLSearchParams();
    if (codigo) params.set("codigo", codigo);
    if (desde) params.set("desde", desde);
    if (hasta) params.set("hasta", hasta);
    const query = params.toString();
    const url = `/api/reporte/${proyectoId}${query ? `?${query}` : ""}`;
    const res = await fetch(url);
    if (res.status === 403) {
      setDesacceso(true);
      return;
    }
    if (!res.ok) {
      setError(true);
      return;
    }
    const json = (await res.json()) as Payload;
    setData(json);
    setActualizadoEn(new Date());
  }, [proyectoId, codigo, desde, hasta]);

  useEffect(() => {
    const timer = setTimeout(() => void cargar(), 0);
    const interval = setInterval(() => void cargar(), INTERVALO_MS);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [cargar]);

  const resumen = data ? agregarScans(data.scans) : null;
  const enlaces = data ? data.proyecto.enlaces : [];

  if (desacceso) {
    return (
      <p className="rounded-xl border border-error-900/50 bg-error-950/30 p-6 text-center text-sm text-error-300">
        Código de acceso incorrecto. No tienes permisos para ver este reporte.
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center text-sm text-gray-400">
        No se pudo cargar el reporte. Inténtalo de nuevo en un momento.
      </p>
    );
  }

  if (!resumen) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-gray-800 bg-gray-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">En vivo</span>
          </div>
          <div role="status" aria-atomic="true">
            <p className="mt-2 font-outfit text-5xl font-bold tracking-tight text-white sm:text-6xl">
              {resumen.total.toLocaleString("es-CL")}
            </p>
            <p className="mt-1 text-sm text-gray-400">escaneos registrados</p>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {actualizadoEn
              ? `actualizado ${actualizadoEn.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
              : "cargando…"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{nombre}</p>
          <p className="text-xs text-gray-400">
            {enlaces.length} enlace{enlaces.length === 1 ? "" : "s"} en la campaña
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <RangoDeFechas desde={desde} hasta={hasta} onChange={(d, h) => { setDesde(d); setHasta(h); }} />
        {data && <BotónCsv scans={data.scans} nombreArchivo={`reporte-${proyectoId}.csv`} />}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Últimos 14 días">
          <Columnas items={resumen.dias} />
        </Card>

        <Card titulo="Por hora del día (hora local de quien ve)">
          <Columnas items={resumen.horas} step={3} />
        </Card>

        <Card titulo="Dispositivos">
          {resumen.dispositivos.length > 0 ? (
            <ListaBarras items={resumen.dispositivos} />
          ) : (
            <Vacío />
          )}
          <div className="mt-5 border-t border-gray-800 pt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Sistemas operativos</h3>
            {resumen.sistemas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resumen.sistemas.map((s) => (
                  <span key={s.label} className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-300">
                    {s.label}: <span className="font-semibold text-white">{s.valor}</span>
                  </span>
                ))}
              </div>
            ) : (
              <Vacío />
            )}
          </div>
        </Card>

        <Card titulo="Ubicaciones">
          {resumen.ubicaciones.length > 0 ? (
            <ListaBarras items={resumen.ubicaciones} />
          ) : (
            <Vacío />
          )}
        </Card>
      </div>

      <Card titulo="Enlaces de la campaña">
        {enlaces.length > 0 ? (
          <ul className="divide-y divide-gray-800">
            {enlaces.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    e.pausado
                      ? "bg-warning-500/10 text-warning-400"
                      : "bg-success-500/10 text-success-400"
                  }`}
                >
                  {e.pausado ? "pausado" : "activo"}
                </span>
                <span className="min-w-0 truncate text-sm font-medium text-gray-200">
                  {e.nombre || e.slug}
                </span>
                {e.descripcion && (
                  <span className="min-w-0 truncate text-xs text-gray-400">{e.descripcion}</span>
                )}
                <span className="min-w-0 truncate text-sm text-gray-400">{e.url_destino}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Vacío />
        )}
      </Card>
    </div>
  );
}