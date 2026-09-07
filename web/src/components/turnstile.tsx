"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function getTurnstileToken(): string | null {
  return typeof window !== "undefined"
    ? window.__pivotqrTurnstileToken ?? null
    : null;
}

export function isTurnstileActive(): boolean {
  // En desarrollo local no hay evidencia de bots y la key del widget es del
  // hostname de producción, así que se omite para no bloquear el flujo.
  return Boolean(SITE_KEY) && process.env.NODE_ENV !== "development";
}

// Anti-bots en registro y login. Sin clave configurada, o en desarrollo local
// (next dev), no se muestra y no bloquea el flujo.
export function Turnstile() {
  const contenedor = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);

  // El script se carga con render=explicit, así que el widget se crea a mano.
  // Cubre el montaje normal (el script carga recién acá) y el caso en que el
  // script ya estaba en la página (p. ej. al abrir el modal de login tras
  // haber visitado /login), donde el mount lo pinta de inmediato.
  const renderWidget = useCallback(() => {
    if (!isTurnstileActive() || typeof window === "undefined" || !window.turnstile)
      return;
    const el = contenedor.current;
    if (!el || widgetId.current) return;
    widgetId.current = window.turnstile.render(el, {
      sitekey: SITE_KEY,
      theme: "dark",
      callback: (token: string) => {
        window.__pivotqrTurnstileToken = token;
      },
    });
  }, []);

  useEffect(() => {
    if (!isTurnstileActive()) return;
    renderWidget();
    return () => {
      delete window.__pivotqrTurnstileToken;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [renderWidget]);

  if (!isTurnstileActive()) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => renderWidget()}
      />
      <div ref={contenedor} className="min-h-[65px]" />
    </>
  );
}

export { getTurnstileToken };