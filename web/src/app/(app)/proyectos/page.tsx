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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis proyectos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Organiza por campaña los enlaces y códigos QR que entregas.
          </p>
        </div>
      </div>

      <CreateProyectoForm />

      {proyectos && proyectos.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {proyectos.map((p) => (
            <a
              key={p.id}
              href={`/proyectos/${p.id}`}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-brand-300 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500/40"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-gray-800 dark:text-white/90">
                    {p.nombre}
                  </h2>
                  {p.descripcion && (
                    <p className="mt-0.5 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                      {p.descripcion}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Aún no tienes proyectos. Crea el primero con el formulario de arriba.
        </p>
      )}
    </div>
  );
}