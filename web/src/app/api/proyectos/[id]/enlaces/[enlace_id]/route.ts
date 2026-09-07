import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { Enlace } from "@/lib/types";

type RouteParams = { params: Promise<{ id: string; enlace_id: string }> };

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id, enlace_id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Validación en el servidor: nunca confiar solo en lo que llega del cliente.
  const body = await request.json().catch(() => null);
  const cambios: Record<string, string | boolean> = {};

  if (body && typeof body.url_destino === "string") {
    const url = body.url_destino.trim();
    let parsed: URL;
    try {
      parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      return NextResponse.json(
        { error: "La URL destino no es válida. Debe empezar con http:// o https://" },
        { status: 400 },
      );
    }
    cambios.url_destino = parsed.toString();
  }

  if (body && typeof body.pausado === "boolean") {
    cambios.pausado = body.pausado;
  }

  if (Object.keys(cambios).length === 0) {
    return NextResponse.json(
      { error: "No hay campos para actualizar" },
      { status: 400 },
    );
  }

  // RLS garantiza que el enlace sea de un proyecto del usuario.
  const { data, error } = await supabase
    .from("links")
    .update(cambios)
    .eq("id", enlace_id)
    .eq("proyecto_id", id)
    .select("id, proyecto_id, slug, url_destino, pausado, creado_en")
    .single<Enlace>();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "No se encontró el enlace" },
      { status: error ? 500 : 404 },
    );
  }

  return NextResponse.json({ enlace: data });
}