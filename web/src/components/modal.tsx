"use client";

import { useEffect, useId, useRef } from "react";

export function Modal({
  titulo,
  onCerrar,
  children,
  ancho = "max-w-md",
}: {
  titulo: string;
  onCerrar: () => void;
  children: React.ReactNode;
  ancho?: string;
}) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef(onCerrar);

  useEffect(() => {
    cerrarRef.current = onCerrar;
  }, [onCerrar]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    panelRef.current
      ?.querySelector<HTMLElement>(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      )
      ?.focus();

    function manejarTeclado(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrarRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((el) => el.offsetParent !== null);
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
    return () => {
      document.removeEventListener("keydown", manejarTeclado);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/70 p-4 backdrop-blur-sm"
      onClick={() => cerrarRef.current()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${ancho} rounded-2xl border border-gray-700 bg-gray-900 p-5 shadow-theme-xl`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={id} className="text-lg font-semibold text-white">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={() => cerrarRef.current()}
            aria-label="Cerrar"
            className="rounded-lg p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
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
        {children}
      </div>
    </div>
  );
}