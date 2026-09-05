"use client";

import { useEffect, useState } from "react";
import { buildQRSvg, buildQRDataUrl } from "@/lib/qr";
import { createClient } from "@/lib/supabase/client";
import type { Enlace } from "@/lib/types";

const SHORT_BASE = process.env.NEXT_PUBLIC_SHORT_URL;

export function QrPanel({ enlace }: { enlace: Enlace }) {
  // En producción el puente vive en el dominio corto (qr.pivotit.cl);
  // en desarrollo local lo sirve la ruta /s/:slug de la propia app.
  const shortUrl = SHORT_BASE
    ? `${SHORT_BASE}/${enlace.slug}`
    : `http://localhost:3000/s/${enlace.slug}`;

  const [qrPng, setQrPng] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);

  useEffect(() => {
    let activo = true;
    buildQRDataUrl(shortUrl).then((url) => {
      if (activo) setQrPng(url);
    });
    return () => {
      activo = false;
    };
  }, [shortUrl]);

  // Contador en vivo: consulta cada 2.5 segundos. Con RLS, solo cuenta los
  // escaneos de enlaces del propio usuario.
  useEffect(() => {
    const supabase = createClient();
    let activo = true;
    async function contar() {
      const { count } = await supabase
        .from("scans")
        .select("*", { count: "exact", head: true })
        .eq("enlace_id", enlace.id);
      if (activo) setScanCount(count ?? 0);
    }
    contar();
    const timer = setInterval(contar, 2500);
    return () => {
      activo = false;
      clearInterval(timer);
    };
  }, [enlace.id]);

  async function descargarSvg() {
    const svg = await buildQRSvg(shortUrl);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pivotqr-${enlace.slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:flex-row">
      <div className="flex-shrink-0">
        {qrPng ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrPng}
            alt={`QR ${enlace.slug}`}
            className="h-40 w-40 rounded-lg bg-white"
          />
        ) : (
          <div className="h-40 w-40 animate-pulse rounded-lg bg-slate-800" />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${enlace.pausado ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
              {enlace.pausado ? "Pausado" : "Activo"}
            </span>
            <span className="text-xs text-slate-500">Creado {new Date(enlace.creado_en).toLocaleString()}</span>
          </div>
          <p className="mt-2 truncate font-mono text-sm text-emerald-400">{shortUrl}</p>
          <p className="mt-1 truncate text-xs text-slate-500" title={enlace.url_destino}>
            → {enlace.url_destino}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-3xl font-bold text-white">{scanCount}</p>
            <p className="text-xs text-slate-400">{scanCount === 1 ? "escaneo" : "escaneos"}</p>
          </div>
          <p className="max-w-56 text-xs text-slate-500">
            Escanea el QR con tu teléfono y mira cómo se suma el contador en vivo.
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={qrPng ?? "#"}
            download={`pivotqr-${enlace.slug}.png`}
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Descargar PNG
          </a>
          <button
            onClick={descargarSvg}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            Descargar SVG
          </button>
        </div>
      </div>
    </div>
  );
}