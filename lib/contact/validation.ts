import { isIP } from "node:net";

export const MAX_BODY_BYTES = 16_384;
export const CONTACT_MAILBOX = "support@gr-tech.id";
const services: Record<string, string> = {
  testing: "System Test Services", inspection: "Inspection Services",
  commissioning: "Commissioning Services", management: "Management Services", discuss: "Initial discussion",
};
export type Inquiry = {
  name: string; email: string; company: string; service: string; message: string;
  locale: string; token: string;
};
const line = (value: unknown, max: number) => typeof value === "string" && value.trim().length <= max && !/[\p{Cc}\p{Cf}]/u.test(value) ? value.trim() : null;
export const validEmail = (value: string) => value.length <= 200 && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(value);

export function parseInquiry(value: unknown): Inquiry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const name = line(data.name, 100), email = line(data.email, 200), company = line(data.company, 150);
  if (!name || !email || !validEmail(email) || company === null || data.consent !== true || data.website !== "") return null;
  if (typeof data.service !== "string" || !Object.hasOwn(services, data.service)) return null;
  if (typeof data.locale !== "string" || !["id", "en", "ar", "zh"].includes(data.locale)) return null;
  if (typeof data.message !== "string" || data.message.length > 3000 || data.message.trim().length < 10) return null;
  if (/[\p{Cc}\p{Cf}]/u.test(data.message.replace(/[\r\n\t]/g, ""))) return null;
  const token = line(data.token, 2048);
  if (!token) return null;
  return { name, email, company, service: data.service, message: data.message.trim(), locale: data.locale, token };
}

export function inquiryMail(inquiry: Inquiry, recipients: readonly string[] = [CONTACT_MAILBOX]) {
  const destinations = [...new Set([CONTACT_MAILBOX, ...recipients])];
  return {
    from: { name: "Green Ridge Technics Website", address: CONTACT_MAILBOX },
    to: CONTACT_MAILBOX,
    // Blind copies are envelope-only, so addresses never become MIME headers.
    envelope: { from: CONTACT_MAILBOX, to: destinations },
    replyTo: { name: inquiry.name, address: inquiry.email },
    subject: "New website inquiry — Green Ridge Technics",
    text: `Website inquiry — Green Ridge Technics\n\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nCompany: ${inquiry.company || "—"}\nService: ${services[inquiry.service]}\nLanguage: ${inquiry.locale}\n\n${inquiry.message}`,
    disableFileAccess: true, disableUrlAccess: true,
  };
}

// Caddy must overwrite this custom header. Port 3000 must remain unpublished.
export function clientAddress(headers: Headers) {
  const value = headers.get("x-grt-client-ip")?.trim() || "";
  return isIP(value) ? value : null;
}

// Group equivalent addresses and IPv6 /64 networks to reduce address-rotation bypasses.
export function clientNetwork(ip: string) {
  if (isIP(ip) === 4) return ip;
  if (isIP(ip) !== 6) throw new Error("Invalid client address");
  const canonical = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
  if (canonical.startsWith("::ffff:")) {
    const [hi, lo] = canonical.slice(7).split(":").map(part => parseInt(part, 16));
    return [hi >> 8, hi & 255, lo >> 8, lo & 255].join(".");
  }
  const [start, end] = canonical.split("::");
  const head = start ? start.split(":") : [], tail = end ? end.split(":") : [];
  const parts = canonical.includes("::") ? [...head, ...Array(8 - head.length - tail.length).fill("0"), ...tail] : head;
  return `${parts.slice(0, 4).map(part => parseInt(part, 16).toString(16)).join(":")}/64`;
}

export class BodyError extends Error {
  status: number;
  constructor(status: number) { super("Invalid request body"); this.status = status; }
}
export async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new BodyError(413);
  const reader = request.body?.getReader();
  if (!reader) throw new BodyError(400);
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 5000);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (timedOut) throw new BodyError(408);
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new BodyError(413); }
      chunks.push(value);
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
  } finally { clearTimeout(timer); reader.releaseLock(); }
}
