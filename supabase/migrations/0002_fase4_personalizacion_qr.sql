-- F4: personalización del QR (colores, estilo y logo).
-- El QR se re-renderiza al vuelo desde estos campos; no requiere reimprimir.
-- Idempotente: las columnas / bucket pueden existir por un setup previo.

alter table public.links
  add column if not exists color_fondo text,
  add column if not exists color_patron text,
  add column if not exists estilo text,
  add column if not exists logo_url text;

-- Bucket público para logos de QR. La lectura pública sirve el logo en el QR.
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do update set name = excluded.name, public = excluded.public;

-- Upsert y borrado de logos solo del dueño (misma convención que la política
-- de insert existente: el archivo vive en una carpeta logos/<uid>/).
do $$
begin
  if not exists (select 1 from pg_policies
                 where policyname = 'logos actualizar dueno'
                   and schemaname = 'storage' and tablename = 'objects') then
    create policy "logos actualizar dueno" on storage.objects for update to authenticated
      using (bucket_id = 'logos' and (storage.foldername(name))[1] = (auth.uid())::text)
      with check (bucket_id = 'logos' and (storage.foldername(name))[1] = (auth.uid())::text);
  end if;

  if not exists (select 1 from pg_policies
                 where policyname = 'logos borrar dueno'
                   and schemaname = 'storage' and tablename = 'objects') then
    create policy "logos borrar dueno" on storage.objects for delete to authenticated
      using (bucket_id = 'logos' and (storage.foldername(name))[1] = (auth.uid())::text);
  end if;
end $$;