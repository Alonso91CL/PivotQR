# PivotQR — Base de datos

## Entidades

### Usuarios
Manejado por Supabase Auth (registro/login con correo y Google). No creamos tabla propia.

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | asignado por Supabase |
| email | texto | único |
| proveedor | texto | email o Google |

### Proyectos
| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | |
| owner_id | ref usuarios | dueño |
| nombre | texto | |
| descripcion | texto | |
| reporte_publico | booleano | F9: público o privado |
| codigo_acceso | texto | si el reporte es privado |
| creado_en | timestamp | |

La miniatura del proyecto se genera al vuelo desde el QR de su primer enlace; no se guarda imagen extra.

### Enlaces (cada QR = un enlace)
| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | |
| proyecto_id | ref proyectos | |
| slug | texto único | el `qr.pivotit.cl/XXXX` |
| url_destino | texto | editable en caliente |
| pausado | booleano | activo por defecto |
| color_fondo | texto | F4 |
| color_patron | texto | F4 |
| estilo | texto | 2-3 estilos preestablecidos |
| logo_url | texto | archivo en Supabase Storage |
| creado_en | timestamp | |

### Escaneos
| Campo | Tipo | Notas |
|---|---|---|
| id | UUID | |
| enlace_id | ref enlaces | |
| ciudad | texto | del Worker (cf-ipcity) |
| region | texto | |
| pais | texto | del Worker (cf-ipcountry) |
| dispositivo | texto | móvil / desktop / tableta |
| so | texto | iOS / Android / etc. |
| fecha_utc | timestamp | se convierte al huso local en la vista |

## Relaciones
- Un usuario tiene muchos proyectos.
- Un proyecto tiene muchos enlaces.
- Un enlace tiene muchos escaneos.
- Los escaneos se suman por enlace (métrica individual) y por proyecto (métrica general).

## Reglas de acceso
Aplicadas en la propia base de datos (RLS de Supabase), no solo en la pantalla:
- **Proyectos y enlaces:** cada usuario solo puede leer, crear, editar y borrar los suyos.
- **Escaneos:** legibles por el dueño del enlace y por quien accede al reporte con su código de acceso (la lectura del reporte se autoriza a nivel de la API de la app, validando el código).
- **Perfil:** cada usuario solo puede editar su propia cuenta.
- Nada de acceder "a lo de otro" aunque se adivine el id: el RLS lo bloquea en la base de datos.

## Datos sensibles
- Se guardan métricas de navegación (ciudad, país, dispositivo, SO, fecha) sin identidad de la persona que escanea. No se guarda la IP ni datos personales del escaneador.
- El JWT de login y las claves de Supabase/Cloudflare van en variables de entorno del servidor, nunca en el frontend.
- Validación en el servidor en toda mutación (nunca confiar solo en lo que llega del cliente).
- Protección anti-bots (Cloudflare Turnstile) en registro y login.