# PivotQR — Usuarios y roles

## Usuario principal
El dueño de una marca, el gerente de un restaurante o el organizador de un evento. Recibe de la agencia un QR impreso (o un enlace) y luego un reporte. No lee textos: al abrir el reporte sus ojos buscan el número más grande (¿funcionó o no?), luego el mapa de ciudades, después la gráfica de días/horas y por último la comparación de dispositivos ("iPhone vs Android").

## Usuarios secundarios
- El equipo de la agencia: crea proyectos, genera y personaliza los QRs, los descarga y entrega los reportes a los clientes.
- El público que escanea: no entra al sistema; solo recorre el puente en milisegundos sin saberlo.

## Quién paga
El cliente de la agencia, hoy dentro del servicio de la agencia. Más adelante (fuera de V1) se explorará suscripción directa al producto.

## Roles del sistema
En V1 hay **un solo rol y una cuenta = una persona**. No hay equipos ni permisos.

| Rol | Qué puede hacer | Qué no puede hacer |
|---|---|---|
| Usuario | Crear y gestionar sus proyectos, enlaces y QRs; ver sus métricas; compartir reportes | Ver o tocar proyectos de otro usuario |

## Recorrido principal
1. Entra al panel e inicia sesión (correo y contraseña o Google).
2. Crea un proyecto con nombre y descripción.
3. Pega la URL destino y genera el enlace corto + QR dinámico.
4. Personaliza el QR (colores y logo) y lo descarga en PNG o SVG.
5. Lo escanea con su teléfono y ve el contador pasar de 0 a 1 con su ciudad y dispositivo.
6. Comparte el reporte con su cliente (invitación con enlace y, si es privado, código de acceso).
7. El cliente abre el reporte y ve el impacto en vivo.