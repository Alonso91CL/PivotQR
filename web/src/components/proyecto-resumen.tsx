"use client";

import { useCallback, useEffect, useState } from "react";
import { agregarScans } from "@/components/metricas/agregacion";
import { BotónCsv } from "@/components/metricas/charts";
import { CompartirReporte, type CompartirProyecto } from "@/components/compartir-reporte";
import type { ReporteScan } from "@/lib/reporte";

interface PayloadProyecto {
  total_exacto: number;
  proyecto: {
    id: string;
    nombre: string;
    enlaces: { id: string; pausado: boolean }[];
  };
  scans: ReporteScan[];
}

const INTERVALO_MS = 5000;

function formatoNumero(n: number): string {
  return n.toLocaleString("es-CL");
}

export function ProyectoResumen({ proyecto }: { proyecto: CompartirProyecto }) {
  const [data, setData] = useState<PayloadProyecto | null>(null);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch(`/api/proyectos/${proyecto.id}/reporte`, { cache: "no-store" });
      if (res.ok) {
        setData((await res.json()) as PayloadProyecto);
      }
    } catch {
      // Mantener el último estado si falla la actualización.
    }
  }, [proyecto.id]);

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
  const enlaces = data ? data.proyecto.enlaces : [];
  const activos = enlaces.filter((e) => !e.pausado).length;
  const pausados = enlaces.filter((e) => e.pausado).length;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Resumen de la campaña
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {data && <BotónCsv scans={data.scans} nombreArchivo={`reporte-${proyecto.id}.csv`} />}
          <CompartirReporte proyecto={proyecto} />
        </div>
      </div>

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
          <p className="text-sm text-gray-500 dark:text-gray-400">QRs activos</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {data ? formatoNumero(activos) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pausados</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {data ? formatoNumero(pausados) : "—"}
          </p>
        </div>
      </div>
    </section>
  );
}