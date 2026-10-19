"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X, Globe2 } from "lucide-react";
import { navigation, secondaryNavigation, m, text, url, type Locale } from "@/lib/content";
import { t, locales, languageNames } from "@/lib/i18n";
import { Brand } from "./ui";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const path = pathname.replace(/^\/(id|en|ar|zh)(?=\/|$)/, "").replace(/^\//, "");
  const active = (page: string) => page ? pathname.startsWith(url(locale, page)) : pathname === url(locale);
  return <>
    <div className="topbar"><div className="container topbar-inner"><span><i />{t(locale,"header.technical_precision_confidence_at_every_step")}</span><span className="topbar-right">{t(locale,"ui.mep_disciplines")}</span></div></div>
    <header className="header"><div className="container header-inner">
      <Link href={url(locale)} aria-label={`Green Ridge Technics — ${t(locale,"content.home")}`}><Brand /></Link>
      <nav className="desktop-nav" aria-label={t(locale,"header.main_navigation")}>
        {navigation.map(item => <Link key={item.path} href={url(locale,item.path)} className={active(item.path)?"active":""} aria-current={active(item.path)?"page":undefined}>{text(item.label,locale)}</Link>)}
        <details className="nav-more"><summary>{t(locale,"header.more")}<ChevronDown size={12} /></summary><div className="nav-dropdown">{secondaryNavigation.map(item=><Link key={item.path} href={url(locale,item.path)} onClick={event=>event.currentTarget.closest("details")?.removeAttribute("open")}>{text(item.label,locale)}<ArrowUpRight size={14}/></Link>)}</div></details>
      </nav>
      <div className="header-actions"><label className="language-switch"><Globe2 size={15}/><select aria-label={t(locale,"ui.language")} value={locale} onChange={event=>router.push(url(event.target.value as Locale,path))}>{locales.map(language=><option key={language} value={language} lang={language}>{languageNames[language]}</option>)}</select></label><Link className="header-cta" href={url(locale,"contact")}>{t(locale,"content.let_s_talk")}<ArrowUpRight size={16}/></Link><button type="button" className="mobile-menu-button" aria-label={t(locale,"header.open_menu")} onClick={()=>dialog.current?.showModal()}><Menu size={25}/></button></div>
    </div></header>
    <dialog ref={dialog} className="mobile-menu"><div className="mobile-menu-head"><Brand/><button type="button" autoFocus aria-label={t(locale,"header.close_menu")} onClick={()=>dialog.current?.close()}><X/></button></div><nav aria-label={t(locale,"header.mobile_navigation")}>{[...navigation,...secondaryNavigation,{path:"contact",label:m("footer.contact")}].map((item,index)=><Link key={item.path} href={url(locale,item.path)} onClick={()=>dialog.current?.close()}><span className="mobile-nav-number">{String(index+1).padStart(2,"0")}</span>{text(item.label,locale)}<ArrowUpRight size={20}/></Link>)}</nav><div className="mobile-languages" aria-label={t(locale,"ui.language")}>{locales.map(language=><Link key={language} href={url(language,path)} lang={language} hrefLang={language} aria-current={language===locale?"true":undefined} onClick={()=>dialog.current?.close()}>{languageNames[language]}</Link>)}</div></dialog>
  </>;
}
