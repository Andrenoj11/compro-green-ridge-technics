"use client";
import { t } from "@/lib/i18n";


import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Expand, X } from "lucide-react";
import { projects, text, url, m, type Locale } from "@/lib/content";
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
  return <><div className="filter-bar">{[{ id: "all", title: m("interactive.all_photos") }, { id: "facilities", title: m("interactive.facilities") }, { id: "engineering", title: m("interactive.engineering") }].map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{text(c.title, locale)}</button>)}</div><div className="gallery-grid" aria-live="polite">{photos.map((photo, index) => (category === "all" || category === photo.category) && <button key={photo.title.en} className="gallery-item" aria-label={`${t(locale, "interactive.enlarge")}: ${text(photo.title, locale)}`} onClick={() => { setSelected(index); dialog.current?.showModal(); }}><Photo src={photo.image} locale={locale} /><span><span>{text(photo.title, locale)}</span><Expand size={22} /></span></button>)}</div><dialog ref={dialog} className="lightbox" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button className="lightbox-close" aria-label={t(locale, "interactive.close_photo")} onClick={() => dialog.current?.close()} autoFocus><X /></button><div className="lightbox-image"><Image src={photos[selected].image} alt={text(photos[selected].title, locale)} fill sizes="90vw" className="object-contain" /></div><p>{text(photos[selected].title, locale)}</p></dialog></>;
}
