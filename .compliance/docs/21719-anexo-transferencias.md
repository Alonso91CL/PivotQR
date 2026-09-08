# Anexo de Transferencia Internacional de Datos — SOCIEDAD TECNOLÓGICA PIVOT IT SPA

> Para amparar el envío de datos personales fuera de Chile (Supabase, Cloudflare, Vercel, Google). Se firma/incorpora con cada proveedor extranjero que actúe como encargado. Mecanismo: **Cláusulas Contractuales Modelo** aprobadas por el Ministerio de Economía (Resolución RAEX202503748, Diario Oficial 19-12-2025). Como la empresa prefiere dejar la documentación (plataforma pequeña), este anexo queda como respaldo contractual que se completa con cada proveedor al renovar/contratar.

## 1. Partes
- **Exportador de datos:** SOCIEDAD TECNOLÓGICA PIVOT IT SPA, RUT 78.279.306-3 (Chile).
- **Importador de datos:** [PROVEEDOR] ([país, ej. EE.UU.]).

## 2. Mecanismo de transferencia
Las partes adoptan las **Cláusulas Contractuales Modelo** del Ministerio de Economía como garantía adecuada conforme a la Ley 21.719. El texto oficial está en `sources/clausulas-modelo-transferencia-economia.pdf` (anéxalo íntegro o incorpóralo por referencia). No basta el DPA estándar del proveedor por sí solo: estas cláusulas (o un mecanismo equivalente: decisión de adecuación, normas corporativas vinculantes o consentimiento del titular) deben respaldar la transferencia.

## 3. Datos y finalidad (por proveedor)

| Proveedor | Categorías de datos | Finalidad | País |
|---|---|---|---|
| Supabase (hosted) | email, contraseña (hash), ciudad, región, país, latitud, longitud, dispositivo, sistema operativo | Base de datos y autenticación | EE.UU. (AWS us-east-1) |
| Cloudflare | IP, token de verificación, headers de ubicación | CDN, Worker de redirección, anti-bot (Turnstile) | Global (edge) |
| Vercel | Datos de navegación agregados | Hosting del sitio y analítica | EE.UU. / global |
| Google | Email verificado | Inicio de sesión (SSO opcional) | EE.UU. / global |

## 4. Compromisos del importador
Tratar los datos solo según instrucciones, aplicar medidas de seguridad equivalentes, no transferir a terceros sin garantías, y colaborar ante solicitudes de los titulares y de la Agencia.

## 5. Declaración en la política
Esta transferencia se declara en la política de privacidad ("Con quién compartimos los datos").

---
*Borrador generado con compliance-cl (pack ley-21719). No constituye asesoría legal; revisar con un abogado.*
