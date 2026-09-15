-- Tipos de QR (v-card y futuros) + cierre de drift del esquema.
-- La columna `tipo` distingue qué codifica el QR: 'url' (redirect vía worker)
-- o 'vcard' (el worker sirve el .vcf al escanear). `contenido` guarda los
-- datos específicos del tipo (ej. campos de contacto para v-card). Idempotente.

alter table public.links
  add column if not exists tipo text not null default 'url'
    check (tipo in ('url', 'vcard'));

-- Datos del tipo: JSONB. Para v-card guarda el contacto (nombre, teléfono,
-- email, etc.). NULL para enlaces de tipo 'url'.
alter table public.links
  add column if not exists contenido jsonb;

-- v-card no apunta a ningún destino: el QR codifica la URL corta y el worker
-- devuelve el archivo .vcf al escanear. url_destino deja de ser obligatorio.
alter table public.links
  alter column url_destino drop not null;

-- Drift: columnas que se crearon fuera del sistema de migraciones y que el
-- esquema versionado debe reflejar para que `db reset` reprodulca la BD.
alter table public.links
  add column if not exists nombre text not null default '' check (char_length(nombre) <= 120),
  add column if not exists descripcion text default '' check (char_length(descripcion) <= 280),
  add column if not exists eliminado_en timestamptz;

alter table public.scans
  add column if not exists latitud double precision,
  add column if not exists longitud double precision;