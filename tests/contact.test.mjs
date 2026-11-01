import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import nodemailer from 'nodemailer';
import { getContactConfig } from '../lib/contact/config.ts';
import { createContactHandler } from '../lib/contact/handler.ts';
import { relayOptions, sendInquiry } from '../lib/contact/mail.ts';
import { createQuotaStore } from '../lib/contact/quota.ts';
import { verifyTurnstile } from '../lib/contact/turnstile.ts';
import { clientAddress, clientNetwork, inquiryMail, parseInquiry, readBody } from '../lib/contact/validation.ts';
import { auditFindings } from '../scripts/audit-security.mjs';

const config = { origin: 'https://www.greenridgetechnics.com', siteKey: 'public-site-key', secret: 'private-secret', stateDir: '/tmp/unused' };
const valid = { name: 'A Customer', email: 'visitor@example.com', company: 'Example Ltd', service: 'testing', message: 'Please discuss our building system tests.', locale: 'id', token: 'challenge-token', website: '', consent: true };
const inquiry = parseInquiry(valid);
function request(data = valid, headers = {}) {
  return new Request(`${config.origin}/api/contact`, { method: 'POST', headers: { origin: config.origin, 'content-type': 'application/json', 'x-grt-client-ip': '192.0.2.1', ...headers }, body: typeof data === 'string' ? data : JSON.stringify(data) });
}
async function temporary(t) {
  const directory = await mkdtemp(join(tmpdir(), 'grt-contact-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test('configuration is opt-in and refuses absent settings, HTTP origins and bypass test keys', () => {
  const previous = { ...process.env };
  try {
    Object.assign(process.env, { CONTACT_ENABLED: 'true', NEXT_PUBLIC_SITE_URL: config.origin, TURNSTILE_SITE_KEY: config.siteKey, TURNSTILE_SECRET_KEY: config.secret });
    assert.equal(getContactConfig().siteKey, config.siteKey);
    for (const [key, value] of [['CONTACT_ENABLED', 'false'], ['TURNSTILE_SECRET_KEY', ''], ['TURNSTILE_SITE_KEY', '1x00000000000000000000AA'], ['TURNSTILE_SECRET_KEY', '1x0000000000000000000000000000000AA'], ['NEXT_PUBLIC_SITE_URL', 'http://example.com'], ['NEXT_PUBLIC_SITE_URL', 'https://example.com/path']]) {
      const old = process.env[key]; process.env[key] = value;
      assert.equal(getContactConfig(), null, key); process.env[key] = old;
    }
  } finally { for (const key of Object.keys(process.env)) if (!(key in previous)) delete process.env[key]; Object.assign(process.env, previous); }
});

test('input validation rejects header injection, missing consent, honeypots, bad services, oversized fields and tokens', () => {
  assert.ok(inquiry);
  for (const change of [
    { email: 'a@example.com\r\nBcc: victim@example.com' }, { email: 'a@example.com, b@example.com' },
    { name: 'A\nB' }, { name: 'a'.repeat(101) }, { company: 'a'.repeat(151) },
    { service: '__proto__' }, { service: 'unknown' }, { locale: 'fr' }, { consent: false },
    { website: 'spam' }, { message: 'short' }, { message: 'a'.repeat(3001) }, { token: '' }, { token: 'a'.repeat(2049) },
  ]) assert.equal(parseInquiry({ ...valid, ...change }), null, JSON.stringify(change));
  assert.equal(parseInquiry(null), null);
  assert.equal(parseInquiry([]), null);
  assert.ok(parseInquiry({ ...valid, name: '李先生', message: 'مرحبا نرغب في مناقشة المشروع\nNext line.' }));
});

test('proxy identification ignores untrusted forwarding headers and groups IPv6 networks', () => {
  assert.equal(clientAddress(new Headers({ 'x-forwarded-for': '192.0.2.1' })), null);
  assert.equal(clientAddress(new Headers({ 'x-grt-client-ip': 'bad, 192.0.2.1' })), null);
  assert.equal(clientNetwork('::ffff:192.0.2.1'), '192.0.2.1');
  assert.equal(clientNetwork('2001:0db8:1234:0001::1'), clientNetwork('2001:db8:1234:1:ffff::2'));
  assert.notEqual(clientNetwork('2001:db8:1234:2::1'), clientNetwork('2001:db8:1234:1::1'));
});

test('body limits apply to real streamed bytes and malformed UTF-8/JSON is rejected', async () => {
  assert.deepEqual(await readBody(request()), valid);
  await assert.rejects(readBody(request(' '.repeat(16_385))), error => error.status === 413);
  await assert.rejects(readBody(request('{}', { 'content-length': '99999' })), error => error.status === 413);
  await assert.rejects(readBody(request('not-json')));
  await assert.rejects(readBody(new Request(`${config.origin}/api/contact`, { method: 'POST', body: new Uint8Array([0xc3, 0x28]) })));
});

test('a stalled request body is cancelled after the read deadline', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const stream = new ReadableStream({ start() {} });
  const pending = readBody(new Request(`${config.origin}/api/contact`, { method: 'POST', body: stream, duplex: 'half' }));
  t.mock.timers.tick(5001);
  await assert.rejects(pending, error => error.status === 408);
});

test('Turnstile requires success, correct hostname/action; failures and provider errors never pass', async () => {
  let outbound;
  const fake = result => async (url, options) => { outbound = { url, options }; return Response.json(result); };
  assert.equal(await verifyTurnstile('token', '192.0.2.1', config, fake({ success: true, hostname: new URL(config.origin).hostname, action: 'contact' })), true);
  assert.equal(outbound.url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.equal(JSON.parse(outbound.options.body).secret, config.secret);
  assert.ok(outbound.options.signal);
  for (const result of [{ success: false }, { success: true, hostname: 'other.example', action: 'contact' }, { success: true, hostname: new URL(config.origin).hostname, action: 'login' }, {}]) assert.equal(await verifyTurnstile('token', '192.0.2.1', config, fake(result)), false);
  await assert.rejects(verifyTurnstile('token', '192.0.2.1', config, async () => { throw new Error('Network unavailable'); }));
});

test('quota survives restart, limits concurrent sends, and stores no inquiry text or raw identifiers', async t => {
  const directory = await temporary(t);
  const store = createQuotaStore(directory, () => 1_000_000);
  const results = await Promise.all(Array.from({ length: 8 }, (_, i) => store.reserve('192.0.2.1', { ...inquiry, message: `Concurrent inquiry number ${i}` })));
  assert.equal(results.filter(result => result.kind === 'reserved').length, 3);
  const restarted = createQuotaStore(directory, () => 1_000_001);
  assert.equal((await restarted.reserve('192.0.2.1', { ...inquiry, message: 'New inquiry after restart' })).kind, 'limited');
  const disk = await readFile(join(directory, 'quota.json'), 'utf8');
  for (const value of ['192.0.2.1', inquiry.email, inquiry.name, 'Concurrent inquiry']) assert.ok(!disk.includes(value), value);
});

test('quota deduplicates accepted messages and holds ambiguous deliveries without resending', async t => {
  const directory = await temporary(t);
  let now = 1_000_000;
  const store = createQuotaStore(directory, () => now);
  const reserved = await store.reserve('192.0.2.1', inquiry);
  assert.equal(reserved.kind, 'reserved');
  assert.equal((await store.reserve('192.0.2.1', inquiry)).kind, 'uncertain');
  await store.accepted(reserved.digest);
  assert.equal((await createQuotaStore(directory, () => now).reserve('192.0.2.2', inquiry)).kind, 'duplicate');
  now += 900_001;
  assert.equal((await store.reserve('192.0.2.1', inquiry)).kind, 'reserved');
});

test('global hourly/daily quotas apply across addresses and cannot be cleared by corrupted state', async t => {
  const directory = await temporary(t);
  let now = 1_000_000;
  const store = createQuotaStore(directory, () => now);
  let sequence = 0;
  const next = () => store.reserve(`192.0.2.${++sequence}`, { ...inquiry, email: `person${sequence}@example.com`, message: `Unique inquiry number ${sequence}` });
  for (let hour = 0; hour < 5; hour++) {
    for (let i = 0; i < 20; i++) assert.equal((await next()).kind, 'reserved');
    assert.equal((await next()).kind, 'limited');
    now += 3_600_001;
  }
  assert.equal((await next()).kind, 'limited');
  now += 24 * 3_600_000;
  assert.equal((await next()).kind, 'reserved');
  await writeFile(join(directory, 'quota.json'), '{broken');
  await assert.rejects(store.reserve('192.0.2.1', inquiry));
});

test('SMTP envelope and MIME are fixed to support; visitor is Reply-To and content is plain text', async () => {
  const parsed = parseInquiry({ ...valid, from: 'attacker@example.com', to: 'victim@example.com', bcc: 'victim@example.com', message: '<script>alert(1)</script> project inquiry' });
  const mail = inquiryMail(parsed);
  assert.equal(mail.from.address, 'support@gr-tech.id');
  assert.equal(mail.to, 'support@gr-tech.id');
  assert.deepEqual(mail.envelope.to, ['support@gr-tech.id']);
  assert.equal(mail.replyTo.address, inquiry.email);
  assert.equal(mail.bcc, undefined);
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const result = await transport.sendMail(mail);
  const mime = result.message.toString();
  assert.match(mime, /Content-Type: text\/plain/);
  assert.match(mime, /Reply-To: A Customer <visitor@example.com>/);
  assert.doesNotMatch(mime, /Bcc:|Content-Type: text\/html|victim@example.com/);
  assert.equal(relayOptions.host, 'smtp-relay.gmail.com');
  assert.equal(relayOptions.requireTLS, true);
  assert.equal(relayOptions.tls.rejectUnauthorized, true);
  assert.equal(relayOptions.auth, undefined);
  await assert.rejects(sendInquiry(inquiry, { sendMail: async () => ({ accepted: [], rejected: ['support@gr-tech.id'] }) }));
});

function handler(overrides = {}) {
  const calls = { verified: 0, sent: 0, reserved: 0, accepted: 0, reported: 0 };
  const deps = {
    config: () => config,
    verify: async () => { calls.verified++; return true; },
    store: () => ({ reserve: async () => { calls.reserved++; return { kind: 'reserved', digest: 'test', retryAfter: 0 }; }, accepted: async () => { calls.accepted++; } }),
    send: async () => { calls.sent++; }, report: () => { calls.reported++; }, ...overrides,
  };
  return { run: createContactHandler(deps), calls };
}

test('HTTP handler rejects disabled, cross-origin, invalid, oversized, missing-proxy and failed-challenge requests before SMTP', async () => {
  const disabled = handler({ config: () => null });
  assert.equal((await disabled.run(request())).status, 503);
  const h = handler();
  for (const [req, expected] of [[request(valid, { origin: 'https://other.example' }), 403], [request(valid, { 'sec-fetch-site': 'cross-site' }), 403], [request(valid, { 'content-type': 'text/plain' }), 415], [request(valid, { 'x-grt-client-ip': '' }), 503], [request({ ...valid, consent: false }), 400], [request(' '.repeat(16_385)), 413]]) assert.equal((await h.run(req)).status, expected);
  assert.equal(h.calls.sent, 0);
  const failed = handler({ verify: async () => false });
  assert.equal((await failed.run(request())).status, 422);
  assert.equal(failed.calls.sent, 0);
  assert.equal(failed.calls.reserved, 0);
});

test('HTTP handler sends once, records SMTP acceptance, limits requests, and returns no sensitive diagnostics', async () => {
  const h = handler();
  const response = await h.run(request());
  assert.equal(response.status, 200);
  assert.equal(h.calls.sent, 1);
  assert.equal(h.calls.accepted, 1);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  for (let i = 0; i < 9; i++) await h.run(request());
  assert.equal((await h.run(request())).status, 429);
  const rejected = handler({ send: async () => { throw new Error('secret SMTP response'); } });
  const error = await rejected.run(request());
  assert.equal(error.status, 503);
  assert.doesNotMatch(await error.text(), /secret|SMTP|visitor/);
  assert.equal(rejected.calls.accepted, 0);
});

test('duplicates, ambiguous reservations, storage failures and verification failures never cause another SMTP send', async () => {
  for (const [kind, status] of [['duplicate', 200], ['uncertain', 409], ['limited', 429]]) {
    const h = handler({ store: () => ({ reserve: async () => ({ kind, retryAfter: 120 }) }) });
    const response = await h.run(request());
    assert.equal(response.status, status);
    assert.equal(h.calls.sent, 0);
  }
  for (const override of [{ verify: async () => { throw new Error('provider offline'); } }, { store: () => ({ reserve: async () => { throw new Error('disk full'); } }) }]) {
    const h = handler(override);
    assert.equal((await h.run(request())).status, 503);
    assert.equal(h.calls.sent, 0);
  }
});

test('HTTP handler bounds simultaneous processing before making more provider calls', async () => {
  let release;
  const wait = new Promise(resolve => { release = resolve; });
  const h = handler({ verify: async () => { await wait; return true; } });
  const first = h.run(request()), second = h.run(request());
  assert.equal((await h.run(request())).status, 429);
  release();
  assert.deepEqual((await Promise.all([first, second])).map(response => response.status), [200, 200]);
});

test('audit exception only accepts exact reviewed dev version/advisory and expires; new or runtime findings fail', () => {
  const path = 'node_modules/minimatch';
  const report = { metadata: { vulnerabilities: { total: 1 } }, vulnerabilities: { minimatch: { nodes: [path], via: [{ url: 'https://github.com/advisories/GHSA-g3hv-75wg-m249', severity: 'moderate' }] } } };
  const lock = { packages: { [path]: { dev: true, version: '3.1.5' } } };
  assert.equal(auditFindings(report, lock, new Date('2026-11-01')).exceptions.length, 1);
  assert.equal(auditFindings(report, lock, new Date('2026-12-01')).unresolved.length, 1);
  assert.equal(auditFindings(report, { packages: { [path]: { dev: false, version: '3.1.5' } } }).unresolved.length, 1);
  assert.equal(auditFindings(report, { packages: { [path]: { dev: true, version: '10.2.5' } } }).unresolved.length, 1);
  assert.equal(auditFindings({ error: {} }, lock).unresolved.length, 1);
  const newAdvisory = structuredClone(report);
  newAdvisory.vulnerabilities.minimatch.via[0].url = 'https://github.com/advisories/new-finding';
  assert.equal(auditFindings(newAdvisory, lock, new Date('2026-11-01')).unresolved.length, 1);
});
