import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const origin = process.env.TEST_URL || 'http://localhost:3000';
const get = path => fetch(new URL(path, origin));
const paths = ['', 'about', 'services', 'insights', 'gallery', 'tools', 'certifications', 'careers', 'contact', 'privacy', 'services/testing', 'services/inspection', 'services/commissioning', 'services/management', 'insights/commissioning-from-the-start', 'insights/understanding-tab', 'insights/efficient-building-systems'];
const routes = new Set(paths.flatMap(path => ['id', 'en', 'ar', 'zh'].map(locale => `/${locale}${path ? `/${path}` : ''}`)));

test('entry redirects to the Indonesian homepage', async () => {
  const response = await fetch(origin, { redirect: 'manual' });
  assert.ok([307, 308].includes(response.status));
  assert.equal(response.headers.get('location'), '/id');
});

test('all 68 pages render meaningful, localized HTML and valid internal links', async () => {
  for (const path of routes) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const locale = path.split('/')[1];
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`), path);
    assert.match(html, new RegExp(`<html[^>]*dir="${locale === 'ar' ? 'rtl' : 'ltr'}"`), path);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one h1`);
    assert.match(html, /Green Ridge Technics/, path);
    assert.match(html, /<title>[^<]+Green Ridge Technics<\/title>/, path);
    assert.match(html, /rel="canonical"/, path);
    assert.match(html, /hrefLang="id-ID"/i, path);
    assert.match(html, /hrefLang="en"/i, path);
    assert.match(html, /hrefLang="ar"/i, path);
    assert.match(html, /hrefLang="zh-CN"/i, path);
    assert.doesNotMatch(html, /href="\/(id|en|ar|zh)\/projects(?:\/|")/, path);
    assert.match(html, /name="robots" content="noindex, nofollow"/, path);
    assert.match(html, /property="og:image"/, path);
    assert.doesNotMatch(html, /class="(?:footer-draft|footer-wordmark|about-image-note|photo-note|form-note)"/, path);
    assert.doesNotMatch(html, /Presentation version|Presentation mode|Illustrative photography|INFORMATION IN PREPARATION|coming here soon|Versi presentasi|Mode presentasi|Foto ilustrasi|INFORMASI DALAM PERSIAPAN|صور توضيحية|النسخة التعريفية|المعلومات قيد الإعداد|示意图片|展示版本|信息准备中/i, path);
    const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(schema, `${path}: structured data`);
    assert.equal(JSON.parse(schema[1])['@graph'].find(item => item['@type'] === 'WebPage').inLanguage, locale);
    for (const [, href] of html.matchAll(/href="(\/[^"?#]*)"/g)) {
      if (/^\/(id|en|ar|zh)(\/|$)/.test(href)) assert.ok(routes.has(href), `${path}: broken internal link ${href}`);
    }
  }
});

test('sitemap lists all four locales and preview robots prevent indexing', async () => {
  const sitemapResponse = await get('/sitemap.xml');
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  assert.deepEqual(new Set(locations), routes);
  assert.match(sitemap, /hreflang="id-ID"/);
  assert.match(sitemap, /hreflang="en"/);
  assert.match(sitemap, /hreflang="ar"/);
  assert.match(sitemap, /hreflang="zh-CN"/);
  assert.doesNotMatch(sitemap, /\/projects/);
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

test('image assets and accurate contact form instructions are available', async () => {
  for (const path of ['/icon.png', '/icon.svg', '/images/logo-grt.svg', '/images/profile-about.png', '/og.png', '/images/data-center.jpg', '/images/building.jpg', '/images/engineering.jpg', '/images/industrial.jpg']) {
    const response = await get(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type'), /^image\//, path);
  }
  const contact = await (await get('/en/contact')).text();
  assert.match(contact, /does not send a message/);
  const certificates = await (await get('/en/certifications')).text();
  assert.match(certificates, /Quality and professional standards/);
  assert.match(certificates, /Discuss the documentation and competency requirements/);
  assert.doesNotMatch(certificates, /will be shown after|does not currently claim any certification/);
});


test('all language JSON files have complete matching keys', async () => {
  const languages = ['id', 'en', 'ar', 'zh'];
  const catalogs = await Promise.all(languages.map(async locale => JSON.parse(await readFile(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8'))));
  const keys = Object.keys(catalogs[1]).sort();
  for (const [i, catalog] of catalogs.entries()) {
    assert.deepEqual(Object.keys(catalog).sort(), keys, languages[i]);
    for (const [key, value] of Object.entries(catalog)) assert.ok(typeof value === 'string' && value.trim(), `${languages[i]}: ${key}`);
  }
  assert.match(catalogs[2]['content.pt_green_ridge_technics_is_a_company'], /[\u0600-\u06ff]/);
  assert.match(catalogs[3]['content.pt_green_ridge_technics_is_a_company'], /[\u4e00-\u9fff]/);
});

test('about page includes the company profile, four missions, and director statement', async () => {
  const html = await (await get('/en/about')).text();
  for (const phrase of ['Mechanical, Electrical, and Plumbing (MEP)', 'Muhammad Zikri Pratama', 'Creating meaningful value.', 'To become a professional, reliable, and trusted company', 'Delivering the Best and Most Trusted Services', 'Developing and Empowering High-Quality Human Resources', 'Creating Broad Employment Opportunities', 'Upholding a Strong Commitment']) assert.ok(html.includes(phrase), phrase);
  assert.doesNotMatch(html, /OUR DRAFT VISION|initial presentation concept/);
});

test('the service catalog matches all four Services groups in the PDF', async () => {
  const expected = { management: ['Management Services', 'Project Management Handling', 'MEP Assessment'], inspection: ['Inspection Services', 'Welding Inspection', 'Equipment Fire Inspection'], testing: ['System Test Services', 'Pressure Test for Piping System', 'Indoor Air Quality', 'Testing, Adjusting and Balancing', 'Breaker Test', 'Room Integrity Test', 'Duct Air Leakage Pressure Test', 'Transmitter Verification'], commissioning: ['Commissioning Services', 'Commissioning for Mechanical System', 'Commissioning for Plumbing System', 'Commissioning for BMS System'] };
  for (const [slug, phrases] of Object.entries(expected)) {
    const html = await (await get(`/en/services/${slug}`)).text();
    for (const phrase of phrases) assert.ok(html.includes(phrase), `${slug}: ${phrase}`);
  }
  assert.equal((await get('/en/services/energy-efficiency')).status, 404);
});

test('projects and project details are temporarily unavailable in every locale', async () => {
  for (const locale of ['id', 'en', 'ar', 'zh']) {
    for (const path of ['projects', 'projects/data-center', 'projects/commercial-building', 'projects/industrial-facility']) assert.equal((await get(`/${locale}/${path}`)).status, 404, `${locale}/${path}`);
  }
});

test('the new logo is a transparent SVG containing actual vector paths', async () => {
  const svg = await (await get('/images/logo-grt.svg')).text();
  assert.match(svg, /<svg[^>]*viewBox=/);
  assert.match(svg, /<path\b/);
  assert.doesNotMatch(svg, /<image\b|<rect\b|data:image|<script\b/);
});
