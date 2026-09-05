# PRD — PivotQR

Documento completo, para leer de corrido o compartir. Todas sus partes viven detalladas en `01-resumen.md` a `08-roadmap.md`.

_Fecha: 05 de septiembre de 2026. Definido con MVP Forge. Sin código todavía._

## 1. Resumen ejecutivo
PivotQR convierte una URL larga en un enlace corto y un código QR **dinámico** que mide cada escaneo y entrega un reporte ejecutivo del impacto. Negocios y creadores comparten información por cualquier canal (papel, WhatsApp, redes) y por fin ven en una sola pantalla si su campaña funcionó.

## 2. Problema y oportunidad
Quien imprime un QR o comparte un enlace necesita saber si su estrategia funcionó. Hoy resuelve eso saltando entre herramientas: una para el QR, otra para el enlace corto y otra para las métricas. El resultado son datos crudos y fragmentados que el dueño del negocio no entiende ni le sirven para decidir. PivotQR une creación + medición + reporte en un solo producto, con un reporte pensado para el dueño y no para el analista.

## 3. Usuarios y roles
- **Usuario principal:** dueños de marca, gerentes de restaurantes y organizadores de eventos — la persona que imprime el QR y quiere ver el impacto. Entra por el reporte: número grande, mapa, picos por día/hora, dispositivos.
- **Usuario secundario:** el equipo de la agencia que crea, personaliza y entrega los QRs y los reportes.
- **Quién paga:** hoy el cliente dentro del servicio de la agencia. Suscripciones se exploran después de validar.
- **Rol:** uno solo; una cuenta = una persona. Sin equipos ni permisos en V1.

## 4. Alcance del V1 y qué queda fuera
**V1 (9 funciones):** cuentas, proyectos, generador de enlace corto + QR dinámico, personalización del QR, descarga PNG/SVG, edición dinámica de la URL, activar/pausar, reporte en vivo, compartir por invitación con código.

**Fuera del V1 a propósito:** pagos/suscripciones, marca blanca, envío automático por email, PDF, QR fijo sin métricas, PWA, equipos/multi-usuario, dashboard global de la cuenta, API pública, IA, galería extensa de plantillas.

## 5. Funcionalidades detalladas
Cada función con prioridad y criterio de terminado en `04-funcionalidades.md`. Resumen: P0 para cuentas, proyectos, generador, descarga, edición dinámica, activar/pausar, reporte en vivo y compartir; P1 para personalización del QR.

## 6. Stack y costos
Supabase (base + login + archivos) · Cloudflare Workers (puente + geo) · Next.js + Tailwind en Vercel (app y reporte) · `qrcode` en el navegador · dominio propio `qr.pivotit.cl` · Cloudflare Turnstile (anti-bots).

**Costo total para empezar: $0** (dominio ya pagado). Detalle de cada pieza y por qué se eligió: `05-stack.md`.

## 7. Arquitectura
Diagrama y recorrido completo en `06-arquitectura.md`. Clave: la persona escanea → Cloudflare Worker registra ciudad/dispositivo en Supabase y redirige al destino (o muestra "Campaña pausada") → el reportero ve los datos sumados en vivo. El QR impreso nunca se rompe porque apunta al enlace corto, no a la URL final.

## 8. Modelo de datos y reglas de acceso
Entidades: proyectos, enlaces y escaneos (los usuarios los maneja Supabase Auth). Detalle en `07-base-de-datos.md`. Regla central: **cada usuario accede solo a lo suyo**, aplicada con RLS en la base de datos, no solo en la pantalla. El reporte privado se protege con código de acceso.

## 9. Seguridad
- Reglas de acceso (RLS) en la base de datos.
- Validación en el servidor en toda mutación.
- Claves y secretos en variables de entorno, nunca en el frontend.
- Protección anti-bots (Cloudflare Turnstile) en registro y login.
- No se guarda la IP ni identidad del escaneador; solo métricas agregables (ciudad, país, dispositivo, SO, fecha).

## 10. Roadmap
- **Fase 1 (PRÓXIMA):** el puente — QR que escaneas y el contador pasa de 0 a 1.
- **Fase 2:** control de campaña — editar URL destino y pausar/activar.
- **Fase 3:** reporte ejecutivo — dashboard completo + compartir con código.
- **Fase 4:** marca y lanzamiento — personalización del QR, diseño final y primer cliente real.

## 11. Riesgos y supuestos
- **Se asume** que el plan gratuito de los tres servicios aguanta el uso inicial; verificar límites vigentes en cada sitio oficial porque cambian seguido.
- **Riesgo:** el plan de Supabase puede pausar el proyecto por inactividad — planear tarea de "heartbeat" o aceptar pagar el plan más bajo cuando haya uso real.
- **Riesgo:** bots pueden ensuciar el número gordo — filtrado de bots anotado como mejora post-validación, no bloquea el V1.
- **Supuesto:** las horas del reporte se muestran en el huso de quien lo ve; si luego se prefiere fijar huso por campaña, es un ajuste menor.
- **Decisión abierta:** licencia. Se elige MIT por simplicidad; antes de abrir con planes de pago, revisar una licencia "source-available" (tipo AGPL o anti-marka-blanca) para proteger la comercialización.

## 12. Cómo sabremos que funcionó
- Un cliente real recibe su QR con su logo, lo escanea y **ve su reporte sin asistencia** del equipo.
- El dueño de la campaña entiende el reporte sin que se lo expliquen: el número gordo responde "¿funcionó?".
- La edición dinámica se usa de verdad: un QR impreso sobrevive a un cambio de URL sin reimprimir.
- Señal de validación para agregar planes de pago: clientes que piden marca blanca o reportes automáticos.