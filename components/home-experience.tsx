"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Crosshair, Layers3, ShieldCheck } from "lucide-react";
import { type Locale, url } from "@/lib/content";
import { ButtonLink, Eyebrow, Photo, ServiceIcon } from "./ui";

const phrases = {
  id: ["sistem siap.", "detail terukur.", "fungsi teruji."],
  en: ["system is ready.", "detail is measured.", "function is tested."],
};

function TypedPhrase({ locale }: { locale: Locale }) {
  const [value, setValue] = useState(phrases[locale][0]);
  const position = useRef({ phrase: 0, length: phrases[locale][0].length, deleting: false });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let disposed = false;
    function schedule() {
      if (disposed || media.matches || document.hidden) return;
      const state = position.current;
      const phrase = phrases[locale][state.phrase];
      const complete = state.length === phrase.length && !state.deleting;
      timer = setTimeout(() => {
        if (complete) state.deleting = true;
        if (state.deleting) {
          state.length = Math.max(0, state.length - 1);
          if (state.length === 0) {
            state.phrase = (state.phrase + 1) % phrases[locale].length;
            state.deleting = false;
          }
        } else state.length += 1;
        setValue(phrases[locale][state.phrase].slice(0, state.length));
        schedule();
      }, complete ? 2600 : state.deleting ? 35 : state.length === 0 ? 350 : 85);
    }
    function restart() {
      clearTimeout(timer);
      if (media.matches) {
        position.current = { phrase: 0, length: phrases[locale][0].length, deleting: false };
        setValue(phrases[locale][0]);
      }
      schedule();
    }
    restart();
    media.addEventListener("change", restart);
    document.addEventListener("visibilitychange", restart);
    return () => {
      disposed = true;
      clearTimeout(timer);
      media.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", restart);
    };
  }, [locale]);

  return <span className="typed-line" aria-hidden="true"><span>{value}</span><span className="typing-caret" /></span>;
}

function EngineeringDiagram({ id }: { id: boolean }) {
  return <div className="readiness-diagram" aria-hidden="true">
    <div className="diagram-heading"><span>ENGINEERING, IN FOCUS</span><Crosshair size={18} /></div>
    <svg className="facility-drawing" viewBox="0 0 480 400" fill="none">
      <defs><linearGradient id="facility-glow" x1="100" y1="50" x2="380" y2="350" gradientUnits="userSpaceOnUse"><stop stopColor="#c9ef95" /><stop offset="1" stopColor="#c9ef95" stopOpacity=".15" /></linearGradient></defs>
      <g className="facility-grid" stroke="currentColor" strokeWidth=".6">
        <path d="M20 280 240 153 460 280 240 407Z M60 303 280 176 M100 326 320 199 M140 349 360 222 M180 372 400 245 M220 395 440 268 M40 268 260 395 M80 245 300 372 M120 222 340 349 M160 199 380 326 M200 176 420 303" />
      </g>
      <g stroke="url(#facility-glow)" strokeWidth="1.2" strokeLinejoin="round">
        <path d="m85 153 155-90 155 90-155 90Z M85 153v140l155 90 155-90V153 M240 243v140" />
        <path d="m85 198 155 90 155-90 M85 245l155 90 155-90 M138 123l154 90v140 M190 93l154 90v140 M136 183v140 M188 213v140 M292 123 137 213 M344 153l-155 90" opacity=".45" />
        <path className="diagram-trace trace-air" d="m111 151 77-44 105 60-77 45 52 30" />
        <path className="diagram-trace trace-power" d="M360 175v95l-94 54v30" />
        <path className="diagram-trace trace-system" d="m112 255 76 44v-50l52-30 52 30" />
      </g>
      <g className="diagram-node"><circle cx="188" cy="107" r="5" /><circle cx="360" cy="270" r="5" /><circle cx="188" cy="299" r="5" /></g>
      <g className="diagram-leaders" stroke="currentColor" strokeWidth=".8"><path d="M188 107V66H90 M360 270h65v-63 M188 299h-69v37H60" /></g>
      <path className="diagram-scan" d="m85 153 155-90 155 90-155 90Z" fill="#c9ef95" fillOpacity=".09" stroke="#c9ef95" strokeOpacity=".65" />
    </svg>
    <span className="diagram-label diagram-label-air"><i>01</i>AIRFLOW</span>
    <span className="diagram-label diagram-label-power"><i>02</i>ELECTRICAL</span>
    <span className="diagram-label diagram-label-system"><i>03</i>INTEGRATION</span>
    <div className="diagram-caption"><span>{id ? "DARI KOMPONEN KE INTEGRASI." : "FROM COMPONENTS TO INTEGRATION."}</span><span>{id ? "Ilustrasi pendekatan verifikasi" : "Verification approach illustration"}</span></div>
  </div>;
}

export function HomeHero({ locale }: { locale: Locale }) {
  const id = locale === "id";
  return <section className="home-hero home-hero-engineered">
    <Photo src="/images/data-center.jpg" locale={locale} priority className="hero-photo" />
    <div className="hero-shade" /><div className="hero-grid" aria-hidden="true" />
    <div className="container engineered-content">
      <div className="hero-copy">
        <Eyebrow light>FROM COMPLEXITY TO CONFIDENCE</Eyebrow>
        <h1><span className="sr-only">{id ? "Sebelum beroperasi, pastikan setiap sistem siap." : "Before you go live, make sure every system is ready."}</span><span aria-hidden="true">{id ? <>Sebelum beroperasi,<br />pastikan setiap</> : <>Before you go live,<br />make sure every</>}</span><TypedPhrase key={locale} locale={locale} /></h1>
        <p>{id ? "Testing, inspection, dan commissioning untuk memverifikasi kinerja fasilitas Anda. Dari setiap komponen hingga integrasi sistem." : "Testing, inspection, and commissioning to verify your facility’s performance. From individual components to integrated systems."}</p>
        <div className="hero-buttons"><ButtonLink href={url(locale, "contact")} variant="lime">{id ? "Diskusikan Proyek Anda" : "Discuss Your Project"}</ButtonLink><a href="#find-your-service" className="hero-about">{id ? "Temukan layanan Anda" : "Find your service"}<ArrowDown size={17} /></a></div>
      </div>
      <EngineeringDiagram id={id} />
      <div className="engineered-bottom"><div className="hero-proof"><ShieldCheck size={19} /><span>{id ? "Perspektif independen" : "Independent perspective"}</span></div><div className="hero-proof"><Crosshair size={19} /><span>{id ? "Pengujian terukur" : "Measured testing"}</span></div><div className="hero-proof"><Layers3 size={19} /><span>{id ? "Hasil terdokumentasi" : "Documented results"}</span></div></div>
    </div>
  </section>;
}

const needs = [
  { slug: "testing", icon: "activity", label: ["Kinerja sistem", "System performance"], title: "Testing & Balancing", question: ["Apakah sistem bekerja sesuai desain?", "Is your system performing as designed?"], description: ["Pahami kinerja aktual melalui pengukuran aliran udara, aliran air, dan parameter sistem. Temukan bagian yang perlu disesuaikan sebelum memengaruhi operasi.", "Understand actual performance through airflow, water flow, and system measurements. Identify adjustments before they affect operations."], outputs: [["Hasil pengukuran", "Measurement records"], ["Perbandingan terhadap desain", "Comparison against design"], ["Rekomendasi penyesuaian", "Adjustment recommendations"]] },
  { slug: "inspection", icon: "scan", label: ["Kualitas instalasi", "Installation quality"], title: "Technical Inspection", question: ["Sudahkah detail instalasi diperiksa?", "Have the installation details been checked?"], description: ["Tinjau kesesuaian instalasi, material, dan dokumen teknis melalui pemeriksaan independen. Kenali temuan dan tentukan tindak lanjut sebelum tahap berikutnya.", "Review installation, materials, and technical documentation through independent inspection. Identify findings and next steps before moving forward."], outputs: [["Checklist inspeksi", "Inspection checklist"], ["Daftar temuan", "Recorded findings"], ["Rekomendasi tindak lanjut", "Follow-up recommendations"]] },
  { slug: "commissioning", icon: "settings", label: ["Kesiapan operasi", "Operational readiness"], title: "Commissioning", question: ["Siapkah setiap sistem bekerja bersama?", "Are your systems ready to work together?"], description: ["Verifikasi fungsi dan integrasi sistem terhadap kebutuhan proyek. Bangun gambaran kesiapan fasilitas melalui pengujian yang sistematis dan hasil yang dapat ditelusuri.", "Verify system functions and integration against project requirements. Assess facility readiness through systematic testing and traceable results."], outputs: [["Catatan pengujian fungsi", "Functional test records"], ["Temuan integrasi sistem", "System integration findings"], ["Dokumentasi kesiapan", "Readiness documentation"]] },
];

export function NeedsExplorer({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const language = locale === "id" ? 0 : 1;
  const need = needs[selected];
  return <section className="needs-section section" id="find-your-service"><div className="container">
    <div className="needs-heading"><div><Eyebrow>{language === 0 ? "MULAI DARI KEBUTUHAN ANDA" : "START WITH YOUR REQUIREMENTS"}</Eyebrow><h2>{language === 0 ? "Apa yang ingin Anda pastikan?" : "What do you need to verify?"}</h2></div><p>{language === 0 ? "Pilih fokus Anda. Temukan pendekatan yang sesuai." : "Choose your focus. Find the right approach."}</p></div>
    <div className="needs-layout"><div className="needs-options" role="tablist" aria-label={language === 0 ? "Kebutuhan fasilitas Anda" : "Your facility requirements"} aria-orientation="vertical">{needs.map((item, index) => <button key={item.slug} ref={element => { buttons.current[index] = element; }} id={`need-tab-${item.slug}`} type="button" role="tab" aria-selected={index === selected} aria-controls="need-panel" tabIndex={index === selected ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => {
      let next = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % needs.length;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + needs.length - 1) % needs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = needs.length - 1;
      else return;
      event.preventDefault(); setSelected(next); buttons.current[next]?.focus();
    }}><span className="need-number">0{index + 1}</span><ServiceIcon name={item.icon} size={23} /><span>{item.label[language]}</span><ArrowUpRight size={20} /></button>)}</div>
    <div className="need-detail" id="need-panel" role="tabpanel" aria-labelledby={`need-tab-${need.slug}`} tabIndex={0}><div className="need-detail-copy" key={need.slug}><span className="mini-label">{need.title}</span><h3>{need.question[language]}</h3><p>{need.description[language]}</p><div className="need-deliverables"><span>{language === 0 ? "KELUARAN SESUAI RUANG LINGKUP" : "DELIVERABLES MATCH THE AGREED SCOPE"}</span><ul>{need.outputs.map(output => <li key={output[1]}><Check size={15} />{output[language]}</li>)}</ul></div><Link className="text-link" href={url(locale, `services/${need.slug}`)}>{language === 0 ? "Jelajahi layanan ini" : "Explore this service"}<ArrowUpRight size={18} /></Link></div><span className="need-watermark" aria-hidden="true">0{selected + 1}</span></div></div>
  </div></section>;
}
