import QRCode from "qrcode";

export const ESTILOS = ["clasico", "redondeado", "puntos"] as const;
export type Estilo = (typeof ESTILOS)[number];

export interface QRConfig {
  colorPatron?: string | null;
  colorFondo?: string | null;
  estilo?: Estilo | null;
  logoUrl?: string | null;
}

const MARGIN = 2; // módulos de margen (quiet zone)
const RADIO_PUNTOS = 0.45; // radio de cada módulo en estilo "puntos"
const RADIO_REDONDEADO = 0.28; // radio de esquina en estilo "redondeado"
const TAMANO_LOGO = 0.22; // lado del logo como fracción del QR completo

function escapar(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function colorEfectivo(valor: string | null | undefined, porDefecto: string): string {
  return valor && valor !== "transparente" ? valor : porDefecto;
}

function estaEnLocalizador(row: number, col: number, size: number): boolean {
  const enSuperiorIzquierda = row <= 6 && col <= 6;
  const enSuperiorDerecha = row <= 6 && col >= size - 7;
  const enInferiorIzquierda = row >= size - 7 && col <= 6;
  return enSuperiorIzquierda || enSuperiorDerecha || enInferiorIzquierda;
}

// Dibuja el QR módulo a módulo (matriz de `qrcode`), permitiendo color de fondo,
// color de patrón, 3 estilos y logo al centro. Los patrones de localización
// (cuadros de las esquinas) se dibujan siempre como cuadrados para conservar la
// escaneabilidad.
function buildSvgString(text: string, config?: QRConfig): string {
  const patron = colorEfectivo(config?.colorPatron, "#000000");
  const fondo = config?.colorFondo === "transparente" ? "transparente" : colorEfectivo(config?.colorFondo, "#ffffff");
  const estilo = config?.estilo ?? "clasico";
  // Con logo al centro se necesita más redundancia para que siga escaneando.
  const qr = QRCode.create(text, {
    errorCorrectionLevel: config?.logoUrl ? "H" : "M",
  });
  const size = qr.modules.size;
  const total = size + MARGIN * 2;
  const datos = qr.modules.data;

  const piezas: string[] = [];
  if (fondo !== "transparente") {
    piezas.push(`<rect x="0" y="0" width="${total}" height="${total}" fill="${escapar(fondo)}"/>`);
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!datos[row * size + col]) continue;
      const x = col + MARGIN;
      const y = row + MARGIN;
      if (estaEnLocalizador(row, col, size) || estilo === "clasico") {
        piezas.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${escapar(patron)}"/>`);
      } else if (estilo === "puntos") {
        piezas.push(`<circle cx="${x + 0.5}" cy="${y + 0.5}" r="${RADIO_PUNTOS}" fill="${escapar(patron)}"/>`);
      } else {
        piezas.push(`<rect x="${x}" y="${y}" width="1" height="1" rx="${RADIO_REDONDEADO}" fill="${escapar(patron)}"/>`);
      }
    }
  }

  if (config?.logoUrl) {
    const logo = total * TAMANO_LOGO;
    const x = (total - logo) / 2;
    const y = (total - logo) / 2;
    const plato = fondo === "transparente" ? "#ffffff" : fondo;
    piezas.push(`<rect x="${x}" y="${y}" width="${logo}" height="${logo}" rx="${logo * 0.18}" fill="${escapar(plato)}"/>`);
    piezas.push(
      `<image href="${escapar(config.logoUrl)}" x="${x + logo * 0.06}" y="${y + logo * 0.06}" width="${logo * 0.88}" height="${logo * 0.88}" preserveAspectRatio="xMidYMid meet"/>`,
    );
  }

  const crisp = estilo === "clasico" ? ' shape-rendering="crispEdges"' : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total * 32}" height="${total * 32}"${crisp}>${piezas.join("")}</svg>`;
}

function svgComoDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export async function buildQRSvg(text: string, config?: QRConfig): Promise<string> {
  return buildSvgString(text, config);
}

// PNG: se compone en canvas en el navegador (el QR sin logo para no contaminar
// el lienzo con una imagen remota, y luego se estampa el logo encima). Si no hay
// navegador (SSR), se devuelve el SVG como data URL.
export async function buildQRDataUrl(text: string, config?: QRConfig): Promise<string> {
  const svg = buildSvgString(text, {
    ...config,
    logoUrl: null,
  });

  if (typeof window === "undefined") {
    return svgComoDataUrl(svg);
  }

  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const objetoUrl = URL.createObjectURL(blob);
  try {
    const fuente = new Image();
    fuente.src = objetoUrl;
    await fuente.decode();
    const lado = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = lado;
    canvas.height = lado;
    const ctx = canvas.getContext("2d");
    if (!ctx) return svgComoDataUrl(svg);
    ctx.drawImage(fuente, 0, 0, lado, lado);

    if (config?.logoUrl) {
      await estamparLogo(ctx, lado, config.logoUrl, config.colorFondo);
    }
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objetoUrl);
  }
}

function estamparLogo(ctx: CanvasRenderingContext2D, lado: number, logoUrl: string, fondo?: string | null): Promise<void> {
  return new Promise((resolver) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const logo = lado * TAMANO_LOGO;
      const x = (lado - logo) / 2;
      const y = (lado - logo) / 2;
      const radio = logo * 0.18;
      ctx.fillStyle = fondo === "transparente" ? "#ffffff" : colorEfectivo(fondo, "#ffffff");
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, logo, logo, radio);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, logo, logo);
      }
      const pad = logo * 0.08;
      ctx.drawImage(img, x + pad, y + pad, logo - pad * 2, logo - pad * 2);
      resolver();
    };
    img.onerror = () => resolver();
    img.src = logoUrl;
  });
}