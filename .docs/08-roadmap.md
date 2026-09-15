# PivotQR — Roadmap

## Fase 1 — "El puente y el momento ajá" ✅ (2026-09-05, commits `4212069`→`bb69304`)
- **Entregable:** un QR que escaneas y el contador pasa de 0 a 1.
- **Incluye:** cuentas (correo + Google, con anti-bots Turnstile), proyectos, generador de `qr.pivotit.cl/XXXX` + QR simple con descarga PNG/SVG, Worker que mide y redirige, contador en vivo.
- **Estado:** desplegada en producción (`qrapp.pivotit.cl` en Vercel, `qr.pivotit.cl` en Cloudflare). **Prueba del "momento ajá" con teléfono realizado (2026-09-15):** contador 0→1 con ciudad/dispositivo y QR v-card descargando el `.vcf`.

## Fase 2 — "Control de campaña" ✅ (commit `814ae23`)
- **Entregable:** un QR impreso que sigue funcionando aunque cambie su destino.
- **Incluye:** edición dinámica de la URL destino, activar/pausar con "Campaña pausada".
- **Estado:** implementada y en producción.

## Fase 3 — "Reporte ejecutivo" ✅ (commit `a07e07a`)
- **Entregable:** el cliente abre su dashboard completo con su código de acceso.
- **Incluye:** número gordo, mapa, gráfica de días/horas, dispositivos (reporte en vivo), compartir público/privado con "Copiar invitación".
- **Estado:** implementada; ampliada con filtros por rango de fechas, export CSV y log de escaneos (`e16a2e9`).

## Fase 4 — "Marca y lanzamiento" ✅ (commits `b8aa40c`, `e9f0c85`, `e4db44c`)
- **Entregable:** el panel listo para mostrarle a un primer cliente de verdad.
- **Incluye:** personalización del QR (colores, estilos y logo), diseño final del panel, prueba integral.
- **Estado:** implementada; galería con menú kebab, edición/eliminación suave y métricas en tres niveles.

## Post-lanzamiento agregado
- **Tipos de QR (v-card)** ✅ (commit `dd3b5f3`): QR de tarjeta de contacto que sirve un `.vcf` al escanear; selector de tipos con url/vcard activos y 6 más "próximamente"; página de creación dedicada `/proyectos/[id]/nuevo` con popup de confirmación y descarga PNG/SVG.
- **Compliance Ley 21.719 / 21.595** (commits `97d5a8b`, `467cb6e`): documentación legal generada con la skill `compliance-cl`; pendiente la implementación en la app (consentimiento, canal de derechos, migración `0004_...`).

## PRÓXIMA FASE
**Fase 5 — "Tipos de QR y cumplimiento en la app"**. Habilitar los tipos "próximamente" (texto, email, llamada, SMS, wifi, evento) y llevar la documentación de cumplimiento a la aplicación (consentimiento en registro, política de privacidad, migración `0004_consentimiento` para la vigencia de la Ley 21.719 en dic-2026).

## Primeros pasos concretos
1. Habilitar los tipos de QR restantes (texto, email, llamada, SMS, wifi, evento) en el selector y en el worker.
2. Implementar compliance en la app: consentimiento de datos personales en registro, política de privacidad, canal de derechos (RDAT) y migración `0004_consentimiento`.