"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X, Globe2 } from "lucide-react";
import { navigation, secondaryNavigation, text, url, type Locale } from "@/lib/content";
import { Brand } from "./ui";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const otherLocale = locale === "id" ? "en" : "id";
  const alternatePath = pathname.replace(/^\/(id|en)(?=\/|$)/, `/${otherLocale}`);
  const active = (path: string) => path ? pathname.startsWith(url(locale, path)) : pathname === url(locale);
  return <>
    <div className="topbar"><div className="container topbar-inner"><span><i />{locale === "id" ? "Presisi teknis. Keyakinan di setiap langkah." : "Technical precision. Confidence at every step."}</span><span className="topbar-right">TESTING · INSPECTION · COMMISSIONING</span></div></div>
    <header className="header"><div className="container header-inner">
      <Link href={url(locale)} aria-label="Green Ridge Technics — Home"><Brand /></Link>
      <nav className="desktop-nav" aria-label={locale === "id" ? "Navigasi utama" : "Main navigation"}>
        {navigation.map(item => <Link key={item.path} href={url(locale, item.path)} className={active(item.path) ? "active" : ""} aria-current={active(item.path) ? "page" : undefined}>{text(item.label, locale)}</Link>)}
        <details className="nav-more"><summary>{locale === "id" ? "Lainnya" : "More"}<ChevronDown size={12} /></summary><div className="nav-dropdown">{secondaryNavigation.map(item => <Link key={item.path} href={url(locale, item.path)} onClick={event => event.currentTarget.closest("details")?.removeAttribute("open")}>{text(item.label, locale)}<ArrowUpRight size={14} /></Link>)}</div></details>
      </nav>
      <div className="header-actions"><Link className="language-switch" href={alternatePath} hrefLang={otherLocale} aria-label={otherLocale === "en" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}><Globe2 size={15} /><span>{locale.toUpperCase()}</span><span className="language-other">/ {otherLocale.toUpperCase()}</span></Link><Link className="header-cta" href={url(locale, "contact")}>{locale === "id" ? "Hubungi Kami" : "Let's Talk"}<ArrowUpRight size={16} /></Link><button className="mobile-menu-button" aria-label={locale === "id" ? "Buka menu" : "Open menu"} onClick={() => dialog.current?.showModal()}><Menu size={25} /></button></div>
    </div></header>
    <dialog ref={dialog} className="mobile-menu"><div className="mobile-menu-head"><Brand /><button autoFocus aria-label={locale === "id" ? "Tutup menu" : "Close menu"} onClick={() => dialog.current?.close()}><X /></button></div><nav aria-label={locale === "id" ? "Menu seluler" : "Mobile navigation"}>{[...navigation, ...secondaryNavigation, { path: "contact", label: { id: "Hubungi Kami", en: "Contact Us" } }].map((item, index) => <Link key={item.path} href={url(locale, item.path)} onClick={() => dialog.current?.close()}><span className="mobile-nav-number">{String(index + 1).padStart(2, "0")}</span>{text(item.label, locale)}<ArrowUpRight size={20} /></Link>)}</nav><div className="mobile-menu-bottom">ENGINEERED FOR CONFIDENCE.</div></dialog>
  </>;
}
