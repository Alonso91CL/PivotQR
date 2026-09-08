"use client";

import { useEffect, useRef, useState } from "react";
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
  const dialogoRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function abrir() {
      setOpen(true);
    }
    window.addEventListener(OPEN_LOGIN_EVENT, abrir);
    return () => window.removeEventListener(OPEN_LOGIN_EVENT, abrir);
  }, []);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement | null;

    function manejarTeclado(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const dialogo = dialogoRef.current;
      if (!dialogo) return;
      const focusables = dialogo.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", manejarTeclado);
    return () => document.removeEventListener("keydown", manejarTeclado);
  }, [open]);

  useEffect(() => {
    if (open) return;
    prevFocus.current?.focus?.();
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pivotqr-login-modal-titulo"
      className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto bg-gray-950/70 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div ref={dialogoRef} className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 id="pivotqr-login-modal-titulo" className="sr-only">
          Inicia sesión o crea una cuenta
        </h2>
        <div className="mb-4 flex items-start justify-between text-white">
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