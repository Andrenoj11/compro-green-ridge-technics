import { isAbsolute } from "node:path";
import { CONTACT_MAILBOX, validEmail } from "./validation.ts";

export type ContactConfig = { origin: string; siteKey: string; secret: string; stateDir: string; recipients: string[] };

export function contactRecipients(value: string | undefined): string[] | null {
  if (value === undefined || value === "") return [CONTACT_MAILBOX];
  if (value.length > 1000 || /[\p{Cc}\p{Cf}]/u.test(value)) return null;
  const entries = value.split(",").map(address => address.trim().toLowerCase());
  if (entries.some(address => !validEmail(address) || !address.endsWith("@gr-tech.id"))) return null;
  const recipients = [...new Set([CONTACT_MAILBOX, ...entries])];
  return recipients.length <= 5 ? recipients : null;
}

export function getContactConfig(): ContactConfig | null {
  if (process.env.CONTACT_ENABLED !== "true") return null;
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim() || "";
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim() || "";
  const stateDir = process.env.CONTACT_STATE_DIR || "/app/contact-state";
  const recipients = contactRecipients(process.env.CONTACT_RECIPIENTS);
  if (!siteKey || !secret || !isAbsolute(stateDir) || !recipients) return null;
  // Test credentials must never silently enable bypass challenges in production.
  if (/^[123]x0000/.test(siteKey) || /^[123]x0000/.test(secret)) return null;
  try {
    const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "");
    if (origin.protocol !== "https:" || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) return null;
    return { origin: origin.origin, siteKey, secret, stateDir, recipients };
  } catch { return null; }
}
