# PivotQR

Plataforma de códigos QR dinámicos y enlaces cortos con métricas. Pegas una URL, obtienes un enlace corto y un QR que **no se rompe aunque cambie el destino**, y un reporte ejecutivo con el impacto real de cada campaña.

## Qué hace

- **QR dinámicos:** el QR apunta a un enlace corto (`qr.pivotit.cl/XXXX`), no a la URL final. Si cambias la URL destino, se edita en el panel y el código impreso sigue funcionando.
- **Métricas por escaneo:** ciudad, país, día y hora, dispositivo y sistema operativo de cada visita al enlace.
- **Reporte ejecutivo:** número total, mapa de ciudades, picos por día/hora y dispositivos, en una sola pantalla y actualizado en vivo, compartible con el cliente mediante una invitación con código de acceso.

## Estado

**Fase 1 — "El puente y el momento ajá":** definida y ya codificada (2026-09-05). El código vive en este repo; el puente de enlaces cortos está en vivo en `https://qr.pivotit.cl`.

Lo que ya funciona:

- ✔ Worker de Cloudflare desplegado: redirige `qr.pivotit.cl/<slug>`, registra ciudad (cabeceras `cf-ipcity`) y redirige en milisegundos. En vivo: `https://qr.pivotit.cl/`.
- ✔ App web Next.js en **producción**: `https://qrapp.pivotit.cl` — login (correo + Google con Turnstile), proyectos, generador de enlace + QR con descarga PNG/SVG, y contador en vivo del "momento ajá". Verificado: `/login` carga Turnstile y `/auth/confirmado` redirige bien.
- ✔ Base de datos Supabase: proyecto creado y migración `0001_init.sql` aplicada (tablas, RLS, Storage y realtime), advisors de seguridad en verde.

Pasos manuales pendientes:

- ✔ Supabase: proveedores Email y Google activados y Site URL `https://qrapp.pivotit.cl` + redirect `/auth/confirmado` autorizado.
- ✔ Turnstile: sitio y keys creados y en producción.
- ✔ Vercel: proyecto con las 6 variables de entorno y el dominio `qrapp.pivotit.cl` en vivo.
- ✖ Resta la prueba del "momento ajá" de punta a punta: cuenta → proyecto → pegar URL → generar QR → escanear → contador 0→1.

**Ramas de git:** `develop` es la rama por defecto y la que se despliega; `master` se mantiene como mirror de versiones estables.

## Roadmap

- **Fase 1 — El puente y el momento ajá:** un QR que escaneas y el contador pasa de 0 a 1. *(en producción en `qrapp.pivotit.cl`; falta validar el flujo con el teléfono)*
- **Fase 2 — Control de campaña:** editar la URL destino y activar/pausar con "Campaña pausada".
- **Fase 3 — Reporte ejecutivo:** dashboard completo del cliente con invitación por código.
- **Fase 4 — Marca y lanzamiento:** personalización del QR (colores y logo) y diseño final.

Detalle: `.docs/08-roadmap.md`.

## Stack

Base de datos + login + archivos → **Supabase** · Puente (enlace corto + geo) → **Cloudflare Workers** · Panel y reporte → **Next.js + Tailwind en Vercel** · QR en el navegador → **`qrcode`** · Anti-bots → **Cloudflare Turnstile** · Dominio → **`pivotit.cl`**. Costo inicial $0 (detalle en `.docs/05-stack.md`).

## Repositorio

| Carpeta | Qué es |
|---|---|
| `web/` | App Next.js (panel, login, landing) |
| `worker/` | Worker de Cloudflare: enlace corto + métricas + redirección |
| `supabase/migrations/` | Esquema de base de datos (migraciones) |
| `.docs/` | Definición del producto (PRD, MVP, stack, roadmap) y grafo de conocimiento |

## Documentación

Toda la definición del proyecto vive en `.docs/`:

- Documento completo: `.docs/PRD.md`
- Alcance por tema: `.docs/01-resumen.md` a `.docs/08-roadmap.md`
- Despliegue paso a paso: `.docs/CHECKLIST-FASE1.md`
- Grafo de conocimiento del código (para búsquedas por arquitectura): `.docs/graphify-out/`