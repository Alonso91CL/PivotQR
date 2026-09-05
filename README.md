# PivotQR

Plataforma de códigos QR dinámicos y enlaces cortos con métricas. Pegas una URL, obtienes un enlace corto y un QR que **no se rompe aunque cambie el destino**, y un reporte ejecutivo con el impacto real de cada campaña.

## Qué hace

- **QR dinámicos:** el QR apunta a un enlace corto (`qr.pivotit.cl/XXXX`), no a la URL final. Si cambias la URL destino, se edita en el panel y el código impreso sigue funcionando.
- **Métricas por escaneo:** ciudad, país, día y hora, dispositivo y sistema operativo de cada visita al enlace.
- **Reporte ejecutivo:** número total, mapa de ciudades, picos por día/hora y dispositivos, en una sola pantalla y actualizado en vivo, compartible con el cliente mediante una invitación con código de acceso.

## Estado

**Definido con MVP Forge el 05/09/2026 — sin código todavía.**

- Alcance V1 / Después de validar / Futuro: `.docs/03-mvp.md`
- Funcionalidades y criterios de terminado: `.docs/04-funcionalidades.md`
- Stack (costo inicial $0) y arquitectura: `.docs/05-stack.md` y `.docs/06-arquitectura.md`
- Roadmap y próxima fase: `.docs/08-roadmap.md`
- Documento completo: `.docs/PRD.md`

**Próxima fase:** Fase 1 — "El puente y el momento ajá": login → proyecto → pegar URL → generar enlace + QR → escanear → contador de 0 a 1 en vivo.

## Documentación

Toda la definición del proyecto vive en `.docs/`