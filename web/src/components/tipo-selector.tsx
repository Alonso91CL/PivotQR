"use client";

import type { TipoEnlace } from "@/lib/types";

export interface InfoTipoQR {
  id: string;
  nombre: string;
  descripcion: string;
  disponible: boolean;
  icono: "link" | "vcard" | "texto" | "email" | "llamada" | "sms" | "wifi" | "evento";
}

export const TIPOS_QR: InfoTipoQR[] = [
  { id: "url", nombre: "Enlace", descripcion: "Abre una URL", disponible: true, icono: "link" },
  { id: "vcard", nombre: "V-card", descripcion: "Guarda el contacto", disponible: true, icono: "vcard" },
  { id: "texto", nombre: "Texto", descripcion: "Muestra un texto", disponible: false, icono: "texto" },
  { id: "email", nombre: "E-mail", descripcion: "Redacta un correo", disponible: false, icono: "email" },
  { id: "llamada", nombre: "Llamada", descripcion: "Marca un teléfono", disponible: false, icono: "llamada" },
  { id: "sms", nombre: "SMS", descripcion: "Envía un mensaje", disponible: false, icono: "sms" },
  { id: "wifi", nombre: "Wi-Fi", descripcion: "Conecta a una red", disponible: false, icono: "wifi" },
  { id: "evento", nombre: "Evento", descripcion: "Añade al calendario", disponible: false, icono: "evento" },
];

function IconoTipo({ icono, className }: { icono: InfoTipoQR["icono"]; className?: string }) {
  const comunes = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (icono) {
    case "vcard":
      return (
        <svg {...comunes} className={className}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M8 15v-3M8 8v.5M16 10h-3M16 14h-3" />
        </svg>
      );
    case "texto":
      return (
        <svg {...comunes} className={className}>
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case "email":
      return (
        <svg {...comunes} className={className}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "llamada":
      return (
        <svg {...comunes} className={className}>
          <path d="M4 4h5l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v5a2 2 0 0 1-2 2A17 17 0 0 1 2 6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "sms":
      return (
        <svg {...comunes} className={className}>
          <path d="M21 8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h9l5 4V8Z" />
        </svg>
      );
    case "wifi":
      return (
        <svg {...comunes} className={className}>
          <path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "evento":
      return (
        <svg {...comunes} className={className}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" />
        </svg>
      );
    default:
      return (
        <svg {...comunes} className={className}>
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
        </svg>
      );
  }
}

export function TipoSelector({
  seleccionado,
  onSeleccionar,
  soloVCard = false,
}: {
  seleccionado: string;
  onSeleccionar: (tipo: string) => void;
  soloVCard?: boolean;
}) {
  const tipos = soloVCard ? TIPOS_QR.filter((t) => t.id !== "url") : TIPOS_QR;

  return (
    <div role="radiogroup" aria-label="Tipo de QR" className="grid grid-cols-4 gap-2">
      {tipos.map((tipo) => {
        const activo = seleccionado === tipo.id;
        return (
          <button
            key={tipo.id}
            type="button"
            role="radio"
            aria-checked={activo}
            disabled={!tipo.disponible}
            onClick={() => tipo.disponible && onSeleccionar(tipo.id)}
            className={`group relative flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition ${
              !tipo.disponible
                ? "cursor-not-allowed border-gray-800 text-gray-600"
                : activo
                  ? "border-brand-500 bg-brand-500/10 text-brand-300 ring-2 ring-brand-500/20"
                  : "border-gray-800 text-gray-300 hover:border-gray-600"
            }`}
          >
            <IconoTipo icono={tipo.icono} className={activo ? "text-brand-400" : "text-gray-400"} />
            <span className="text-xs font-medium">{tipo.nombre}</span>
            {!tipo.disponible && (
              <span className="absolute right-1 top-1 rounded bg-gray-800 px-1 py-px text-[9px] uppercase tracking-wide text-gray-500">
                Pronto
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function EtiquetaTipo({ tipo }: { tipo: TipoEnlace }) {
  const info = TIPOS_QR.find((t) => t.id === tipo);
  if (!info) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-700 bg-gray-800/60 px-2 py-px text-[11px] text-gray-300">
      <IconoTipo icono={info.icono} className="h-3 w-3 text-gray-400" />
      {info.nombre}
    </span>
  );
}