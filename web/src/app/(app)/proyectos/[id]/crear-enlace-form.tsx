"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect, useRef } from "react";
import type { Enlace } from "@/lib/types";

export function CrearEnlaceForm({ proyectoId }: { proyectoId: string }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
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
    setCargando(true);

    try {
      const res = await fetch(`/api/proyectos/${proyectoId}/enlaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url_destino: url }),
      });
      const data = (await res.json()) as { enlace?: Enlace; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Error al crear el enlace");
      }

      setUrl("");
      setOk(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el enlace");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      onSubmit={crear}
      className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4"
    >
      <div>
        <label
          htmlFor="enlace-url"
          className="mb-1.5 block text-sm font-medium text-gray-300"
        >
          URL de destino
        </label>
        <input
          id="enlace-url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://pizzerialuigi.com/menu"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "enlace-error" : undefined}
          className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={cargando}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {cargando ? "Generando…" : "Generar enlace y QR"}
        </button>
        {error && (
          <p
            id="enlace-error"
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="rounded-lg border border-error-500/30 bg-error-950/40 px-3 py-2 text-sm text-error-400"
          >
            {error}
          </p>
        )}
        {ok && (
          <p role="status" className="text-xs text-success-400">
            Enlace creado. Escanéalo y mira el contador.
          </p>
        )}
      </div>
    </form>
  );
}