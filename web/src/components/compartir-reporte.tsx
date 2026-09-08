"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/modal";

export interface CompartirProyecto {
  id: string;
  reporte_publico: boolean;
  codigo_acceso: string | null;
}

function ContenidoCompartir({ proyecto }: { proyecto: CompartirProyecto }) {
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
    <div className="space-y-4">
      <p className="text-sm text-gray-300">
        Comparte el dashboard en vivo de esta campaña. Quien abra el enlace verá solo el reporte,
        sin acceso a tu cuenta.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            reportePublico
              ? "bg-success-500/10 text-success-400"
              : "bg-warning-500/10 text-warning-400"
          }`}
        >
          {reportePublico ? "Público · sin código" : "Privado · con código"}
        </span>
        <button
          type="button"
          onClick={() => void guardar({ reporte_publico: !reportePublico })}
          disabled={cargando}
          className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-200 transition hover:bg-white/5 disabled:opacity-50"
        >
          {reportePublico ? "Hacerlo privado" : "Hacerlo público"}
        </button>
      </div>

      {!reportePublico && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-400">Código:</span>
          <code className="rounded bg-gray-800 px-2 py-0.5 font-mono font-semibold text-brand-300">
            {codigo ?? "—"}
          </code>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("¿Generar un nuevo código? El anterior dejará de funcionar.")) {
                void guardar({ regenerar: true });
              }
            }}
            disabled={cargando}
            className="text-brand-400 hover:underline"
          >
            Generar nuevo código
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/reporte/${proyecto.id}${reportePublico ? "" : `?codigo=${encodeURIComponent(codigo ?? "")}`}`}
          target="_blank"
          className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm font-medium text-gray-200 transition hover:bg-white/5"
        >
          Ver reporte ↗
        </Link>
        <button
          type="button"
          onClick={() => void copiarInvitacion()}
          className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          {copiado ? "¡Copiado!" : "Copiar invitación"}
        </button>
      </div>

      {error && <p role="alert" className="text-sm text-error-400">{error}</p>}
    </div>
  );
}

export function CompartirReporte({ proyecto }: { proyecto: CompartirProyecto }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 12a3 3 0 11-3 3 3 3 0 013-3zm0 0V7.5A1.5 1.5 0 017.5 6H12m-6 6v4.5m6-7.5a3 3 0 103 3 3 3 0 00-3-3zm0 0V6a3 3 0 013-3h4.5" />
        </svg>
        Compartir reporte
      </button>

      {abierto && (
        <Modal titulo="Compartir reporte" onCerrar={() => setAbierto(false)}>
          <ContenidoCompartir proyecto={proyecto} />
        </Modal>
      )}
    </>
  );
}