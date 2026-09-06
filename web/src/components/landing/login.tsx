"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { createClient } from "@/lib/supabase/client";

const OPEN_LOGIN_EVENT = "pivotqr:open-login";

export function LoginButton({
  className,
  label = "Iniciar sesión",
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();

  async function onClick() {
    const {
      data: { user },
    } = await createClient().auth.getUser();
    if (user) {
      router.push("/proyectos");
      return;
    }
    window.dispatchEvent(new CustomEvent(OPEN_LOGIN_EVENT));
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

export function LoginModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function abrir() {
      setOpen(true);
    }
    window.addEventListener(OPEN_LOGIN_EVENT, abrir);
    return () => window.removeEventListener(OPEN_LOGIN_EVENT, abrir);
  }, []);

  useEffect(() => {
    if (!open) return;
    function cerrarConEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto bg-gray-950/70 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between text-white">
          <div>
            <Image
              src="/brand/logo.svg"
              alt="PivotQR"
              className="mb-3 h-auto w-24"
            />
            <p className="text-sm text-gray-400">
              Enlaces cortos y QR dinámicos con métricas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}