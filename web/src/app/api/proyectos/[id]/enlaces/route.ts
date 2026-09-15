import { createClient } from "@/lib/supabase/server";
import { randomSlug } from "@/lib/slug";
import { CAMPOS_VCARD, type VCardContenido } from "@/lib/vcard";
import { NextResponse, type NextRequest } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Validación en el servidor: nunca confiar solo en lo que llega del cliente.
  const body = await request.json().catch(() => null);
  const tipo = body?.tipo === "vcard" ? "vcard" : "url";

  const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : "";
  if (nombre.length === 0 || nombre.length > 120) {
    return NextResponse.json(
      { error: "El nombre es obligatorio y debe tener hasta 120 caracteres" },
      { status: 400 },
    );
  }

  const descripcion =
    typeof body?.descripcion === "string" ? body.descripcion.trim() : "";
  if (descripcion.length > 280) {
    return NextResponse.json(
      { error: "La descripción debe tener hasta 280 caracteres" },
      { status: 400 },
    );
  }

  let url_destino: string | null = null;
  if (tipo === "url") {
    const url = typeof body?.url_destino === "string" ? body.url_destino.trim() : "";
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
    url_destino = parsed.toString();
  }

  let contenido: VCardContenido | null = null;
  if (tipo === "vcard") {
    if (!body?.contenido || typeof body.contenido !== "object") {
      return NextResponse.json(
        { error: "Faltan los datos de contacto de la vCard" },
        { status: 400 },
      );
    }
    contenido = {};
    for (const campo of CAMPOS_VCARD) {
      const valor = body.contenido[campo];
      contenido[campo] = typeof valor === "string" ? valor.trim().slice(0, 200) : "";
    }
    if (!contenido.nombre && !contenido.apellido) {
      return NextResponse.json(
        { error: "Ingresa al menos el nombre o el apellido del contacto" },
        { status: 400 },
      );
    }
  }

  // El proyecto debe existir y ser del usuario (lo garantiza RLS al insertar).
  let slug = randomSlug();
  for (let intento = 0; intento < 5; intento++) {
    const { data, error } = await supabase
      .from("links")
      .insert({
        proyecto_id: id,
        slug,
        nombre,
        descripcion,
        url_destino,
        tipo,
        contenido,
      })
      .select("id, slug, nombre, descripcion, url_destino, pausado, tipo, contenido, color_fondo, color_patron, estilo, logo_url, creado_en, eliminado_en")
      .single();

    if (!error && data) {
      return NextResponse.json({ enlace: data }, { status: 201 });
    }
    if (error && error.code === "23505") {
      // slug duplicado: reintenta con otro
      slug = randomSlug();
      continue;
    }
    return NextResponse.json({ error: error?.message ?? "Error al crear enlace" }, { status: 500 });
  }

  return NextResponse.json({ error: "No se pudo generar un slug único" }, { status: 500 });
}