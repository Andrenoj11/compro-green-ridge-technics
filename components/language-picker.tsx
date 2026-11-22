"use client";

import { useMotionPreference } from "./motion-preference";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { languageNames, languageTags, locales, t, url, type Locale } from "@/lib/i18n";
import { AnimatePresence, motion, useIsPresent } from "motion/react";

function LanguagePanel({ id, label, children, legacy }: { id: string; label: string; children: ReactNode; legacy: boolean }) {
  const reduced = useMotionPreference();
  const present = useIsPresent();
  if (legacy) return present ? <nav id={id} className="language-picker-panel language-picker-legacy" aria-label={label}>{children}</nav> : null;
  return <motion.nav id={id} className="language-picker-panel" aria-label={label} initial={{ opacity: 0, y: reduced ? 0 : -7, scale: reduced ? 1 : .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : -4 }} transition={{ duration: reduced ? 0 : .16 }} inert={!present} aria-hidden={!present ? true : undefined}>{children}</motion.nav>;
}

export function LanguagePicker({ locale, path }: { locale: Locale; path: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    }
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function openWithKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setOpen(true);
    const index = event.key === "ArrowDown" ? 0 : locales.length - 1;
    requestAnimationFrame(() => options.current[index]?.focus());
  }

  function moveFocus(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowDown": next = (index + 1) % locales.length; break;
      case "ArrowUp": next = (index + locales.length - 1) % locales.length; break;
      case "Home": next = 0; break;
      case "End": next = locales.length - 1; break;
      default: return;
    }
    event.preventDefault();
    options.current[next]?.focus();
  }

  return (
    <div className="language-picker" ref={root} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button
        type="button"
        ref={trigger}
        className="language-picker-trigger"
        aria-label={`${t(locale, "ui.language")}: ${languageNames[locale]}`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(value => !value)}
        onKeyDown={openWithKeyboard}
      >
        <span className="language-picker-current">
          <Globe2 size={16} strokeWidth={1.6} aria-hidden="true" />
          <bdi>{languageNames[locale]}</bdi>
        </span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>{open && (
        <LanguagePanel id={panelId} label={t(locale, "ui.language")} legacy={!path}>
          <ul>
            {locales.map((language, index) => (
              <li key={language}>
                <Link
                  ref={element => { options.current[index] = element; }}
                  className="language-picker-option"
                  href={url(language, path)}
                  hrefLang={languageTags[language]}
                  lang={language}
                  aria-current={language === locale ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  onKeyDown={event => moveFocus(event, index)}
                >
                  <bdi>{languageNames[language]}</bdi>
                  <span className="language-picker-mark" aria-hidden="true">
                    {language === locale && <Check size={16} strokeWidth={1.8} />}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </LanguagePanel>
      )}</AnimatePresence>
    </div>
  );
}
