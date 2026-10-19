import type { MetadataRoute } from "next";
import { paths, url } from "@/lib/content";
import { locales, languageTags } from "@/lib/i18n";
import { siteOrigin } from "@/lib/seo";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  return paths.flatMap(path => locales.map(locale => ({ url: `${origin}${url(locale,path)}`, changeFrequency: "monthly" as const, priority: path ? .7 : 1, alternates: { languages: Object.fromEntries(locales.map(language => [languageTags[language], `${origin}${url(language,path)}`])) } })));
}
