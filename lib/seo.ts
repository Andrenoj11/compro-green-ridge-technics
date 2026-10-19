import { t, locales, languageTags, openGraphLocales } from "./i18n";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { articles, m, pageInfo, paths, services, text, url, type Locale } from "./content";

export const indexable = process.env.SITE_INDEXABLE === "true";

export async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host")?.split(",")[0].trim() || requestHeaders.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

export function routeInfo(path: string) {
  if (!paths.includes(path)) return null;
  if (!path) return { title: m("content.testing_inspection_commissioning"), description: m("content.green_ridge_technics_your_technical_partner_for") };
  if (pageInfo[path]) return pageInfo[path];
  const [section, slug] = path.split("/");
  if (section === "services") { const service = services.find(s => s.slug === slug); if (service) return { title: service.name, description: service.description }; }
  if (section === "insights") { const article = articles.find(a => a.slug === slug); if (article) return { title: article.title, description: article.excerpt }; }
  return null;
}

export async function pageMetadata(locale: Locale, path: string): Promise<Metadata> {
  const info = routeInfo(path);
  if (!info) return { title: t(locale,"ui.not_found"), robots: { index: false, follow: false } };
  const origin = await siteOrigin();
  const title = `${text(info.title, locale).replace(/\n/g, " ")} | Green Ridge Technics`;
  const description = text(info.description, locale);
  return {
    metadataBase: new URL(origin), title, description,
    applicationName: "Green Ridge Technics",
    alternates: { canonical: url(locale, path), languages: { ...Object.fromEntries(locales.map(language=>[languageTags[language],url(language,path)])), "x-default":url("id",path) } },
    robots: { index: indexable, follow: indexable },
    openGraph: { type: "website", siteName: "Green Ridge Technics", title, description, locale: openGraphLocales[locale], alternateLocale: locales.filter(language=>language!==locale).map(language=>openGraphLocales[language]), url: `${origin}${url(locale, path)}`, images: [{ url: `${origin}/og.png`, width: 1736, height: 906, alt: "Green Ridge Technics — Engineered for confidence." }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
    icons: { icon: [{url:"/icon.svg",type:"image/svg+xml"},{url:"/icon.png",type:"image/png"}], apple: "/icon.png" },
  };
}
