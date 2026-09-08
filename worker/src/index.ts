interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface LinkRow {
  id: string;
  url_destino: string;
  pausado: boolean;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return Response.json({ ok: true, servicio: "pivotqr-worker" });
    }

    const slug = url.pathname.slice(1);
    if (!/^[A-Za-z0-9]{6,10}$/.test(slug)) {
      return new Response("Enlace no encontrado", { status: 404 });
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    const { dispositivo, so } = detectDevice(userAgent);

    const enlace = await getLink(env, slug);
    if (!enlace) {
      return new Response("Enlace no encontrado", { status: 404 });
    }

    // Registro el escaneo con service_role (respeta el esquema; el insert
    // "service insert scans" permite la escritura desde el servidor). La
    // ubicación llega del Managed Transform "Add visitor location headers".
    await recordScan(env, {
      enlace_id: enlace.id,
      ciudad: request.headers.get("cf-ipcity"),
      region: request.headers.get("cf-region-code"),
      pais: request.headers.get("cf-ipcountry"),
      latitud: parseCoordenada(request.headers.get("cf-iplatitude")),
      longitud: parseCoordenada(request.headers.get("cf-iplongitude")),
      dispositivo,
      so,
    });

    if (enlace.pausado) {
      return new Response(
        `<!DOCTYPE html><html lang="es"><body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f172a;color:#e2e8f0"><div style="text-align:center"><h1>Campaña pausada</h1><p style="color:#94a3b8">Este enlace está temporalmente desactivado.</p></div></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
      );
    }

    return Response.redirect(enlace.url_destino, 302);
  },
};

async function getLink(env: Env, slug: string): Promise<LinkRow | null> {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/links?select=id,url_destino,pausado&slug=eq.${slug}`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as LinkRow[];
  return rows[0] ?? null;
}

async function recordScan(
  env: Env,
  scan: {
    enlace_id: string;
    ciudad: string | null;
    region: string | null;
    pais: string | null;
    latitud: number | null;
    longitud: number | null;
    dispositivo: string;
    so: string;
  },
): Promise<void> {
  await fetch(`${env.SUPABASE_URL}/rest/v1/scans`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(scan),
  });
}

function parseCoordenada(valor: string | null): number | null {
  if (!valor) return null;
  const n = Number.parseFloat(valor);
  return Number.isFinite(n) ? n : null;
}

function detectDevice(userAgent: string): { dispositivo: string; so: string } {
  const ua = userAgent.toLowerCase();
  let dispositivo = "desktop";
  let so = "desconocido";

  if (/tablet|ipad/i.test(ua)) dispositivo = "tableta";
  else if (/mobile|iphone|android/i.test(ua)) dispositivo = "móvil";

  if (/windows/i.test(ua)) so = "Windows";
  else if (/android/i.test(ua)) so = "Android";
  else if (/(iphone|ipad|ipod)/i.test(ua)) so = "iOS";
  else if (/mac os|crios/i.test(ua)) so = "macOS";
  else if (/linux/i.test(ua)) so = "Linux";

  return { dispositivo, so };
}