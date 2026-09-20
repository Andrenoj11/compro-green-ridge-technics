import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
const ctx = { waitUntil() {}, passThroughOnException() {} };
const env = { ASSETS: { fetch: async () => new Response('not found', { status: 404 }) } };
for (const path of ['/id', '/en', '/id/services/testing', '/en/contact', '/robots.txt', '/sitemap.xml']) {
  const response = await worker.fetch(new Request(`https://green-ridge-technics.leafy-swan-6083.chatgpt.site${path}`, { headers: { accept: 'text/html' } }), env, ctx);
  assert.equal(response.status, 200, path);
  const body = await response.text();
  if (path.startsWith('/id') || path.startsWith('/en')) assert.match(body, /Green Ridge Technics/, path);
  console.log(`PASS ${path}`);
}
