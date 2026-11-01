import { getContactConfig } from "@/lib/contact/config";
import { createContactHandler } from "@/lib/contact/handler";
import { sendInquiry } from "@/lib/contact/mail";
import { createQuotaStore, type QuotaStore } from "@/lib/contact/quota";
import { verifyTurnstile } from "@/lib/contact/turnstile";

export const runtime = "nodejs";
const stores = new Map<string, QuotaStore>();
export const POST = createContactHandler({
  config: getContactConfig, verify: verifyTurnstile,
  send: (inquiry, config) => sendInquiry(inquiry, config.recipients),
  store: config => {
    if (!stores.has(config.stateDir)) stores.set(config.stateDir, createQuotaStore(config.stateDir));
    return stores.get(config.stateDir)!;
  },
  report: () => console.error("Contact delivery or security check unavailable."),
});
