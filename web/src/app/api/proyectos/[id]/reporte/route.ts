import { createClient } from "@/lib/supabase/server";
import { randomSlug } from "@/lib/slug";
import { NextResponse, type NextRequest } from "next/server";
import type { Proyecto } from "@/lib/types";

type RouteParams = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

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