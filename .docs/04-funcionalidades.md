# PivotQR — Funcionalidades del V1

## Cuentas (registro y login) — P0
- **Objetivo:** que el usuario pueda crear su cuenta e iniciar sesión.
- **Usuario:** el dueño de marca / equipo de la agencia.
- **Resultado:** registro con correo + contraseña o con Google, y login con cualquiera de los dos.
- **Dependencias:** Supabase Auth (email + OAuth Google) y protección anti-bots en el registro.
- **Terminado cuando:** un usuario nuevo crea su cuenta por cualquiera de los dos métodos e inicia sesión viendo su panel vacío en menos de 2 minutos, sin errores.

## Proyectos — P0
- **Objetivo:** organizar los enlaces y QRs por campaña.
- **Usuario:** el equipo de la agencia.
- **Resultado:** crear un proyecto con nombre, descripción y miniatura; listarlo en la tabla; abrirlo para crear sus enlaces/QRs.
- **Dependencias:** Cuentas.
- **Terminado cuando:** con un clic en "Nuevo proyecto" se crea con nombre y descripción, queda listado en la tabla y se abre pudiendo crear su primer enlace.

## Generador (URL → enlace corto + QR dinámico) — P0
- **Objetivo:** convertir una URL larga en un puente corto y medible.
- **Usuario:** el equipo de la agencia.
- **Resultado:** pegar la URL → PivotQR crea `qr.pivotit.cl/XXXXXX` y genera el QR que apunta a ese puente (el QR nunca apunta a la URL final).
- **Dependencias:** dominio `qr.pivotit.cl` configurado en Cloudflare y el Worker de redirección.
- **Terminado cuando:** pego una URL, genero, y el QR escaneado me lleva a la URL original en menos de 3 segundos, contando el escaneo como visita.

## Personalización del QR — P1
- **Objetivo:** que el QR se vea de la marca sin reimprimir.
- **Usuario:** el equipo de la agencia.
- **Resultado:** elegir colores (color picker), logo al centro y uno de 2-3 estilos preestablecidos; al generar, el QR sale así y queda listo para descargar.
- **Dependencias:** librería de QRs en el navegador (color y logo) + Supabase Storage para el logo.
- **Terminado cuando:** cambio color de fondo y de patrón + logo al centro, genero, y el QR escaneado funciona igual de bien que sin personalizar.

## Descarga del QR — P0
- **Objetivo:** entregar el activo imprimible.
- **Usuario:** el equipo de la agencia.
- **Resultado:** clic en "Descargar" → baja el archivo (PNG sin fondo o SVG) exactamente con la configuración elegida, listo para la imprenta.
- **Dependencias:** Generador y Personalización del QR.
- **Terminado cuando:** con un clic se descarga el archivo en el formato elegido y al abrirlo se ve como quedó configurado (colores, logo, estilo).

## Edición dinámica de la URL destino — P0
- **Objetivo:** corregir o cambiar la URL destino sin reimprimir.
- **Usuario:** el equipo de la agencia.
- **Resultado:** editar la URL de un enlace y guardar; el escaneo del QR o el clic al enlace corto pasa a redirigir a la nueva dirección al instante.
- **Dependencias:** Generador.
- **Terminado cuando:** cambio la URL destino, guardo, escaneo el mismo QR físico y llego a la nueva dirección.

## Activar / Pausar campaña — P0
- **Objetivo:** controlar el tráfico de una campaña.
- **Usuario:** el equipo de la agencia.
- **Resultado:** al pausar, el escaneo del QR o el clic al enlace corto deja de redirigir y muestra "Campaña pausada"; al activarla, vuelve a redirigir. Los escaneos siguen registrándose igual.
- **Dependencias:** Generador.
- **Terminado cuando:** pauso la campaña, escaneo y veo el mensaje; la reactivo, escaneo y redirige normal.

## Reporte en vivo (dashboard del cliente) — P0
- **Objetivo:** que el cliente vea el impacto de su campaña en una sola pantalla.
- **Usuario:** el cliente del negocio / la agencia.
- **Resultado:** con el código de acceso entra a un dashboard ordenado por importancia: número gordo → mapa → gráfica de días/horas → dispositivos; cada nuevo escaneo aparece en vivo, sin recargar. Horas en el huso del que ve el reporte (guardado en UTC).
- **Dependencias:** Generador, escaneos registrados por el Worker, y el modelo Compartir (público/privado).
- **Terminado cuando:** el cliente entra con su código, ve el dashboard ordenado y al escanear de nuevo el contador y la gráfica se actualizan solos en pantalla.

## Compartir el reporte — P0
- **Objetivo:** entregar el reporte al cliente de un clic.
- **Usuario:** el equipo de la agencia.
- **Resultado:** elegir si el reporte es **público** (enlace directo) o **privado** (enlace + código de acceso), y apretar **"Copiar invitación"**: si es público copia un texto corto con el enlace; si es privado, copia el enlace + el código para pegarlos en WhatsApp. Sin envío automático.
- **Dependencias:** Reporte en vivo.
- **Terminado cuando:** aprieto "Copiar invitación" en ambos modos, pego en un chat, y en el privado el mensaje incluye enlace + código con el que el receptor puede ver el reporte.