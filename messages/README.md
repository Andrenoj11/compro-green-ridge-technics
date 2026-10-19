# Website languages

The website uses four complete JSON catalogs: `id.json` (Bahasa Indonesia), `en.json` (English), `ar.json` (Arabic), and `zh.json` (Simplified Chinese / Mandarin).

Keys are grouped by their first source section, such as `content`, `home`, `interactive`, and `pages`. Reused phrases share one key. Change the same key in all four files; preserve `\n` when an intentional heading line break is needed. The integration tests require identical keys and nonempty strings in every catalog.

Use `t(locale, "section.key")` for a string in a component and `m("section.key")` for localized content records. Shared content structure, service slugs, images, and company facts are defined in `lib/content.ts`; user-facing text belongs in these JSON files. Language labels, HTML language tags, and Open Graph locale codes are configured in `lib/i18n.ts`.

Routes use `/id`, `/en`, `/ar`, and `/zh`. Chinese metadata uses `zh-CN`; Arabic uses `dir="rtl"`. Switching languages preserves the current route. Company and personal names, addresses, and technical acronyms are retained where appropriate.

The About Us, vision, four missions, director statement, and service scope follow the supplied *Company Profile - PT Green Ridge Technics.pdf* (2026), pages 3–5 and 7–10. The English source is retained; Indonesian, Arabic, and Chinese are translations. The old project content remains in the source for future use, with its routes and links currently disabled.
