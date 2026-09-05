# PivotQR — Checklist de despliegue para la Fase 1

Pasos en orden para poner en línea el "momento ajá". Verificar siempre los límites vigentes de los planes gratuitos en los sitios oficiales.

## Estado actual (2026-09-05)
- ✔ Proyecto Supabase creado (`mnjaelkdejlpjwtjzgpt`), MCP conectado (supabase, cloudflare, vercel en `.opencode/opencode.json`).
- ✔ Migración `0001_init.sql` aplicada y advisors de seguridad/rendimiento en verde (solo INFO de índices sin uso, por tablas vacías).
- ✔ `.env.local` creado con URL + publishable key + `SUPABASE_SERVICE_ROLE_KEY` (validada, HTTP 200).
- ✔ Fase 1 comiteada y mergeada a `develop` (`4212069`).
- ✔ `wrangler.toml` con el `SUPABASE_URL` real (rama `feature/deploy-fase-1`).
- ✔ Worker `pivotqr-worker` desplegado por API en tu cuenta (módulos, binding `SUPABASE_URL`, secreto `SUPABASE_SERVICE_ROLE_KEY`).
- ✔ Registro DNS `qr.pivotit.cl` (A proxied) + ruta `qr.pivotit.cl/*` → worker. En vivo: `https://qr.pivotit.cl/` responde `{"ok":true,"servicio":"pivotqr-worker"}` y un slug desconocido da 404.
- ✖ Lo que sigue NO tiene vía por MCP → requiere acción manual (ver "Pasos manuales").

## Tutorial: pasos manuales (bloqueantes)
Quedan solo 3 áreas manuales; las demás ya están hechas. Necessitas hacer tú (una vez):
1. Supabase dashboard → Authentication → Providers: activar **Email** y **Google**. Para Google: crear OAuth Client ID en Google Cloud y copiar la URI de redirect que muestra Supabase.
2. Supabase dashboard → Authentication → URL Configuration: pegar la URL del sitio y el redirect `/auth/confirmado`.
3. Cloudflare dashboard → Turnstile → crear sitio `PivotQR` y pasar Site Key + Secret Key (la API no expone ese endpoint). Luego yo las pongo en `web/.env.local` y en Vercel.
4. Vercel dashboard → importar el repo `Alonso91CL/PivotQR` (o darme tu team slug/ID) y crear las 6 variables de entorno (o pasarme un token API para hacerlo yo).

## 1. Supabase (base + login + almacenamiento)
- [x] Crear proyecto gratis en supabase.com.
- [x] Guardar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API). → en `web/.env.local`
- [x] Guardar la clave `service_role` (la misma pantalla) y completarla en `web/.env.local` (validada contra la API, HTTP 200) — solo para el servidor y el worker.
- [x] Ejecutar la migración inicial: `supabase/migrations/0001_init.sql` (tablas, RLS, Storage, realtime).
- [ ] Activar email (confirmar correo opcional) y el proveedor Google en Authentication → Providers. Para Google hay que crear OAuth Client ID en Google Cloud y configurar la URI de redirect que indica Supabase.
- [ ] Dentro de Authentication → URL Configuration, poner la URL del sitio y el redirect de confirmación (`https://TU-SITIO/auth/confirmado`).

## 2. Cloudflare (puente + anti-bots)
- [x] Crear cuenta gratis en cloudflare.com y añadir el dominio a la zona (DNS de `qr.pivotit.cl`). → la zona `pivotit.cl` ya existía (activa).
- [x] Desplegar el worker (`worker/`): subido por API con binding `SUPABASE_URL` y secreto `SUPABASE_SERVICE_ROLE_KEY` (sin usar wrangler CLI).
- [x] Ruta `qr.pivotit.cl/*` activa (registro DNS `qr` A proxied + route). `wrangler.toml` actualizado con la ruta real.
- [x] Probar `https://qr.pivotit.cl/<slug>` → `/` responde OK; slug desconocido → 404.
- [ ] Crear sitio/keys de Cloudflare Turnstile (Dashboard → Turnstile) y completar `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` en `web/.env.local`.

## 3. Vercel (panel y reporte)
- [ ] Importar el repositorio en vercel.com (raíz, framework detectado Next.js).
- [ ] Configurar variables de entorno (producción):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_SHORT_URL` = `https://qr.pivotit.cl` (el enlace corto que verán los QR)
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`
- [ ] Asignar el dominio de la app (ej. `pivotqr.cl`) si aplica.

## 4. Prueba del "momento ajá"
- [ ] Crear cuenta, crear proyecto, pegar URL, generar.
- [ ] Descargar el QR (PNG o SVG) y escanearlo con el teléfono.
- [ ] Confirmar que el contador en el panel pasa de 0 a 1 y muestra ciudad/dispositivo.

## Verificar en los sitios oficiales
- Límites del plan gratuito de: Supabase (pausa por inactividad), Wrangler/Workers (peticiones/día), Turnstile (verificaciones), Vercel (uso mensual).