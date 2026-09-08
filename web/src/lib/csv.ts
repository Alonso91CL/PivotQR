import type { ReporteScan } from "@/lib/reporte";

// Exporta los escaneos visibles como CSV separado por ";" con BOM para que
// Excel muestre bien los acentos. La fecha se emite en el huso de quien la ve.
export function descargarScansCsv(scans: ReporteScan[], nombreArchivo: string): void {
  const cabeceras = ["fecha", "ciudad", "región", "país", "dispositivo", "SO", "latitud", "longitud"];
  const filas = scans.map((s) => [
    new Date(s.fecha_utc).toLocaleString("es-CL"),
    s.ciudad ?? "",
    s.region ?? "",
    s.pais ?? "",
    s.dispositivo,
    s.so,
    s.latitud != null ? String(s.latitud) : "",
    s.longitud != null ? String(s.longitud) : "",
  ]);

  const csv =
    "\uFEFF" +
    [cabeceras, ...filas]
      .map((fila) => fila.map(escapar).join(";"))
      .join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  URL.revokeObjectURL(url);
}

function escapar(celda: string): string {
  return /[";\r\n]/.test(celda) ? `"${celda.replace(/"/g, '""')}"` : celda;
}