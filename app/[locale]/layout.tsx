import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MotionEffects } from "@/components/motion";
import { isLocale } from "@/lib/content";
import "../globals.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#183f32" };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale}><body id="top"><a className="skip-link" href="#main">{locale === "id" ? "Lewati ke konten" : "Skip to content"}</a><Header locale={locale} /><main id="main">{children}</main><Footer locale={locale} /><MotionEffects /></body></html>;
}
