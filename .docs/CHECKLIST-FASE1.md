# PivotQR — Checklist de despliegue para la Fase 1

Pasos en orden para poner en línea el "momento ajá". Verificar siempre los límites vigentes de los planes gratuitos en los sitios oficiales.

## Estado actual (2026-09-05)

- ✔ Proyecto Supabase creado (`mnjaelkdejlpjwtjzgpt`), MCP conectado (supabase, cloudflare, vercel en `.opencode/opencode.json`).
- ✔ Migración `0001_init.sql` aplicada y advisors de seguridad/rendimiento en verde (solo INFO de índices sin uso, por tablas vacías).
- ✔ `.env.local` con URL + publishable key + `SUPABASE_SERVICE_ROLE_KEY` (validada, HTTP 200) + `NEXT_PUBLIC_SHORT_URL=https://qr.pivotit.cl`.
- ✔ Worker `pivotqr-worker` desplegado por API (módulos, binding `SUPABASE_URL`, secreto `SUPABASE_SERVICE_ROLE_KEY`). En vivo: `https://qr.pivotit.cl/` → `{"ok":true,"servicio":"pivotqr-worker"}`; slug desconocido → 404.
- ✔ Registro DNS `qr.pivotit.cl` (A proxied) + ruta `qr.pivotit.cl/*` → worker.
- ✔ Turnstile: sitio creado con hostname `qrapp.pivotit.cl` y keys completadas en `web/.env.local` (secret validada con `siteverify`).
- ✔ Supabase Auth: proveedores **Email** y **Google** activados (Google Client ID configurado; `authorize` responde 302 a `accounts.google.com` con `redirect_uri` = callback de Supabase).
- ✔ Supabase URL Configuration: Site URL `https://qrapp.pivotit.cl` y redirect autorizado `https://qrapp.pivotit.cl/auth/confirmado`. Ojo: aun con el frontend ya corregido, la config hosteada seguía con `site_url=http://localhost:3000` y `uri_allow_list` vacía, por lo que GoTrue caía a `localhost:3000/?code=` en el callback. El 2026-09-05 se leyó `config/auth` vía Management API (PAT) y se corrigió con `PATCH` → `site_url=https://qrapp.pivotit.cl` y `uri_allow_list=https://qrapp.pivotit.cl,http://localhost:3000`. Además, el frontend fija `NEXT_PUBLIC_SITE_URL=https://qrapp.pivotit.cl` y lo usa como `redirectTo` de OAuth/registro (desplegado en producción; el bundle de `/login` embebe la URL de producción).
- ✔ Fase 1 codificada y mergeada a `develop` (`4212069`, `c2af0f7`, `05daf50`): login (correo + Google con Turnstile), proyectos, generador de `qr.pivotit.cl/XXXX` + QR descargable, contador en vivo y restyling del panel + landing pública. Ramas: `develop` por defecto, `master` como mirror estable. **Producción = `master`** (deploy por git; `master` == `develop` == `bb69304`). El alias `qrapp.pivotit.cl` había quedado apuntando a un redeploy viejo de `master` (`05daf50`) que no tenía branding, analytics ni el redirect de OAuth; se reposicionó con el build corregido y `master` quedó sincronizado.
- ✔ Vercel: proyecto `pivot-qr` en `alonso-figueroas-projects`, root `web`, 6 variables de entorno en Production/Preview/Development, dominio `qrapp.pivotit.cl` asignado y deployment en vivo (lo levantó el dashboard; verificado el flujo de rutas).
- ✔ Vercel Analytics: paquete `@vercel/analytics@2.0.1` instalado y componente `<Analytics/>` en `web/src/app/layout.tsx`; desplegado a producción y **activo/receiving datos** (el usuario lo habilitó en el dashboard).
- ✖ Faltan: la prueba final del login de Google y del "momento ajá" con teléfono.

## Tutorial: pasos manuales (bloqueantes)

Dominios definidos: **`qr.pivotit.cl`** = enlaces cortos (worker, listo y en vivo) y **`qrapp.pivotit.cl`** = panel (Vercel, en vivo). No quedan pasos manuales de infraestructura; falta solo la **prueba del "momento ajá"** (sección 4) y, si se prefiere, fijar la **Production Branch** de Vercel a `master` (hoy queda en `develop`, el default, que es lo que generó el deployment actual — ver sección 3).

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
- [ ] **Producción Branch (decisión):** hoy el proyecto despliega desde `develop` (default de Vercel, que es lo que generó el deployment actual). Si se quiere que las publicaciones salgan desde `master`, fijarlo en Settings → Git (el CLI no expone esa opción). Mientras `develop` y `master` estén en el mismo commit, es indiferente.

## 4. Prueba del "momento ajá"

- [ ] Crear cuenta, crear proyecto, pegar URL, generar.
- [ ] Descargar el QR (PNG o SVG) y escanearlo con el teléfono.
- [ ] Confirmar que el contador en el panel pasa de 0 a 1 y muestra ciudad/dispositivo.

## Verificar en los sitios oficiales

- Límites del plan gratuito de: Supabase (pausa por inactividad), Wrangler/Workers (peticiones/día), Turnstile (verificaciones), Vercel (uso mensual).