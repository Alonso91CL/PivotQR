"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { agregarScans } from "@/components/metricas/agregacion";
import { BotónCsv, Card, Columnas, ListaBarras, Vacío } from "@/components/metricas/charts";
import type { ReporteScan } from "@/lib/reporte";
import type { Enlace } from "@/lib/types";

interface PayloadMetricasQr {
  enlace: Pick<Enlace, "id" | "slug" | "nombre">;
  scans: ReporteScan[];
}

function formatoNumero(n: number): string {
  return n.toLocaleString("es-CL");
}

function ContenidoMetricas({ enlace }: { enlace: Enlace }) {
  const [data, setData] = useState<PayloadMetricasQr | null>(null);

  useEffect(() => {
    let activo = true;
    fetch(`/api/proyectos/${enlace.proyecto_id}/enlaces/${enlace.id}/metricas`, {
      cache: "no-store",
    })
      .then((r) => (r.ok ? (r.json() as Promise<PayloadMetricasQr>) : null))
      .then((json) => {
        if (activo) setData(json);
      })
      .catch(() => {
        if (activo) setData(null);
      });
    return () => {
      activo = false;
    };
  }, [enlace.id, enlace.proyecto_id]);

  const resumen = data ? agregarScans(data.scans) : null;

  if (!resumen) {
    return <p className="py-6 text-center text-sm text-gray-400">Cargando métricas…</p>;
  }

  const scans = data?.scans ?? [];

  return (
    <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Escaneos registrados</p>
          <p className="mt-1 text-3xl font-bold text-white">{formatoNumero(resumen.total)}</p>
        </div>
        <BotónCsv scans={scans} nombreArchivo={`metricas-${enlace.slug}.csv`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card titulo="Últimos 14 días">
          <Columnas items={resumen.dias} step={2} />
        </Card>
        <Card titulo="Por hora">
          <Columnas items={resumen.horas} step={3} />
        </Card>
        <Card titulo="Dispositivos">
          {resumen.dispositivos.length > 0 ? (
            <ListaBarras items={resumen.dispositivos} />
          ) : (
            <Vacío />
          )}
        </Card>
        <Card titulo="Sistemas operativos">
          {resumen.sistemas.length > 0 ? (
            <ListaBarras items={resumen.sistemas} />
          ) : (
            <Vacío />
          )}
        </Card>
        <Card titulo="Ubicaciones">
          {resumen.ubicaciones.length > 0 ? (
            <ListaBarras items={resumen.ubicaciones} />
          ) : (
            <Vacío />
          )}
        </Card>
        <Card titulo="Escaneos" className="lg:col-span-2">
          {scans.length > 0 ? (
            <div className="max-h-64 overflow-y-auto border-b border-gray-800">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-gray-900">
                  <tr className="text-xs uppercase tracking-wide text-gray-400">
                    <th scope="col" className="py-2 pr-3 font-semibold">Fecha</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">Ubicación</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">Dispositivo</th>
                    <th scope="col" className="py-2 font-semibold">SO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {scans.map((s) => (
                    <tr key={s.id}>
                      <td className="whitespace-nowrap py-2 pr-3">
                        {new Date(s.fecha_utc).toLocaleString("es-CL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2 pr-3">
                        {[s.ciudad, s.region, s.pais].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="py-2 pr-3">{s.dispositivo}</td>
                      <td className="py-2">{s.so}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Vacío />
          )}
        </Card>
      </div>
    </div>
  );
}

export function VerMetricasQrModal({
  enlace,
  abierto,
  onCerrar,
}: {
  enlace: Enlace;
  abierto: boolean;
  onCerrar: () => void;
}) {
  if (!abierto) return null;

  return (
    <Modal
      titulo={`Métricas · ${enlace.nombre || `QR ${enlace.slug}`}`}
      onCerrar={onCerrar}
      ancho="max-w-3xl"
    >
      <ContenidoMetricas key={enlace.id} enlace={enlace} />
    </Modal>
  );
}