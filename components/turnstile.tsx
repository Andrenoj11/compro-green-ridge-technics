"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { t, type Locale } from "@/lib/i18n";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi } }

export function Turnstile({ siteKey, locale, resetKey, onToken }: {
  siteKey: string; locale: Locale; resetKey: number; onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    const api = window.turnstile;
    let mounted = true;
    let id: string;
    try { id = api.render(container.current, {
      sitekey: siteKey, action: "contact", language: locale === "zh" ? "zh-CN" : locale,
      theme: "light", size: "flexible", "response-field": false,
      callback: (token: string) => { onToken(token); setFailed(false); },
      "expired-callback": () => onToken(""),
      "error-callback": () => { onToken(""); setFailed(true); return true; },
    }); } catch {
      queueMicrotask(() => { if (mounted) { onToken(""); setFailed(true); } });
    }
    return () => { mounted = false; if (id) api.remove(id); };
  }, [ready, siteKey, locale, resetKey, onToken]);
  return <>
    <Script id="contact-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive" onReady={() => setReady(true)} onError={() => { setFailed(true); onToken(""); }} />
    <div ref={container} className="contact-verification" />
    {failed && <p role="alert">{t(locale, "contact.verification_failed")}</p>}
  </>;
}
