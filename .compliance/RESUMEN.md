# Postura de Cumplimiento — PIVOTQR (SOCIEDAD TECNOLÓGICA PIVOT IT SPA)

**Fecha:** 08-sep-2026 · **Commit:** e4db44c · **Marco activo:** Ley 21.719 (datos, vigencia 1-dic-2026) + Ley 21.595 (delitos económicos, ya vigente)

> **DISCLAIMER:** No constituye asesoría legal. Documentación generada con compliance-cl a partir del análisis de código y las respuestas del responsable. Un abogado es opcional; solo es imprescindible para la representación ante una fiscalización.

---

## Resumen de postura por marco

| Marco | Score | ✅ | ⚠️ | ❌ |
|---|---|---|---|---|
| **Ley 21.719** (datos personales) | 52% | 8 | 10 | 3 |
| **Ley 21.595** (delitos económicos) | 44% | 4 | 5 | 0 |

---

## Decisiones resueltas (aplicando el criterio de la ley)

- **¿Necesita DPO?** **No.** El DPO es obligatorio solo para organismos públicos o tratamiento masivo de datos sensibles (Art. 50). PivotQR no trata datos sensibles → el **dueño (Germán Figueroa) asume como responsable de datos**.
- **¿La EIPD es obligatoria?** **No.** No aplica ningún supuesto del Art. 15 ter (no hay perfiles, decisiones automatizadas, datos sensibles masivos, ni monitoreo de zonas públicas). Se dejó constancia en `docs/21719-eipd.md`.
- **¿Qué base de licitud?** Ejecución de contrato (cuenta) + interés legítimo del responsable (escaneos y seguridad). Consentimiento opt-in (Art. 12) para quienes se registran.
- **¿Qué mecanismo de transferencia?** Cláusulas contractuales modelo del Ministerio de Economía (Res. RAEX202503748) para Supabase, Cloudflare, Vercel y Google (EE.UU./global). Documentado en `docs/21719-anexo-transferencias.md`.
- **¿Encargado de prevención (21.595)?** Germán Figueroa (microempresa → el socio asume). Acta en `docs/21595-acta-encargado-prevencion.md`.

---

## Brechas prioritarias

### Críticas
1. **`.env.local` versionado en el repo** con credenciales (control `sec-secrets`). *Acción inmediata:* sacar del tracking y **rotar** las claves expuestas (Supabase, Turnstile, OIDC).
2. **Sin política de privacidad pública ni consentimiento** en el registro (controles `data-info`, `data-licitud`, `data-consent-text`). La documentación ya está en `docs/`; falta publicarla e integrar el checkbox.
3. **Sin derechos ARCO completos** (controles `data-derechos`): no hay export de datos, borrado de cuenta ni oposición implementados.

### Altas
4. **Sin retención de datos** — los escaneos se acumulan indefinidamente (control `data-minimizacion`). Implementar retención de 24 meses + anonimización.
5. **Sin MFA** en acceso (control `sec-mfa`).
6. **Sin audit log** de acciones de usuario (control `sec-logs`), clave para demostrar cumplimiento.

### Legales / organizacionales
7. **DPA y anexos de transferencia** con Supabase, Cloudflare, Vercel, Google: documentación lista, falta completar/firmar por proveedor.
8. **Supervisión externa anual del MPD** (Ley 21.595): único componente NO self-service; requiere un tercero independiente (~UF 3-5).
9. **Activar el canal de denuncias** (correo denuncias@pivotit.cl) y el plan de respuesta a brechas.

---

## Documentación generada en `.compliance/docs/`

### Ley 21.719
- `21719-rat.md` — Registro de Actividades de Tratamiento
- `21719-politica-privacidad.md` — Política de privacidad
- `21719-consentimiento.md` — Textos de consentimiento y avisos
- `21719-canal-derechos.md` — Canal de ejercicio de derechos
- `21719-dpa.md` — Contrato de tratamiento de datos (modelo)
- `21719-anexo-transferencias.md` — Transferencias internacionales
- `21719-plan-respuesta-brechas.md` — Plan de respuesta a brechas
- `21719-registro-vulneraciones.md` — Registro de vulneraciones
- `21719-eipd.md` — EIPD (no obligatoria, constancia)

### Ley 21.595
- `21595-modelo-prevencion-delitos.md` — Modelo de Prevención de Delitos
- `21595-codigo-etica.md` — Código de ética
- `21595-matriz-riesgos.md` — Matriz de riesgos
- `21595-acta-encargado-prevencion.md` — Acta de designación del Encargado
- `21595-reglamento-canal-denuncias.md` — Reglamento del canal de denuncias

---

## Próximos pasos (1 siguiente paso recomendado)
**Remediar la brecha crítica #1 ahora mismo:** sacar `.env.local` del repositorio y rotar las credenciales expuestas. A continuación, publicar la política de privacidad y añadir el checkbox de consentimiento al registro.

¿Quieres que realice las remediaciones de código (purgar `.env.local`, política + consentimiento en registro, MFA, retención de escaneos, audit log, endpoints ARCO) en una rama?
