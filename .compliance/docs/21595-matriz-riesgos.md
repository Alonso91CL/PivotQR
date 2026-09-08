# Matriz de Riesgos de Delitos — SOCIEDAD TECNOLÓGICA PIVOT IT SPA

**Fecha:** 2026-09-08 · **Versión:** 1.0 · **Responsable:** Germán Figueroa (Encargado de Prevención)

> Identifica, por proceso, dónde puede ocurrir un delito de la Ley 21.595, su nivel de riesgo y el control que lo mitiga. Actualizar al menos anualmente.

| Proceso | Delito potencial | Probabilidad | Impacto | Nivel | Control mitigante | Control técnico (id) | Estado |
|---|---|---|---|---|---|---|---|
| Acceso a sistemas y datos de clientes | Delitos informáticos | Media | Alto | Alto | MFA opcional a futuro + logs + RLS por tenant + mínimo privilegio | `sec-mfa`, `sec-logs`, `sec-tenant` | ⚠️ |
| Facturación / tributario | Delito tributario | Baja | Alto | Medio | Facturación electrónica + respaldo de operaciones | — | ✅ |
| Pagos a proveedores | Lavado / cohecho | Baja | Alto | Medio | Autorización por monto + doble firma | `ctrl-interno` | ✅ |
| Contratación con el Estado | Cohecho / fraude licitaciones | Baja | Alto | Medio | Debida diligencia + registro | `ctrl-interno` | ✅ |
| Tratamiento de datos personales de usuarios | Uso indebido de datos (cruce 21.719) | Media | Medio | Medio | Política de privacidad + RLS + minimización + retención | `data-*`, `sec-tenant` | ⚠️ |
| Gastos / reembolsos | Administración desleal / fraude | Baja | Medio | Bajo | Política de gastos + revisión | `ctrl-interno` | ✅ |

## Notas
- Niveles: combinación de probabilidad × impacto (bajo/medio/alto).
- Los controles técnicos enlazan con `references/controls.md` (se evalúan en la auditoría del repo).
- Los procesos marcados ⚠️ son los que requieren las remediaciones técnicas pendientes (MFA, logs, retención).

---
*Borrador generado con compliance-cl (pack ley-21595). No constituye asesoría legal; revisar con un abogado.*
