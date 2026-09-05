# PivotQR — Stack

## Resumen

| Pieza | Herramienta elegida | Costo inicial |
|---|---|---|
| Base de datos + login + archivos | Supabase | $0 |
| Puente (enlace corto + geo + redirección) | Cloudflare Workers | $0 |
| App web / panel / reporte | Next.js + Tailwind en Vercel | $0 |
| QR + descarga en el navegador | Librería `qrcode` (con variante para color/logo) | $0 |
| Dominio corto | `qr.pivotit.cl` (tuyo, ya pagado) | $0 |
| Anti-bots en registro | Cloudflare Turnstile | $0 |

**Costo total para empezar: $0** (el dominio ya lo tienes; de lo contrario serían ~$10–15/año).

---

## Supabase
1. **Qué es:** plataforma que junta base de datos (PostgreSQL), registro/login de usuarios y almacenamiento de archivos.
2. **Para qué sirve acá:** guarda proyectos, enlaces y escaneos, y maneja el registro/login con correo y con Google.
3. **Por qué encaja:** resuelve la pieza más delicada (cuentas + datos) con reglas de acceso por usuario (RLS) ya incluidas, sin montar un servidor de login propio.
4. **Costo para empezar:** $0.
5. **Límite del plan gratuito que importa:** el proyecto se pausa por inactividad y hay cuotas de uso mensual — verificar en supabase.com.
6. **Cuándo habría que pagar:** cuando el proyecto se pause por inactividad y sea un producto en uso real, o necesites respaldos garantizados.
7. **Alternativa:** Firebase (similar para partir gratis).

## Cloudflare Workers
1. **Qué es:** código que corre en el borde de internet, cerca del usuario, sin servidor propio.
2. **Para qué sirve acá:** es el portero de `qr.pivotit.cl/XXXX`: recibe la visita, registra ciudad/dispositivo en Supabase y redirige en milisegundos (o muestra "Campaña pausada").
3. **Por qué encaja:** Cloudflare le entrega al código, gratis, la ciudad y el país de cada visita (cabeceras `cf-ipcity` y `cf-ipcountry`). Sin eso habría que pagar un servicio de geolocalización.
4. **Costo para empezar:** $0.
5. **Límite del plan gratuito que importa:** cuota de peticiones diarias del plan gratuito de Workers — verificar en cloudflare.com.
6. **Cuándo habría que pagar:** cuando la cuota gratuita se quede corta para el tráfico real.
7. **Alternativa:** una ruta de API en el mismo frontend — funciona, pero obliga a añadir un servicio de geolocalización (coste y pieza extra).

## Next.js + Tailwind en Vercel
1. **Qué es:** un framework para web (Next.js), los estilos (Tailwind) y el lugar donde se publica (Vercel), con despliegue automático desde GitHub.
2. **Para qué sirve acá:** es la app que ve el usuario (panel, proyectos, generador) y la vista de reporte del cliente.
3. **Por qué encaja:** la combinación más estándar con Supabase; renderiza rápido y publicar es gratis y automático.
4. **Costo para empezar:** $0.
5. **Límite del plan gratuito que importa:** cuotas de uso mensual del plan gratuito — verificar en vercel.com.
6. **Cuándo habría que pagar:** cuando el proyecto sea comercial grande y necesites más cómputo o garantías.
7. **Alternativa:** React + Vite publicado en Cloudflare Pages — consolida todo en un solo proveedor, a cambio de más configuración manual.

## Librería de QR (`qrcode`)
1. **Qué es:** librería que genera códigos QR dentro del navegador.
2. **Para qué sirve acá:** dibuja el QR con colores, logo al centro y estilos, y permite descargarlo en PNG y SVG.
3. **Por qué encaja:** generación 100% en el cliente: sin servidor, sin costo, sin procesamiento extra.
4. **Costo para empezar:** $0.
5. **Límite del plan gratuito que importa:** ninguna; es software libre.
6. **Cuándo habría que pagar:** nunca.
7. **Alternativa:** generarlo en el servidor — no hace falta para V1.

## Dominio `qr.pivotit.cl`
1. **Qué es:** el subdominio que dan los enlaces cortos y que guardan los QRs impresos.
2. **Para qué sirve acá:** el QR físico apunta a este dominio; si el puente se mueve de plataforma, el QR sigue funcionando porque el dominio es tuyo.
3. **Por qué encaja:** es la dirección que el cliente ve e imprime; con él el producto se ve profesional y el código impreso no queda atado a un dominio ajeno.
4. **Costo para empezar:** $0 (ya lo tienes). Si no existiera, ~$10–15/año.
5. **Límite del plan gratuito que importa:** renuevas el dominio todos los años — es un costo anual fijo.
6. **Cuándo habría que pagar:** en cada renovación anual (es infraestructura básica del negocio).
7. **Alternativa:** enlaces del tipo `.vercel.app` o `.supabase.co` — gratis pero feos, menos confiables y atan el QR impreso a un tercero.

## Cloudflare Turnstile (anti-bots)
1. **Qué es:** captcha invisible que distingue humanos de robots.
2. **Para qué sirve acá:** protege el registro y el login de cuentas automáticas.
3. **Por qué encaja:** requisito de seguridad mínima, gratis y sin fricción para el usuario.
4. **Costo para empezar:** $0.
5. **Límite del plan gratuito que importa:** cuota de verificaciones — verificar en cloudflare.com.
6. **Cuándo habría que pagar:** cuando la cuota gratuita se quede corta.
7. **Alternativa:** CAPTCHA tradicional de Google — más fricción para el usuario final.

---

## Lo que NO usamos y por qué
- **Firebase y Auth0/Clerk:** Supabase cubre base + auth + archivos en una sola pieza; menos cuentas que manejar. (Auth0/Clerk solo serían útiles si ya no usáramos Supabase.)
- **Servicio de geolocalización de pago (ipinfo, MaxMind):** Cloudflare Workers entrega la ciudad gratis en el borde.
- **Servicio de email (Resend/Brevo):** el V1 comparte el reporte manualmente por WhatsApp; el envío automático se decide después de validar.
- **Pasarela de pago (Stripe/Mercado Pago/Flow):** el V1 no cobra; los planes de pago se agregan cuando haya usuarios de verdad.
- **Cloudflare Pages en vez de Vercel:** se consideró para consolidar todo en Cloudflare, pero Vercel es la ruta más estándar con Next.js + Supabase.