# PivotQR — Alcance del MVP

## Criterio de corte
Una función entra a V1 solo si, sin ella, el producto no le sirve a nadie.

## V1 imprescindible
- [x] **Cuentas** — registro y login simple (correo + contraseña o Google), una cuenta = una persona. Sin cuentas no hay "lo tuyo" ni reportes a tu nombre.
- [x] **Proyectos** — crear y listar proyectos. Sin proyectos no hay dónde organizar campañas.
- [x] **Generador** — pegar URL → enlace corto (`qr.pivotit.cl/XXXX`) + QR dinámico. Es el corazón del producto.
- [x] **Personalización del QR** — colores, logo al centro y un estilo preestablecido. Sin esto el QR no se ve de la marca.
- [x] **Descarga** — QR en PNG (sin fondo) y SVG, listo para imprenta. Sin esto el QR no llega al mundo real.
- [x] **Edición dinámica** — cambiar la URL destino sin reimprimir. Es la promesa central del QR dinámico.
- [x] **Activar/Pausar** — apagar el puente y mostrar "Campaña pausada" en vez de redirigir.
- [x] **Reporte en vivo** — número total grande, mapa de ciudades, gráfica de días/horas y dispositivos, actualizado en tiempo real, protegido con código de acceso. Es la segunda mitad de la propuesta de valor.
- [x] **Compartir** — botón "Copiar invitación" que genera el mensaje con el enlace del reporte (y el código de acceso si es privado) para pegarlo en WhatsApp.

## Después de validar
- **Marca blanca** (logo y colores del cliente en el reporte) — el clásico gancho de un plan superior cuando el cliente ya probó el valor. Se avisa cuando un cliente pagante lo pida.
- **Planes de pago y suscripciones** (gratis limitado + dos planes + plan personalizado, ≤$10 y ≤$20 aprox.) — primero validar uso real.
- **QR fijo sin métricas** — una segunda vía de generación que nadie pidió todavía.
- **Envío automático por email/WhatsApp** del reporte — requiere piezas de correo/mensajería; primero compartir manual.
- **Exportación PDF del reporte** — el reporte HTML en vivo cubre el V1.
- **PWA** (instalación y uso offline) — el reporte necesita internet.
- **Dashboard global de la cuenta** con totales agregados — pantalla nueva que sirve cuando haya campañas acumuladas.
- **Equipos / multi-usuario bajo una cuenta** — hoy una cuenta = una persona.

## Futuro
- **IA y análisis predictivo** — visión del usuario, no necesaria para validar.
- **API pública** — para integrarse con otros sistemas.
- **Galería grande de plantillas de diseño** — en V1 solo 2 o 3 estilos preestablecidos.
- **Filtrado de bots en métricas** — para no ensuciar el número gordo.

## Qué NO hace este MVP
- No cobra ni tiene planes de pago.
- No envía correos ni mensajes automáticos.
- No exporta PDF.
- No ofrece QR fijo sin métricas.
- No tiene marca blanca.
- No tiene PWA ni uso offline.
- No tiene equipos, roles ni multi-usuario.
- No tiene dashboard de totales por cuenta.
- No tiene IA.
- No tiene API pública.
- No tiene galería extensa de plantillas.