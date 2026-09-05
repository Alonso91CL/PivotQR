import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/proyectos";

  if (!next.startsWith("/")) {
    return NextResponse.redirect(`${origin}/login?error=url-invalida`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=sin-codigo`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=sesion-no-confirmada`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}