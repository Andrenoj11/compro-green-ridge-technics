import id from "@/messages/id.json";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import zh from "@/messages/zh.json";

export const locales = ["id", "en", "ar", "zh"] as const;
export type Locale = typeof locales[number];
export type MessageKey = keyof typeof en;
export type Localized = Record<Locale, string>;
const dictionaries: Record<Locale, Record<MessageKey, string>> = { id, en, ar, zh };
export const languageNames: Record<Locale, string> = { id: "Bahasa Indonesia", en: "English", ar: "العربية", zh: "简体中文" };
export const languageTags: Record<Locale, string> = { id: "id-ID", en: "en", ar: "ar", zh: "zh-CN" };
export const openGraphLocales: Record<Locale, string> = { id: "id_ID", en: "en_US", ar: "ar_SA", zh: "zh_CN" };
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);
export const url = (locale: Locale, path = "") => `/${locale}${path ? `/${path}` : ""}`;
export const t = (locale: Locale, key: MessageKey) => dictionaries[locale][key];
export const m = (key: MessageKey): Localized => ({ id: id[key], en: en[key], ar: ar[key], zh: zh[key] });
export const text = (value: Localized, locale: Locale) => value[locale];
