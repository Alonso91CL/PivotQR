import { createServiceClient } from "@/lib/supabase/service";
import { detectDevice } from "@/lib/ua";
import { NextResponse, type NextRequest } from "next/server";

type RouteParams = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function parseCoordenada(valor: string | null): number | null {
  if (!valor) return null;
  const n = Number.parseFloat(valor);
  return Number.isFinite(n) ? n : null;
}

// Stand-in local del Worker de Cloudflare: sirve el "momento ajá" sin
// desplegar. Registra el escaneo con service_role y redirige (o muestra
// "Campaña pausada"). La ubicación llega en producción desde cf-ipcity y
// cf-iplatitude/longitude; acá se completa con headers de Vercel si están
// disponibles.
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: enlace } = await supabase
    .from("links")
    .select("id, url_destino, pausado, proyecto_id")
    .eq("slug", slug)
    .is("eliminado_en", null)
    .single();

  if (!enlace) {
    return new NextResponse("Enlace no encontrado", { status: 404 });
  }

  const { dispositivo, so } = detectDevice(request.headers.get("user-agent") ?? "");

  const latitud = parseCoordenada(request.headers.get("x-vercel-ip-latitude"));
  const longitud = parseCoordenada(request.headers.get("x-vercel-ip-longitude"));

  await supabase.from("scans").insert({
    enlace_id: enlace.id,
    ciudad: request.headers.get("x-vercel-ip-city") ?? null,
    region: request.headers.get("x-vercel-ip-country-region") ?? null,
    pais: request.headers.get("x-vercel-ip-country") ?? null,
    latitud,
    longitud,
    dispositivo,
    so,
  });

  if (enlace.pausado) {
    return new NextResponse(
      `<html lang="es"><body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f172a;color:#e2e8f0"><div style="text-align:center"><h1>Campaña pausada</h1><p style="color:#94a3b8">Este enlace está temporalmente desactivado.</p></div></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  return NextResponse.redirect(enlace.url_destino, 302);
}