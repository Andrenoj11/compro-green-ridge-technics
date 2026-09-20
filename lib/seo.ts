import type { Metadata } from "next";
import { headers } from "next/headers";
import { articles, b, pageInfo, projects, services, text, url, type Locale } from "./content";

export const indexable = process.env.SITE_INDEXABLE === "true";

export async function siteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host")?.split(",")[0].trim() || requestHeaders.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

export function routeInfo(path: string) {
  if (!path) return { title: b("Testing, Inspection & Commissioning", "Testing, Inspection & Commissioning"), description: b("Green Ridge Technics — mitra teknis untuk testing, inspection, commissioning, dan evaluasi kinerja fasilitas. Ketelitian teknis untuk keyakinan di setiap langkah.", "Green Ridge Technics — your technical partner for testing, inspection, commissioning, and facility performance. Technical precision for confidence at every step.") };
  if (pageInfo[path]) return pageInfo[path];
  const [section, slug] = path.split("/");
  if (section === "services") { const service = services.find(s => s.slug === slug); if (service) return { title: service.name, description: service.description }; }
  if (section === "projects") { const project = projects.find(p => p.slug === slug); if (project) return { title: project.name, description: project.description }; }
  if (section === "insights") { const article = articles.find(a => a.slug === slug); if (article) return { title: article.title, description: article.excerpt }; }
  return null;
}

export async function pageMetadata(locale: Locale, path: string): Promise<Metadata> {
  const info = routeInfo(path);
  if (!info) return { title: "Page not found", robots: { index: false, follow: false } };
  const origin = await siteOrigin();
  const title = `${text(info.title, locale).replace(/\n/g, " ")} | Green Ridge Technics`;
  const description = text(info.description, locale);
  return {
    metadataBase: new URL(origin), title, description,
    applicationName: "Green Ridge Technics",
    alternates: { canonical: url(locale, path), languages: { "id-ID": url("id", path), "en": url("en", path), "x-default": url("id", path) } },
    robots: { index: indexable, follow: indexable },
    openGraph: { type: "website", siteName: "Green Ridge Technics", title, description, locale: locale === "id" ? "id_ID" : "en_US", alternateLocale: locale === "id" ? "en_US" : "id_ID", url: `${origin}${url(locale, path)}`, images: [{ url: `${origin}/og.png`, width: 1736, height: 906, alt: "Green Ridge Technics — Engineered for confidence." }] },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
    icons: { icon: "/icon.png", apple: "/icon.png" },
  };
}
