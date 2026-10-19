"use client";
import { t } from "@/lib/i18n";


import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, Copy, Expand, X, Download, Mail } from "lucide-react";
import { projects, services, text, url, m, company, common, type Locale } from "@/lib/content";
import { Photo } from "./ui";

export function ProjectGrid({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState("all");
  const categories = [{ id: "all", title: m("interactive.all_sectors") }, { id: "data", title: m("content.data_centers") }, { id: "building", title: m("content.commercial_buildings") }, { id: "industrial", title: m("interactive.industrial") }];
  return <><div className="filter-bar" aria-label={t(locale, "interactive.filter_by_sector")}>{categories.map(c => <button key={c.id} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{text(c.title, locale)}</button>)}</div><div className="project-grid" aria-live="polite">{projects.filter(p => filter === "all" || p.category === filter).map(p => <Link className="project-card" href={url(locale, `projects/${p.slug}`)} key={p.slug}><div className="project-image"><Photo src={p.image} locale={locale} /><span className="image-tag">{text(p.sector, locale)}</span><span className="image-arrow"><ArrowUpRight size={24} /></span></div><span className="mini-label">{t(locale, "interactive.illustrative_study")}</span><h2>{text(p.name, locale)}</h2><p>{text(p.description, locale)}</p></Link>)}</div></>;
}

export function Gallery({ locale }: { locale: Locale }) {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const photos = [
    { image: "/images/data-center.jpg", title: m("interactive.digital_infrastructure"), category: "facilities" },
    { image: "/images/engineering.jpg", title: m("interactive.focused_on_every_detail"), category: "engineering" },
    { image: "/images/building.jpg", title: m("interactive.a_wider_perspective"), category: "facilities" },
    { image: "/images/industrial.jpg", title: m("interactive.behind_system_performance"), category: "engineering" },
  ];
  return <><div className="filter-bar">{[{ id: "all", title: m("interactive.all_photos") }, { id: "facilities", title: m("interactive.facilities") }, { id: "engineering", title: m("interactive.engineering") }].map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{text(c.title, locale)}</button>)}</div><div className="gallery-grid" aria-live="polite">{photos.map((photo, index) => (category === "all" || category === photo.category) && <button key={photo.title.en} className="gallery-item" aria-label={`${t(locale, "interactive.enlarge")}: ${text(photo.title, locale)}`} onClick={() => { setSelected(index); dialog.current?.showModal(); }}><Photo src={photo.image} locale={locale} /><span><span>{text(photo.title, locale)}</span><Expand size={22} /></span></button>)}</div><dialog ref={dialog} className="lightbox" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button className="lightbox-close" aria-label={t(locale, "interactive.close_photo")} onClick={() => dialog.current?.close()} autoFocus><X /></button><div className="lightbox-image"><Image src={photos[selected].image} alt={text(photos[selected].title, locale)} fill sizes="90vw" className="object-contain" /></div><p>{text(photos[selected].title, locale)} <span>— {text(common.photo, locale)}</span></p></dialog></>;
}

export function ContactForm({ locale }: { locale: Locale }) {
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary(`${t(locale, "interactive.project_inquiry")} — Green Ridge Technics\n\n${t(locale, "interactive.name")}: ${data.get("name")}\n${t(locale,"ui.email")}: ${data.get("email")}\n${t(locale, "interactive.company")}: ${data.get("company") || "—"}\n${t(locale, "interactive.service")}: ${text(services.find(service=>service.slug===data.get("service"))?.name || m("interactive.i_d_like_to_discuss_it_first"),locale)}\n\n${data.get("message")}`);
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
  return <div className="contact-form-wrap" id="project-form"><form onSubmit={submit} className="contact-form"><h2>{t(locale, "interactive.tell_us_about_your_project")}</h2><p>{t(locale, "interactive.complete_the_details_below_to_prepare_your")}</p><div className="form-row"><label>{t(locale, "interactive.full_name")} <span>*</span><input name="name" required autoComplete="name" maxLength={100} placeholder={t(locale, "interactive.your_name")} /></label><label>{t(locale, "interactive.work_email")} <span>*</span><input name="email" type="email" required autoComplete="email" maxLength={200} placeholder="you@company.com" /></label></div><div className="form-row"><label>{t(locale, "interactive.company")}<input name="company" autoComplete="organization" maxLength={150} placeholder={t(locale, "interactive.company_name")} /></label><label>{t(locale, "interactive.service_required")} <span>*</span><select name="service" defaultValue="" required><option value="" disabled>{t(locale, "interactive.select_a_service")}</option>{services.map(service=><option key={service.slug} value={service.slug}>{text(service.name,locale)}</option>)}<option>{t(locale, "interactive.i_d_like_to_discuss_it_first")}</option></select></label></div><label>{t(locale, "interactive.about_your_project")} <span>*</span><textarea name="message" required minLength={10} maxLength={3000} rows={5} placeholder={t(locale, "interactive.tell_us_about_the_facility_location_scope")} /></label><label className="consent"><input type="checkbox" required /><span>{t(locale, "interactive.i_understand_this_form_prepares_a_local")}</span></label><button type="submit" className="button button-green"><span>{t(locale, "interactive.prepare_project_brief")}</span><ArrowUpRight size={18} /></button><p className="form-note">{t(locale, "interactive.presentation_mode_your_data_is_not_stored")}</p></form>{summary && <div className="form-result" ref={result} tabIndex={-1} role="status"><div className="result-title"><Check size={22} /><h3>{t(locale, "interactive.your_brief_is_ready")}</h3></div><p>{t(locale, "interactive.no_message_has_been_sent_copy_or")}</p><pre>{summary}</pre><div className="result-actions"><button type="button" className="button button-green" onClick={copy}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? t(locale, "interactive.copied") : t(locale, "interactive.copy_brief")}</button><button type="button" className="button button-outline" onClick={download}><Download size={17} />{t(locale, "interactive.download")}</button>{company.email && <a className="button button-outline" href={`mailto:${company.email}?subject=${encodeURIComponent("Project inquiry — Green Ridge Technics")}&body=${encodeURIComponent(summary)}`}><Mail size={17} />{t(locale,"ui.email")}</a>}</div>{copyError && <p>{t(locale, "interactive.automatic_copying_is_unavailable_use_download_or")}</p>}</div>}</div>;
}
