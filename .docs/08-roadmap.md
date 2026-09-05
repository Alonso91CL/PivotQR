# PivotQR — Roadmap

## Fase 1 — "El puente y el momento ajá"
- **Entregable:** un QR que escaneas y el contador pasa de 0 a 1.
- **Incluye:** cuentas (correo + Google, con anti-bots Turnstile), proyectos, generador de `qr.pivotit.cl/XXXX` + QR simple con descarga PNG/SVG, Worker que mide y redirige, contador en vivo.
- **Listo cuando:** creo un proyecto, genero, escaneo con mi teléfono, y el panel muestra "1 escaneo".

## Fase 2 — "Control de campaña"
- **Entregable:** un QR impreso que sigue funcionando aunque cambie su destino.
- **Incluye:** edición dinámica de la URL destino, activar/pausar con "Campaña pausada".
- **Listo cuando:** cambio la URL y el escaneo va a la nueva; pauso y muestra el mensaje.

## Fase 3 — "Reporte ejecutivo"
- **Entregable:** el cliente abre su dashboard completo con su código de acceso.
- **Incluye:** número gordo, mapa, gráfica de días/horas, dispositivos (reporte en vivo), compartir público/privado con "Copiar invitación".
- **Listo cuando:** el cliente entra con su invitación y ve el reporte actualizándose en vivo.

## Fase 4 — "Marca y lanzamiento"
- **Entregable:** el panel listo para mostrarle a un primer cliente de verdad.
- **Incluye:** personalización del QR (colores y logo), diseño final del panel, prueba integral.
- **Listo cuando:** un cliente real recibe su QR con su logo, escanea y ve su reporte sin asistencia tuya.

## PRÓXIMA FASE
**Fase 1 — "El puente y el momento ajá".** Es lo que hay que construir mañana. Nada de las fases 2-4 antes de que esto funcione de punta a punta.

## Primeros pasos concretos
1. Crear el repositorio y las cuentas gratuitas de Supabase, Vercel y Cloudflare.
2. Configurar el dominio `qr.pivotit.cl` en Cloudflare (DNS) y vincular las cuentas a GitHub.
3. Construir el flujo mínimo: login → proyecto → pegar URL → generar slug + QR → escanear → ver "1 escaneo" en vivo.