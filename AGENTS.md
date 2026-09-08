# PivotQR

Proyecto de códigos QR (PivotQR).

## Reglas para agentes

- Toda la documentación y análisis del proyecto vive en `.docs/`:
  - `PRD.md` — el documento completo.
  - `01-resumen.md` a `08-roadmap.md` — el detalle por tema.
  - `INICIAR-DESARROLLO.md` — prompt para arrancar la construcción.
- Antes de escribir código, lee `.docs/PRD.md` y `.docs/INICIAR-DESARROLLO.md`.
- No programes la aplicación antes de que la definición en `.docs/` esté cerrada.
- Si `.docs/` aún no existe o está vacía, no inventes el alcance: sigue la etapa de definición (Skill `crear-proyecto`) antes de construir.
- No modifiques la carpeta `.opencode/`: es el framework de definición, no se trackea.

## ui-ux-pro-max

Skill de diseño UI/UX instalado localmente en `.opencode/skills/ui-ux-pro-max/`. Úsalo al diseñar, revisar o corregir interfaces (componentes, páginas, accesibilidad, colores, tipografía, charts, responsive). Su buscador se invoca con `py -3` (en Windows el `python` del PATH es el alias de MS Store y falla):

```bash
py -3 ".opencode/skills/ui-ux-pro-max/scripts/search.py" "<consulta>" --domain <ux|style|color|typography|chart|landing|icons|product|react|nextjs...>
```

Para dirección visual de una página/proyecto usa `--design-system`; para guía de implementación pasa `--stack nextjs`.

## graphify

This project has a knowledge graph at .docs/graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

The graph output dir is `.docs/graphify-out/` (set `GRAPHIFY_OUT=.docs/graphify-out` in the shell for `update`/`extract`, which have no `--graph` flag).

Rules:
- For codebase questions, first run `graphify query "<question>" --graph .docs/graphify-out/graph.json` when that file exists. Use `graphify path "A" "B" --graph .docs/graphify-out/graph.json` for relationships and `graphify explain "<concept>" --graph .docs/graphify-out/graph.json` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty .docs/graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If .docs/graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read .docs/graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `$env:GRAPHIFY_OUT=".docs/graphify-out"; graphify update .` to keep the graph current (AST-only, no API cost). Use `graphify cluster-only . --graph .docs/graphify-out/graph.json` to regenerate the report, and `graphify extract . --code-only --out .docs` for a full rebuild.
