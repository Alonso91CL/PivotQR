-- PivotQR migración inicial
-- Tablas: projects, links, scans + RLS + Storage

-- ============ PROYECTOS ============
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  nombre      text not null check (char_length(nombre) between 1 and 120),
  descripcion text default '',
  reporte_publico boolean not null default false,
  codigo_acceso text default null,
  creado_en   timestamptz not null default now()
);

create index if not exists projects_owner_idx on public.projects (owner_id);

alter table public.projects enable row level security;

create policy "owners select projects"
  on public.projects for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "owners insert projects"
  on public.projects for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "owners update projects"
  on public.projects for update
  to authenticated
  using (auth.uid() = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "owners delete projects"
  on public.projects for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

-- ============ ENLACES ============
-- Cada QR es un enlace. El slug es el puente corto: qr.pivotit.cl/<slug>
create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references public.projects(id) on delete cascade,
  slug        text not null unique,
  url_destino text not null check (char_length(url_destino) <= 2048),
  pausado     boolean not null default false,
  color_fondo text default null,
  color_patron text default null,
  estilo      text default null,
  logo_url    text default null,
  creado_en   timestamptz not null default now()
);

create index if not exists links_proyecto_idx on public.links (proyecto_id);

alter table public.links enable row level security;

create policy "owners select links"
  on public.links for select
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = links.proyecto_id and p.owner_id = (select auth.uid())
    )
  );

create policy "owners insert links"
  on public.links for insert
  to authenticated
  with check (
    exists (
      select 1 from public.projects p
      where p.id = links.proyecto_id and p.owner_id = (select auth.uid())
    )
  );

create policy "owners update links"
  on public.links for update
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = links.proyecto_id and p.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = links.proyecto_id and p.owner_id = (select auth.uid())
    )
  );

create policy "owners delete links"
  on public.links for delete
  to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = links.proyecto_id and p.owner_id = (select auth.uid())
    )
  );

-- ============ ESCANEOS ============
create table if not exists public.scans (
  id          bigint generated always as identity primary key,
  enlace_id   uuid not null references public.links(id) on delete cascade,
  ciudad      text default null,
  region      text default null,
  pais        text default null,
  dispositivo text default null,
  so          text default null,
  fecha_utc   timestamptz not null default now()
);

create index if not exists scans_enlace_idx on public.scans (enlace_id);
create index if not exists scans_fecha_idx  on public.scans (fecha_utc);

alter table public.scans enable row level security;

-- El dueño del enlace puede ver los escaneos de sus enlaces.
create policy "owners select scans"
  on public.scans for select
  to authenticated
  using (
    exists (
      select 1
      from public.links l
      join public.projects p on p.id = l.proyecto_id
      where l.id = scans.enlace_id and p.owner_id = (select auth.uid())
    )
  );

-- Insert de escaneos: solo desde el servidor de confianza (worker de
-- Cloudflare con service_role). Realtime respeta esta política.
create policy "service insert scans"
  on public.scans for insert
  to service_role
  with check (true);

-- ============ REALTIME (contador en vivo) ============
-- Publica la tabla scans para que el navegador se suscriba y vea el
-- contador sumarse sin recargar. RLS filtra lo que cada quien recibe.
alter publication supabase_realtime add table public.scans;

-- ============ STORAGE (logos del QR, Fase 1 preparado) ============
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "logos public read"
  on storage.objects for select
  using (bucket_id = 'logos');

create policy "owners insert logos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);