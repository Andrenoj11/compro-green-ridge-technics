import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, stat, unlink } from "node:fs/promises";
import { join } from "node:path";
import { clientNetwork, type Inquiry } from "./validation.ts";

const MINUTE = 60_000, HOUR = 60 * MINUTE, DAY = 24 * HOUR;
type Entry = { at: number; client: string; email: string; digest: string; accepted: boolean };
type State = { version: 1; salt: string; entries: Entry[] };
export type Reservation = { kind: "reserved" | "duplicate" | "uncertain" | "limited"; digest: string; retryAfter: number };

// One store instance, one Node process, one web replica. No inquiry text or raw IP
// is stored. The Docker volume preserves budgets and duplicate checks across deploys.
export function createQuotaStore(directory: string, clock = Date.now) {
  let queue: Promise<unknown> = Promise.resolve();
  const file = join(directory, "quota.json");

  function transaction<T>(change: (state: State, now: number) => T): Promise<T> {
    const operation = queue.then(async () => {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      let state: State;
      try {
        if ((await stat(file)).size > 100_000) throw new Error("Invalid quota state");
        state = JSON.parse(await readFile(file, "utf8"));
        if (state.version !== 1 || !/^[a-f0-9]{64}$/.test(state.salt) || !Array.isArray(state.entries) || state.entries.length > 100) throw new Error("Invalid quota state");
        for (const entry of state.entries) {
          if (!Number.isSafeInteger(entry.at) || entry.at < 0 || typeof entry.accepted !== "boolean" || ![entry.client, entry.email, entry.digest].every(hash => typeof hash === "string" && /^[a-f0-9]{64}$/.test(hash))) throw new Error("Invalid quota state");
        }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        state = { version: 1, salt: randomBytes(32).toString("hex"), entries: [] };
      }
      const now = clock();
      // A clock moving backwards retains reservations, rather than clearing limits.
      state.entries = state.entries.filter(entry => now - entry.at < DAY);
      const result = change(state, now);
      const temporary = `${file}.${randomUUID()}.tmp`;
      try {
        const handle = await open(temporary, "wx", 0o600);
        try { await handle.writeFile(JSON.stringify(state)); await handle.sync(); }
        finally { await handle.close(); }
        await rename(temporary, file);
        const parent = await open(directory, "r");
        try { await parent.sync(); } finally { await parent.close(); }
      } finally { await unlink(temporary).catch(() => {}); }
      return result;
    });
    queue = operation.catch(() => {});
    return operation;
  }

  return {
    reserve(ip: string, inquiry: Inquiry): Promise<Reservation> {
      return transaction((state, now) => {
        const hash = (value: string) => createHmac("sha256", state.salt).update(value).digest("hex");
        const email = hash(inquiry.email.toLowerCase());
        const client = hash(clientNetwork(ip));
        const digest = hash(JSON.stringify([inquiry.name, inquiry.email.toLowerCase(), inquiry.company, inquiry.service, inquiry.message, inquiry.locale]));
        const recent = state.entries.filter(entry => now - entry.at < 15 * MINUTE);
        const duplicate = recent.find(entry => entry.digest === digest);
        if (duplicate) return { kind: duplicate.accepted ? "duplicate" : "uncertain", digest, retryAfter: 900 };
        const limits = [
          { entries: recent.filter(entry => entry.client === client), max: 3, window: 15 * MINUTE },
          { entries: recent.filter(entry => entry.email === email), max: 3, window: 15 * MINUTE },
          { entries: state.entries.filter(entry => now - entry.at < HOUR), max: 20, window: HOUR },
          { entries: state.entries, max: 100, window: DAY },
        ];
        let retryAfter = 0;
        for (const limit of limits) if (limit.entries.length >= limit.max) retryAfter = Math.max(retryAfter, Math.ceil((Math.min(...limit.entries.map(entry => entry.at)) + limit.window - now) / 1000));
        if (retryAfter) return { kind: "limited", digest, retryAfter };
        state.entries.push({ at: now, client, email, digest, accepted: false });
        return { kind: "reserved", digest, retryAfter: 0 };
      });
    },
    accepted(digest: string) {
      return transaction(state => {
        const entry = state.entries.find(item => item.digest === digest);
        if (!entry) throw new Error("Missing reservation");
        entry.accepted = true;
      });
    },
  };
}

export type QuotaStore = ReturnType<typeof createQuotaStore>;
