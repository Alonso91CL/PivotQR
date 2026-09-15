// Datos de contacto de una tarjeta vCard (tipo de QR 'vcard'). El worker
// construye el archivo .vcf a partir de este objeto al momento de escanear.
export interface VCardContenido {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  movil?: string;
  email?: string;
  web?: string;
  empresa?: string;
  cargo?: string;
  fax?: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  pais?: string;
}

export const CAMPOS_VCARD: (keyof VCardContenido)[] = [
  "nombre",
  "apellido",
  "telefono",
  "movil",
  "email",
  "web",
  "empresa",
  "cargo",
  "fax",
  "direccion",
  "ciudad",
  "codigo_postal",
  "pais",
];

export function contenidoVCardVacio(): VCardContenido {
  return Object.fromEntries(CAMPOS_VCARD.map((c) => [c, ""])) as VCardContenido;
}

// Valor seguro para una línea de vCard 3.0: escapa los separadores `;` y `,`
// y colapsa saltos de línea para no romper cada línea del archivo.
function escaparVcf(valor: string): string {
  return valor.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/[\r\n]+/g, " ");
}

// Convierte el contenido en un archivo .vcf (vCard 3.0) válido.
export function construirVcf(c: VCardContenido): string {
  const lineas: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  const nombre = (c.nombre ?? "").trim();
  const apellido = (c.apellido ?? "").trim();
  const nombreCompleto = [nombre, apellido].filter(Boolean).join(" ") || "Contacto";

  lineas.push(`N:${escaparVcf(apellido)};${escaparVcf(nombre)};;;`);
  lineas.push(`FN:${escaparVcf(nombreCompleto)}`);

  if (c.empresa) lineas.push(`ORG:${escaparVcf(c.empresa)}`);
  if (c.cargo) lineas.push(`TITLE:${escaparVcf(c.cargo)}`);
  if (c.telefono) lineas.push(`TEL;TYPE=VOICE:${escaparVcf(c.telefono)}`);
  if (c.movil) lineas.push(`TEL;TYPE=CELL:${escaparVcf(c.movil)}`);
  if (c.fax) lineas.push(`TEL;TYPE=FAX:${escaparVcf(c.fax)}`);
  if (c.email) lineas.push(`EMAIL:${escaparVcf(c.email)}`);
  if (c.web) lineas.push(`URL:${escaparVcf(c.web)}`);

  const tieneDireccion = c.direccion || c.ciudad || c.codigo_postal || c.pais;
  if (tieneDireccion) {
    // ADR vCard: box;extended;street;city;region;postal;country
    const adr = [
      "",
      "",
      c.direccion ?? "",
      c.ciudad ?? "",
      "",
      c.codigo_postal ?? "",
      c.pais ?? "",
    ]
      .map((v) => escaparVcf(v))
      .join(";");
    lineas.push(`ADR;TYPE=HOME:${adr}`);
  }

  lineas.push("END:VCARD");
  return lineas.join("\r\n");
}

// Nombre de archivo seguro para la descarga del .vcf.
export function nombreArchivoVcf(c: VCardContenido, slug?: string): string {
  const base = ((c.nombre ?? c.apellido) ?? "contacto").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${base || "contacto"}${slug ? `-${slug}` : ""}.vcf`;
}