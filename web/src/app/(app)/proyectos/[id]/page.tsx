import Link from "next/link";
import { notFound } from "next/navigation";
import { CrearEnlaceForm } from "@/app/(app)/proyectos/[id]/crear-enlace-form";
import { QrPanel } from "@/components/qr-panel";
import { createClient } from "@/lib/supabase/server";
import type { Enlace, Proyecto } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proyecto } = await supabase
    .from("projects")
    .select("id, nombre, descripcion")
    .eq("id", id)
    .single<Proyecto>();

  if (!proyecto) {
    notFound();
  }

  const { data: enlaces } = await supabase
    .from("links")
    .select("id, proyecto_id, slug, url_destino, pausado, creado_en")
    .eq("proyecto_id", id)
    .order("creado_en", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/proyectos" className="text-sm text-brand-400 hover:underline">
          ← Mis proyectos
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{proyecto.nombre}</h1>
        {proyecto.descripcion && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{proyecto.descripcion}</p>
        )}
      </div>

      <CrearEnlaceForm proyectoId={proyecto.id} />

      {enlaces && enlaces.length > 0 ? (
        <ul className="space-y-4">
          {enlaces.map((enlace: Enlace) => (
            <li key={enlace.id}>
              <QrPanel enlace={enlace} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Aún no hay enlaces. Pega la URL de tu campaña arriba para crear el primero.
        </p>
      )}
    </div>
  );
}