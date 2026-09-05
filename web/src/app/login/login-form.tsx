"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getTurnstileToken,
  isTurnstileActive,
  Turnstile,
} from "@/components/turnstile";

export function LoginForm() {
  const router = useRouter();

  const [modo, setModo] = useState<"ingresar" | "registrar">("ingresar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function verificarTurnstile(): Promise<boolean> {
    if (!isTurnstileActive()) return true;
    const token = getTurnstileToken();
    if (!token) {
      setError("Confirma que no eres un robot antes de continuar.");
      return false;
    }
    const res = await fetch("/api/turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = (await res.json()) as { ok: boolean };
    if (!data.ok) {
      setError("No se pudo verificar el captcha. Intenta de nuevo.");
      return false;
    }
    return true;
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMensaje(null);
    if (cargando) return;

    const turnstileOk = await verificarTurnstile();
    if (!turnstileOk) return;

    setCargando(true);
    const supabase = createClient();
    try {
      if (modo === "registrar") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirmado`,
          },
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          router.push("/proyectos");
          router.refresh();
        } else {
          setMensaje("Revisa tu correo para confirmar la cuenta y luego inicia sesión.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        router.push("/proyectos");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  async function entrarConGoogle() {
    setError(null);
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/confirmado` },
    });
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-950 p-1 text-sm">
        <button
          type="button"
          onClick={() => {
            setModo("ingresar");
            setError(null);
          }}
          className={`rounded-md py-2 ${modo === "ingresar" ? "bg-slate-800 text-white" : "text-slate-400"}`}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={() => {
            setModo("registrar");
            setError(null);
          }}
          className={`rounded-md py-2 ${modo === "registrar" ? "bg-slate-800 text-white" : "text-slate-400"}`}
        >
          Registrarse
        </button>
      </div>

      <form onSubmit={enviar} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña (mínimo 6 caracteres)"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <Turnstile />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {mensaje && <p className="text-sm text-emerald-400">{mensaje}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {cargando ? "Procesando…" : modo === "registrar" ? "Crear cuenta" : "Entrar"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
        <span className="h-px flex-1 bg-slate-800" />
        o
        <span className="h-px flex-1 bg-slate-800" />
      </div>

      <button
        type="button"
        onClick={entrarConGoogle}
        disabled={cargando}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
      >
        Continuar con Google
      </button>
    </div>
  );
}