# PivotQR

Plataforma de códigos QR dinámicos y enlaces cortos con métricas: pegas una URL, obtienes un QR que no se rompe aunque cambie el destino, y un reporte ejecutivo que muestra el impacto real de cada campaña.

## Documentación

Toda la definición del proyecto está en `.docs/`:

```
.docs/
├── 01-resumen.md          Qué es y qué problema resuelve
├── 02-usuarios.md         Para quién es y quién paga
├── 03-mvp.md              Alcance V1 / Después de validar / Futuro
├── 04-funcionalidades.md  Funciones de V1 con criterio de terminado
├── 05-stack.md            Stack FREE-FIRST y costos
├── 06-arquitectura.md     Cómo se conecta todo
├── 07-base-de-datos.md    Entidades y reglas de acceso
├── 08-roadmap.md          Fases y próxima fase
├── PRD.md                 Documento completo
├── INICIAR-DESARROLLO.md  Prompt para empezar a construir
└── CHECKLIST-FASE1.md     Estado del despliegue en producción
```

## Estado

**En producción.** Fases 1-4 implementadas (puente y momento ajá, control de campaña, reporte ejecutivo, marca y lanzamiento) y tipos de QR (url/vcard) con página de creación dedicada. En vivo en `qr.pivotit.cl` (worker) y `qrapp.pivotit.cl` (panel). Próxima fase: tipos de QR restantes y cumplimiento en la app (ver `08-roadmap.md`).

- Panel (Vercel): `https://qrapp.pivotit.cl`
- Enlaces cortos (Cloudflare Worker): `https://qr.pivotit.cl/<slug>`
- Backend + Auth + DB: Supabase (`mnjaelkdejlpjwtjzgpt`)
- Producción = rama `master` (deploy automático por git); desarrollo en `develop`.