import { t } from "@/lib/i18n";
import Link from "next/link";
import { ArrowUpRight, Building2, Factory, Server, MoveUpRight } from "lucide-react";
import { m, text, url, services, articles, common, type Locale } from "@/lib/content";
import { Photo, ButtonLink, TextLink, Eyebrow, SectionHeading, ServiceIcon, CallToAction } from "./ui";
import { HomeHero, NeedsExplorer } from "./home-experience";

export function HomePage({ locale }: { locale: Locale }) {
  return <>
    <HomeHero locale={locale} />
    <NeedsExplorer locale={locale} />

    <section className="intro-section section" id="introduction"><div className="container intro-grid"><div data-reveal><Eyebrow>{t(locale, "home.your_engineering_partner")}</Eyebrow><h2>{text(m("home.reliable_systems_built_on_precision"),locale)}</h2></div><div className="intro-copy" data-reveal><p>{t(locale, "home.behind_every_facility_that_performs_well_is")}</p><p>{t(locale, "home.green_ridge_technics_helps_you_understand_verify")}</p><TextLink href={url(locale, "about")}>{t(locale, "home.about_green_ridge_technics")}</TextLink></div></div></section>

    <section className="services-section section"><div className="container"><SectionHeading locale={locale} label={m("home.what_we_do")} title={m("home.expertise_that_connects")} description={m("home.from_component_verification_to_whole_facility_readiness")} href={url(locale, "services")} link={m("home.all_services")} /><div className="services-grid">{services.map(service => <Link href={url(locale, `services/${service.slug}`)} className="service-card" key={service.slug} data-reveal><div className="service-card-top"><ServiceIcon name={service.icon} /><span>{service.number}</span></div><h3>{text(service.name, locale)}</h3><p>{text(service.description, locale)}</p><div className="service-card-bottom"><span>{t(locale, "home.explore_expertise")}</span><ArrowUpRight size={23} /></div></Link>)}</div></div></section>

    <section className="sector-section"><div className="container sector-inner"><span className="mini-label">{t(locale, "home.expertise_across_sectors")}</span><div><Server size={25} strokeWidth={1.2} /><span>{t(locale,"content.data_centers")}</span></div><div><Building2 size={25} strokeWidth={1.2} /><span>{t(locale, "content.commercial_buildings")}</span></div><div><Factory size={25} strokeWidth={1.2} /><span>{t(locale, "content.industrial_facilities")}</span></div></div></section>

    <section className="approach-section section"><div className="approach-orbits" aria-hidden="true"><i /><i /><i /></div><div className="container approach-grid"><div className="approach-intro" data-reveal><Eyebrow light>{t(locale, "home.how_we_work")}</Eyebrow><h2>{text(m("home.a_clear_process_real_confidence"),locale)}</h2><p>{t(locale, "home.every_project_is_different_our_commitment_stays")}</p><ButtonLink href={url(locale, "contact")} variant="outline">{t(locale, "home.discuss_your_requirements")}</ButtonLink><div className="approach-emblem" aria-hidden="true"><MoveUpRight size={100} strokeWidth={.8} /></div></div><div className="process-list">{[
      [m("home.understand"), m("home.we_listen_to_your_requirements_review_documentation")],
      [m("home.verify"), m("home.testing_and_inspection_follow_a_systematic_process")],
      [m("home.document"), m("home.findings_and_results_are_clearly_documented_to")],
      [m("home.improve"), m("home.relevant_recommendations_guide_improvements_and_facility_operational")],
    ].map(([title, description], index) => <div className="process-step" key={title.en} data-reveal><span className="process-number">0{index + 1}</span><div><h3>{text(title, locale)}</h3><p>{text(description, locale)}</p></div><ArrowUpRight size={20} strokeWidth={1} /></div>)}</div></div></section>

    <section className="section insights-section"><div className="container"><SectionHeading locale={locale} label={m("home.insights_perspectives")} title={m("home.knowledge_for_your_next_move")} href={url(locale, "insights")} link={common.allArticles} /><div className="article-grid">{articles.map(article => <Link className="article-card" key={article.slug} href={url(locale, `insights/${article.slug}`)} data-reveal><div className="article-image"><Photo src={article.image} locale={locale} /><span className="article-arrow"><ArrowUpRight size={20} /></span></div><div className="article-meta"><span>{text(article.category, locale)}</span><span>{article.read} {t(locale, "home.min_read")}</span></div><h3>{text(article.title, locale)}</h3><p>{text(article.excerpt, locale)}</p></Link>)}</div></div></section>

    <section className="faq-section section"><div className="container faq-grid"><div data-reveal><Eyebrow>{t(locale, "home.before_we_begin")}</Eyebrow><h2>{t(locale, "home.a_few_questions_answered")}</h2><p>{t(locale, "home.have_something_else_in_mind")}</p><TextLink href={url(locale, "contact")}>{t(locale, "home.let_s_talk")}</TextLink></div><div>{[
      [m("home.do_i_need_all_of_the_services"), m("home.not_necessarily_the_scope_can_be_tailored")],
      [m("home.when_should_we_start_a_conversation"), m("home.as_soon_as_project_requirements_start_taking")],
      [m("home.what_should_i_prepare_for_an_initial"), m("home.facility_type_location_service_requirements_and_an")],
      [m("home.what_does_the_verification_process_deliver"), m("home.deliverables_match_the_agreed_service_such_as")],
    ].map(([question, answer]) => <details className="faq-item" key={question.en}><summary>{text(question, locale)}<span aria-hidden="true" /></summary><p>{text(answer, locale)}</p></details>)}</div></div></section>
    <CallToAction locale={locale} />
  </>;
}
