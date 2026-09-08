import type { ReporteScan } from "@/lib/reporte";

export interface Item {
  label: string;
  valor: number;
}

export interface ResumenMetricas {
  total: number;
  dias: Item[];
  horas: Item[];
  dispositivos: Item[];
  sistemas: Item[];
  ubicaciones: Item[];
}

const DIAS_CORTA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export function keyLocal(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

// Agrega la lista de escaneos en el mismo formato que el dashboard de reporte.
// Se reutiliza en el panel de cuenta, el resumen de proyecto y el modal de QR.
export function agregarScans(scans: ReporteScan[], diasHorizonte = 14): ResumenMetricas {
  const ahora = new Date();

  const porFecha = new Map<string, number>();
  for (const s of scans) {
    const fecha = keyLocal(new Date(s.fecha_utc));
    porFecha.set(fecha, (porFecha.get(fecha) ?? 0) + 1);
  }
  const dias: Item[] = [];
  for (let i = diasHorizonte - 1; i >= 0; i--) {
    const d = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - i);
    const fecha = keyLocal(d);
    dias.push({
      label: `${DIAS_CORTA[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}`,
      valor: porFecha.get(fecha) ?? 0,
    });
  }

  const horas: Item[] = Array.from({ length: 24 }, (_, h) => ({
    label: `${String(h).padStart(2, "0")}`,
    valor: 0,
  }));
  for (const s of scans) {
    horas[new Date(s.fecha_utc).getHours()].valor += 1;
  }

  const porDispositivo = new Map<string, number>();
  const porSO = new Map<string, number>();
  const porUbicacion = new Map<string, number>();
  for (const s of scans) {
    porDispositivo.set(s.dispositivo, (porDispositivo.get(s.dispositivo) ?? 0) + 1);
    const so = s.so || "desconocido";
    porSO.set(so, (porSO.get(so) ?? 0) + 1);
    const ubicacion = `${s.ciudad ?? "Ubicación desconocida"}${s.pais ? ` · ${s.pais}` : ""}`;
    porUbicacion.set(ubicacion, (porUbicacion.get(ubicacion) ?? 0) + 1);
  }

  const ordenarValor = (m: Map<string, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).map(([label, valor]) => ({ label, valor }));

  return {
    total: scans.length,
    dias,
    horas,
    dispositivos: ordenarValor(porDispositivo),
    sistemas: ordenarValor(porSO).slice(0, 5),
    ubicaciones: ordenarValor(porUbicacion).slice(0, 8),
  };
}