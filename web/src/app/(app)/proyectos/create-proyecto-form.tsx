"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CreateProyectoForm() {
  const router = useRouter();
  const supabase = createClient();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No autorizado");

      const { data, error: insertError } = await supabase
        .from("projects")
        .insert({ nombre: nombre.trim(), descripcion: descripcion.trim(), owner_id: user.id })
        .select("id")
        .single();

      if (insertError) throw insertError;

      router.push(`/proyectos/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear proyecto");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      onSubmit={crear}
      className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="proyecto-nombre"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Nombre del proyecto
          </label>
          <input
            id="proyecto-nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Menú Pizzería Luigi"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "proyecto-error" : undefined}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </div>
        <div>
          <label
            htmlFor="proyecto-descripcion"
            className="mb-1.5 block text-sm font-medium text-gray-300"
          >
            Descripción (opcional)
          </label>
          <input
            id="proyecto-descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej. campaña del trimestre"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "proyecto-error" : undefined}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={cargando}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {cargando ? "Creando…" : "Nuevo proyecto"}
        </button>
        {error && (
          <p
            id="proyecto-error"
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="rounded-lg border border-error-500/30 bg-error-950/40 px-3 py-2 text-sm text-error-400"
          >
            {error}
          </p>
        )}
      </div>
    </form>
  );
}