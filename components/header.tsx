"use client";

import { useMotionPreference } from "./motion-preference";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "motion";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { navigation, secondaryNavigation, m, text, url, type Locale } from "@/lib/content";
import { t, locales, languageNames } from "@/lib/i18n";
import { Brand } from "./ui";
import { LanguagePicker } from "./language-picker";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const legacyHome = /^\/(id|en|ar|zh)\/?$/.test(pathname);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuAnimations = useRef<Array<ReturnType<typeof animate>>>([]);
  const reduced = useMotionPreference();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", value => setScrolled(value > 28));
  useEffect(() => {
    const menu = dialog.current;
    const controls = menuAnimations;
    controls.current.forEach(animation => animation.stop());
    controls.current = [];
    menu?.close();
    menu?.style.removeProperty("opacity");
    menu?.style.removeProperty("transform");
    return () => { controls.current.forEach(animation => animation.stop()); controls.current = []; menu?.close(); };
  }, [pathname, reduced]);
  function openMenu() {
    const menu = dialog.current;
    if (!menu) return;
    menuAnimations.current.forEach(animation => animation.stop());
    menu.style.removeProperty("opacity");
    menu.style.removeProperty("transform");
    menu.showModal();
    if (!reduced && !legacyHome) menuAnimations.current = [
      animate(menu, { opacity: [0, 1], x: [locale === "ar" ? 28 : -28, 0] }, { duration: .3 }),
      animate(menu.querySelectorAll("nav a"), { opacity: [0, 1], y: [14, 0] }, { duration: .28, delay: stagger(.035) }),
    ];
  }
  async function closeMenu() {
    const menu = dialog.current;
    if (!menu?.open) return;
    menuAnimations.current.forEach(animation => animation.stop());
    if (!reduced && !legacyHome) {
      const exit = animate(menu, { opacity: 0, x: locale === "ar" ? 16 : -16 }, { duration: .16 });
      menuAnimations.current = [exit];
      await exit;
      if (menuAnimations.current[0] !== exit) return;
      exit.cancel();
    }
    menu.close();
    menu.style.removeProperty("opacity");
    menu.style.removeProperty("transform");
  }
  const path = pathname.replace(/^\/(id|en|ar|zh)(?=\/|$)/, "").replace(/^\//, "");
  const active = (page: string) => page ? pathname.startsWith(url(locale, page)) : pathname === url(locale);
  return <>
    <div className="topbar"><div className="container topbar-inner"><span><i />{t(locale,"header.technical_precision_confidence_at_every_step")}</span><span className="topbar-right">{t(locale,"ui.mep_disciplines")}</span></div></div>
    <header className={`header${legacyHome ? " header-legacy" : scrolled ? " header-scrolled" : ""}`}><div className="container header-inner">
      <Link href={url(locale)} aria-label={`Green Ridge Technics — ${t(locale,"content.home")}`}><Brand /></Link>
      <nav className="desktop-nav" aria-label={t(locale,"header.main_navigation")}>
        {navigation.map(item => <Link key={item.path} href={url(locale,item.path)} className={active(item.path)?"active":""} aria-current={active(item.path)?"page":undefined}>{text(item.label,locale)}{active(item.path) && !legacyHome && <motion.span className="nav-active-marker" layoutId="nav-active-marker" transition={{ duration: reduced ? 0 : .3 }} />}</Link>)}
        <details className="nav-more"><summary>{t(locale,"header.more")}<ChevronDown size={12} /></summary><div className="nav-dropdown">{secondaryNavigation.map(item=><Link key={item.path} href={url(locale,item.path)} onClick={event=>event.currentTarget.closest("details")?.removeAttribute("open")}>{text(item.label,locale)}<ArrowUpRight size={14}/></Link>)}</div></details>
      </nav>
      <div className="header-actions"><LanguagePicker key={`${locale}/${path}`} locale={locale} path={path} /><Link className="header-cta" href={url(locale,"contact")}>{t(locale,"content.let_s_talk")}<ArrowUpRight size={16}/></Link><button type="button" className="mobile-menu-button" aria-label={t(locale,"header.open_menu")} onClick={openMenu}><Menu size={25}/></button></div>
    </div></header>
    <dialog ref={dialog} className="mobile-menu" aria-label={t(locale,"header.mobile_navigation")} onCancel={event => { event.preventDefault(); void closeMenu(); }}><div className="mobile-menu-head"><Brand/><button type="button" autoFocus aria-label={t(locale,"header.close_menu")} onClick={()=>void closeMenu()}><X/></button></div><nav aria-label={t(locale,"header.mobile_navigation")}>{[...navigation,...secondaryNavigation,{path:"contact",label:m("footer.contact")}].map((item,index)=><Link key={item.path} href={url(locale,item.path)} onClick={()=>dialog.current?.close()}><span className="mobile-nav-number">{String(index+1).padStart(2,"0")}</span>{text(item.label,locale)}<ArrowUpRight size={20}/></Link>)}</nav><div className="mobile-languages" aria-label={t(locale,"ui.language")}>{locales.map(language=><Link key={language} href={url(language,path)} lang={language} hrefLang={language} aria-current={language===locale?"true":undefined} onClick={()=>dialog.current?.close()}>{languageNames[language]}</Link>)}</div></dialog>
  </>;
}
