import type { MetadataRoute } from "next";
import { indexable, siteOrigin } from "@/lib/seo";
// CI builds with indexing off; production controls indexing at container startup.
// Do not bake the CI robots policy into a cached metadata route.
export const dynamic = "force-dynamic";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await siteOrigin();
  return { rules: { userAgent: "*", ...(indexable ? { allow: "/", disallow: "/api/" } : { disallow: "/" }) }, sitemap: `${origin}/sitemap.xml` };
}
