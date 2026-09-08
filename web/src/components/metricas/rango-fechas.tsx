"use client";

// Selector de rango de fechas: envía `desde`/`hasta` en formato YYYY-MM-DD,
// que el servidor interpreta en UTC. `Borrar` restablece el rango.
export function RangoDeFechas({
  desde,
  hasta,
  onChange,
}: {
  desde: string;
  hasta: string;
  onChange: (desde: string, hasta: string) => void;
}) {
  const inputClases =
    "rounded-lg border border-gray-700 bg-gray-800 px-2.5 py-1.5 text-sm text-gray-200 [color-scheme:dark] focus:border-brand-500 focus:outline-none";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor="rango-desde">
        Desde
      </label>
      <input
        id="rango-desde"
        type="date"
        value={desde}
        max={hasta || undefined}
        onChange={(e) => onChange(e.target.value, hasta)}
        className={inputClases}
      />
      <span aria-hidden className="text-gray-500">
        →
      </span>
      <label className="sr-only" htmlFor="rango-hasta">
        Hasta
      </label>
      <input
        id="rango-hasta"
        type="date"
        value={hasta}
        min={desde || undefined}
        onChange={(e) => onChange(desde, e.target.value)}
        className={inputClases}
      />
      {(desde || hasta) && (
        <button
          type="button"
          onClick={() => onChange("", "")}
          className="rounded-lg px-2 py-1.5 text-sm text-gray-400 transition hover:text-white"
        >
          Borrar
        </button>
      )}
    </div>
  );
}