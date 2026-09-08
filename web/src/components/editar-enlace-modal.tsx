"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";
import { shortUrlDe } from "@/lib/short-url";
import type { Enlace } from "@/lib/types";

export function EditarEnlaceModal({
  enlace,
  abierto,
  onCerrar,
  onGuardado,
}: {
  enlace: Enlace;
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: (enlace: Enlace, mensaje: string) => void;
}) {
  if (!abierto) return null;

  return (
    <Modal titulo="Editar QR" onCerrar={onCerrar}>
      <FormularioEditar
        key={enlace.id}
        enlace={enlace}
        onCerrar={onCerrar}
        onGuardado={onGuardado}
      />
    </Modal>
  );
}

function FormularioEditar({
  enlace,
  onCerrar,
  onGuardado,
}: {
  enlace: Enlace;
  onCerrar: () => void;
  onGuardado: (enlace: Enlace, mensaje: string) => void;
}) {
  const [url, setUrl] = useState(enlace.url_destino);
  const [pausado, setPausado] = useState(enlace.pausado);
  const [nombre, setNombre] = useState(enlace.nombre);
  const [descripcion, setDescripcion] = useState(enlace.descripcion);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sinCambios =
    url.trim() === enlace.url_destino &&
    pausado === enlace.pausado &&
    nombre.trim() === enlace.nombre &&
    descripcion.trim() === enlace.descripcion;

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (nombre.trim().length === 0) {
      setError("El nombre es obligatorio para identificar el QR.");
      return;
    }
    if (sinCambios) {
      onCerrar();
      return;
    }
    const cambios: Record<string, string | boolean> = {};
    const mensajes: string[] = [];
    if (nombre.trim() !== enlace.nombre) {
      cambios.nombre = nombre.trim();
      mensajes.push(`Nombre actualizado a «${nombre.trim()}».`);
    }
    if (descripcion.trim() !== enlace.descripcion) {
      cambios.descripcion = descripcion.trim();
      mensajes.push("Descripción actualizada.");
    }
    if (url.trim() !== enlace.url_destino) {
      cambios.url_destino = url;
      mensajes.push("Destino actualizado: el mismo QR ya redirige a la nueva URL.");
    }
    if (pausado !== enlace.pausado) {
      cambios.pausado = pausado;
      mensajes.push(
        pausado
          ? "Campaña pausada: ya no redirige y los escaneos siguen contando."
          : "Campaña activada: vuelve a redirigir.",
      );
    }
    setCargando(true);
    try {
      const res = await fetch(
        `/api/proyectos/${enlace.proyecto_id}/enlaces/${enlace.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cambios),
        },
      );
      const data = (await res.json()) as { enlace?: Enlace; error?: string };
      if (!res.ok || !data.enlace) {
        throw new Error(data.error ?? "No se pudo actualizar el QR");
      }
      onGuardado(data.enlace, mensajes.join(" "));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el QR");
    } finally {
      setCargando(false);
    }
  }

  return (
    <>
      <p className="mb-4 truncate rounded-lg bg-gray-950 px-3 py-2 font-mono text-xs text-brand-400">
        {shortUrlDe(enlace.slug)}
      </p>
      <form onSubmit={guardar} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor={`editar-nombre-${enlace.id}`}
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Nombre / Título <span className="text-warning-400">*</span>
          </label>
          <input
            id={`editar-nombre-${enlace.id}`}
            type="text"
            required
            maxLength={120}
            autoFocus
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `editar-error-${enlace.id}` : undefined}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </div>

        <div>
          <label
            htmlFor={`editar-url-${enlace.id}`}
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            URL de destino
          </label>
          <input
            id={`editar-url-${enlace.id}`}
            type="url"
            required
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </div>

        <div>
          <label
            htmlFor={`editar-descripcion-${enlace.id}`}
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Descripción <span className="text-gray-500">(opcional)</span>
          </label>
          <textarea
            id={`editar-descripcion-${enlace.id}`}
            rows={2}
            maxLength={280}
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
              setError(null);
            }}
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </div>

        {error && (
            <p
              id={`editar-error-${enlace.id}`}
              role="alert"
              className="mt-2 text-xs text-error-400"
            >
              {error}
            </p>
          )}

        <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2">
          <div>
            <p className="text-sm font-medium text-gray-300">Campaña</p>
            <p className="text-xs text-gray-400">
              {pausado ? "Pausada (no redirige al escanear)" : "Activa (redirige al escanear)"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!pausado}
            aria-label="Activar o pausar campaña"
            onClick={() => setPausado((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 ${
              pausado ? "bg-gray-700" : "bg-success-500"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                pausado ? "translate-x-1" : "translate-x-6"
              }`}
            />
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={cargando || sinCambios}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
          >
            {cargando ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>
    </>
  );
}