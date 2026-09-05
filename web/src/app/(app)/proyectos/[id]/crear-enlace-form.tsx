"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Enlace } from "@/lib/types";

export function CrearEnlaceForm({ proyectoId }: { proyectoId: string }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [cargando, setCargando] = useState(false);

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
      className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row"
    >
      <input
        type="url"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Pega la URL de destino, ej. https://pizzerialuigi.com/menu"
        className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        disabled={cargando}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {cargando ? "Generando…" : "Generar enlace y QR"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {ok && <p className="text-xs text-emerald-400">Enlace creado. Escanéalo y mira el contador.</p>}
    </form>
  );
}