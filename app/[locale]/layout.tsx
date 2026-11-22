import { t } from "@/lib/i18n";
import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MotionProvider } from "@/components/motion";
import { isLocale } from "@/lib/content";
import "../globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#183f32" };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}><body id="top"><MotionProvider><a className="skip-link" href="#main">{t(locale, "content.skip_to_content")}</a><Header locale={locale} /><main id="main">{children}</main><Footer locale={locale} /></MotionProvider></body></html>;
}
