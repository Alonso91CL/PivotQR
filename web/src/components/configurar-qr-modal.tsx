"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { PersonalizarQr, personalizacionDe } from "@/components/personalizar-qr";
import type { PersonalizacionQR } from "@/components/personalizar-qr";
import { buildQRSvg, buildQRDataUrl } from "@/lib/qr";
import type { Estilo } from "@/lib/qr";
import { createClient } from "@/lib/supabase/client";
import { shortUrlDe } from "@/lib/short-url";
import type { Enlace } from "@/lib/types";

export function ConfigurarQrModal({
  enlace,
  abierto,
  onCerrar,
  onGuardado,
}: {
  enlace: Enlace;
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: (enlace: Enlace, mensaje: string) => void;
}) {
  if (!abierto) return null;

  return (
    <Modal titulo="Personalizar QR" onCerrar={onCerrar} ancho="max-w-3xl">
      <ContenidoPersonalizar
        key={enlace.id}
        enlace={enlace}
        onGuardado={onGuardado}
      />
    </Modal>
  );
}

function ContenidoPersonalizar({
  enlace,
  onGuardado,
}: {
  enlace: Enlace;
  onGuardado: (enlace: Enlace, mensaje: string) => void;
}) {
  const shortUrl = shortUrlDe(enlace.slug);
  const [personalizacion, setPersonalizacion] = useState<PersonalizacionQR>(() =>
    personalizacionDe(enlace),
  );
  const [qrPng, setQrPng] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

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

  function cambiar(campo: keyof PersonalizacionQR, valor: string | null | Estilo) {
    setPersonalizacion((p) => ({ ...p, [campo]: valor }));
    setOkMsg(null);
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

  async function guardar() {
    setGuardando(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch(
        `/api/proyectos/${enlace.proyecto_id}/enlaces/${enlace.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            color_fondo: personalizacion.colorFondo,
            color_patron: personalizacion.colorPatron,
            estilo: personalizacion.estilo,
            logo_url: personalizacion.logoUrl,
          }),
        },
      );
      const data = (await res.json()) as { enlace?: Enlace; error?: string };
      if (!res.ok || !data.enlace) {
        throw new Error(data.error ?? "No se pudo guardar la personalización");
      }
      const mensaje =
        "Personalización guardada: el QR y la descarga usan los nuevos colores, estilo y logo.";
      setOkMsg(mensaje);
      onGuardado(data.enlace, mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la personalización");
    } finally {
      setGuardando(false);
    }
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
    <>
      <div className="grid gap-5 md:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg bg-gray-950 p-3">
            {qrPng ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrPng}
                alt={`Vista previa del QR ${enlace.slug}`}
                className="h-36 w-36 rounded-lg"
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
              <div className="h-36 w-36 animate-pulse rounded-lg bg-gray-800" />
            )}
          </div>
          <div className="flex gap-2">
            <a
              href={qrPng ?? "#"}
              download={`pivotqr-${enlace.slug}.png`}
              className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Descargar PNG
            </a>
            <button
              type="button"
              onClick={() => void descargarSvg()}
              className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-200 transition hover:bg-gray-800"
            >
              SVG
            </button>
          </div>
        </div>

        <PersonalizarQr
          valores={personalizacion}
          onCambio={cambiar}
          onLogoSeleccionado={(file) => void subirLogo(file)}
          onQuitarLogo={() => setPersonalizacion((p) => ({ ...p, logoUrl: null }))}
          subiendoLogo={subiendoLogo}
          guardando={guardando}
          onGuardar={() => void guardar()}
        />
      </div>

      {error && <p role="alert" className="mt-3 text-xs text-error-400">{error}</p>}
      {okMsg && <p role="status" className="mt-3 text-xs text-success-400">{okMsg}</p>}
    </>
  );
}