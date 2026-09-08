"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import type { Enlace } from "@/lib/types";

export function CrearEnlaceModal({ proyectoId }: { proyectoId: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [url, setUrl] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [cargando, setCargando] = useState(false);

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    if (nombre.trim().length === 0) {
      setError("Ingresa un nombre para identificar el QR.");
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`/api/proyectos/${proyectoId}/enlaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url_destino: url,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
        }),
      });
      const data = (await res.json()) as { enlace?: Enlace; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Error al crear el enlace");
      }
      setUrl("");
      setNombre("");
      setDescripcion("");
      setOk(true);
      router.refresh();
      window.setTimeout(() => setAbierto(false), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el enlace");
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Nuevo QR
      </button>

      {abierto && (
        <Modal titulo="Crear nuevo QR" onCerrar={() => setAbierto(false)}>
          <form onSubmit={crear} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="nuevo-enlace-nombre"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Nombre / Título <span className="text-warning-400">*</span>
              </label>
              <input
                id="nuevo-enlace-nombre"
                type="text"
                required
                autoFocus
                maxLength={120}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setError(null);
                }}
                placeholder="Menú de verano"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "nuevo-enlace-error" : undefined}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Te permite identificar este QR en la lista de tu campaña.
              </p>
            </div>

            <div>
              <label
                htmlFor="nuevo-enlace-url"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                URL de destino
              </label>
              <input
                id="nuevo-enlace-url"
                type="url"
                required
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                placeholder="https://pizzerialuigi.com/menu"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                El QR apuntará a esta URL. Puedes cambiarla después sin reimprimir.
              </p>
            </div>

            <div>
              <label
                htmlFor="nuevo-enlace-descripcion"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Descripción <span className="text-gray-500">(opcional)</span>
              </label>
              <textarea
                id="nuevo-enlace-descripcion"
                rows={2}
                maxLength={280}
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                  setError(null);
                }}
                placeholder="Campaña del menú digital para mesas del local"
                className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
              />
            </div>

            {error && (
              <p
                id="nuevo-enlace-error"
                ref={errorRef}
                tabIndex={-1}
                role="alert"
                className="mt-2 rounded-lg border border-error-500/30 bg-error-950/40 px-3 py-2 text-sm text-error-400"
              >
                {error}
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={cargando}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
              >
                {cargando ? "Generando…" : "Generar enlace y QR"}
              </button>
              {ok && (
                <p role="status" className="text-xs text-success-400">
                  Enlace creado. Escanéalo y mira el contador.
                </p>
              )}
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}