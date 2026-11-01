import type { ContactConfig } from "./config.ts";
import type { QuotaStore } from "./quota.ts";
import { BodyError, clientAddress, clientNetwork, parseInquiry, readBody, type Inquiry } from "./validation.ts";

type Dependencies = {
  config: () => ContactConfig | null;
  verify: (token: string, ip: string, config: ContactConfig) => Promise<boolean>;
  store: (config: ContactConfig) => QuotaStore;
  send: (inquiry: Inquiry) => Promise<void>;
  report: () => void;
};
function reply(status: number, code: string, retryAfter?: number) {
  return Response.json({ ok: status === 200, code }, { status, headers: {
    "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
    ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
  } });
}

// Early request limits protect verification/SMTP resources, separately from the
// durable send budget. This map is bounded and intentionally resets on restart.
function requestLimiter() {
  const clients = new Map<string, number>();
  let until = 0, total = 0;
  return (client: string) => {
    const now = Date.now();
    if (now >= until) { clients.clear(); total = 0; until = now + 900_000; }
    const count = clients.get(client) || 0;
    if (total >= 120 || count >= 10) return false;
    clients.set(client, count + 1); total++;
    return true;
  };
}

export function createContactHandler(deps: Dependencies) {
  const allowRequest = requestLimiter();
  let active = 0;
  return async (request: Request) => {
    const config = deps.config();
    if (!config) return reply(503, "unavailable");
    if (request.headers.get("origin") !== config.origin || request.headers.get("sec-fetch-site") === "cross-site") return reply(403, "forbidden");
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return reply(415, "invalid");
    const ip = clientAddress(request.headers);
    if (!ip) return reply(503, "unavailable");
    if (!allowRequest(clientNetwork(ip))) return reply(429, "limited", 900);
    // Bound all in-flight body reads, external verifications, quota writes and sends.
    if (active >= 2) return reply(429, "limited", 15);
    active++;
    try {
      let inquiry;
      try { inquiry = parseInquiry(await readBody(request)); }
      catch (error) { return reply(error instanceof BodyError ? error.status : 400, "invalid"); }
      if (!inquiry) return reply(400, "invalid");
      if (!await deps.verify(inquiry.token, ip, config)) return reply(422, "verification");
      const store = deps.store(config);
      const reservation = await store.reserve(ip, inquiry);
      if (reservation.kind === "limited") return reply(429, "limited", reservation.retryAfter);
      if (reservation.kind === "duplicate") return reply(200, "accepted");
      if (reservation.kind === "uncertain") return reply(409, "uncertain");
      // Persist reservation before contacting SMTP. Failed or ambiguous delivery
      // keeps its budget; never automatically retry a possibly delivered message.
      await deps.send(inquiry);
      await store.accepted(reservation.digest);
      return reply(200, "accepted");
    } catch {
      deps.report(); // Generic log only: no tokens, IPs, inquiry contents or SMTP replies.
      return reply(503, "uncertain");
    } finally { active--; }
  };
}
