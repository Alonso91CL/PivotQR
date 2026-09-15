"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/modal";
import { TipoSelector } from "@/components/tipo-selector";
import { VCardForm } from "@/components/vcard-form";
import { buildQRDataUrl, buildQRSvg } from "@/lib/qr";
import { shortUrlDe } from "@/lib/short-url";
import { contenidoVCardVacio, type VCardContenido } from "@/lib/vcard";
import type { Enlace, TipoEnlace } from "@/lib/types";

const inputCls =
  "w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";
const etiquetaCls = "mb-1.5 block text-sm font-medium text-gray-300";

export function NuevoQrForm({
  proyectoId,
  proyectoNombre,
}: {
  proyectoId: string;
  proyectoNombre: string;
}) {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoEnlace>("url");
  const [url, setUrl] = useState("");
  const [contenido, setContenido] = useState<VCardContenido>(() => contenidoVCardVacio());
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [creado, setCreado] = useState<Enlace | null>(null);

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const [qrCreado, setQrCreado] = useState<string | null>(null);
  useEffect(() => {
    if (!creado) return;
    let activo = true;
    buildQRDataUrl(shortUrlDe(creado.slug)).then((urlFinal) => {
      if (activo) setQrCreado(urlFinal);
    });
    return () => {
      activo = false;
    };
  }, [creado]);

  function validar(): string | null {
    if (nombre.trim().length === 0) {
      return "Ingresa un nombre para identificar el QR.";
    }
    if (tipo === "url" && url.trim().length === 0) {
      return "Ingresa la URL de destino.";
    }
    if (tipo === "vcard" && !contenido.nombre?.trim() && !contenido.apellido?.trim()) {
      return "Ingresa al menos el nombre o el apellido del contacto.";
    }
    return null;
  }

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const problema = validar();
    if (problema) {
      setError(problema);
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`/api/proyectos/${proyectoId}/enlaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          url_destino: tipo === "url" ? url : undefined,
          contenido: tipo === "vcard" ? contenido : undefined,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
        }),
      });
      const data = (await res.json()) as { enlace?: Enlace; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Error al crear el enlace");
      }
      setQrCreado(null);
      setCreado(data.enlace ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el enlace");
    } finally {
      setCargando(false);
    }
  }

  async function descargarSvg() {
    if (!creado) return;
    const svg = await buildQRSvg(shortUrlDe(creado.slug));
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const objeto = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objeto;
    a.download = `pivotqr-${creado.slug}.svg`;
    a.click();
    URL.revokeObjectURL(objeto);
  }

  function cerrarPopup() {
    router.push(`/proyectos/${proyectoId}`);
  }

  return (
    <form onSubmit={crear} noValidate className="space-y-6">
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">1 · Tipo de QR</h2>
        <div className="mt-3">
          <TipoSelector seleccionado={tipo} onSeleccionar={(t) => setTipo(t as TipoEnlace)} />
        </div>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          2 · {tipo === "vcard" ? "Datos de contacto" : "Destino"}
        </h2>

        {tipo === "url" ? (
          <div className="mt-3">
            <label htmlFor="nuevo-enlace-url" className={etiquetaCls}>
              URL de destino <span className="text-warning-400">*</span>
            </label>
            <input
              id="nuevo-enlace-url"
              type="url"
              required
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="https://pizzerialuigi.com/menu"
              className={inputCls}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              El QR apuntará a esta URL. Puedes cambiarla después sin reimprimir.
            </p>
          </div>
        ) : (
          <div className="mt-3">
            <VCardForm contenido={contenido} onCambio={setContenido} />
            <p className="mt-1.5 text-xs text-gray-400">
              Al escanear, el QR guarda estos datos como una tarjeta de contacto (.vcf).
            </p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">3 · Identificación</h2>

        <div className="mt-3 space-y-4">
          <div>
            <label htmlFor="nuevo-enlace-nombre" className={etiquetaCls}>
              Nombre / Título <span className="text-warning-400">*</span>
            </label>
            <input
              id="nuevo-enlace-nombre"
              type="text"
              required
              maxLength={120}
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setError(null);
              }}
              placeholder={tipo === "vcard" ? "Tarjeta de Juan Pérez" : "Menú de verano"}
              className={inputCls}
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Te permite identificar este QR en la lista de tu campaña.
            </p>
          </div>

          <div>
            <label htmlFor="nuevo-enlace-descripcion" className={etiquetaCls}>
              Descripción <span className="text-gray-500">(opcional)</span>
            </label>
            <textarea
              id="nuevo-enlace-descripcion"
              rows={2}
              maxLength={280}
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                setError(null);
              }}
              placeholder={tipo === "vcard" ? "Tarjeta de contacto de Juan para distribución" : "Campaña del menú digital para mesas del local"}
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={cargando}
          className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {cargando ? "Generando…" : "Generar enlace y QR"}
        </button>
        {error && (
          <p
            id="nuevo-enlace-error"
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="rounded-lg border border-error-500/30 bg-error-950/40 px-3 py-2 text-sm text-error-400"
          >
            {error}
          </p>
        )}
      </div>

      {creado && (
        <Modal titulo="QR creado" onCerrar={cerrarPopup} ancho="max-w-sm">
          <div className="flex flex-col items-center gap-3 text-center">
            {qrCreado ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCreado}
                alt={`QR del enlace ${creado.slug}`}
                className="h-44 w-44 rounded-lg bg-white p-1"
              />
            ) : (
              <div className="h-44 w-44 animate-pulse rounded-lg bg-gray-800" />
            )}
            <p className="truncate font-mono text-xs text-brand-400">{shortUrlDe(creado.slug)}</p>
            <div className="mt-1 grid w-full grid-cols-2 gap-2">
              <a
                href={qrCreado ?? "#"}
                download={`pivotqr-${creado.slug}.png`}
                className="rounded-lg bg-brand-500 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Descargar PNG
              </a>
              <button
                type="button"
                onClick={() => void descargarSvg()}
                className="rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 transition hover:bg-gray-800"
              >
                Descargar SVG
              </button>
            </div>
            <button
              type="button"
              onClick={cerrarPopup}
              className="mt-1 w-full rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
            >
              Ver en {proyectoNombre}
            </button>
          </div>
        </Modal>
      )}
    </form>
  );
}