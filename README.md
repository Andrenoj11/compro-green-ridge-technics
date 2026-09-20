# Green Ridge Technics

Bilingual company profile and design presentation built with **Next.js App Router, TypeScript, Tailwind CSS 4, and React**. Primary commands use real Next.js; an additional Sites/vinext adapter is retained solely for optional private Cloudflare preview hosting.

## Run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/id` or `/en`. `/` redirects to Indonesian.

```sh
npm run build
npm start
npm run lint
npm run typecheck
npm test
```

The HTTP integration tests expect a running server at `http://localhost:3000`. Set `TEST_URL` to test another local production server. Tests check all 42 localized pages, internal links, metadata, language tags, 404 responses, sitemap, robots, assets, and presentation disclosures.

## Content and pages

`lib/content.ts` contains bilingual company information, navigation, services, illustrative projects, articles, and page introductions. All 21 page variants are available in both languages:

- Home, About, Services, Projects, Insights, Gallery, Equipment, Certifications, Careers, Contact, Privacy.
- Four service detail pages, three illustrative project studies, three complete introductory articles.

Shared page layouts are in `components/pages.tsx`; the homepage is `components/home.tsx`. Visual styles and responsive breakpoints are in `app/globals.css`. Language switching preserves the current page. A native dialog provides the mobile menu and gallery lightbox; project and gallery filters work without a backend. CSS transitions and IntersectionObserver reveal effects respect `prefers-reduced-motion`.

## Draft content and contact behavior

Business scope follows the initial testing / inspection / commissioning assumption. Logo, copy, and imagery are presentation assets. Projects are explicitly illustrative. The certifications page makes no certification claims, and careers does not invent open positions.

The contact form validates inputs and prepares a project brief in page memory. Visitors can copy or download it; it does **not** submit or save personal information. Set `company.email` in `lib/content.ts` to expose an approved email contact and a mailto action on the prepared brief. A real submission endpoint can be added later. No CMS, database, analytics, or marketing cookies are implemented.

## SEO

Content is server-rendered. Each page includes a localized title and description, canonical, `hreflang`, Open Graph, Twitter card, semantic headings, and organization / website / webpage / breadcrumb structured data. Photos use `next/image`; the Manrope font is self-hosted.

Copy `.env.example` to `.env.local` if needed. `NEXT_PUBLIC_SITE_URL` sets the final canonical origin; otherwise it is derived from the incoming request. `SITE_INDEXABLE=false` is the safe presentation default. After approving company content and assigning the final domain, set it to `true` and rebuild to allow indexing. A sitemap includes all 42 localized URLs. Implementing SEO does not guarantee search ranking.

## Images

Local copies of illustrative stock photography:

- Data center: https://images.unsplash.com/photo-1558494949-ef010cbdcc31
- Building: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab
- Electronics / technical work: https://images.unsplash.com/photo-1581092921461-eab62e97a780
- Industrial process plant: https://www.pexels.com/photo/257700/ (photo by Pixabay)

These are not company project or employee photographs. Replace them with approved client assets when available.

`public/og.png` was generated with the built-in ImageGen tool. Prompt: a finished landscape social card in forest green, ivory, and lime, with a geometric ridge mark, a data center aisle, and the exact wording “GREEN RIDGE TECHNICS”, “Engineered for confidence.”, and “Testing. Inspection. Commissioning.” The generated card was reviewed for spelling and used as the social-sharing asset. The site logo is a temporary CSS ridge mark; `public/icon.png` is its raster favicon.

## Optional Sites build

```sh
npm run build:sites
```

This produces Worker-compatible output under `dist/` using the retained Sites adapter. Hosting information is stored in `.openai/hosting.json`. Standard deployment to any supported Next.js platform should use `npm run build` and `npm start` instead.
