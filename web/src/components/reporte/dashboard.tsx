"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

interface EnlaceReporte {
  id: string;
  slug: string;
  url_destino: string;
  pausado: boolean;
}

interface ReporteScan {
  id: string;
  enlace_id: string;
  ciudad: string | null;
  region: string | null;
  pais: string | null;
  dispositivo: string;
  so: string;
  fecha_utc: string;
}

interface Payload {
  proyecto: { id: string; nombre: string; enlaces: EnlaceReporte[] };
  scans: ReporteScan[];
}

const DIAS_CORTA = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const INTERVALO_MS = 5000;

function keyLocal(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

function Columnas({ items, step = 1 }: { items: { label: string; valor: number }[]; step?: number }) {
  const max = Math.max(1, ...items.map((i) => i.valor));
  return (
    <div>
      <div className="flex h-36 items-end gap-[3px]">
        {items.map((it, i) => (
          <div
            key={i}
            role="img"
            aria-label={`${it.label}: ${it.valor} escaneos`}
            tabIndex={0}
            className="group relative flex h-full flex-1 flex-col justify-end rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70"
            title={`${it.label}: ${it.valor} escaneos`}
          >
            {it.valor > 0 && (
              <span
                aria-hidden
                className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1.5 text-[11px] leading-4 text-gray-200 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {it.valor}
              </span>
            )}
            <div
              className={`w-full rounded-t-[3px] ${it.valor > 0 ? "bg-brand-500" : "bg-gray-800"}`}
              style={{ height: `${Math.max(it.valor > 0 ? 6 : 2, (it.valor / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-[3px] text-[11px] text-gray-400">
        {items.map((it, i) => (
          <span key={i} className="flex-1 text-center">
            {i % step === 0 ? it.label : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function ListaBarras({ items }: { items: { label: string; valor: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.valor));
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it.label}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className="truncate text-gray-300">{it.label}</span>
            <span className="font-semibold text-white">{it.valor}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${(it.valor / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Card({
  titulo,
  children,
  className = "",
}: {
  titulo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-gray-800 bg-gray-900 p-5 ${className}`}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">{titulo}</h2>
      {children}
    </section>
  );
}

export function ReporteDashboard({
  proyectoId,
  codigo,
  nombre,
}: {
  proyectoId: string;
  codigo: string;
  nombre: string;
}) {
  const [data, setData] = useState<Payload | null>(null);
  const [desacceso, setDesacceso] = useState(false);
  const [error, setError] = useState(false);
  const [actualizadoEn, setActualizadoEn] = useState<Date | null>(null);

  const cargar = useCallback(async () => {
    const url = `/api/reporte/${proyectoId}${codigo ? `?codigo=${encodeURIComponent(codigo)}` : ""}`;
    const res = await fetch(url);
    if (res.status === 403) {
      setDesacceso(true);
      return;
    }
    if (!res.ok) {
      setError(true);
      return;
    }
    const json = (await res.json()) as Payload;
    setData(json);
    setActualizadoEn(new Date());
  }, [proyectoId, codigo]);

  useEffect(() => {
    const timer = setTimeout(() => void cargar(), 0);
    const interval = setInterval(() => void cargar(), INTERVALO_MS);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [cargar]);

  const resumen = useMemo(() => {
    if (!data) return null;
    const scans = data.scans;
    const ahora = new Date();

    const dias: { label: string; valor: number }[] = [];
    const porFecha = new Map<string, number>();
    for (const s of scans) {
      const fecha = keyLocal(new Date(s.fecha_utc));
      porFecha.set(fecha, (porFecha.get(fecha) ?? 0) + 1);
    }
    for (let i = 13; i >= 0; i--) {
      const d = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - i);
      const fecha = keyLocal(d);
      dias.push({
        label: `${DIAS_CORTA[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}`,
        valor: porFecha.get(fecha) ?? 0,
      });
    }

    const horas: { label: string; valor: number }[] = Array.from({ length: 24 }, (_, h) => ({
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
      enlaces: data.proyecto.enlaces,
    };
  }, [data]);

  if (desacceso) {
    return (
      <p className="rounded-xl border border-error-900/50 bg-error-950/30 p-6 text-center text-sm text-error-300">
        Código de acceso incorrecto. No tienes permisos para ver este reporte.
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-center text-sm text-gray-400">
        No se pudo cargar el reporte. Inténtalo de nuevo en un momento.
      </p>
    );
  }

  if (!resumen) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-gray-800 bg-gray-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">En vivo</span>
          </div>
          <div role="status" aria-atomic="true">
            <p className="mt-2 font-outfit text-5xl font-bold tracking-tight text-white sm:text-6xl">
              {resumen.total.toLocaleString("es-CL")}
            </p>
            <p className="mt-1 text-sm text-gray-400">escaneos registrados</p>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {actualizadoEn
              ? `actualizado ${actualizadoEn.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
              : "cargando…"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{nombre}</p>
          <p className="text-xs text-gray-400">
            {resumen.enlaces.length} enlace{resumen.enlaces.length === 1 ? "" : "s"} en la campaña
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Últimos 14 días">
          <Columnas items={resumen.dias} />
        </Card>

        <Card titulo="Por hora del día (hora local de quien ve)">
          <Columnas items={resumen.horas} step={3} />
        </Card>

        <Card titulo="Dispositivos">
          {resumen.dispositivos.length > 0 ? (
            <ListaBarras items={resumen.dispositivos} />
          ) : (
            <Vacío />
          )}
          <div className="mt-5 border-t border-gray-800 pt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Sistemas operativos</h3>
            {resumen.sistemas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resumen.sistemas.map((s) => (
                  <span key={s.label} className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-300">
                    {s.label}: <span className="font-semibold text-white">{s.valor}</span>
                  </span>
                ))}
              </div>
            ) : (
              <Vacío />
            )}
          </div>
        </Card>

        <Card titulo="Ubicaciones">
          {resumen.ubicaciones.length > 0 ? (
            <ListaBarras items={resumen.ubicaciones} />
          ) : (
            <Vacío />
          )}
        </Card>
      </div>

      <Card titulo="Enlaces de la campaña">
        {resumen.enlaces.length > 0 ? (
          <ul className="divide-y divide-gray-800">
            {resumen.enlaces.map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    e.pausado
                      ? "bg-warning-500/10 text-warning-400"
                      : "bg-success-500/10 text-success-400"
                  }`}
                >
                  {e.pausado ? "pausado" : "activo"}
                </span>
                <code className="shrink-0 text-sm text-brand-400">{e.slug}</code>
                <span className="min-w-0 truncate text-sm text-gray-400">{e.url_destino}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Vacío />
        )}
      </Card>
    </div>
  );
}

function Vacío() {
  return <p className="py-4 text-center text-sm text-gray-400">Sin datos aún</p>;
}