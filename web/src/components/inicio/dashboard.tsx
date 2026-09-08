"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { agregarScans } from "@/components/metricas/agregacion";
import { Card, Columnas, ListaBarras, Vacío } from "@/components/metricas/charts";
import type { ReporteScan } from "@/lib/reporte";

interface ProyectoMetrica {
  id: string;
  nombre: string;
  descripcion: string;
  escaneos: number;
  qrs: number;
}

interface QrMetrica {
  enlace_id: string;
  slug: string;
  nombre: string;
  pausado: boolean;
  proyecto_id: string;
  proyecto_nombre: string;
  escaneos: number;
}

interface PayloadInicio {
  total: number;
  total_exacto: number;
  proyectos: ProyectoMetrica[];
  qrs: QrMetrica[];
  scans: ReporteScan[];
}

const INTERVALO_MS = 5000;

function formatoNumero(n: number): string {
  return n.toLocaleString("es-CL");
}

export function InicioDashboard() {
  const [data, setData] = useState<PayloadInicio | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch("/api/metricas", { cache: "no-store" });
      if (!res.ok) {
        setError("No se pudo cargar el resumen de tu cuenta.");
        return;
      }
      setData(await res.json());
      setError(null);
    } catch {
      setError("No se pudo cargar el resumen de tu cuenta.");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void cargar(), 0);
    const interval = setInterval(() => void cargar(), INTERVALO_MS);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [cargar]);

  const resumen = data ? agregarScans(data.scans) : null;
  const ultimos7 = data && resumen ? resumen.dias.slice(-7).reduce((acc, d) => acc + d.valor, 0) : 0;
  const totalQrs = data ? data.proyectos.reduce((acc, p) => acc + p.qrs, 0) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inicio</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Resumen de escaneos en todos tus proyectos. Se actualiza en vivo.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-300">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Escaneos</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {data ? formatoNumero(data.total_exacto) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Últimos 7 días</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {resumen ? formatoNumero(ultimos7) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Proyectos</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {data ? formatoNumero(data.proyectos.length) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">QRs</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {data ? formatoNumero(totalQrs) : "—"}
          </p>
        </div>
      </div>

      {resumen && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card titulo="Escaneos · últimos 14 días">
            <Columnas items={resumen.dias} step={2} />
          </Card>
          <Card titulo="Por hora">
            <Columnas items={resumen.horas} step={3} />
          </Card>
          <Card titulo="Dispositivos">
            {resumen.dispositivos.length > 0 ? (
              <ListaBarras items={resumen.dispositivos} />
            ) : (
              <Vacío />
            )}
          </Card>
          <Card titulo="Ubicaciones">
            {resumen.ubicaciones.length > 0 ? (
              <ListaBarras items={resumen.ubicaciones} />
            ) : (
              <Vacío />
            )}
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card titulo="Proyectos">
          {data && data.proyectos.length > 0 ? (
            <ul className="divide-y divide-gray-800">
              {data.proyectos.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/proyectos/${p.id}`}
                    className="flex items-center justify-between gap-3 py-3 transition hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{p.nombre}</p>
                      <p className="text-xs text-gray-400">
                        {p.qrs} QR{p.qrs === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold text-brand-400">
                      {formatoNumero(p.escaneos)} escaneos
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Vacío />
          )}
        </Card>

        <Card titulo="QRs con más escaneos">
          {data && data.qrs.length > 0 ? (
            <ul className="divide-y divide-gray-800">
              {data.qrs.map((q) => (
                <li key={q.enlace_id}>
                  <Link
                    href={`/proyectos/${q.proyecto_id}`}
                    className="flex items-center justify-between gap-3 py-3 transition hover:opacity-80"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {q.nombre || `QR · ${q.slug}`}
                      </p>
                      <p className="truncate text-xs text-gray-400">{q.proyecto_nombre}</p>
                    </div>
                    <span className="shrink-0 font-semibold text-brand-400">
                      {formatoNumero(q.escaneos)} escaneos
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Vacío />
          )}
        </Card>
      </div>
    </div>
  );
}