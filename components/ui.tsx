import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Activity, ScanLine, Settings2, Leaf, ArrowRight } from "lucide-react";
import { type Locale, type Bilingual, text, url, imageAlt } from "@/lib/content";

export function Brand({ light = false }: { light?: boolean }) {
  return <span className={`brand ${light ? "brand-light" : ""}`}><span className="brand-mark" aria-hidden="true"><i /><i /></span><span className="brand-type">GREEN RIDGE<span>TECHNICS</span></span></span>;
}

export function Photo({ src, locale, className = "", priority = false }: { src: string; locale: Locale; className?: string; priority?: boolean }) {
  const alt = imageAlt[src as keyof typeof imageAlt];
  return <Image src={src} alt={alt ? text(alt, locale) : "Green Ridge Technics"} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 75vw, 1400px" priority={priority} className={`object-cover ${className}`} />;
}

export function ButtonLink({ href, children, variant = "green", className = "" }: { href: string; children: React.ReactNode; variant?: "green" | "lime" | "outline" | "white"; className?: string }) {
  return <Link href={href} className={`button button-${variant} ${className}`}><span>{children}</span><ArrowUpRight size={18} aria-hidden="true" /></Link>;
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="text-link"><span>{children}</span><ArrowRight size={18} aria-hidden="true" /></Link>;
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <div className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span />{children}</div>;
}

export function SectionHeading({ locale, label, title, description, href, link }: { locale: Locale; label: Bilingual; title: Bilingual; description?: Bilingual; href?: string; link?: Bilingual }) {
  return <div className="section-heading" data-reveal><div><Eyebrow>{text(label, locale)}</Eyebrow><h2>{text(title, locale)}</h2>{description && <p>{text(description, locale)}</p>}</div>{href && link && <TextLink href={href}>{text(link, locale)}</TextLink>}</div>;
}

export function ServiceIcon({ name, size = 29 }: { name: string; size?: number }) {
  const Icon = name === "activity" ? Activity : name === "scan" ? ScanLine : name === "leaf" ? Leaf : Settings2;
  return <Icon size={size} strokeWidth={1.4} aria-hidden="true" />;
}

export function PageHero({ locale, eyebrow, title, description }: { locale: Locale; eyebrow: Bilingual; title: Bilingual; description: Bilingual }) {
  return <section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href={url(locale)}>{locale === "id" ? "Beranda" : "Home"}</Link><span>/</span><span>{text(eyebrow, locale)}</span></div><div className="page-hero-inner"><div><Eyebrow>{text(eyebrow, locale)}</Eyebrow><h1>{text(title, locale)}</h1></div><p>{text(description, locale)}</p></div></div><div className="hero-watermark" aria-hidden="true">GRT</div></section>;
}

export function CallToAction({ locale }: { locale: Locale }) {
  return <section className="cta-section"><div className="container cta-inner" data-reveal><div><Eyebrow>{locale === "id" ? "LANGKAH BERIKUTNYA" : "YOUR NEXT STEP"}</Eyebrow><h2>{locale === "id" ? "Mari bangun keyakinan.\nMulai dari sistem Anda." : "Let's build confidence.\nStarting with your systems."}</h2><p>{locale === "id" ? "Bersama, kita siapkan fasilitas Anda untuk bekerja lebih baik." : "Together, let's get your facility ready to perform better."}</p></div><Link className="cta-circle" href={url(locale, "contact")}><ArrowUpRight size={40} strokeWidth={1.3} aria-hidden="true" /><span>{locale === "id" ? "Mulai percakapan" : "Start a conversation"}</span></Link></div></section>;
}
