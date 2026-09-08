"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildQRDataUrl, buildQRSvg } from "@/lib/qr";
import { createClient } from "@/lib/supabase/client";
import { shortUrlDe } from "@/lib/short-url";
import { personalizacionDe } from "@/components/personalizar-qr";
import { EditarEnlaceModal } from "@/components/editar-enlace-modal";
import { ConfigurarQrModal } from "@/components/configurar-qr-modal";
import { VerMetricasQrModal } from "@/components/ver-metricas-qr-modal";
import { Modal } from "@/components/modal";
import type { Enlace } from "@/lib/types";

export function QrCard({ enlace }: { enlace: Enlace }) {
  const router = useRouter();
  const shortUrl = shortUrlDe(enlace.slug);

  const [qrPng, setQrPng] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);

  const [urlDestino, setUrlDestino] = useState(enlace.url_destino);
  const [pausado, setPausado] = useState(enlace.pausado);
  const [nombre, setNombre] = useState(enlace.nombre);
  const [descripcion, setDescripcion] = useState(enlace.descripcion);
  const [personalizacion, setPersonalizacion] = useState(() => personalizacionDe(enlace));

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const [editarAbierto, setEditarAbierto] = useState(false);
  const [configurarAbierto, setConfigurarAbierto] = useState(false);
  const [metricasAbierto, setMetricasAbierto] = useState(false);
  const [eliminarAbierto, setEliminarAbierto] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuAbierto) return;

    function fuera(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuAbierto(false);
    }
    function tecla(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuAbierto(false);
    }
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [menuAbierto]);

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

  function aplicarEnlace(e: Enlace) {
    setUrlDestino(e.url_destino);
    setPausado(e.pausado);
    setNombre(e.nombre);
    setDescripcion(e.descripcion);
    setPersonalizacion(personalizacionDe(e));
  }

  function onGuardadoModal(e: Enlace, mensaje: string) {
    aplicarEnlace(e);
    setOkMsg(mensaje);
  }

  async function alternarPausa() {
    const nuevo = !pausado;
    setGuardando(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch(
        `/api/proyectos/${enlace.proyecto_id}/enlaces/${enlace.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pausado: nuevo }),
        },
      );
      const data = (await res.json()) as { enlace?: Enlace; error?: string };
      if (!res.ok || !data.enlace) {
        throw new Error(data.error ?? "No se pudo actualizar el QR");
      }
      aplicarEnlace(data.enlace);
      setOkMsg(
        nuevo
          ? "Campaña pausada: ya no redirige y los escaneos siguen contando."
          : "Campaña activada: vuelve a redirigir.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el QR");
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

  async function eliminar() {
    setEliminando(true);
    setErrorEliminar(null);
    try {
      const res = await fetch(
        `/api/proyectos/${enlace.proyecto_id}/enlaces/${enlace.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "No se pudo eliminar el QR");
      }
      setEliminarAbierto(false);
      router.refresh();
    } catch (err) {
      setErrorEliminar(err instanceof Error ? err.message : "No se pudo eliminar el QR");
    } finally {
      setEliminando(false);
    }
  }

  const enlaceActual: Enlace = {
    ...enlace,
    nombre,
    descripcion,
    url_destino: urlDestino,
    pausado,
    color_fondo: personalizacion.colorFondo,
    color_patron: personalizacion.colorPatron,
    estilo: personalizacion.estilo,
    logo_url: personalizacion.logoUrl,
  };

  return (
    <article className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <div className="flex gap-4">
        <div className="shrink-0 self-center sm:self-auto">
          {qrPng ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrPng}
              alt={`QR ${enlace.slug}`}
              className="h-28 w-28 rounded-lg"
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
            <div className="h-28 w-28 animate-pulse rounded-lg bg-gray-800" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 truncate pt-1 text-base font-semibold text-white">
              {nombre || `QR · ${enlace.slug}`}
            </h3>
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuAbierto((v) => !v)}
                aria-label={`Acciones de ${nombre || `QR ${enlace.slug}`}`}
                aria-haspopup="menu"
                aria-expanded={menuAbierto}
                className="rounded-lg p-1.5 text-white transition hover:bg-gray-800"
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
                  <path d="M12 5.25v.01M12 12v.01M12 18.75v.01" />
                </svg>
              </button>

              {menuAbierto && (
                <div
                  role="menu"
                  aria-label={`Opciones de ${nombre || `QR ${enlace.slug}`}`}
                  className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-gray-700 bg-gray-900 p-1.5 shadow-theme-lg"
                >
                  <a
                    role="menuitem"
                    href={qrPng ?? "#"}
                    download={`pivotqr-${enlace.slug}.png`}
                    onClick={() => setMenuAbierto(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M12 3v10m0 0-3-3m3 3 3-3M6 17v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
                    </svg>
                    Descargar PNG
                  </a>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuAbierto(false);
                      void descargarSvg();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M12 3v10m0 0-3-3m3 3 3-3M6 17v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2M8 6h.01" />
                    </svg>
                    Descargar SVG
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuAbierto(false);
                      setEditarAbierto(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M16.5 3.5l4 4L8 20l-5 1 1-5L16.5 3.5z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuAbierto(false);
                      setConfigurarAbierto(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-1.4-1-2.4-1-3.6 0-1.7 1.9-2.4 3.6-2.4H18a4.4 4.4 0 0 0 4.4-4.4A9 9 0 0 0 12 3z" />
                      <circle cx="7.6" cy="10.5" r="1.1" />
                      <circle cx="12" cy="7.4" r="1.1" />
                      <circle cx="16.4" cy="10.5" r="1.1" />
                    </svg>
                    Personalizar
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuAbierto(false);
                      setMetricasAbierto(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M4 20h16M7 17v-4m5 4V8m5 9v-7" />
                    </svg>
                    Métricas
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuAbierto(false);
                      void alternarPausa();
                    }}
                    disabled={guardando}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {pausado ? (
                        <path d="M7 5l12 7-12 7V5z" />
                      ) : (
                        <path d="M8 5v14M16 5v14" />
                      )}
                    </svg>
                    {pausado ? "Activar campaña" : "Pausar campaña"}
                  </button>
                  <div className="my-1 h-px bg-gray-800" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuAbierto(false);
                      setEliminarAbierto(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-error-400 transition hover:bg-error-500/10 hover:text-error-300"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M4 7h16M10 11v6m4-6v6M6 7l1 12h10l1-12M9 7V4h6v3" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
          {descripcion && (
            <p className="line-clamp-2 text-sm text-gray-400">{descripcion}</p>
          )}
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
            <span className="text-xs text-gray-400">
              Creado{" "}
              {new Date(enlace.creado_en).toLocaleString("es-CL", {
                timeZone: "America/Santiago",
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>

          <p className="truncate font-mono text-xs text-brand-400">{shortUrl}</p>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div role="status" aria-atomic="true" className="flex items-baseline gap-1.5">
              <span className="font-outfit text-2xl font-bold text-white">{scanCount}</span>
              <span className="text-xs text-gray-400">
                {scanCount === 1 ? "escaneo" : "escaneos"}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {pausado
                ? "Campaña pausada: los escaneos siguen contando."
                : "Se actualiza en vivo con cada escaneo."}
            </p>
          </div>

          {error && <p role="alert" className="text-xs text-error-400">{error}</p>}
          {okMsg && <p role="status" className="text-xs text-success-400">{okMsg}</p>}
        </div>
      </div>

      <EditarEnlaceModal
        enlace={enlaceActual}
        abierto={editarAbierto}
        onCerrar={() => setEditarAbierto(false)}
        onGuardado={(e, m) => {
          onGuardadoModal(e, m);
          setEditarAbierto(false);
        }}
      />
      <ConfigurarQrModal
        enlace={enlaceActual}
        abierto={configurarAbierto}
        onCerrar={() => setConfigurarAbierto(false)}
        onGuardado={onGuardadoModal}
      />
      <VerMetricasQrModal
        enlace={enlaceActual}
        abierto={metricasAbierto}
        onCerrar={() => setMetricasAbierto(false)}
      />

      {eliminarAbierto && (
        <Modal titulo="Eliminar QR" onCerrar={() => setEliminarAbierto(false)}>
          <p className="text-sm text-gray-300">
            Se eliminará{" "}
            <span className="font-semibold text-white">{nombre || `QR · ${enlace.slug}`}</span>{" "}
            de esta campaña. El enlace dejará de redirigir y desaparecerá de los listados; los
            escaneos registrados se mantienen en el reporte.
          </p>
          {errorEliminar && (
            <p role="alert" className="mt-3 text-xs text-error-400">{errorEliminar}</p>
          )}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEliminarAbierto(false)}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => void eliminar()}
              disabled={eliminando}
              className="rounded-lg bg-error-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-error-600 disabled:opacity-50"
            >
              {eliminando ? "Eliminando…" : "Eliminar QR"}
            </button>
          </div>
        </Modal>
      )}
    </article>
  );
}