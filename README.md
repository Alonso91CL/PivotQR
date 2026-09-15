# PivotQR

Plataforma de códigos QR dinámicos y enlaces cortos con métricas. Pegas una URL, obtienes un enlace corto y un QR que **no se rompe aunque cambie el destino**, y un reporte ejecutivo con el impacto real de cada campaña.

## Qué hace

- **QR dinámicos:** el QR apunta a un enlace corto (`qr.pivotit.cl/XXXX`), no a la URL final. Si cambias la URL destino, se edita en el panel y el código impreso sigue funcionando.
- **Métricas por escaneo:** ciudad, país, día y hora, dispositivo y sistema operativo de cada visita al enlace.
- **Reporte ejecutivo:** número total, mapa de ciudades interactivo con zoom/pan, picos por día/hora y dispositivos, en una sola pantalla y actualizado en vivo, compartible con el cliente mediante una invitación con código de acceso.

## Estado

**Fase 3 — Reporte ejecutivo:** en desarrollo.

Lo que ya funciona:

- ✔ Worker de Cloudflare desplegado: redirige `qr.pivotit.cl/<slug>`, registra ciudad (cabeceras `cf-ipcity`) y redirige en milisegundos.
- ✔ App web Next.js en **producción**: `https://qrapp.pivotit.cl` — login (correo + Google con Turnstile), proyectos, generador de enlace + QR con descarga PNG/SVG, y contador en vivo.
- ✔ Base de datos Supabase: migraciones aplicadas (tablas, RLS, Storage y realtime), advisors de seguridad en verde.
- ✔ Reporte ejecutivo con dashboard: gráficos de barras (países, ciudades, dispositivos, horarios), tabla rankeada y **mapa de escaneos interactivo**.
- ✔ Mapa interactivo: zoom con botones +/-, pan con drag, pinch-to-zoom en mobile, tooltips al hover, fronteras de países (world-atlas 110m), etiquetas dinámicas que se adaptan al nivel de zoom, colores de intensidad (azul→naranja→rojo).

**Ramas de git:** `develop` es la rama por defecto y la que se despliega; `master` se mantiene como mirror de versiones estables.

## Roadmap

- **Fase 1 — El puente y el momento ajá:** un QR que escaneas y el contador pasa de 0 a 1. *(completada)*
- **Fase 2 — Control de campaña:** editar la URL destino y activar/pausar con "Campaña pausada". *(completada)*
- **Fase 3 — Reporte ejecutivo:** dashboard completo del cliente con invitación por código. *(en desarrollo)*
- **Fase 4 — Marca y lanzamiento:** personalización del QR (colores y logo) y diseño final.

## Stack

Base de datos + login + archivos → **Supabase** · Puente (enlace corto + geo) → **Cloudflare Workers** · Panel y reporte → **Next.js + Tailwind en Vercel** · QR en el navegador → **`qrcode`** · Mapa → **d3-geo + world-atlas + topojson-client** · Anti-bots → **Cloudflare Turnstile** · Dominio → **`pivotit.cl`**.

## Repositorio

| Carpeta | Qué es |
|---|---|
| `web/` | App Next.js (panel, login, landing, reporte) |
| `worker/` | Worker de Cloudflare: enlace corto + métricas + redirección |
| `supabase/migrations/` | Esquema de base de datos (migraciones) |
| `.docs/` | Definición del producto (PRD, MVP, stack, roadmap) y grafo de conocimiento |

## Mapa de escaneos

El componente `MapaCalor` en `web/src/components/metricas/charts.tsx` renderiza un mapa interactivo con:

- **Proyección Mercator** con centro y escala calculados automáticamente desde los datos.
- **Fronteras de países** usando `world-atlas/countries-110m.json` (Natural Earth, dominio público).
- **Etiquetas de países** (~80 centroides) visibles según el área del mapa.
- **Etiquetas de ciudades** solo cuando el zoom es suficiente (scale ≥ 200).
- **Zoom:** botones +/−, pinch-to-zoom en mobile (rueda del mouse desactivada).
- **Pan:** drag con mouse o touch.
- **Tooltips:** info de ciudad y cantidad de escaneos al pasar el cursor/toque.
- **Colores:** interpolación RGB azul→naranja→rojo sin verde.
- **Mobile:** fuentes 1.6x más grandes, `touch-action: none` para bloquear scroll.

## Documentación

Toda la definición del proyecto vive en `.docs/`:

- Documento completo: `.docs/PRD.md`
- Alcance por tema: `.docs/01-resumen.md` a `.docs/08-roadmap.md`
- Grafo de conocimiento del código: `.docs/graphify-out/`