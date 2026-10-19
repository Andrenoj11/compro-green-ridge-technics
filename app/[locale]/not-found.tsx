"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { isLocale, t, url } from "@/lib/i18n";
export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale && isLocale(params.locale) ? params.locale : "id";
  return <section className="not-found"><span>404</span><h1>{t(locale,"ui.not_found")}</h1><div><Link className="button button-green" href={url(locale)}>{t(locale,"ui.return_home")} ↗</Link></div></section>;
}
