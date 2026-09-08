"use client";

import { useEffect, useState } from "react";
import { buildQRSvg, buildQRDataUrl, type Estilo } from "@/lib/qr";
import { createClient } from "@/lib/supabase/client";
import { PersonalizarQr, type PersonalizacionQR } from "@/components/personalizar-qr";
import type { Enlace } from "@/lib/types";

const SHORT_BASE = process.env.NEXT_PUBLIC_SHORT_URL;

function personalizacionDe(enlace: Enlace): PersonalizacionQR {
  return {
    colorFondo: enlace.color_fondo ?? null,
    colorPatron: enlace.color_patron ?? null,
    estilo: (enlace.estilo as Estilo | null) ?? null,
    logoUrl: enlace.logo_url ?? null,
  };
}

export function QrPanel({ enlace }: { enlace: Enlace }) {
  // En producción el puente vive en el dominio corto (qr.pivotit.cl);
  // en desarrollo local lo sirve la ruta /s/:slug de la propia app.
  const shortUrl = SHORT_BASE
    ? `${SHORT_BASE}/${enlace.slug}`
    : `http://localhost:3000/s/${enlace.slug}`;

  const [qrPng, setQrPng] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);

  // Estado editable (Fase 2): destino y pausa se actualizan sin reimprimir.
  const [urlDestino, setUrlDestino] = useState(enlace.url_destino);
  const [pausado, setPausado] = useState(enlace.pausado);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [subiendoLogo, setSubiendoLogo] = useState(false);

  // Personalización (F4): colores, estilo y logo del QR.
  const [personalizacion, setPersonalizacion] = useState<PersonalizacionQR>(() =>
    personalizacionDe(enlace),
  );

  const configQR = {
    colorPatron: personalizacion.colorPatron,
    colorFondo: personalizacion.colorFondo,
    estilo: personalizacion.estilo ?? "clasico",
    logoUrl: personalizacion.logoUrl,
  };

  useEffect(() => {
    let activo = true;
    buildQRDataUrl(shortUrl, configQR).then((url) => {
      if (activo) setQrPng(url);
    });
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shortUrl, personalizacion]);

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

  async function actualizar(cambios: Record<string, string | boolean | null>, mensajeOk?: string) {
    setGuardando(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch(
        `/api/proyectos/${enlace.proyecto_id}/enlaces/${enlace.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cambios),
        },
      );
      const data = (await res.json()) as { enlace?: Enlace; error?: string };
      if (!res.ok || !data.enlace) {
        throw new Error(data.error ?? "No se pudo actualizar el enlace");
      }
      const e = data.enlace;
      setUrlDestino(e.url_destino);
      setPausado(e.pausado);
      setPersonalizacion(personalizacionDe(e));
      setOkMsg(mensajeOk ?? "Guardado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el enlace");
    } finally {
      setGuardando(false);
    }
  }

  function guardarUrl(e: React.FormEvent) {
    e.preventDefault();
    if (urlDestino.trim() === enlace.url_destino) return;
    void actualizar(
      { url_destino: urlDestino },
      "Destino actualizado: el mismo QR ya redirige a la nueva URL.",
    );
  }

  async function guardarConfig() {
    await actualizar(
      {
        color_fondo: personalizacion.colorFondo,
        color_patron: personalizacion.colorPatron,
        estilo: personalizacion.estilo,
        logo_url: personalizacion.logoUrl,
      },
      "Personalización guardada: el QR y la descarga usan los nuevos colores, estilo y logo.",
    );
  }

  async function subirLogo(file: File) {
    setSubiendoLogo(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
      const nombre = file.name.replace(/[^a-zA-Z0-9._-]/g, "");
      const ruta = `${user.id}/${enlace.slug}-${Date.now()}-${nombre}`;
      const { error } = await supabase.storage
        .from("logos")
        .upload(ruta, file, { upsert: true, contentType: file.type });
      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from("logos").getPublicUrl(ruta);
      setPersonalizacion((p) => ({ ...p, logoUrl: data.publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el logo.");
    } finally {
      setSubiendoLogo(false);
    }
  }

  function cambiarPersonalizacion(
    campo: keyof PersonalizacionQR,
    valor: string | null | Estilo,
  ) {
    setPersonalizacion((p) => ({ ...p, [campo]: valor }));
    setOkMsg(null);
  }

  async function descargarSvg() {
    const svg = await buildQRSvg(shortUrl, configQR);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pivotqr-${enlace.slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 p-5 sm:flex-row">
        <div className="flex-shrink-0">
          {qrPng ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrPng}
              alt={`QR ${enlace.slug}`}
              className="h-40 w-40 rounded-lg"
              style={
                personalizacion.colorFondo === "transparente"
                  ? {
                      background:
                        "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 0 0 / 16px 16px",
                    }
                  : undefined
              }
            />
          ) : (
            <div className="h-40 w-40 animate-pulse rounded-lg bg-gray-800" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  pausado
                    ? "bg-warning-500/20 text-warning-300"
                    : "bg-success-500/20 text-success-300"
                }`}
              >
                {pausado ? "Pausado" : "Activo"}
              </span>
              <span className="text-xs text-gray-500">
                Creado{" "}
                {new Date(enlace.creado_en).toLocaleString("es-CL", {
                  timeZone: "America/Santiago",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <p className="mt-2 truncate font-mono text-sm text-brand-400">{shortUrl}</p>

            <form onSubmit={guardarUrl} className="mt-1 flex items-center gap-1.5">
              <input
                type="url"
                value={urlDestino}
                onChange={(e) => {
                  setUrlDestino(e.target.value);
                  setError(null);
                  setOkMsg(null);
                }}
                aria-label="URL de destino"
                disabled={guardando}
                className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-2 py-1 text-xs text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={guardando || urlDestino.trim() === enlace.url_destino}
                className="rounded-lg border border-gray-700 px-2.5 py-1 text-xs text-gray-200 transition hover:bg-gray-800 disabled:opacity-40"
              >
                {guardando ? "Guardando…" : "Guardar"}
              </button>
            </form>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold text-white">{scanCount}</p>
              <p className="text-xs text-gray-400">{scanCount === 1 ? "escaneo" : "escaneos"}</p>
            </div>
            <p className="max-w-56 text-xs text-gray-500">
              {pausado
                ? "Campaña pausada: al escanear el QR se muestra el aviso y los escaneos siguen contando."
                : "Escanea el QR con tu teléfono y mira cómo se suma el contador en vivo."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={qrPng ?? "#"}
              download={`pivotqr-${enlace.slug}.png`}
              className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Descargar PNG
            </a>
            <button
              onClick={() => void descargarSvg()}
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-200 transition hover:bg-gray-800"
            >
              Descargar SVG
            </button>
            <button
              type="button"
              onClick={() => void actualizar(
                { pausado: !pausado },
                pausado ? "Campaña activada: vuelve a redirigir." : "Campaña pausada: ya no redirige y los escaneos siguen contando.",
              )}
              disabled={guardando}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
                pausado
                  ? "border-success-700 bg-success-500/10 text-success-300 hover:bg-success-500/20"
                  : "border-warning-700 bg-warning-500/10 text-warning-300 hover:bg-warning-500/20"
              }`}
            >
              {pausado ? "Activar campaña" : "Pausar campaña"}
            </button>
          </div>

          {error && <p className="text-xs text-error-400">{error}</p>}
          {okMsg && <p className="text-xs text-success-400">{okMsg}</p>}
        </div>
      </div>

      <PersonalizarQr
        valores={personalizacion}
        onCambio={cambiarPersonalizacion}
        onLogoSeleccionado={(file) => void subirLogo(file)}
        onQuitarLogo={() => setPersonalizacion((p) => ({ ...p, logoUrl: null }))}
        subiendoLogo={subiendoLogo}
        guardando={guardando}
        onGuardar={() => void guardarConfig()}
      />
    </div>
  );
}