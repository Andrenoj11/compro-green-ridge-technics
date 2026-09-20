import type { MetadataRoute } from "next";
import { paths, url } from "@/lib/content";
import { siteOrigin } from "@/lib/seo";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await siteOrigin();
  return paths.flatMap(path => (["id", "en"] as const).map(locale => ({ url: `${origin}${url(locale, path)}`, changeFrequency: "monthly" as const, priority: path ? .7 : 1, alternates: { languages: { "id-ID": `${origin}${url("id", path)}`, en: `${origin}${url("en", path)}` } } })));
}
