# Graph Report - PivotQR  (2026-09-08)

## Corpus Check
- 61 files · ~66,386 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 354 nodes · 452 edges · 34 communities (25 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b8aa40c7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- web/package.json
- compilerOptions
- createClient
- qr.ts
- PRD — PivotQR
- worker/package.json
- devDependencies
- dashboard.tsx
- app/layout.tsx
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
- public.links

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createClient()` - 15 edges
3. `createClient()` - 14 edges
4. `react` - 13 edges
5. `PRD — PivotQR` - 13 edges
6. `QrPanel()` - 12 edges
7. `PivotQR — Funcionalidades del V1` - 10 edges
8. `PivotQR — Stack` - 9 edges
9. `buildQRDataUrl()` - 8 edges
10. `PivotQR — Checklist de despliegue para la Fase 1` - 8 edges

## Surprising Connections (you probably didn't know these)
- `PATCH()` --calls--> `createClient()`  [EXTRACTED]
  web/src/app/api/proyectos/[id]/enlaces/[enlace_id]/route.ts → web/src/lib/supabase/server.ts
- `LandingPage()` --calls--> `buildQRDataUrl()`  [EXTRACTED]
  web/src/app/page.tsx → web/src/lib/qr.ts
- `subirLogo()` --calls--> `createClient()`  [EXTRACTED]
  web/src/components/qr-panel.tsx → web/src/lib/supabase/client.ts
- `AppLayout()` --calls--> `createClient()`  [EXTRACTED]
  web/src/app/(app)/layout.tsx → web/src/lib/supabase/server.ts
- `ProyectoPage()` --calls--> `createClient()`  [EXTRACTED]
  web/src/app/(app)/proyectos/[id]/page.tsx → web/src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (34 total, 6 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.11
Nodes (20): react, CreateProyectoForm(), LoginForm(), entrarConGoogle(), enviar(), verificarTurnstile(), barras, chats (+12 more)

### Community 1 - "web/package.json"
Cohesion: 0.07
Nodes (29): eslint, eslint-config-next, qrcode, react-dom, tailwindcss, @tailwindcss/postcss, @types/node, @types/qrcode (+21 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 3 - "createClient"
Cohesion: 0.12
Nodes (18): @supabase/ssr, dynamic, POST(), RouteParams, dynamic, PATCH(), RouteParams, AppLayout() (+10 more)

### Community 4 - "qr.ts"
Cohesion: 0.08
Nodes (32): dynamic, PATCH(), RouteParams, CrearEnlaceForm(), dynamic, CompartirProyecto, CompartirReporte(), copiarInvitacion() (+24 more)

### Community 5 - "PRD — PivotQR"
Cohesion: 0.14
Nodes (13): 10. Roadmap, 11. Riesgos y supuestos, 12. Cómo sabremos que funcionó, 1. Resumen ejecutivo, 2. Problema y oportunidad, 3. Usuarios y roles, 4. Alcance del V1 y qué queda fuera, 5. Funcionalidades detalladas (+5 more)

### Community 6 - "worker/package.json"
Cohesion: 0.18
Nodes (10): wrangler, devDependencies, wrangler, name, pnpm, onlyBuiltDependencies, private, scripts (+2 more)

### Community 7 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/qrcode, @types/react (+2 more)

### Community 8 - "dashboard.tsx"
Cohesion: 0.09
Nodes (19): @supabase/supabase-js, dynamic, GET(), ReporteScan, RouteParams, dynamic, ReportePage(), dynamic (+11 more)

### Community 9 - "app/layout.tsx"
Cohesion: 0.25
Nodes (5): next, nextConfig, metadata, openSans, outfit

### Community 10 - "PivotQR — Funcionalidades del V1"
Cohesion: 0.18
Nodes (10): Activar / Pausar campaña — P0, Compartir el reporte — P0, Cuentas (registro y login) — P0, Descarga del QR — P0, Edición dinámica de la URL destino — P0, Generador (URL → enlace corto + QR dinámico) — P0, Personalización del QR — P1, PivotQR — Funcionalidades del V1 (+2 more)

### Community 11 - "index.ts"
Cohesion: 0.43
Nodes (6): detectDevice(), Env, fetch(), getLink(), LinkRow, recordScan()

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
Nodes (8): 1. Supabase (base + login + almacenamiento), 2. Cloudflare (puente + anti-bots), 3. Vercel (panel y reporte), 4. Prueba del "momento ajá", Estado actual (2026-09-05), PivotQR — Checklist de despliegue para la Fase 1, Tutorial: pasos manuales (bloqueantes), Verificar en los sitios oficiales

### Community 20 - "PivotQR — Resumen"
Cohesion: 0.25
Nodes (7): Cómo lo resuelve, El problema, En qué se diferencia, Estado, Para quién, PivotQR — Resumen, Qué es

### Community 21 - "PivotQR — Roadmap"
Cohesion: 0.25
Nodes (7): Fase 1 — "El puente y el momento ajá", Fase 2 — "Control de campaña", Fase 3 — "Reporte ejecutivo", Fase 4 — "Marca y lanzamiento", PivotQR — Roadmap, Primeros pasos concretos, PRÓXIMA FASE

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

## Knowledge Gaps
- **180 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+175 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 220 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `createClient` to `dashboard.tsx`, `web/package.json`, `qr.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `@supabase/ssr` connect `createClient` to `createClient`, `web/package.json`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `web/package.json`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _180 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.10695187165775401 - nodes in this community are weakly interconnected._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._