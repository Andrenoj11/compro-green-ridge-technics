import assert from 'node:assert/strict';
import test from 'node:test';

const origin = process.env.TEST_URL || 'http://localhost:3000';
const get = path => fetch(new URL(path, origin));
const paths = ['', 'about', 'services', 'projects', 'insights', 'gallery', 'tools', 'certifications', 'careers', 'contact', 'privacy', 'services/testing', 'services/inspection', 'services/commissioning', 'services/energy-efficiency', 'projects/data-center', 'projects/commercial-building', 'projects/industrial-facility', 'insights/commissioning-from-the-start', 'insights/understanding-tab', 'insights/efficient-building-systems'];
const routes = new Set(paths.flatMap(path => ['id', 'en'].map(locale => `/${locale}${path ? `/${path}` : ''}`)));

test('entry redirects to the Indonesian homepage', async () => {
  const response = await fetch(origin, { redirect: 'manual' });
  assert.ok([307, 308].includes(response.status));
  assert.equal(response.headers.get('location'), '/id');
});

test('all 42 pages render meaningful, localized HTML and valid internal links', async () => {
  for (const path of routes) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const locale = path.split('/')[1];
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`), path);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one h1`);
    assert.match(html, /Green Ridge Technics/, path);
    assert.match(html, /<title>[^<]+Green Ridge Technics<\/title>/, path);
    assert.match(html, /rel="canonical"/, path);
    assert.match(html, /hrefLang="id-ID"/i, path);
    assert.match(html, /hrefLang="en"/i, path);
    assert.match(html, /name="robots" content="noindex, nofollow"/, path);
    assert.match(html, /property="og:image"/, path);
    const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(schema, `${path}: structured data`);
    assert.equal(JSON.parse(schema[1])['@graph'].find(item => item['@type'] === 'WebPage').inLanguage, locale);
    for (const [, href] of html.matchAll(/href="(\/[^"?#]*)"/g)) {
      if (/^\/(id|en)(\/|$)/.test(href)) assert.ok(routes.has(href), `${path}: broken internal link ${href}`);
    }
  }
});

test('sitemap lists both locales and preview robots prevent indexing', async () => {
  const sitemapResponse = await get('/sitemap.xml');
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  assert.deepEqual(new Set(locations), routes);
  assert.match(sitemap, /hreflang="id-ID"/);
  assert.match(sitemap, /hreflang="en"/);
  const robots = await (await get('/robots.txt')).text();
  assert.match(robots, /Disallow: \//);
  assert.match(robots, /Sitemap: http/);
});

test('unknown pages and unsupported languages return 404', async () => {
  for (const path of ['/id/not-a-page', '/en/services/not-a-service', '/fr', '/id/projects/data-center/extra']) {
    const response = await get(path);
    assert.equal(response.status, 404, path);
  }
});

test('image assets and presentation disclosures are available', async () => {
  for (const path of ['/icon.png', '/og.png', '/images/data-center.jpg', '/images/building.jpg', '/images/engineering.jpg', '/images/industrial.jpg']) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type'), /^image\//, path);
  }
  const contact = await (await get('/en/contact')).text();
  assert.match(contact, /does not send a message/);
  const projects = await (await get('/en/projects')).text();
  assert.match(projects, /not projects delivered by Green Ridge Technics/);
  const certificates = await (await get('/en/certifications')).text();
  assert.match(certificates, /does not currently claim any certification/);
});
