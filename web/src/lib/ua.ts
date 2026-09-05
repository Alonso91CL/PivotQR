export function detectDevice(userAgent: string): { dispositivo: string; so: string } {
  const ua = userAgent.toLowerCase();
  let dispositivo = "desktop";
  let so = "desconocido";

  if (/tablet|ipad/i.test(ua)) dispositivo = "tableta";
  else if (/mobile|iphone|android/i.test(ua)) dispositivo = "móvil";

  if (/windows/i.test(ua)) so = "Windows";
  else if (/android/i.test(ua)) so = "Android";
  else if (/(iphone|ipad|ipod)/i.test(ua)) so = "iOS";
  else if (/mac os|crios/i.test(ua)) so = "macOS";
  else if (/linux/i.test(ua)) so = "Linux";

  return { dispositivo, so };
}