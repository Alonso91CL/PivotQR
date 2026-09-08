import { createClient } from "@/lib/supabase/server";
import { ESTILOS, type Estilo } from "@/lib/qr";
import { NextResponse, type NextRequest } from "next/server";
import type { Enlace } from "@/lib/types";

type RouteParams = { params: Promise<{ id: string; enlace_id: string }> };

const COLOR_REGEX = /^#[0-9a-fA-F]{3,8}$/;

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
  const cambios: Record<string, string | boolean | null> = {};

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

  if (body && "color_fondo" in body) {
    const v = body.color_fondo;
    if (v !== null && v !== "transparente" && !(typeof v === "string" && COLOR_REGEX.test(v))) {
      return NextResponse.json(
        { error: "El color de fondo debe ser un hex válido, 'transparente' o nada" },
        { status: 400 },
      );
    }
    cambios.color_fondo = v ?? null;
  }

  if (body && "color_patron" in body) {
    const v = body.color_patron;
    if (v !== null && !(typeof v === "string" && COLOR_REGEX.test(v))) {
      return NextResponse.json(
        { error: "El color del patrón debe ser un hex válido o nada" },
        { status: 400 },
      );
    }
    cambios.color_patron = v ?? null;
  }

  if (body && "estilo" in body) {
    const v = body.estilo;
    if (v !== null && !(typeof v === "string" && ESTILOS.includes(v as Estilo))) {
      return NextResponse.json(
        { error: `El estilo debe ser uno de: ${ESTILOS.join(", ")}` },
        { status: 400 },
      );
    }
    cambios.estilo = v ?? null;
  }

  if (body && "logo_url" in body) {
    const v = body.logo_url;
    if (v !== null) {
      if (typeof v !== "string" || v.length > 500) {
        return NextResponse.json(
          { error: "La URL del logo no es válida" },
          { status: 400 },
        );
      }
      let parsed: URL;
      try {
        parsed = new URL(v);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        return NextResponse.json(
          { error: "La URL del logo no es válida. Debe empezar con http:// o https://" },
          { status: 400 },
        );
      }
      cambios.logo_url = parsed.toString();
    } else {
      cambios.logo_url = null;
    }
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
    .select("id, proyecto_id, slug, url_destino, pausado, color_fondo, color_patron, estilo, logo_url, creado_en")
    .single<Enlace>();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "No se encontró el enlace" },
      { status: error ? 500 : 404 },
    );
  }

  return NextResponse.json({ enlace: data });
}