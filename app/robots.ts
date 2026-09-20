import type { MetadataRoute } from "next";
import { indexable, siteOrigin } from "@/lib/seo";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await siteOrigin();
  return { rules: { userAgent: "*", ...(indexable ? { allow: "/" } : { disallow: "/" }) }, sitemap: `${origin}/sitemap.xml` };
}
