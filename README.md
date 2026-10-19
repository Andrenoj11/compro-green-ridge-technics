# Green Ridge Technics

Four-language company profile and design presentation built with **Next.js App Router, TypeScript, Tailwind CSS 4, and React**. Primary commands use real Next.js; an additional Sites/vinext adapter is retained solely for optional private Cloudflare preview hosting.

## Run locally

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/id`, `/en`, `/ar`, or `/zh`. `/` redirects to Indonesian.

```sh
npm run build
npm start
npm run lint
npm run typecheck
npm test
```

The HTTP integration tests expect a running server at `http://localhost:3000`. Set `TEST_URL` to test another local production server. Tests check all 68 localized pages, four complete language catalogs, company profile content, all four service groups, hidden project routes, internal links, language tags and direction, metadata, sitemap, robots, assets, and presentation disclosures.

## Content and pages

`lib/content.ts` contains the company information and content structure. Translations are stored in `messages/id.json`, `messages/en.json`, `messages/ar.json`, and `messages/zh.json`; see `messages/README.md` for editing instructions. Seventeen pages are available in all four languages:

- Home, About, Services, Insights, Gallery, Equipment, Certifications, Careers, Contact, Privacy.
- Management, Inspection, System Test, and Commissioning service detail pages, plus three introductory articles.

The About Us, vision, four mission points, director statement (Muhammad Zikri Pratama), and service scopes follow the supplied 2026 company profile. Project content is retained in the source, but its routes return 404 and its links are removed from the homepage, navigation, footer, metadata, and sitemap.

Shared page layouts are in `components/pages.tsx`; the homepage is `components/home.tsx`. Visual styles and responsive breakpoints are in `app/globals.css`. Language switching preserves the current page. Arabic has a right-to-left layout; Mandarin uses Simplified Chinese. A native dialog provides the mobile menu and gallery lightbox; project and gallery filters work without a backend. CSS transitions and IntersectionObserver reveal effects respect `prefers-reduced-motion`.

## Draft content and contact behavior

The company description, address, vision, mission, director statement, and four service groups follow the supplied 2026 company profile. Other photography and introductory articles remain presentation assets. Projects are currently hidden. The certifications page makes no certification claims, and careers does not invent open positions.

The contact form validates inputs and prepares a project brief in page memory. Visitors can copy or download it; it does **not** submit or save personal information. Set `company.email` in `lib/content.ts` to expose an approved email contact and a mailto action on the prepared brief. A real submission endpoint can be added later. No CMS, database, analytics, or marketing cookies are implemented.

## SEO

Content is server-rendered. Each page includes a localized title and description, canonical, `hreflang`, Open Graph, Twitter card, semantic headings, and organization / website / webpage / breadcrumb structured data. Photos use `next/image`; the Manrope font is self-hosted.

Copy `.env.example` to `.env.local` if needed. `NEXT_PUBLIC_SITE_URL` sets the final canonical origin; otherwise it is derived from the incoming request. `SITE_INDEXABLE=false` is the safe presentation default. After approving company content and assigning the final domain, set it to `true` and rebuild to allow indexing. A sitemap includes all 68 active localized URLs and excludes projects. Implementing SEO does not guarantee search ranking.

## Images

Local copies of illustrative stock photography:

- Data center: https://images.unsplash.com/photo-1558494949-ef010cbdcc31
- Building: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab
- Electronics / technical work: https://images.unsplash.com/photo-1581092921461-eab62e97a780
- Industrial process plant: https://www.pexels.com/photo/257700/ (photo by Pixabay)

These are not company project or employee photographs. Replace them with approved client assets when available.

The supplied company logo is retained unchanged at `public/images/logo-grt.png`. Its traced, transparent vector version, `public/images/logo-grt.svg`, is used in the header, mobile menu, footer, and organization metadata. The footer displays a white silhouette for contrast. `public/icon.svg`, `public/favicon.svg`, and `public/icon.png` use the same company mark. `public/images/profile-about.png` is extracted from page 5 of the supplied company profile.

`public/og.png` was generated with the built-in ImageGen tool. Prompt: a finished landscape social card in forest green, ivory, and lime, with a geometric ridge mark, a data center aisle, and the exact wording “GREEN RIDGE TECHNICS”, “Engineered for confidence.”, and “Testing. Inspection. Commissioning.” The generated card was reviewed for spelling and used as the social-sharing asset. The social card retains the presentation artwork.

## Optional Sites build

```sh
npm run build:sites
```

This produces Worker-compatible output under `dist/` using the retained Sites adapter. Hosting information is stored in `.openai/hosting.json`. Standard deployment to any supported Next.js platform should use `npm run build` and `npm start` instead.
