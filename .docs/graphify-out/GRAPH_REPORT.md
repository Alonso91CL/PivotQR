# Graph Report - PivotQR  (2026-09-15)

## Corpus Check
- 100 files · ~82,535 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 582 nodes · 864 edges · 58 communities (45 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d7f1cc1e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- web/package.json
- compilerOptions
- Política de Privacidad — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- qr-card.tsx
- PRD — PivotQR
- worker/package.json
- charts.tsx
- createClient
- Postura de Cumplimiento — PIVOTQR (SOCIEDAD TECNOLÓGICA PIVOT IT SPA)
- PivotQR — Funcionalidades del V1
- index.ts
- PivotQR — Stack
- 0001_init.sql
- eslint.config.mjs
- postcss.config.mjs
- global.d.ts
- Entidades
- PivotQR — Checklist de despliegue para la Fase 1
- PivotQR — Resumen
- PivotQR — Roadmap
- PivotQR — Usuarios y roles
- PivotQR — Alcance del MVP
- PivotQR — Arquitectura
- PivotQR — Iniciar desarrollo
- PivotQR
- PivotQR
- web/README.md
- PivotQR
- web/AGENTS.md
- devDependencies
- Modelo de Prevención de Delitos (MPD) — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- ContenidoCompartir
- Código de Ética y Conducta — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- dependencies
- [slug]/route.ts
- QrCard
- Reglamento del Canal de Denuncias — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- Evaluación de Impacto en Protección de Datos (EIPD) — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- Plan de Respuesta a Brechas de Datos Personales
- app/layout.tsx
- Anexo de Transferencia Internacional de Datos — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- Consentimiento y avisos en el punto de captura — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- Contrato de Tratamiento de Datos (DPA)
- Instructivo: qué hacer ante cada situación — PIVOTQR
- Acta de Designación del Encargado de Prevención — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- Canal de ejercicio de derechos — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- Registro de Actividades de Tratamiento (RAT)
- scripts
- Matriz de Riesgos de Delitos — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- Registro de Vulneraciones a las Medidas de Seguridad — SOCIEDAD TECNOLÓGICA PIVOT IT SPA
- public.scans
- public.links
- public.links

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 23 edges
2. `react` - 20 edges
3. `ReporteScan` - 16 edges
4. `createClient()` - 16 edges
5. `compilerOptions` - 16 edges
6. `QrCard()` - 14 edges
7. `Enlace` - 14 edges
8. `PRD — PivotQR` - 13 edges
9. `buildQRDataUrl()` - 12 edges
10. `rangoFechasDe()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `PATCH()` --calls--> `createClient()`  [EXTRACTED]
  web/src/app/api/proyectos/[id]/enlaces/[enlace_id]/route.ts → web/src/lib/supabase/server.ts
- `DELETE()` --calls--> `createClient()`  [EXTRACTED]
  web/src/app/api/proyectos/[id]/enlaces/[enlace_id]/route.ts → web/src/lib/supabase/server.ts
- `LandingPage()` --calls--> `buildQRDataUrl()`  [EXTRACTED]
  web/src/app/page.tsx → web/src/lib/qr.ts
- `subirLogo()` --calls--> `createClient()`  [EXTRACTED]
  web/src/components/configurar-qr-modal.tsx → web/src/lib/supabase/client.ts
- `descargarSvg()` --calls--> `buildQRSvg()`  [EXTRACTED]
  web/src/components/qr-card.tsx → web/src/lib/qr.ts

## Import Cycles
- None detected.

## Communities (58 total, 9 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.10
Nodes (20): CreateProyectoForm(), LoginForm(), entrarConGoogle(), enviar(), verificarTurnstile(), barras, chats, features (+12 more)

### Community 1 - "web/package.json"
Cohesion: 0.11
Nodes (18): eslint, eslint-config-next, qrcode, react-dom, tailwindcss, @tailwindcss/postcss, @types/d3-geo, @types/geojson (+10 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 3 - "Política de Privacidad — SOCIEDAD TECNOLÓGICA PIVOT IT SPA"
Cohesion: 0.15
Nodes (12): 10. Cambios, 11. Reclamos, 1. Responsable del tratamiento, 2. Qué datos tratamos, 3. Finalidad y base de licitud, 4. Con quién compartimos los datos, 5. Por cuánto tiempo, 6. Tus derechos (+4 more)

### Community 4 - "qr-card.tsx"
Cohesion: 0.08
Nodes (43): react, DELETE(), dynamic, PATCH(), RouteParams, ConfigurarQrModal(), ContenidoPersonalizar(), descargarSvg() (+35 more)

### Community 5 - "PRD — PivotQR"
Cohesion: 0.14
Nodes (13): 10. Roadmap, 11. Riesgos y supuestos, 12. Cómo sabremos que funcionó, 1. Resumen ejecutivo, 2. Problema y oportunidad, 3. Usuarios y roles, 4. Alcance del V1 y qué queda fuera, 5. Funcionalidades detalladas (+5 more)

### Community 6 - "worker/package.json"
Cohesion: 0.18
Nodes (10): wrangler, devDependencies, wrangler, name, pnpm, onlyBuiltDependencies, private, scripts (+2 more)

### Community 7 - "charts.tsx"
Cohesion: 0.09
Nodes (37): d3-geo, metadata, CompartirProyecto, CompartirReporte(), formatoNumero(), InicioDashboard(), PayloadInicio, ProyectoMetrica (+29 more)

### Community 8 - "createClient"
Cohesion: 0.06
Nodes (43): @supabase/ssr, @supabase/supabase-js, dynamic, GET(), dynamic, GET(), RouteParams, dynamic (+35 more)

### Community 9 - "Postura de Cumplimiento — PIVOTQR (SOCIEDAD TECNOLÓGICA PIVOT IT SPA)"
Cohesion: 0.17
Nodes (11): Altas, Brechas prioritarias, Críticas, Decisiones resueltas (aplicando el criterio de la ley), Documentación generada en `.compliance/docs/`, Legales / organizacionales, Ley 21.595, Ley 21.719 (+3 more)

### Community 10 - "PivotQR — Funcionalidades del V1"
Cohesion: 0.18
Nodes (10): Activar / Pausar campaña — P0, Compartir el reporte — P0, Cuentas (registro y login) — P0, Descarga del QR — P0, Edición dinámica de la URL destino — P0, Generador (URL → enlace corto + QR dinámico) — P0, Personalización del QR — P1, PivotQR — Funcionalidades del V1 (+2 more)

### Community 11 - "index.ts"
Cohesion: 0.29
Nodes (10): construirVcf(), detectDevice(), Env, escaparVcf(), fetch(), getLink(), LinkRow, parseCoordenada() (+2 more)

### Community 12 - "PivotQR — Stack"
Cohesion: 0.20
Nodes (9): Cloudflare Turnstile (anti-bots), Cloudflare Workers, Dominio `qr.pivotit.cl`, Librería de QR (`qrcode`), Lo que NO usamos y por qué, Next.js + Tailwind en Vercel, PivotQR — Stack, Resumen (+1 more)

### Community 13 - "0001_init.sql"
Cohesion: 0.60
Nodes (4): auth.users, public.links, public.projects, public.scans

### Community 18 - "Entidades"
Cohesion: 0.20
Nodes (9): Datos sensibles, Enlaces (cada QR = un enlace), Entidades, Escaneos, PivotQR — Base de datos, Proyectos, Reglas de acceso, Relaciones (+1 more)

### Community 19 - "PivotQR — Checklist de despliegue para la Fase 1"
Cohesion: 0.22
Nodes (8): 1. Supabase (base + login + almacenamiento), 2. Cloudflare (puente + anti-bots), 3. Vercel (panel y reporte), 4. Prueba del "momento ajá", Estado actual (2026-09-15), PivotQR — Checklist de despliegue para la Fase 1, Tutorial: pasos manuales (bloqueantes), Verificar en los sitios oficiales

### Community 20 - "PivotQR — Resumen"
Cohesion: 0.25
Nodes (7): Cómo lo resuelve, El problema, En qué se diferencia, Estado, Para quién, PivotQR — Resumen, Qué es

### Community 21 - "PivotQR — Roadmap"
Cohesion: 0.22
Nodes (8): Fase 1 — "El puente y el momento ajá" ✅ (2026-09-05, commits `4212069`→`bb69304`), Fase 2 — "Control de campaña" ✅ (commit `814ae23`), Fase 3 — "Reporte ejecutivo" ✅ (commit `a07e07a`), Fase 4 — "Marca y lanzamiento" ✅ (commits `b8aa40c`, `e9f0c85`, `e4db44c`), PivotQR — Roadmap, Post-lanzamiento agregado, Primeros pasos concretos, PRÓXIMA FASE

### Community 22 - "PivotQR — Usuarios y roles"
Cohesion: 0.29
Nodes (6): PivotQR — Usuarios y roles, Quién paga, Recorrido principal, Roles del sistema, Usuario principal, Usuarios secundarios

### Community 23 - "PivotQR — Alcance del MVP"
Cohesion: 0.29
Nodes (6): Criterio de corte, Después de validar, Futuro, PivotQR — Alcance del MVP, Qué NO hace este MVP, V1 imprescindible

### Community 24 - "PivotQR — Arquitectura"
Cohesion: 0.33
Nodes (5): Decisiones, Diagrama, Las piezas, PivotQR — Arquitectura, Recorrido de una acción real (el escaneo)

### Community 25 - "PivotQR — Iniciar desarrollo"
Cohesion: 0.40
Nodes (4): Antes de empezar, Cómo usar este archivo, PivotQR — Iniciar desarrollo, Prompt

### Community 26 - "PivotQR"
Cohesion: 0.25
Nodes (7): Documentación, Estado, PivotQR, Qué hace, Repositorio, Roadmap, Stack

### Community 27 - "PivotQR"
Cohesion: 0.40
Nodes (4): graphify, PivotQR, Reglas para agentes, ui-ux-pro-max

### Community 28 - "web/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 29 - "PivotQR"
Cohesion: 0.50
Nodes (3): Documentación, Estado, PivotQR

### Community 32 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/d3-geo, @types/geojson, @types/node (+4 more)

### Community 33 - "Modelo de Prevención de Delitos (MPD) — SOCIEDAD TECNOLÓGICA PIVOT IT SPA"
Cohesion: 0.20
Nodes (9): 1. Objeto y alcance, 2. Encargado de Prevención de Delitos, 3. Identificación de riesgos, 4. Controles internos, 5. Canal de denuncias, 6. Capacitación, 7. Régimen disciplinario, 8. Supervisión y actualización (+1 more)

### Community 35 - "ContenidoCompartir"
Cohesion: 0.67
Nodes (3): ContenidoCompartir(), copiarInvitacion(), linkReporte()

### Community 36 - "Código de Ética y Conducta — SOCIEDAD TECNOLÓGICA PIVOT IT SPA"
Cohesion: 0.22
Nodes (8): 1. Propósito, 2. Principios, 3. Conductas prohibidas, 4. Datos personales, 5. Canal de denuncias, 6. Consecuencias, 7. Aceptación, Código de Ética y Conducta — SOCIEDAD TECNOLÓGICA PIVOT IT SPA

### Community 37 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, d3-geo, next, qrcode, react, react-dom, @supabase/ssr, @supabase/supabase-js (+1 more)

### Community 38 - "[slug]/route.ts"
Cohesion: 0.33
Nodes (7): dynamic, GET(), parseCoordenada(), RouteParams, detectDevice(), construirVcf(), escaparVcf()

### Community 39 - "QrCard"
Cohesion: 0.28
Nodes (5): QrCard(), alternarPausa(), aplicarEnlace(), descargarSvg(), onGuardadoModal()

### Community 40 - "Reglamento del Canal de Denuncias — SOCIEDAD TECNOLÓGICA PIVOT IT SPA"
Cohesion: 0.25
Nodes (7): 1. Quién puede denunciar, 2. Qué se denuncia, 3. Cómo (canal), 4. Garantía de no represalias, 5. Investigación, 6. Registro, Reglamento del Canal de Denuncias — SOCIEDAD TECNOLÓGICA PIVOT IT SPA

### Community 41 - "Evaluación de Impacto en Protección de Datos (EIPD) — SOCIEDAD TECNOLÓGICA PIVOT IT SPA"
Cohesion: 0.25
Nodes (7): 1. Descripción del tratamiento, 2. Necesidad y proporcionalidad, 3. Riesgos identificados, 4. Medidas de mitigación, 5. Conclusión, ¿Es obligatoria? (test del Art. 15 ter), Evaluación de Impacto en Protección de Datos (EIPD) — SOCIEDAD TECNOLÓGICA PIVOT IT SPA

### Community 42 - "Plan de Respuesta a Brechas de Datos Personales"
Cohesion: 0.25
Nodes (7): Fase 1 — Detección y contención (0–4h), Fase 2 — Evaluación (4–24h), Fase 3 — Notificación (sin dilaciones indebidas), Fase 4 — Cierre y mejora, Plan de Respuesta a Brechas de Datos Personales, Plantilla de aviso (borrador), Roles

### Community 43 - "app/layout.tsx"
Cohesion: 0.25
Nodes (5): next, nextConfig, metadata, openSans, outfit

### Community 44 - "Anexo de Transferencia Internacional de Datos — SOCIEDAD TECNOLÓGICA PIVOT IT SPA"
Cohesion: 0.29
Nodes (6): 1. Partes, 2. Mecanismo de transferencia, 3. Datos y finalidad (por proveedor), 4. Compromisos del importador, 5. Declaración en la política, Anexo de Transferencia Internacional de Datos — SOCIEDAD TECNOLÓGICA PIVOT IT SPA

### Community 45 - "Consentimiento y avisos en el punto de captura — SOCIEDAD TECNOLÓGICA PIVOT IT SPA"
Cohesion: 0.29
Nodes (6): 1. Aviso corto (en el punto de captura, junto al formulario de registro), 2. Consentimiento (checkbox, NO premarcado), 3. Datos sensibles (Art. 16 — consentimiento reforzado), 4. Revocación, 5. Registro del consentimiento (prueba), Consentimiento y avisos en el punto de captura — SOCIEDAD TECNOLÓGICA PIVOT IT SPA

### Community 46 - "Contrato de Tratamiento de Datos (DPA)"
Cohesion: 0.29
Nodes (6): 1. Objeto y duración, 2. Naturaleza y categorías, 3. Obligaciones del Encargado, 4. Transferencias internacionales, 5. Responsabilidad, Contrato de Tratamiento de Datos (DPA)

### Community 47 - "Instructivo: qué hacer ante cada situación — PIVOTQR"
Cohesion: 0.29
Nodes (6): A. Llega un derecho del titular (acceso, rectificación, supresión, oposición, portabilidad, bloqueo), B. Brecha de seguridad (acceso no autorizado, fuga, pérdida, alteración), C. Te fiscaliza la Agencia de Protección de Datos, D. Cambia la ley o sale un reglamento (ej. DS 662), E. Calendario de revisión, Instructivo: qué hacer ante cada situación — PIVOTQR

### Community 48 - "Acta de Designación del Encargado de Prevención — SOCIEDAD TECNOLÓGICA PIVOT IT SPA"
Cohesion: 0.33
Nodes (5): 1. Designación, 2. Autonomía y medios, 3. Funciones, 4. Aprobación, Acta de Designación del Encargado de Prevención — SOCIEDAD TECNOLÓGICA PIVOT IT SPA

### Community 49 - "Canal de ejercicio de derechos — SOCIEDAD TECNOLÓGICA PIVOT IT SPA"
Cohesion: 0.40
Nodes (4): 1. Texto público ("Tus derechos", para la web/política), 2. Procedimiento interno (plazos verificados contra la ley), 3. Si no puedes cumplir, Canal de ejercicio de derechos — SOCIEDAD TECNOLÓGICA PIVOT IT SPA

### Community 50 - "Registro de Actividades de Tratamiento (RAT)"
Cohesion: 0.40
Nodes (4): Actividades de tratamiento, Categorías de titulares, Notas, Registro de Actividades de Tratamiento (RAT)

### Community 51 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

## Knowledge Gaps
- **281 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+276 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 346 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `qr-card.tsx` to `createClient`, `web/package.json`, `createClient`, `charts.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `@supabase/ssr` connect `createClient` to `createClient`, `web/package.json`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `web/package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _281 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.09803921568627451 - nodes in this community are weakly interconnected._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._