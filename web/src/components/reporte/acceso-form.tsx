"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AccesoReporte({
  proyectoId,
  nombre,
  error,
}: {
  proyectoId: string;
  nombre: string;
  error: boolean;
}) {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [cargando, setCargando] = useState(false);

  function entrar(e: FormEvent) {
    e.preventDefault();
    if (!codigo.trim()) return;
    setCargando(true);
    router.push(`/reporte/${proyectoId}?codigo=${encodeURIComponent(codigo.trim())}`);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
        <h1 className="text-xl font-bold text-white">Reporte privado</h1>
        <p className="mt-1 text-sm text-gray-400">
          El reporte de <span className="text-gray-200">{nombre}</span> está protegido con un
          código de acceso.
        </p>

        <form onSubmit={entrar} className="mt-5 space-y-4">
          <div>
            <label htmlFor="codigo" className="text-sm font-medium text-gray-300">
              Código de acceso
            </label>
            <input
              id="codigo"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Código de 6 caracteres"
              autoComplete="off"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "acceso-error" : undefined}
              className="mt-1.5 w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
            {error && (
              <p id="acceso-error" role="alert" className="mt-1.5 text-sm text-error-400">
                El código no es válido. Inténtalo de nuevo.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={cargando || !codigo.trim()}
            className="w-full rounded-lg bg-brand-500 px-4 py-2.5 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cargando ? "Entrando…" : "Ver reporte"}
          </button>
        </form>
      </div>
    </div>
  );
}