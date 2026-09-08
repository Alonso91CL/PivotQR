"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function UserDropdown({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fuera(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  async function cerrarSesion() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        aria-label="Menú de usuario"
      >
        {email.slice(0, 1).toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
          <div className="border-b border-gray-200 px-3 pb-2 pt-1 dark:border-gray-800">
            <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">{email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sesión de PivotQR</p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={cerrarSesion}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const enProyectos = pathname.startsWith("/proyectos");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-5 dark:border-gray-800">
          <Link href="/proyectos" className="inline-flex items-center">
            <Image
              src="/brand/logo-bk.svg"
              alt="PivotQR"
              width={150}
              height={55}
              className="h-9 w-auto"
              priority
            />
          </Link>
        </div>

        <nav className="flex flex-col gap-6 px-4 py-6">
          <div>
            <h2 className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              Menú
            </h2>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/proyectos"
                  className={`menu-item ${enProyectos ? "menu-item-active" : "menu-item-inactive"}`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  Proyectos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400">
              Próximamente
            </h2>
            <ul className="space-y-1">
              {["Reportes", "Personalización"].map((p) => (
                <li key={p}>
                  <span className="menu-item menu-item-inactive cursor-not-allowed opacity-50">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </nav>


      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-950/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80 dark:text-white/90">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 dark:border-gray-800 dark:text-gray-300 lg:hidden"
            aria-label="Abrir menú"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
          <Link href="/proyectos" className="inline-flex items-center lg:hidden">
            <Image
              src="/brand/logo.svg"
              alt="PivotQR"
              width={150}
              height={55}
              className="h-8 w-auto"
            />
          </Link>
          <div className="ml-auto">
            <UserDropdown email={email} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}