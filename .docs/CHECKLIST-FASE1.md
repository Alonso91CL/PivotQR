# PivotQR — Checklist de despliegue para la Fase 1

Pasos en orden para poner en línea el "momento ajá". Verificar siempre los límites vigentes de los planes gratuitos en los sitios oficiales.

## Estado actual (2026-09-15)

- ✔ Proyecto Supabase creado (`mnjaelkdejlpjwtjzgpt`), MCP conectado (supabase, cloudflare, vercel en `.opencode/opencode.json`).
- ✔ Migración `0001_init.sql` aplicada; también `0002_fase4_personalizacion_qr.sql` y `0003_tipos_qr.sql` (tipos url/vcard) aplicadas al remoto.
- ✔ `.env.local` con URL + publishable key + `SUPABASE_SERVICE_ROLE_KEY` (validada, HTTP 200) + `NEXT_PUBLIC_SHORT_URL=https://qr.pivotit.cl`; `SUPABASE_SERVICE_ROLE_KEY` nunca en git (compliance pass) y `web/.env.local.example` versionable.
- ✔ Worker `pivotqr-worker` desplegado (vcard incluida, 2026-09-15): sirve `.vcf` para tipo vcard, redirige `302` para url, registra escaneos y `404` si el enlace no tiene destino. En vivo: `https://qr.pivotit.cl/` → `{"ok":true,...}`.
- ✔ Registro DNS `qr.pivotit.cl` (A proxied) + ruta `qr.pivotit.cl/*` → worker.
- ✔ Turnstile: sitio con hostname `qrapp.pivotit.cl` y keys en `web/.env.local` (secret validada con `siteverify`).
- ✔ Supabase Auth: Email + Google activos; URL Configuration con Site URL `https://qrapp.pivotit.cl` y redirect autorizado.
- ✔ Fase 1 codificada y mergeada a `develop`: login (correo + Google con Turnstile), proyectos, generador de `qr.pivotit.cl/XXXX` + QR descargable, contador en vivo y restyling del panel + landing pública. **Producción = `master`** (deploy por git). Commits: `4212069`, `c2af0f7`, `05daf50`, `bb69304`, `67f4996`, `3586499` (logo 3000×1000 + variante `bk`), `30a8ce9` (fix Turnstile + icono de Google).
- ✔ Vercel: proyecto `pivot-qr` en `alonso-figueroas-projects`, root `web`, variables de entorno en Production/Preview/Development, dominio `qrapp.pivotit.cl` y deployment en vivo; **Production Branch = `master`** (push a master → deploy Production).
- ✔ Vercel Analytics: `@vercel/analytics@2.0.1` + `<Analytics/>` en `web/src/app/layout.tsx`, desplegado y activo.
- ✔ Fase 2 (control de campaña): editar URL destino y pausar/activar sin reimprimir (`814ae23`).
- ✔ Fase 3 (reporte ejecutivo): dashboard público/privado con código, gráficos, polling y compartir; ampliado con filtros por rango de fechas, export CSV y log de escaneos (`a07e07a`, `e16a2e9`).
- ✔ Fase 4 (marca y lanzamiento): personalización de colores/estilos/logo, fundamentos UI/UX, galería con menú kebab, edición/eliminación suave y métricas en tres niveles (`b8aa40c`, `e9f0c85`, `e4db44c`).
- ✔ Tipos de QR: página de creación dedicada `/proyectos/[id]/nuevo` + selector de tipos (url/vcard activos; texto, email, llamada, SMS, wifi, evento "próximamente") + popup de confirmación con descarga PNG/SVG (`dd3b5f3`).
- ✔ Compliance: documentación Ley 21.719/21.595 generada (`97d5a8b`, `467cb6e`); pendiente implementación en la app (migración `0004_...`).
- ✖ Falta: la **prueba del "momento ajá" con teléfono** (contador 0→1 + ciudad/dispositivo) y del QR v-card (descarga del `.vcf`).

## Tutorial: pasos manuales (bloqueantes)

Dominios definidos: **`qr.pivotit.cl`** = enlaces cortos (worker, listo y en vivo, con soporte vcard) y **`qrapp.pivotit.cl`** = panel (Vercel, en vivo). No quedan pasos manuales de infraestructura; falta solo la **prueba del "momento ajá"** (sección 4). La **Production Branch** de Vercel quedó validada como `master` — ver sección 3. Las fases 2-4 y los tipos de QR ya están implementados (ver `08-roadmap.md`).

## 1. Supabase (base + login + almacenamiento)

- [x] Crear proyecto gratis en supabase.com.
- [x] Guardar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API). → en `web/.env.local`
- [x] Guardar la clave `service_role` (la misma pantalla) y completarla en `web/.env.local` (validada contra la API, HTTP 200) — solo para el servidor y el worker.
- [x] Ejecutar la migración inicial: `supabase/migrations/0001_init.sql` (tablas, RLS, Storage, realtime).
- [x] Activar email (confirmar correo opcional) y el proveedor Google en Authentication → Providers. Google Client ID creado; configurada la URI de redirect que indica Supabase (`https://mnjaelkdejlpjwtjzgpt.supabase.co/auth/v1/callback`).
- [x] Authentication → URL Configuration: Site URL = `https://qrapp.pivotit.cl` y redirect autorizado `https://qrapp.pivotit.cl/auth/confirmado`. Corregido y verificado por Management API (`config/auth`, 2026-09-05) — el `authorize` solo no sirve para validar (GoTrue valida hasta el callback).

## 2. Cloudflare (puente + anti-bots)

- [x] Crear cuenta gratis en cloudflare.com y añadir el dominio a la zona (DNS de `qr.pivotit.cl`). → la zona `pivotit.cl` ya existía (activa).
- [x] Desplegar el worker (`worker/`): subido por API con binding `SUPABASE_URL` y secreto `SUPABASE_SERVICE_ROLE_KEY` (sin usar wrangler CLI).
- [x] Ruta `qr.pivotit.cl/*` activa (registro DNS `qr` A proxied + route). `wrangler.toml` actualizado con la ruta real.
- [x] Probar `https://qr.pivotit.cl/<slug>` → `/` responde OK; slug desconocido → 404.
- [x] Crear sitio/keys de Cloudflare Turnstile (Dashboard → Turnstile) con hostname `qrapp.pivotit.cl` y completar `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` en `web/.env.local` (secret validada vía `siteverify`).
- [x] (Despliegue Vercel) las dos keys de Turnstile quedaron en las variables de entorno de producción (verificado: el widget carga en `/login` de `qrapp.pivotit.cl`).

## 3. Vercel (panel y reporte)

- [x] Importar el repositorio en vercel.com → proyecto `pivot-qr` en el equipo `alonso-figueroas-projects`, root `web`, framework Next.js.
- [x] Configurar variables de entorno (Production, Preview y Development; verificado con `vercel env ls`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_SHORT_URL` = `https://qr.pivotit.cl` (el enlace corto que verán los QR)
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`
- [x] Dominio `qrapp.pivotit.cl` asignado al proyecto (CNAME a `cname.vercel-dns.com` ya existía en la zona); en vivo: `https://qrapp.pivotit.cl/` → 200, `/login` carga Turnstile, `/auth/confirmado` redirige a `/login?error=sin-codigo` sin parámetros.
- [x] Vercel Analytics (Web Analytics): `@vercel/analytics@2.0.1` instalado con `pnpm`, `<Analytics/>` en `web/src/app/layout.tsx`, build + lint OK y desplegado a producción; activado por el usuario en el dashboard (2026-09-05), ya recibe datos. El endpoint `/_vercel/insights/script.js` sirve (200).
- [x] **Producción Branch:** validado empíricamente que la rama de producción es `master`: el push de `3586499` a `master` generó el deploy **Production** `pivot-926275143` (Ready, alias `qrapp.pivotit.cl`), y el push paralelo a `develop` generó el deploy **Preview** `pivot-5x8jswdat`. Cualquier publicación futura sale de `master`.

## 4. Prueba del "momento ajá"

- [ ] Crear cuenta, crear proyecto, pegar URL, generar.
- [ ] Descargar el QR (PNG o SVG) y escanearlo con el teléfono.
- [ ] Confirmar que el contador en el panel pasa de 0 a 1 y muestra ciudad/dispositivo.

## Verificar en los sitios oficiales

- Límites del plan gratuito de: Supabase (pausa por inactividad), Wrangler/Workers (peticiones/día), Turnstile (verificaciones), Vercel (uso mensual).