"use client";

import { useMotionPreference } from "./motion-preference";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from "lucide-react";
import { animate } from "motion";
import { AnimatePresence, motion } from "motion/react";
import { projects, text, url, m, type Locale } from "@/lib/content";
import { t } from "@/lib/i18n";
import { Photo } from "./ui";

export function ProjectGrid({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState("all");
  const categories = [{ id: "all", title: m("interactive.all_sectors") }, { id: "data", title: m("content.data_centers") }, { id: "building", title: m("content.commercial_buildings") }, { id: "industrial", title: m("interactive.industrial") }];
  return <><div className="filter-bar" aria-label={t(locale, "interactive.filter_by_sector")}>{categories.map(c => <button key={c.id} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{text(c.title, locale)}</button>)}</div><div className="project-grid" aria-live="polite">{projects.filter(p => filter === "all" || p.category === filter).map(p => <Link className="project-card" href={url(locale, `projects/${p.slug}`)} key={p.slug}><div className="project-image"><Photo src={p.image} locale={locale} /><span className="image-tag">{text(p.sector, locale)}</span><span className="image-arrow"><ArrowUpRight size={24} /></span></div><span className="mini-label">{t(locale, "interactive.illustrative_study")}</span><h2>{text(p.name, locale)}</h2><p>{text(p.description, locale)}</p></Link>)}</div></>;
}

const photos = [
  { image: "/images/data-center.jpg", title: m("interactive.digital_infrastructure"), category: "facilities" },
  { image: "/images/engineering.jpg", title: m("interactive.focused_on_every_detail"), category: "engineering" },
  { image: "/images/building.jpg", title: m("interactive.a_wider_perspective"), category: "facilities" },
  { image: "/images/industrial.jpg", title: m("interactive.behind_system_performance"), category: "engineering" },
];

export function Gallery({ locale }: { locale: Locale }) {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const reduced = useMotionPreference();
  const visible = photos.map((photo, index) => ({ ...photo, index })).filter(photo => category === "all" || category === photo.category);
  const position = visible.findIndex(photo => photo.index === selected);
  useEffect(() => {
    const modal = dialog.current;
    animation.current?.stop();
    modal?.style.removeProperty("opacity");
    modal?.style.removeProperty("transform");
    return () => { animation.current?.stop(); };
  }, [reduced]);

  function openPhoto(index: number) {
    setSelected(index);
    const modal = dialog.current;
    if (!modal) return;
    animation.current?.stop();
    modal.style.removeProperty("opacity");
    modal.style.removeProperty("transform");
    modal.showModal();
    if (!reduced) animation.current = animate(modal, { opacity: [0, 1], y: [18, 0], scale: [.985, 1] }, { duration: .25 });
  }
  async function closePhoto() {
    const modal = dialog.current;
    if (!modal?.open) return;
    animation.current?.stop();
    if (!reduced) {
      const exit = animate(modal, { opacity: 0, y: 12, scale: .99 }, { duration: .16 });
      animation.current = exit;
      await exit;
      if (animation.current !== exit) return;
      exit.cancel();
    }
    modal.close();
    modal.style.removeProperty("opacity");
    modal.style.removeProperty("transform");
  }
  function movePhoto(direction: number) {
    setSelected(visible[(position + direction + visible.length) % visible.length].index);
  }

  return <>
    <div className="filter-bar gallery-filters">
      {[{ id: "all", title: m("interactive.all_photos") }, { id: "facilities", title: m("interactive.facilities") }, { id: "engineering", title: m("interactive.engineering") }].map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
        {category === c.id && <motion.span className="filter-selection" layoutId={`gallery-filter-${locale}`} transition={{ duration: reduced ? 0 : .25 }} />}
        <span className="filter-label">{text(c.title, locale)}</span>
      </button>)}
    </div>
    <motion.div layout className="gallery-grid" aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map(photo => <motion.button layout={reduced ? false : "position"} key={photo.image} className="gallery-item" initial={{ opacity: 0, scale: reduced ? 1 : .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reduced ? 1 : .96 }} transition={{ duration: reduced ? 0 : .3 }} whileTap={reduced ? undefined : { scale: .985 }} aria-label={`${t(locale, "interactive.enlarge")}: ${text(photo.title, locale)}`} onClick={() => openPhoto(photo.index)}>
          <Photo src={photo.image} locale={locale} /><span><span>{text(photo.title, locale)}</span><Expand size={22} /></span>
        </motion.button>)}
      </AnimatePresence>
    </motion.div>
    <dialog ref={dialog} className="lightbox" aria-label={text(photos[selected].title, locale)} onCancel={event => { event.preventDefault(); void closePhoto(); }} onClick={event => { if (event.target === event.currentTarget) void closePhoto(); }} onKeyDown={event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        movePhoto((event.key === "ArrowLeft" ? -1 : 1) * (locale === "ar" ? -1 : 1));
      }
    }}>
      <button className="lightbox-close" aria-label={t(locale, "interactive.close_photo")} onClick={() => void closePhoto()} autoFocus><X /></button>
      <div className="lightbox-stage"><AnimatePresence initial={false} mode="wait">
        <motion.div className="lightbox-image" key={photos[selected].image} initial={{ opacity: 0, scale: reduced ? 1 : .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .18 }}>
          <Image src={photos[selected].image} alt={text(photos[selected].title, locale)} fill sizes="90vw" className="object-contain" />
        </motion.div>
      </AnimatePresence></div>
      <div className="lightbox-toolbar">
        <button onClick={() => movePhoto(-1)} aria-label={t(locale, "gallery.previous")}><ArrowLeft size={20} /></button>
        <p aria-live="polite">{text(photos[selected].title, locale)} <span dir="ltr">{position + 1} / {visible.length}</span></p>
        <button onClick={() => movePhoto(1)} aria-label={t(locale, "gallery.next")}><ArrowRight size={20} /></button>
      </div>
    </dialog>
  </>;
}
