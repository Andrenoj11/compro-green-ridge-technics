"use client";
import { t } from "@/lib/i18n";


import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Crosshair, Layers3, ShieldCheck } from "lucide-react";
import { type Locale, url, m, text, services } from "@/lib/content";
import { ButtonLink, Eyebrow, Photo, ServiceIcon } from "./ui";

const phrases = [m("home-experience.system_is_ready"), m("home-experience.detail_is_measured"), m("home-experience.function_is_tested")];

function TypedPhrase({ locale }: { locale: Locale }) {
  const words = useMemo(() => phrases.map(phrase => text(phrase, locale)), [locale]);
  const [value, setValue] = useState(words[0]);
  const position = useRef({ phrase: 0, length: words[0].length, deleting: false });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let disposed = false;
    function schedule() {
      if (disposed || media.matches || document.hidden) return;
      const state = position.current;
      const phrase = words[state.phrase];
      const complete = state.length === phrase.length && !state.deleting;
      timer = setTimeout(() => {
        if (complete) state.deleting = true;
        if (state.deleting) {
          state.length = Math.max(0, state.length - 1);
          if (state.length === 0) {
            state.phrase = (state.phrase + 1) % words.length;
            state.deleting = false;
          }
        } else state.length += 1;
        setValue(words[state.phrase].slice(0, state.length));
        schedule();
      }, complete ? 2600 : state.deleting ? 35 : state.length === 0 ? 350 : 85);
    }
    function restart() {
      clearTimeout(timer);
      if (media.matches) {
        position.current = { phrase: 0, length: words[0].length, deleting: false };
        setValue(words[0]);
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
  }, [words]);

  return <span className="typed-line" aria-hidden="true"><span>{value}</span><span className="typing-caret" /></span>;
}

function EngineeringDiagram({ locale }: { locale: Locale }) {
  return <div className="readiness-diagram" aria-hidden="true">
    <div className="diagram-heading"><span>{t(locale,"ui.engineering_focus")}</span><Crosshair size={18} /></div>
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
    <span className="diagram-label diagram-label-air"><i>01</i>{t(locale,"ui.airflow")}</span>
    <span className="diagram-label diagram-label-power"><i>02</i>{t(locale,"ui.electrical")}</span>
    <span className="diagram-label diagram-label-system"><i>03</i>{t(locale,"ui.integration")}</span>
    <div className="diagram-caption"><span>{t(locale, "home-experience.from_components_to_integration")}</span></div>
  </div>;
}

export function HomeHero({ locale }: { locale: Locale }) {
  return <section className="home-hero home-hero-engineered">
    <Photo src="/images/data-center.jpg" locale={locale} priority className="hero-photo" />
    <div className="hero-shade" /><div className="hero-grid" aria-hidden="true" />
    <div className="container engineered-content">
      <div className="hero-copy">
        <Eyebrow light>{t(locale,"ui.from_complexity")}</Eyebrow>
        <h1><span className="sr-only">{t(locale, "home-experience.before_you_go_live_make_sure_every")}</span><span aria-hidden="true">{text(m("home-experience.before_you_go_live_make_sure_every_27801"),locale)}</span><TypedPhrase key={locale} locale={locale} /></h1>
        <p>{t(locale, "home-experience.testing_inspection_and_commissioning_to_verify_your")}</p>
        <div className="hero-buttons"><ButtonLink href={url(locale, "contact")} variant="lime">{t(locale, "home-experience.discuss_your_project")}</ButtonLink><a href="#find-your-service" className="hero-about">{t(locale, "home-experience.find_your_service")}<ArrowDown size={17} /></a></div>
      </div>
      <EngineeringDiagram locale={locale} />
      <div className="engineered-bottom"><div className="hero-proof"><ShieldCheck size={19} /><span>{t(locale, "home-experience.independent_perspective")}</span></div><div className="hero-proof"><Crosshair size={19} /><span>{t(locale, "home-experience.measured_testing")}</span></div><div className="hero-proof"><Layers3 size={19} /><span>{t(locale, "home-experience.documented_results")}</span></div></div>
    </div>
  </section>;
}

const needs = [
 { slug: "testing", label: m("home-experience.system_performance"), question: m("home-experience.is_your_system_performing_as_designed") },
 { slug: "inspection", label: m("home-experience.installation_quality"), question: m("home-experience.have_the_installation_details_been_checked") },
 { slug: "commissioning", label: m("home-experience.operational_readiness"), question: m("home-experience.are_your_systems_ready_to_work_together") },
];

export function NeedsExplorer({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const need = needs[selected];
  const service = services.find(item => item.slug === need.slug)!;
  return <section className="needs-section section" id="find-your-service"><div className="container">
    <div className="needs-heading"><div><Eyebrow>{t(locale, "home-experience.start_with_your_requirements")}</Eyebrow><h2>{t(locale, "home-experience.what_do_you_need_to_verify")}</h2></div><p>{t(locale, "home-experience.choose_your_focus_find_the_right_approach")}</p></div>
    <div className="needs-layout"><div className="needs-options" role="tablist" aria-label={t(locale, "home-experience.your_facility_requirements")} aria-orientation="vertical">{needs.map((item, index) => <button key={item.slug} ref={element => { buttons.current[index] = element; }} id={`need-tab-${item.slug}`} type="button" role="tab" aria-selected={index === selected} aria-controls="need-panel" tabIndex={index === selected ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => {
      let next = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % needs.length;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + needs.length - 1) % needs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = needs.length - 1;
      else return;
      event.preventDefault(); setSelected(next); buttons.current[next]?.focus();
    }}><span className="need-number">0{index + 1}</span><ServiceIcon name={services.find(service => service.slug === item.slug)!.icon} size={23} /><span>{text(item.label,locale)}</span><ArrowUpRight size={20} /></button>)}</div>
    <div className="need-detail" id="need-panel" role="tabpanel" aria-labelledby={`need-tab-${need.slug}`} tabIndex={0}><div className="need-detail-copy" key={need.slug}><span className="mini-label">{text(service.name,locale)}</span><h3>{text(need.question,locale)}</h3><p>{text(service.description,locale)}</p><div className="need-deliverables"><span>{t(locale, "home-experience.scope_examples")}</span><ul>{service.scope.slice(0,3).map(output => <li key={output.en}><Check size={15} />{text(output,locale)}</li>)}</ul></div><Link className="text-link" href={url(locale, `services/${need.slug}`)}>{t(locale, "home-experience.explore_this_service")}<ArrowUpRight size={18} /></Link></div><span className="need-watermark" aria-hidden="true">0{selected + 1}</span></div></div>
  </div></section>;
}
