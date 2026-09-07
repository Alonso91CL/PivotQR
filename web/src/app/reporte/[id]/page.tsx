import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/service";
import { AccesoReporte } from "@/components/reporte/acceso-form";
import { ReporteDashboard } from "@/components/reporte/dashboard";

export const dynamic = "force-dynamic";

export default async function ReportePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ codigo?: string }>;
}) {
  const { id } = await params;
  const { codigo } = await searchParams;
  const supabase = createServiceClient();

  const { data: proyecto } = await supabase
    .from("projects")
    .select("id, nombre, reporte_publico, codigo_acceso")
    .eq("id", id)
    .single();

  if (!proyecto) {
    notFound();
  }

  const permitido =
    proyecto.reporte_publico ||
    (Boolean(proyecto.codigo_acceso) && codigo === proyecto.codigo_acceso);

  return (
    <div className="min-h-dvh bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800/80 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="font-semibold tracking-tight text-white">
            Pivot<span className="text-brand-400">QR</span>
          </span>
          <span className="text-sm text-gray-400">Reporte de {proyecto.nombre}</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {permitido ? (
          <ReporteDashboard proyectoId={proyecto.id} codigo={codigo ?? ""} nombre={proyecto.nombre} />
        ) : (
          <AccesoReporte
            proyectoId={proyecto.id}
            nombre={proyecto.nombre}
            error={Boolean(codigo)}
          />
        )}
      </main>
    </div>
  );
}