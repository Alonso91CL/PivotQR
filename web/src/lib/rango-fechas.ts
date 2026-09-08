import { NextRequest } from "next/server";

// Filtros opcionales `desde`/`hasta` (YYYY-MM-DD o ISO 8601) aplicados a la
// columna fecha_utc. `desde` se interpreta como inicio del día en UTC y
// `hasta` como fin del día en UTC; en la query se usa una cota exclusiva con
// `.lt`. El selector de fechas del panel envía días en formato YYYY-MM-DD.
export interface RangoFechas {
  desde?: string;
  hastaExclusiva?: string;
}

const ES_DIA = /^\d{4}-\d{2}-\d{2}$/;
const ES_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/;

export function rangoFechasDe(request: NextRequest): RangoFechas {
  const desdeRaw = request.nextUrl.searchParams.get("desde");
  const hastaRaw = request.nextUrl.searchParams.get("hasta");

  const desde = desdeRaw && esValida(desdeRaw) ? aIso(desdeRaw) : undefined;

  let hastaExclusiva: string | undefined;
  if (hastaRaw && esValida(hastaRaw)) {
    hastaExclusiva = diaSiguiente(aIso(hastaRaw));
  }

  return { desde, hastaExclusiva };
}

function esValida(valor: string): boolean {
  return ES_DIA.test(valor) || ES_ISO.test(valor);
}

// Devuelve el valor normalizado a un instante ISO con zona UTC: un día simple
// son las 00:00 UTC, un valor ISO se conserva tal cual.
function aIso(valor: string): string {
  return ES_DIA.test(valor) ? `${valor}T00:00:00.000Z` : valor;
}

// Cota exclusiva para `.lt`: el día siguiente a las 00:00 UTC.
function diaSiguiente(iso: string): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString();
}