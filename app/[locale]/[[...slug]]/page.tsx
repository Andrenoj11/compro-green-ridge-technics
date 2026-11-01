import { notFound } from "next/navigation";
import { HomePage } from "@/components/home";
import { ContentPage, ServiceDetail, ArticleDetail } from "@/components/pages";
import { company, isLocale, locales, paths, services, t, text, url } from "@/lib/content";
import { pageMetadata, routeInfo, siteOrigin } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug?: string[] }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug = [] } = await params;
  if (!isLocale(locale) || !paths.includes(slug.join("/"))) notFound();
  return pageMetadata(locale, slug.join("/"));
}

export default async function Page({ params }: Props) {
  const { locale, slug = [] } = await params;
  const path = slug.join("/");
  if (!isLocale(locale) || !paths.includes(path)) notFound();
  const info = routeInfo(path)!;
  const origin = await siteOrigin();
  const service = path.startsWith("services/") ? services.find(item => item.slug === slug[1]) : undefined;
  const structuredData = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "Organization", "@id": `${origin}/#organization`, name: company.name, legalName: "PT Green Ridge Technics", url: origin, logo: `${origin}/images/logo-grt.svg`, email: company.email, areaServed: company.serviceAreas,
        address: { "@type": "PostalAddress", streetAddress: "Jl. Bintaro Raya Selatan No. 8, RT 012/RW 10, Kebayoran Lama Utara, Kebayoran Lama", addressLocality: "Jakarta Selatan", addressRegion: "DKI Jakarta", postalCode: "12240", addressCountry: "ID" } },
      { "@type": "WebSite", "@id": `${origin}/#website`, name: "Green Ridge Technics", url: origin, inLanguage: [...locales], publisher: { "@id": `${origin}/#organization` } },
      { "@type": "WebPage", name: text(info.title, locale).replace(/\n/g, " "), description: text(info.description, locale), url: `${origin}${url(locale, path)}`, inLanguage: locale, isPartOf: { "@id": `${origin}/#website` } },
      ...(service ? [{ "@type": "Service", "@id": `${origin}${url(locale, path)}#service`, name: text(service.name, locale), description: text(info.description, locale), serviceType: text(service.name, locale), areaServed: company.serviceAreas, provider: { "@id": `${origin}/#organization` }, url: `${origin}${url(locale, path)}` }] : []),
      ...(path ? [{ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: t(locale,"content.home"), item: `${origin}${url(locale)}` }, { "@type": "ListItem", position: 2, name: text(info.title, locale).replace(/\n/g, " "), item: `${origin}${url(locale, path)}` }] }] : []),
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />{!path ? <HomePage locale={locale} /> : slug.length === 1 ? <ContentPage locale={locale} path={path} /> : slug[0] === "services" ? <ServiceDetail locale={locale} slug={slug[1]} /> : <ArticleDetail locale={locale} slug={slug[1]} />}</>;
}
