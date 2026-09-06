"use client";

import { useEffect } from "react";
import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function getTurnstileToken(): string | null {
  return typeof window !== "undefined"
    ? window.__pivotqrTurnstileToken ?? null
    : null;
}

export function isTurnstileActive(): boolean {
  return Boolean(SITE_KEY);
}

// Anti-bots en registro y login. Si no hay clave configurada (entorno de
// desarrollo), no se muestra y no bloquea el flujo.
export function Turnstile() {
  useEffect(() => {
    if (!SITE_KEY) return;
    window.pivotqrOnTurnstile = (token: string) => {
      window.__pivotqrTurnstileToken = token;
    };
    return () => {
      delete window.pivotqrOnTurnstile;
      delete window.__pivotqrTurnstileToken;
    };
  }, []);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div
        className="cf-turnstile"
        data-sitekey={SITE_KEY}
        data-theme="dark"
        data-callback="pivotqrOnTurnstile"
      />
    </>
  );
}

export { getTurnstileToken };