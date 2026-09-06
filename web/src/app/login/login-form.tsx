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
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-theme-xl">
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-gray-800 bg-gray-950 p-1 text-sm">
        <button
          type="button"
          onClick={() => {
            setModo("ingresar");
            setError(null);
          }}
          className={`rounded-md py-2 ${modo === "ingresar" ? "bg-gray-800 text-white" : "text-gray-400"}`}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={() => {
            setModo("registrar");
            setError(null);
          }}
          className={`rounded-md py-2 ${modo === "registrar" ? "bg-gray-800 text-white" : "text-gray-400"}`}
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
          className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña (mínimo 6 caracteres)"
          className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
        />

        <Turnstile />

        {error && <p className="text-sm text-error-400">{error}</p>}
        {mensaje && <p className="text-sm text-success-400">{mensaje}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-lg bg-brand-500 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {cargando ? "Procesando…" : modo === "registrar" ? "Crear cuenta" : "Entrar"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-gray-500">
        <span className="h-px flex-1 bg-gray-800" />
        o
        <span className="h-px flex-1 bg-gray-800" />
      </div>

      <button
        type="button"
        onClick={entrarConGoogle}
        disabled={cargando}
        className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
      >
        Continuar con Google
      </button>
    </div>
  );
}