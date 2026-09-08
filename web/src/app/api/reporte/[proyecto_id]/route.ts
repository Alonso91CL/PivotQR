import { createServiceClient } from "@/lib/supabase/service";
import { MAX_SCANS, type ReporteScan } from "@/lib/reporte";
import { NextResponse, type NextRequest } from "next/server";
import type { Enlace, Proyecto } from "@/lib/types";

type RouteParams = { params: Promise<{ proyecto_id: string }> };

export const dynamic = "force-dynamic";

// Lectura pública del reporte: si el proyecto es privado se exige el código
// de acceso (validado aquí, en el servidor) como define .docs/07-base-de-datos.md.
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { proyecto_id } = await params;
  const codigo = request.nextUrl.searchParams.get("codigo") ?? "";
  const supabase = createServiceClient();

  const { data: proyecto } = await supabase
    .from("projects")
    .select("id, nombre, reporte_publico, codigo_acceso")
    .eq("id", proyecto_id)
    .single<Pick<Proyecto, "id" | "nombre" | "reporte_publico" | "codigo_acceso">>();

  if (!proyecto) {
    return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
  }

  if (!proyecto.reporte_publico) {
    if (!proyecto.codigo_acceso || codigo !== proyecto.codigo_acceso) {
      return NextResponse.json({ error: "Código de acceso incorrecto" }, { status: 403 });
    }
  }

  const { data: enlaces } = await supabase
    .from("links")
    .select("id, slug, nombre, descripcion, url_destino, pausado, creado_en")
    .eq("proyecto_id", proyecto_id)
    .is("eliminado_en", null)
    .order("creado_en", { ascending: false })
    .returns<Enlace[]>();

  const ids = (enlaces ?? []).map((e) => e.id);
  let scans: ReporteScan[] = [];
  if (ids.length > 0) {
    const { data } = await supabase
      .from("scans")
      .select("id, enlace_id, ciudad, region, pais, dispositivo, so, fecha_utc")
      .in("enlace_id", ids)
      .order("fecha_utc", { ascending: false })
      .limit(MAX_SCANS)
      .returns<ReporteScan[]>();
    scans = data ?? [];
  }

  return NextResponse.json({ proyecto: { ...proyecto, enlaces }, scans });
}