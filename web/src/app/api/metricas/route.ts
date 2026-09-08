import { createClient } from "@/lib/supabase/server";
import { MAX_SCANS, type ReporteScan } from "@/lib/reporte";
import { rangoFechasDe } from "@/lib/rango-fechas";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Métricas a nivel cuenta: agrega los escaneos de todos los proyectos del
// usuario (RLS). Los conteos usan la muestra de los MAX_SCANS más recientes,
// la misma semántica que el reporte; los contadores en vivo por QR usan el
// conteo exacto en su propia consulta. Acepta `desde`/`hasta` (YYYY-MM-DD).
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: proyectos } = await supabase
    .from("projects")
    .select("id, nombre, descripcion")
    .order("creado_en", { ascending: true });

  const ids = (proyectos ?? []).map((p) => p.id);

  let enlaces: { id: string; slug: string; nombre: string; proyecto_id: string; pausado: boolean }[] = [];
  let scans: ReporteScan[] = [];
  let totalExacto = 0;
  if (ids.length > 0) {
    const { data: enlacesData } = await supabase
      .from("links")
      .select("id, slug, nombre, proyecto_id, pausado")
      .in("proyecto_id", ids)
      .is("eliminado_en", null);
    enlaces = enlacesData ?? [];

    const enlaceIds = enlaces.map((e) => e.id);
    if (enlaceIds.length > 0) {
      const { desde, hastaExclusiva } = rangoFechasDe(request);

      let scansQuery = supabase
        .from("scans")
        .select("id, enlace_id, ciudad, region, pais, latitud, longitud, dispositivo, so, fecha_utc")
        .in("enlace_id", enlaceIds);
      let countQuery = supabase.from("scans").select("*", { count: "exact", head: true }).in("enlace_id", enlaceIds);
      if (desde) {
        scansQuery = scansQuery.gte("fecha_utc", desde);
        countQuery = countQuery.gte("fecha_utc", desde);
      }
      if (hastaExclusiva) {
        scansQuery = scansQuery.lt("fecha_utc", hastaExclusiva);
        countQuery = countQuery.lt("fecha_utc", hastaExclusiva);
      }

      const [{ data }, { count }] = await Promise.all([
        scansQuery.order("fecha_utc", { ascending: false }).limit(MAX_SCANS).returns<ReporteScan[]>(),
        countQuery,
      ]);
      scans = data ?? [];
      totalExacto = count ?? 0;
    }
  }

  const porEnlace = new Map<string, number>();
  const porProyecto = new Map<string, number>();
  const proyectoDeEnlace = new Map(enlaces.map((e) => [e.id, e.proyecto_id]));
  for (const s of scans) {
    porEnlace.set(s.enlace_id, (porEnlace.get(s.enlace_id) ?? 0) + 1);
    const pid = proyectoDeEnlace.get(s.enlace_id);
    if (pid) porProyecto.set(pid, (porProyecto.get(pid) ?? 0) + 1);
  }

  const proyectosCon = (proyectos ?? []).map((p) => ({
    ...p,
    escaneos: porProyecto.get(p.id) ?? 0,
    qrs: enlaces.filter((e) => e.proyecto_id === p.id).length,
  }));

  const qrs = enlaces
    .map((e) => ({
      enlace_id: e.id,
      slug: e.slug,
      nombre: e.nombre,
      pausado: e.pausado,
      proyecto_id: e.proyecto_id,
      proyecto_nombre: proyectos?.find((p) => p.id === e.proyecto_id)?.nombre ?? "",
      escaneos: porEnlace.get(e.id) ?? 0,
    }))
    .sort((a, b) => b.escaneos - a.escaneos)
    .slice(0, 10);

  return NextResponse.json({
    total: scans.length,
    total_exacto: totalExacto,
    proyectos: proyectosCon,
    qrs,
    scans,
  });
}