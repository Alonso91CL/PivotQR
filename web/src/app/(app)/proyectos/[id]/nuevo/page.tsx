import Link from "next/link";
import { notFound } from "next/navigation";
import { NuevoQrForm } from "@/components/nuevo-qr-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NuevoQrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proyecto } = await supabase
    .from("projects")
    .select("id, nombre")
    .eq("id", id)
    .single<{ id: string; nombre: string }>();

  if (!proyecto) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href={`/proyectos/${proyecto.id}`}
            className="text-sm text-brand-400 hover:underline"
          >
            ← Volver a {proyecto.nombre}
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            Crear nuevo QR
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Elige el tipo de código, completa los datos y ya quedará listo.
          </p>
        </div>
      </div>

      <NuevoQrForm proyectoId={proyecto.id} proyectoNombre={proyecto.nombre} />
    </div>
  );
}