import { isAbsolute } from "node:path";

export type ContactConfig = { origin: string; siteKey: string; secret: string; stateDir: string };
export function getContactConfig(): ContactConfig | null {
  if (process.env.CONTACT_ENABLED !== "true") return null;
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim() || "";
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim() || "";
  const stateDir = process.env.CONTACT_STATE_DIR || "/app/contact-state";
  if (!siteKey || !secret || !isAbsolute(stateDir)) return null;
  // Test credentials must never silently enable bypass challenges in production.
  if (/^[123]x0000/.test(siteKey) || /^[123]x0000/.test(secret)) return null;
  try {
    const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "");
    if (origin.protocol !== "https:" || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) return null;
    return { origin: origin.origin, siteKey, secret, stateDir };
  } catch { return null; }
}
