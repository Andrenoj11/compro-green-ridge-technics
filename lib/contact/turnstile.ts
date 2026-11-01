import type { ContactConfig } from "./config.ts";

export async function verifyTurnstile(token: string, ip: string, config: ContactConfig, fetcher: typeof fetch = fetch) {
  const response = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: config.secret, response: token, remoteip: ip }),
    signal: AbortSignal.timeout(8000), cache: "no-store", redirect: "error",
  });
  if (!response.ok) throw new Error("Verification unavailable");
  const result = await response.json();
  // A widget from a different site or action must not authorize this form.
  return result?.success === true && result.hostname === new URL(config.origin).hostname && result.action === "contact";
}
