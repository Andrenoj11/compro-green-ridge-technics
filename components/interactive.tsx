"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, Copy, Expand, X, Download, Mail } from "lucide-react";
import { projects, text, url, b, company, common, type Locale } from "@/lib/content";
import { Photo } from "./ui";

export function ProjectGrid({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState("all");
  const categories = [{ id: "all", title: b("Semua sektor", "All sectors") }, { id: "data", title: b("Data Center", "Data Centers") }, { id: "building", title: b("Gedung Komersial", "Commercial Buildings") }, { id: "industrial", title: b("Industri", "Industrial") }];
  return <><div className="filter-bar" aria-label={locale === "id" ? "Filter sektor" : "Filter by sector"}>{categories.map(c => <button key={c.id} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{text(c.title, locale)}</button>)}</div><div className="project-grid" aria-live="polite">{projects.filter(p => filter === "all" || p.category === filter).map(p => <Link className="project-card" href={url(locale, `projects/${p.slug}`)} key={p.slug}><div className="project-image"><Photo src={p.image} locale={locale} /><span className="image-tag">{text(p.sector, locale)}</span><span className="image-arrow"><ArrowUpRight size={24} /></span></div><span className="mini-label">{locale === "id" ? "STUDI ILUSTRATIF" : "ILLUSTRATIVE STUDY"}</span><h2>{text(p.name, locale)}</h2><p>{text(p.description, locale)}</p></Link>)}</div></>;
}

export function Gallery({ locale }: { locale: Locale }) {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const photos = [
    { image: "/images/data-center.jpg", title: b("Infrastruktur digital", "Digital infrastructure"), category: "facilities" },
    { image: "/images/engineering.jpg", title: b("Fokus pada setiap detail", "Focused on every detail"), category: "engineering" },
    { image: "/images/building.jpg", title: b("Perspektif yang lebih luas", "A wider perspective"), category: "facilities" },
    { image: "/images/industrial.jpg", title: b("Di balik kinerja sistem", "Behind system performance"), category: "engineering" },
  ];
  return <><div className="filter-bar">{[{ id: "all", title: b("Semua foto", "All photos") }, { id: "facilities", title: b("Fasilitas", "Facilities") }, { id: "engineering", title: b("Engineering", "Engineering") }].map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{text(c.title, locale)}</button>)}</div><div className="gallery-grid" aria-live="polite">{photos.map((photo, index) => (category === "all" || category === photo.category) && <button key={photo.title.en} className="gallery-item" aria-label={`${locale === "id" ? "Perbesar" : "Enlarge"}: ${text(photo.title, locale)}`} onClick={() => { setSelected(index); dialog.current?.showModal(); }}><Photo src={photo.image} locale={locale} /><span><span>{text(photo.title, locale)}</span><Expand size={22} /></span></button>)}</div><dialog ref={dialog} className="lightbox" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button className="lightbox-close" aria-label={locale === "id" ? "Tutup foto" : "Close photo"} onClick={() => dialog.current?.close()} autoFocus><X /></button><div className="lightbox-image"><Image src={photos[selected].image} alt={text(photos[selected].title, locale)} fill sizes="90vw" className="object-contain" /></div><p>{text(photos[selected].title, locale)} <span>— {text(common.photo, locale)}</span></p></dialog></>;
}

export function ContactForm({ locale }: { locale: Locale }) {
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  const t = (id: string, en: string) => locale === "id" ? id : en;
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary(`${t("Permintaan proyek", "Project inquiry")} — Green Ridge Technics\n\n${t("Nama", "Name")}: ${data.get("name")}\nEmail: ${data.get("email")}\n${t("Perusahaan", "Company")}: ${data.get("company") || "—"}\n${t("Layanan", "Service")}: ${data.get("service")}\n\n${data.get("message")}`);
    setCopied(false); setCopyError(false);
    window.requestAnimationFrame(() => result.current?.focus());
  }
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  function download() {
    const file = URL.createObjectURL(new Blob([summary], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = file; link.download = "green-ridge-project-inquiry.txt"; link.click(); URL.revokeObjectURL(file);
  }
  return <div className="contact-form-wrap" id="project-form"><form onSubmit={submit} className="contact-form"><h2>{t("Ceritakan proyek Anda", "Tell us about your project")}</h2><p>{t("Isi detail berikut untuk menyiapkan ringkasan kebutuhan Anda.", "Complete the details below to prepare your project brief.")}</p><div className="form-row"><label>{t("Nama lengkap", "Full name")} <span>*</span><input name="name" required autoComplete="name" maxLength={100} placeholder={t("Nama Anda", "Your name")} /></label><label>{t("Email kerja", "Work email")} <span>*</span><input name="email" type="email" required autoComplete="email" maxLength={200} placeholder="you@company.com" /></label></div><div className="form-row"><label>{t("Perusahaan", "Company")}<input name="company" autoComplete="organization" maxLength={150} placeholder={t("Nama perusahaan", "Company name")} /></label><label>{t("Layanan yang dibutuhkan", "Service required")} <span>*</span><select name="service" defaultValue="" required><option value="" disabled>{t("Pilih layanan", "Select a service")}</option><option>Testing & Balancing</option><option>Technical Inspection</option><option>Commissioning</option><option>Energy & Performance</option><option>{t("Saya ingin berdiskusi dahulu", "I'd like to discuss it first")}</option></select></label></div><label>{t("Tentang proyek Anda", "About your project")} <span>*</span><textarea name="message" required minLength={10} maxLength={3000} rows={5} placeholder={t("Ceritakan jenis fasilitas, lokasi, ruang lingkup, dan jadwal yang direncanakan…", "Tell us about the facility, location, scope, and planned schedule…")} /></label><label className="consent"><input type="checkbox" required /><span>{t("Saya memahami bahwa formulir ini menyiapkan ringkasan lokal dan belum mengirimkan pesan.", "I understand this form prepares a local brief and does not send a message.")}</span></label><button type="submit" className="button button-green"><span>{t("Siapkan ringkasan proyek", "Prepare project brief")}</span><ArrowUpRight size={18} /></button><p className="form-note">{t("Mode presentasi. Data tidak disimpan. Kanal kontak resmi akan ditambahkan setelah dikonfirmasi.", "Presentation mode. Your data is not stored. Official contact channels will be added once confirmed.")}</p></form>{summary && <div className="form-result" ref={result} tabIndex={-1} role="status"><div className="result-title"><Check size={22} /><h3>{t("Ringkasan Anda siap", "Your brief is ready")}</h3></div><p>{t("Belum ada pesan yang dikirim. Salin atau unduh ringkasan untuk digunakan nanti.", "No message has been sent. Copy or download your brief to use later.")}</p><pre>{summary}</pre><div className="result-actions"><button type="button" className="button button-green" onClick={copy}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? t("Tersalin", "Copied") : t("Salin ringkasan", "Copy brief")}</button><button type="button" className="button button-outline" onClick={download}><Download size={17} />{t("Unduh", "Download")}</button>{company.email && <a className="button button-outline" href={`mailto:${company.email}?subject=${encodeURIComponent("Project inquiry — Green Ridge Technics")}&body=${encodeURIComponent(summary)}`}><Mail size={17} />Email</a>}</div>{copyError && <p>{t("Penyalinan otomatis tidak tersedia. Gunakan tombol Unduh atau pilih teks di atas.", "Automatic copying is unavailable. Use Download or select the text above.")}</p>}</div>}</div>;
}
