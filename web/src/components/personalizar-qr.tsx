"use client";

import { useRef } from "react";
import { ESTILOS, type Estilo } from "@/lib/qr";

export interface PersonalizacionQR {
  colorFondo: string | null;
  colorPatron: string | null;
  estilo: Estilo | null;
  logoUrl: string | null;
}

const ETIQUETAS_ESTILO: Record<Estilo, string> = {
  clasico: "Clásico",
  redondeado: "Redondeado",
  puntos: "Puntos",
};

export function PersonalizarQr({
  valores,
  onCambio,
  onLogoSeleccionado,
  onQuitarLogo,
  subiendoLogo,
  guardando,
  onGuardar,
}: {
  valores: PersonalizacionQR;
  onCambio: (campo: keyof PersonalizacionQR, valor: string | null | Estilo) => void;
  onLogoSeleccionado: (file: File) => void;
  onQuitarLogo: () => void;
  subiendoLogo: boolean;
  guardando: boolean;
  onGuardar: () => void;
}) {
  const inputLogo = useRef<HTMLInputElement>(null);
  const fondoVisible = valores.colorFondo && valores.colorFondo !== "transparente" ? valores.colorFondo : "#ffffff";

  return (
    <section className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-200">Personalizar QR</h3>
        <button
          type="button"
          onClick={onGuardar}
          disabled={guardando}
          className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {guardando ? "Guardando…" : "Guardar personalización"}
        </button>
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-xs text-gray-400">Color del patrón</span>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              type="color"
              value={valores.colorPatron ?? "#000000"}
              onChange={(e) => onCambio("colorPatron", e.target.value)}
              aria-label="Color del patrón"
              className="h-9 w-12 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-1"
            />
            <span className="font-mono text-xs text-gray-500">{valores.colorPatron ?? "#000000"}</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-400">Color de fondo</span>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <input
              type="color"
              value={fondoVisible}
              onChange={(e) => onCambio("colorFondo", e.target.value)}
              aria-label="Color de fondo"
              className="h-9 w-12 cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-1"
            />
            <button
              type="button"
              onClick={() => onCambio("colorFondo", "transparente")}
              className={`rounded-md border px-2 py-1 text-xs transition ${
                valores.colorFondo === "transparente"
                  ? "border-brand-500 bg-brand-500/10 text-brand-400"
                  : "border-gray-700 text-gray-400 hover:bg-gray-800"
              }`}
            >
              Transparente
            </button>
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-400">Estilo</span>
          <div className="mt-1.5 flex gap-1.5">
            {ESTILOS.map((estilo) => (
              <button
                key={estilo}
                type="button"
                onClick={() => onCambio("estilo", estilo)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
                  (valores.estilo ?? "clasico") === estilo
                    ? "border-brand-500 bg-brand-500/10 text-brand-400"
                    : "border-gray-700 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {ETIQUETAS_ESTILO[estilo]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-400">Logo al centro</span>
          <input
            ref={inputLogo}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onLogoSeleccionado(file);
              e.target.value = "";
            }}
          />
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {valores.logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={valores.logoUrl}
                  alt="Logo del QR"
                  className="h-9 w-9 rounded-md border border-gray-700 bg-white object-contain p-0.5"
                />
                <button
                  type="button"
                  onClick={onQuitarLogo}
                  disabled={subiendoLogo}
                  className="rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-400 transition hover:bg-gray-800 disabled:opacity-50"
                >
                  Quitar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => inputLogo.current?.click()}
                disabled={subiendoLogo}
                className="rounded-md border border-gray-700 px-2.5 py-1.5 text-xs text-gray-400 transition hover:bg-gray-800 disabled:opacity-50"
              >
                {subiendoLogo ? "Subiendo…" : "Elegir imagen"}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-4 text-gray-500">
        Con logo, el QR usa máxima corrección de errores para seguir escaneando. El QR cambia al
        instante; pulsa “Guardar personalización” para guardarlo.
      </p>
    </section>
  );
}