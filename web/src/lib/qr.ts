import QRCode from "qrcode";

export interface QRConfig {
  colorPatron?: string | null;
  colorFondo?: string | null;
}

export async function buildQRDataUrl(text: string, config?: QRConfig) {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
    color: {
      dark: config?.colorPatron ?? "#000000",
      light: config?.colorFondo === "transparente" ? "#00000000" : config?.colorFondo ?? "#ffffff",
    },
  });
}

export async function buildQRSvg(text: string, config?: QRConfig) {
  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
    color: {
      dark: config?.colorPatron ?? "#000000",
      light: config?.colorFondo === "transparente" ? "#00000000" : config?.colorFondo ?? "#ffffff",
    },
  });
}