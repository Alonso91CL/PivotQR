# Graph Report - PivotQR  (2026-09-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 291 nodes · 340 edges · 32 communities (25 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `05daf508`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- web/package.json
- compilerOptions
- createClient
- [id]/page.tsx
- PRD — PivotQR
- worker/package.json
- devDependencies
- [slug]/route.ts
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `createClient()` - 13 edges
3. `PRD — PivotQR` - 13 edges
4. `createClient()` - 11 edges
5. `PivotQR — Funcionalidades del V1` - 10 edges
6. `react` - 9 edges
7. `PivotQR — Stack` - 9 edges
8. `PivotQR — Checklist de despliegue para la Fase 1` - 8 edges
9. `PivotQR — Resumen` - 7 edges
10. `PivotQR — Roadmap` - 7 edges

## Surprising Connections (you probably didn't know these)
- `entrarConGoogle()` --calls--> `createClient()`  [EXTRACTED]
  web/src/app/login/login-form.tsx → web/src/lib/supabase/client.ts
- `cerrarSesion()` --calls--> `createClient()`  [EXTRACTED]
  web/src/components/app-shell.tsx → web/src/lib/supabase/client.ts
- `onClick()` --calls--> `createClient()`  [EXTRACTED]
  web/src/components/landing/login.tsx → web/src/lib/supabase/client.ts
- `QrPanel()` --calls--> `createClient()`  [EXTRACTED]
  web/src/components/qr-panel.tsx → web/src/lib/supabase/client.ts
- `AppLayout()` --calls--> `createClient()`  [EXTRACTED]
  web/src/app/(app)/layout.tsx → web/src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (32 total, 5 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.17
Nodes (14): react, CreateProyectoForm(), LoginForm(), entrarConGoogle(), enviar(), verificarTurnstile(), UserDropdown(), cerrarSesion() (+6 more)

### Community 1 - "web/package.json"
Cohesion: 0.06
Nodes (30): eslint, eslint-config-next, react-dom, @supabase/ssr, tailwindcss, @tailwindcss/postcss, @types/node, @types/qrcode (+22 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 3 - "createClient"
Cohesion: 0.19
Nodes (11): dynamic, POST(), RouteParams, AppLayout(), ProyectoPage(), dynamic, ProyectosPage(), GET() (+3 more)

### Community 4 - "[id]/page.tsx"
Cohesion: 0.12
Nodes (16): qrcode, CrearEnlaceForm(), dynamic, barras, chats, features, LandingPage(), pasos (+8 more)

### Community 5 - "PRD — PivotQR"
Cohesion: 0.14
Nodes (13): 10. Roadmap, 11. Riesgos y supuestos, 12. Cómo sabremos que funcionó, 1. Resumen ejecutivo, 2. Problema y oportunidad, 3. Usuarios y roles, 4. Alcance del V1 y qué queda fuera, 5. Funcionalidades detalladas (+5 more)

### Community 6 - "worker/package.json"
Cohesion: 0.18
Nodes (10): wrangler, devDependencies, wrangler, name, pnpm, onlyBuiltDependencies, private, scripts (+2 more)

### Community 7 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/qrcode, @types/react (+2 more)

### Community 8 - "[slug]/route.ts"
Cohesion: 0.33
Nodes (6): @supabase/supabase-js, dynamic, GET(), RouteParams, createServiceClient(), detectDevice()

### Community 9 - "app/layout.tsx"
Cohesion: 0.25
Nodes (5): next, nextConfig, metadata, outfit, roboto

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
Cohesion: 0.40
Nodes (4): Documentación, Estado, PivotQR, Qué hace

### Community 27 - "PivotQR"
Cohesion: 0.50
Nodes (3): graphify, PivotQR, Reglas para agentes

### Community 28 - "web/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **160 isolated node(s):** `Env`, `LinkRow`, `Window`, `RouteParams`, `QRConfig` (+155 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 190 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `createClient` to `web/package.json`, `[id]/page.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `@supabase/ssr` connect `web/package.json` to `createClient`, `createClient`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `web/package.json`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `Env`, `LinkRow`, `Window` to the rest of the system?**
  _160 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06439393939393939 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._