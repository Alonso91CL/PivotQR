import { createClient } from "@/lib/supabase/server";
import { MAX_SCANS, type ReporteScan } from "@/lib/reporte";
import { NextResponse } from "next/server";
import type { Enlace } from "@/lib/types";

type RouteParams = { params: Promise<{ id: string; enlace_id: string }> };

export const dynamic = "force-dynamic";

// Métricas de un QR concreto: devuelve sus escaneos (muestra reciente) para
// que el modal los agrege con las mismas reglas que el dashboard.
export async function GET(_request: Request, { params }: RouteParams) {
  const { id, enlace_id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // RLS garantiza que el enlace pertenezca a un proyecto del usuario.
  const { data: enlace } = await supabase
    .from("links")
    .select("id, slug, nombre, descripcion, pausado")
    .eq("id", enlace_id)
    .eq("proyecto_id", id)
    .is("eliminado_en", null)
    .single<Pick<Enlace, "id" | "slug" | "nombre" | "descripcion" | "pausado">>();

  if (!enlace) {
    return NextResponse.json({ error: "QR no encontrado" }, { status: 404 });
  }

  const { data: scans } = await supabase
    .from("scans")
    .select("id, enlace_id, ciudad, region, pais, dispositivo, so, fecha_utc")
    .eq("enlace_id", enlace_id)
    .order("fecha_utc", { ascending: false })
    .limit(MAX_SCANS)
    .returns<ReporteScan[]>();

  return NextResponse.json({ enlace, scans: scans ?? [] });
}