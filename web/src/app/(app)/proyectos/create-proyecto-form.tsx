"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CreateProyectoForm() {
  const router = useRouter();
  const supabase = createClient();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

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
      className="flex flex-col gap-2 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:flex-row"
    >
      <input
        required
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del proyecto, ej. Menú Pizzería Luigi"
        className="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
      />
      <input
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción (opcional)"
        className="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
      />
      <button
        type="submit"
        disabled={cargando}
        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {cargando ? "Creando…" : "Nuevo proyecto"}
      </button>
      {error && <p className="text-sm text-error-400">{error}</p>}
    </form>
  );
}