import { CreateProyectoForm } from "@/app/(app)/proyectos/create-proyecto-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const supabase = await createClient();

  const { data: proyectos } = await supabase
    .from("projects")
    .select("id, nombre, descripcion, creado_en")
    .order("creado_en", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis proyectos</h1>
          <p className="text-sm text-slate-400">
            Organiza por campaña los enlaces y códigos QR que entregas.
          </p>
        </div>
      </div>

      <CreateProyectoForm />

      {proyectos && proyectos.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {proyectos.map((p) => (
            <a
              key={p.id}
              href={`/proyectos/${p.id}`}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition hover:border-emerald-600"
            >
              <h2 className="font-semibold text-white">{p.nombre}</h2>
              {p.descripcion && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-400">{p.descripcion}</p>
              )}
            </a>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
          Aún no tienes proyectos. Crea el primero con el formulario de arriba.
        </p>
      )}
    </div>
  );
}