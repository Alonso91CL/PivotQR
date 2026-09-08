export interface ReporteScan {
  id: string;
  enlace_id: string;
  ciudad: string | null;
  region: string | null;
  pais: string | null;
  latitud: number | null;
  longitud: number | null;
  dispositivo: string;
  so: string;
  fecha_utc: string;
}

// Escaneos más recientes que alimentan los agregados; el resto se cuenta por
// separado cuando hace falta exactitud (contadores por QR).
export const MAX_SCANS = 2000;