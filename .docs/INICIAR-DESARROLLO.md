# PivotQR — Iniciar desarrollo

## Cómo usar este archivo
Pega el bloque de abajo en Claude Code, Codex o Cursor para construir la primera fase. Lee antes `PRD.md`.

## Prompt

---
Voy a construir PivotQR: una plataforma que convierte una URL en un enlace corto y un QR dinámico que mide cada escaneo y muestra el impacto en un reporte ejecutivo.

Documentación completa en `.docs/`. **Lee `PRD.md` antes de empezar.**

**Stack:** Supabase (base + login + storage) · Cloudflare Workers (enlace corto `qr.pivotit.cl` + redirección + geo) · Next.js + Tailwind en Vercel · librería `qrcode` en el navegador · Cloudflare Turnstile (anti-bots).

**Dominio:** `qr.pivotit.cl` — los enlaces cortos del proyecto usan este subdominio.

**Fase 1 (la única que se construye):** "El puente y el momento ajá".
Entregable: un QR que escaneas y el contador pasa de 0 a 1.

Funciones de esta fase:
- Cuentas — registro y login con correo+contraseña y con Google (Supabase Auth), con protección anti-bots (Turnstile). Listo cuando: un usuario nuevo crea su cuenta y entra viendo su panel vacío en menos de 2 minutos.
- Proyectos — crear (nombre + descripción) y listar en tabla. Listo cuando: creo un proyecto, queda listado y se abre.
- Generador — pegar URL → slug único `qr.pivotit.cl/XXXXXX` + QR que apunta al slug. Listo cuando: pego una URL, genero, escaneo y llego a la URL original en menos de 3 segundos contando la visita.
- Descarga PNG/SVG — del QR simple. Listo cuando: con un clic se descarga el archivo y se ve como quedó configurado.
- Worker de redirección — registra la visita en Supabase (ciudad por `cf-ipcity`, país por `cf-ipcountry`, dispositivo y SO) y redirige. Listo cuando: el escaneo queda guardado.
- Contador en vivo — el panel muestra el número de escaneos sumándose sin recargar. Listo cuando: escaneo y el contador pasa de 0 a 1 en pantalla.

Reglas:
- Solo la Fase 1. Nada de lo que está en "Después de validar" o "Futuro" de `03-mvp.md`. Nada de: pagos, marca blanca, email automático, PDF, QR fijo, PWA, plantillas, IA.
- Reglas de acceso en la base de datos desde el principio (RLS: cada usuario solo ve/toca lo suyo).
- Validación en el servidor en toda mutación.
- Secretos en variables de entorno, nunca en el frontend.
- No se guarda la IP ni datos personales del escaneador.
- Hora de escaneo guardada en UTC.
- Antes de crear archivos, muéstrame el plan.

Parte proponiéndome la estructura de carpetas.
---

## Antes de empezar
- [ ] Cuentas creadas en Supabase, Vercel y Cloudflare (planes gratuitos)
- [ ] Dominio `qr.pivotit.cl` configurado en Cloudflare (DNS) y verificado
- [ ] Repositorio creado (GitHub) y conectado a Vercel
- [ ] Proyecto de Supabase creado con Auth (email + Google), base de datos y Storage
- [ ] Variables de entorno definidas (URLs y claves de Supabase, token de Cloudflare)
- [ ] Verificados los límites vigentes de los planes gratuitos en sus sitios oficiales