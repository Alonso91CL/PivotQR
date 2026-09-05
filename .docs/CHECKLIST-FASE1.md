# PivotQR — Checklist de despliegue para la Fase 1

Pasos en orden para poner en línea el "momento ajá". Verificar siempre los límites vigentes de los planes gratuitos en los sitios oficiales.

## 1. Supabase (base + login + almacenamiento)
- [ ] Crear proyecto gratis en supabase.com.
- [ ] Guardar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).
- [ ] Guardar la clave `service_role` (la misma pantalla) — solo para el servidor y el worker.
- [ ] Ejecutar la migración inicial: `supabase/migrations/0001_init.sql` (tablas, RLS, Storage, realtime).
- [ ] Activar email (confirmar correo opcional) y el proveedor Google en Authentication → Providers. Para Google hay que crear OAuth Client ID en Google Cloud y configurar la URI de redirect que indica Supabase.
- [ ] Dentro de Authentication → URL Configuration, poner la URL del sitio y el redirect de confirmación (`https://TU-SITIO/auth/confirmado`).

## 2. Cloudflare (puente + anti-bots)
- [ ] Crear cuenta gratis en cloudflare.com y añadir el dominio a la zona (DNS de `qr.pivotit.cl`).
- [ ] Desplegar el worker (`worker/`): `wrangler login`, `wrangler secret put SUPABASE_SERVICE_ROLE_KEY`, y subir `SUPABASE_URL` en `wrangler.toml`.
- [ ] Descomentar la ruta `qr.pivotit.cl/*` en `wrangler.toml` y desplegar.
- [ ] Importar el certificado SSL (lo resuelve Cloudflare en la zona) y probar `https://qr.pivotit.cl/<slug>`.
- [ ] Crear sitio/keys de Cloudflare Turnstile (Dashboard → Turnstile) y guardar Site Key + Secret Key.

## 3. Vercel (panel y reporte)
- [ ] Importar el repositorio en vercel.com.
- [ ] Configurar variables de entorno:
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