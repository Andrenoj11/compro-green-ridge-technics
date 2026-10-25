import { t } from "@/lib/i18n";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Brand } from "./ui";
import { company, navigation, secondaryNavigation, services, text, url, type Locale } from "@/lib/content";

export function Footer({ locale }: { locale: Locale }) {
  return <footer className="footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Link href={url(locale)} aria-label="Green Ridge Technics"><Brand light /></Link><p>{t(locale, "footer.precision_in_the_process_confidence_in_the")}</p><Link className="footer-contact" href={url(locale, "contact")}>{t(locale, "footer.tell_us_what_you_need")}<ArrowUpRight size={19} /></Link>{company.email && <a className="footer-email" href={`mailto:${company.email}`}><Mail size={16} strokeWidth={1.5} aria-hidden="true" /><span dir="ltr">{company.email}</span></a>}</div><div><h2>{t(locale, "footer.explore")}</h2>{[...navigation.slice(1), secondaryNavigation[0]].map(n => <Link key={n.path} href={url(locale, n.path)}>{text(n.label, locale)}</Link>)}</div><div><h2>{t(locale, "footer.expertise")}</h2>{services.map(s => <Link key={s.slug} href={url(locale, `services/${s.slug}`)}>{text(s.name, locale)}</Link>)}</div><div><h2>{t(locale, "footer.information")}</h2>{secondaryNavigation.slice(1).map(n => <Link key={n.path} href={url(locale, n.path)}>{text(n.label, locale)}</Link>)}<Link href={url(locale, "contact")}>{t(locale, "footer.contact")}</Link><Link href={url(locale, "privacy")}>{t(locale, "footer.privacy")}</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Green Ridge Technics.</span><a href="#top" className="back-top">{t(locale, "footer.back_to_top")}<ArrowUpRight size={14} /></a></div></div></footer>;
}
