import { NextResponse, type NextRequest } from "next/server";

// Verifica el token de Cloudflare Turnstile en el servidor.
// Si no hay clave configurada (entorno de desarrollo), pasa de largo.
export async function POST(request: NextRequest) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ ok: true });
  }

  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";

  if (!token) {
    return NextResponse.json({ ok: false, error: "Falta el token de Turnstile" }, { status: 400 });
  }

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
      remoteip: request.headers.get("x-forwarded-for") ?? "",
    }),
  });

  const data = (await res.json()) as { success: boolean };
  return NextResponse.json({ ok: data.success === true });
}