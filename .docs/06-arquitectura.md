# PivotQR — Arquitectura

## Diagrama

```
        MUNDO EXTERNO                    TU STACK
┌────────────────────────────┐   ┌──────────────────────────────────┐
│ Persona escanea QR físico  │   │ Cloudflare Worker                │
│ con su teléfono            │──►│ qr.pivotit.cl/XXXX               │
│ (impreso o en pantalla)    │   │ anota: ciudad + dispositivo      │
│                            │   └──────────────┬───────────────────┘
│                            │                  │ guarda el escaneo
│                            │   ┌──────────────▼───────────────────┐
│ Admin/negocio entra al     │   │ Supabase (base de datos + login) │
│ panel (Next.js en Vercel)  │◄──┤ proyectos · enlaces · escaneos   │
│ y crea QR, edita, etc.     │   └──────────────┬───────────────────┘
│                            │                  │ datos en vivo
│ Cliente abre el reporte    │   ┌──────────────▼───────────────────┐
│ con su código de acceso    │◄──┤ App web (Next.js en Vercel)      │
│ y ve el dashboard          │   │ panel admin + vista del reporte  │
└────────────────────────────┘   └──────────────────────────────────┘
```

## Las piezas
- **Cloudflare Worker:** el portero del dominio corto. Atiende el escaneo en milisegundos, mide y redirige (o muestra "Campaña pausada").
- **Supabase:** el almacén: quién es cada usuario, qué proyectos tiene y cada escaneo que ocurrió. También sirve el login y los logos.
- **Next.js en Vercel:** la cara visible: el panel del negocio y la vista del reporte del cliente.
- **Librería QR en el navegador:** dibuja el código con color y logo antes de descargarlo.

## Recorrido de una acción real (el escaneo)
1. Alguien escanea el QR físico → el teléfono pide `qr.pivotit.cl/XXXX`.
2. El **Worker** recibe la visita, saca la ciudad (Cloudflare la provee gratis) y el dispositivo (del navegador), y lo **guarda en Supabase** como un escaneo.
3. Si la campaña está **activa**, responde redirigiendo a la URL destino (la persona nunca nota el puente). Si está **pausada**, muestra "Campaña pausada".
4. El dueño abre su panel —o el cliente su reporte con el código de acceso— y ve ese escaneo **sumado en vivo** al número gordo, el mapa y las gráficas.

## Decisiones
- **QR dinámico siempre:** el QR apunta al enlace corto, nunca a la URL final. Por eso el QR impreso sobrevive a cualquier cambio de destino. (El QR fijo, sin métricas, se descartó para V1.)
- **Geo gratis desde el borde:** Cloudflare entrega la ciudad en el Worker, evitando pagar un servicio de geolocalización.
- **Piezas separadas (Worker + app):** el puente vive en Cloudflare (mínimo tiempo de respuesta) y el panel en Vercel; no compiten entre sí y cada uno se escala solo.
- **Reporte en la misma app:** el reporte del cliente y el panel comparten la app Next.js; menos piezas que mantener.
- **Enlace con código, compartido a mano:** el V1 no envía correos; la invitación es un texto que se copia y pega en WhatsApp.