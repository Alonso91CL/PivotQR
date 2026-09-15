"use client";

import type { VCardContenido } from "@/lib/vcard";

interface CampoVCard {
  campo: keyof VCardContenido;
  etiqueta: string;
  requerido?: boolean;
  placeholder?: string;
  spanDoble?: boolean;
}

const CAMPOS: CampoVCard[] = [
  { campo: "nombre", etiqueta: "Nombre", requerido: true, placeholder: "Nombre" },
  { campo: "apellido", etiqueta: "Apellido", requerido: true, placeholder: "Apellido" },
  { campo: "telefono", etiqueta: "Teléfono", placeholder: "+56 9 1234 5678" },
  { campo: "movil", etiqueta: "Móvil", placeholder: "+56 9 1234 5678" },
  { campo: "email", etiqueta: "E-mail", placeholder: "contacto@empresa.cl" },
  { campo: "web", etiqueta: "Sitio web", placeholder: "https://empresa.cl" },
  { campo: "empresa", etiqueta: "Empresa", placeholder: "Empresa Ltda." },
  { campo: "cargo", etiqueta: "Cargo", placeholder: "Gerente" },
  { campo: "fax", etiqueta: "Fax", placeholder: "+56 2 2345 6789" },
  { campo: "direccion", etiqueta: "Dirección", spanDoble: true, placeholder: "Calle 123, depto 4" },
  { campo: "ciudad", etiqueta: "Ciudad", placeholder: "Santiago" },
  { campo: "codigo_postal", etiqueta: "Código postal", placeholder: "7500000" },
  { campo: "pais", etiqueta: "País", placeholder: "Chile" },
];

const inputCls =
  "w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

export function VCardForm({
  contenido,
  onCambio,
  camposVisibles = CAMPOS,
}: {
  contenido: VCardContenido;
  onCambio: (contenido: VCardContenido) => void;
  camposVisibles?: CampoVCard[];
}) {
  function cambiar(campo: keyof VCardContenido, valor: string) {
    onCambio({ ...contenido, [campo]: valor });
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {camposVisibles.map(({ campo, etiqueta, requerido, placeholder, spanDoble }) => (
        <div key={campo} className={spanDoble ? "col-span-2" : undefined}>
          <label
            htmlFor={`vcard-${campo}`}
            className="mb-1.5 block text-xs font-medium text-gray-300"
          >
            {etiqueta} {requerido && <span className="text-warning-400">*</span>}
          </label>
          <input
            id={`vcard-${campo}`}
            type={
              campo === "email"
                ? "email"
                : campo === "web"
                  ? "url"
                  : campo === "telefono" || campo === "movil" || campo === "fax"
                    ? "tel"
                    : "text"
            }
            value={contenido[campo] ?? ""}
            maxLength={200}
            onChange={(e) => {
              cambiar(campo, e.target.value);
            }}
            placeholder={placeholder}
            className={inputCls}
          />
        </div>
      ))}
    </div>
  );
}