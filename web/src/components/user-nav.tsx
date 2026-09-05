"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function UserNav({ email }: { email: string }) {
  const router = useRouter();

  async function cerrarSesion() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <span className="hidden max-w-48 truncate sm:block">{email}</span>
      <button
        onClick={cerrarSesion}
        className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 transition hover:bg-slate-800"
      >
        Salir
      </button>
    </div>
  );
}