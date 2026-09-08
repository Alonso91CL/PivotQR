"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { agregarScans } from "@/components/metricas/agregacion";
import { Card, Columnas, ListaBarras, Vacío } from "@/components/metricas/charts";
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

  return (
    <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <p className="text-sm text-gray-400">Escaneos registrados</p>
        <p className="mt-1 text-3xl font-bold text-white">{formatoNumero(resumen.total)}</p>
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
      ancho="max-w-2xl"
    >
      <ContenidoMetricas key={enlace.id} enlace={enlace} />
    </Modal>
  );
}