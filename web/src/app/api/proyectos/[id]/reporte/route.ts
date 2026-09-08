import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { randomSlug } from "@/lib/slug";
import { MAX_SCANS, type ReporteScan } from "@/lib/reporte";
import { rangoFechasDe } from "@/lib/rango-fechas";
import { NextResponse, type NextRequest } from "next/server";
import type { Enlace, Proyecto } from "@/lib/types";

type RouteParams = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

// Reporte del dueño (logueado, sin código ni comprobación de visibilidad):
// devuelve el mismo payload que el reporte público para reutilizar el
// dashboard y construir los resúmenes del proyecto. RLS limita a sus datos.
// Acepta `desde`/`hasta` (YYYY-MM-DD) para filtrar los escaneos.
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: proyecto } = await supabase
    .from("projects")
    .select("id, nombre, descripcion")
    .eq("id", id)
    .single<Pick<Proyecto, "id" | "nombre" | "descripcion">>();

  if (!proyecto || !proyecto.id) {
    return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
  }

  const { data: enlaces } = await supabase
    .from("links")
    .select("id, slug, nombre, descripcion, url_destino, pausado, creado_en")
    .eq("proyecto_id", id)
    .is("eliminado_en", null)
    .order("creado_en", { ascending: false })
    .returns<Enlace[]>();

  const ids = (enlaces ?? []).map((e) => e.id);
  let scans: ReporteScan[] = [];
  let totalExacto = 0;
  if (ids.length > 0) {
    const { desde, hastaExclusiva } = rangoFechasDe(request);

    const service = createServiceClient();
    let scansQuery = service
      .from("scans")
      .select("id, enlace_id, ciudad, region, pais, latitud, longitud, dispositivo, so, fecha_utc")
      .in("enlace_id", ids);
    let countQuery = service.from("scans").select("*", { count: "exact", head: true }).in("enlace_id", ids);
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

  return NextResponse.json({ proyecto: { ...proyecto, enlaces }, scans, total_exacto: totalExacto });
}

// Compartir el reporte (F3): público/privado y regeneración del código de acceso.
// RLS garantiza que solo el dueño pueda actualizar su proyecto.
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { data: actual } = await supabase
    .from("projects")
    .select("id, reporte_publico, codigo_acceso")
    .eq("id", id)
    .single();
  if (!actual) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  const cambios: Record<string, string | boolean> = {};
  if (typeof body.reporte_publico === "boolean") {
    cambios.reporte_publico = body.reporte_publico;
  }
  if (body.regenerar === true || (cambios.reporte_publico === false && !actual.codigo_acceso)) {
    cambios.codigo_acceso = randomSlug();
  }

  if (Object.keys(cambios).length === 0) {
    return NextResponse.json(
      { error: "No hay cambios para guardar" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .update(cambios)
    .eq("id", id)
    .select("id, nombre, reporte_publico, codigo_acceso")
    .single<Pick<Proyecto, "id" | "nombre" | "reporte_publico" | "codigo_acceso">>();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "No se pudo actualizar el proyecto" },
      { status: 500 },
    );
  }

  return NextResponse.json({ proyecto: data });
}