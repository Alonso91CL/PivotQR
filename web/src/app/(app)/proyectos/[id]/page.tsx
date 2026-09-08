import Link from "next/link";
import { notFound } from "next/navigation";
import { CrearEnlaceModal } from "@/components/crear-enlace-modal";
import { ProyectoResumen } from "@/components/proyecto-resumen";
import { QrCard } from "@/components/qr-card";
import { createClient } from "@/lib/supabase/server";
import type { Enlace, Proyecto } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proyecto } = await supabase
    .from("projects")
    .select("id, nombre, descripcion, reporte_publico, codigo_acceso")
    .eq("id", id)
    .single<Proyecto>();

  if (!proyecto) {
    notFound();
  }

  const { data: enlaces } = await supabase
    .from("links")
    .select("id, proyecto_id, slug, nombre, descripcion, url_destino, pausado, color_fondo, color_patron, estilo, logo_url, creado_en")
    .eq("proyecto_id", id)
    .is("eliminado_en", null)
    .order("creado_en", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/proyectos" className="text-sm text-brand-400 hover:underline">
            ← Mis proyectos
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{proyecto.nombre}</h1>
          {proyecto.descripcion && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{proyecto.descripcion}</p>
          )}
        </div>
        <CrearEnlaceModal proyectoId={proyecto.id} />
      </div>

      <ProyectoResumen
        proyecto={{
          id: proyecto.id,
          reporte_publico: proyecto.reporte_publico,
          codigo_acceso: proyecto.codigo_acceso,
        }}
      />

      {enlaces && enlaces.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Códigos QR
          </h2>
          <ul className="space-y-4">
            {enlaces.map((enlace: Enlace) => (
              <li key={enlace.id}>
                <QrCard enlace={enlace} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Aún no hay códigos QR. Usa «Nuevo QR» para crear el primero.
        </p>
      )}
    </div>
  );
}