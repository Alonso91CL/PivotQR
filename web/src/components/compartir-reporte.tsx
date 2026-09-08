"use client";

import { useState } from "react";
import Link from "next/link";

export interface CompartirProyecto {
  id: string;
  reporte_publico: boolean;
  codigo_acceso: string | null;
}

export function CompartirReporte({ proyecto }: { proyecto: CompartirProyecto }) {
  const [reportePublico, setReportePublico] = useState(proyecto.reporte_publico);
  const [codigo, setCodigo] = useState(proyecto.codigo_acceso);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState(false);

  function linkReporte(): string {
    const base = window.location.origin;
    return `${base}/reporte/${proyecto.id}${reportePublico ? "" : `?codigo=${encodeURIComponent(codigo ?? "")}`}`;
  }

  async function guardar(cambios: { reporte_publico?: boolean; regenerar?: boolean }) {
    setCargando(true);
    setError("");
    try {
      const res = await fetch(`/api/proyectos/${proyecto.id}/reporte`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.proyecto) {
        setError(json?.error ?? "No se pudo guardar. Inténtalo de nuevo.");
        return;
      }
      setReportePublico(json.proyecto.reporte_publico);
      setCodigo(json.proyecto.codigo_acceso);
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  async function copiarInvitacion() {
    try {
      await navigator.clipboard.writeText(linkReporte());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setError("No se pudo copiar el enlace automáticamente. Cópialo del botón 'Ver reporte'.");
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white/90">Reporte del cliente</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comparte el dashboard en vivo de esta campaña.
          </p>
        </div>
        <Link
          href={`/reporte/${proyecto.id}${reportePublico ? "" : `?codigo=${encodeURIComponent(codigo ?? "")}`}`}
          target="_blank"
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Ver reporte ↗
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void guardar({ reporte_publico: !reportePublico })}
          disabled={cargando}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {reportePublico ? "Hacerlo privado" : "Hacerlo público"}
        </button>
        {!reportePublico && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("¿Generar un nuevo código? El anterior dejará de funcionar.")) {
                void guardar({ regenerar: true });
              }
            }}
            disabled={cargando}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Generar nuevo código
          </button>
        )}
        <button
          type="button"
          onClick={() => void copiarInvitacion()}
          className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          {copiado ? "¡Copiado!" : "Copiar invitación"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            reportePublico
              ? "bg-success-500/10 text-success-600 dark:text-success-400"
              : "bg-warning-500/10 text-warning-600 dark:text-warning-400"
          }`}
        >
          {reportePublico ? "Público" : "Privado"}
        </span>
        {!reportePublico && codigo && (
          <>
            <span className="text-gray-500 dark:text-gray-400">Código:</span>
            <code className="rounded bg-gray-100 px-2 py-0.5 font-mono font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              {codigo}
            </code>
            <span className="text-gray-500 dark:text-gray-400">
              — quien abra el enlace debe ingresarlo.
            </span>
          </>
        )}
      </div>

      {error && <p role="alert" className="mt-3 text-sm text-error-600 dark:text-error-400">{error}</p>}
    </section>
  );
}