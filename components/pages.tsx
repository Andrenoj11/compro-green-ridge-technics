import { t } from "@/lib/i18n";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Crosshair,
  UsersRound,
  Leaf,
  MapPin,
  Mail,
  Clock3,
  FileCheck2,
  GraduationCap,
  BriefcaseBusiness,
  Gauge,
  Thermometer,
  Wind,
  Zap,
  AudioLines,
  ScanLine,
} from "lucide-react";
import {
  m,
  text,
  url,
  services,
  projects,
  articles,
  pageInfo,
  common,
  company,
  profile,
  type Locale,
} from "@/lib/content";
import {
  Photo,
  ButtonLink,
  TextLink,
  Eyebrow,
  PageHero,
  SectionHeading,
  ServiceIcon,
  CallToAction,
} from "./ui";
import { ProjectGrid, Gallery, ContactForm } from "./interactive";

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="content-note">
      <span aria-hidden="true">i</span>
      <p>{children}</p>
    </div>
  );
}

function About({ locale }: { locale: Locale }) {
  const principleKeys = ["about.professionalism", "about.transparency", "about.accountability"] as const;
  return (
    <>
      <section className="section about-overview">
        <div className="container about-story">
          <figure className="about-visual" data-reveal>
            <div className="about-visual-image">
              <Photo src="/images/profile-about.png" locale={locale} />
            </div>
            <figcaption className="about-location">
              <MapPin size={20} strokeWidth={1.4} aria-hidden="true" />
              <div>
                <span>{t(locale, "pages.office")}</span>
                <p>{text(company.address, locale)}</p>
              </div>
            </figcaption>
          </figure>
          <div className="about-story-copy" data-reveal>
            <span className="mini-label">{t(locale, "about.building_solutions")}</span>
            <h2>PT Green Ridge Technics</h2>
            <p className="about-story-lead">{t(locale, "about.company_introduction")}</p>
            <p>{text(profile.principles, locale)}</p>
            <ul className="about-principles" aria-label={t(locale, "about.our_principles")}>
              {principleKeys.map(key => (
                <li key={key}><Check size={15} strokeWidth={1.5} aria-hidden="true" />{t(locale, key)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-tinted about-purpose-section">
        <div className="container company-purpose">
          <div className="company-vision" data-reveal>
            <Eyebrow>{text(profile.visionLabel, locale)}</Eyebrow>
            <h2>{text(profile.vision, locale)}</h2>
          </div>
          <div className="company-missions" data-reveal>
            <Eyebrow>{text(profile.missionLabel, locale)}</Eyebrow>
            <ol>{profile.missions.map((mission, index) => (
              <li key={index}><span aria-hidden="true">0{index + 1}</span><p>{text(mission, locale)}</p></li>
            ))}</ol>
          </div>
        </div>
      </section>

      <section className="section director-section">
        <div className="container">
          <figure className="director-panel" data-reveal>
            <div className="director-panel-heading">
              <div>
                <Eyebrow light>{text(profile.directorLabel, locale)}</Eyebrow>
                <h2>{text(profile.directorTitle, locale)}</h2>
              </div>
              <span className="director-quote-mark" aria-hidden="true">“</span>
            </div>
            <blockquote><p>{text(profile.directorStatement, locale)}</p></blockquote>
            <figcaption>
              <span className="director-initials" aria-hidden="true">MZP</span>
              <span><strong>{profile.directorName}</strong><span>{text(profile.directorRole, locale)} · PT Green Ridge Technics</span></span>
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}

function Services({ locale }: { locale: Locale }) {
  return (
    <section className="section">
      <div className="container service-list">
        {services.map((s) => (
          <article className="service-detail-card" key={s.slug} data-reveal>
            <div className="service-detail-image">
              <Photo src={s.image} locale={locale} />
              <span>{s.number}</span>
            </div>
            <div className="service-detail-copy">
              <div className="service-label">
                <ServiceIcon name={s.icon} />
                <span>{text(s.name, locale)}</span>
              </div>
              <h2>{text(s.tagline, locale)}</h2>
              <p>{text(s.description, locale)}</p>
              <ul className="scope-list">
                {s.scope.map((item) => (
                  <li key={item.en}>
                    <Check size={16} />
                    {text(item, locale)}
                  </li>
                ))}
              </ul>
              <TextLink href={url(locale, `services/${s.slug}`)}>
                {t(locale, "home-experience.explore_this_service")}
              </TextLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ServiceDetail({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const s = services.find((item) => item.slug === slug)!;
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s.name}
        title={s.tagline}
        description={s.description}
      />
      <div className="container detail-hero-image">
        <Photo src={s.image} locale={locale} priority />
      </div>
      <section className="section">
        <div className="container detail-layout">
          <div className="detail-body">
            <Eyebrow>{t(locale, "pages.about_the_service")}</Eyebrow>
            <h2>
              {t(locale, "pages.understand_the_need_verify_the_performance")}
            </h2>
            <p>{text(s.detail, locale)}</p>
            <h3>{t(locale, "pages.service_scope")}</h3>
            <ul className="large-scope-list">
              {s.scope.map((item, index) => (
                <li key={item.en}>
                  <span>0{index + 1}</span>
                  {text(item, locale)}
                  <ArrowUpRight size={18} />
                </li>
              ))}
            </ul>
            <h3>{t(locale, "pages.what_you_receive")}</h3>
            <p>{text(s.deliverable, locale)}</p>
          </div>
          <aside className="detail-sidebar">
            <span className="mini-label">
              {t(locale, "pages.let_s_discuss")}
            </span>
            <h3>
              {t(locale, "pages.what_does_your_facility_need")}
            </h3>
            <p>
              {t(locale, "pages.prepare_your_facility_type_location_schedule_and")}
            </p>
            <ButtonLink href={url(locale, "contact")}>
              {t(locale, "pages.start_a_conversation")}
            </ButtonLink>
            <div className="sidebar-links">
              <h4>{t(locale, "pages.other_services")}</h4>
              {services
                .filter((item) => item.slug !== slug)
                .map((item) => (
                  <Link
                    href={url(locale, `services/${item.slug}`)}
                    key={item.slug}
                  >
                    {text(item.name, locale)}
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
            </div>
          </aside>
        </div>
      </section>
      <CallToAction locale={locale} />
    </>
  );
}

function ProjectList({ locale }: { locale: Locale }) {
  return (
    <section className="section">
      <div className="container">
        <Note>
          {t(locale, "pages.all_studies_on_this_page_illustrate_service")}
        </Note>
        <ProjectGrid locale={locale} />
      </div>
    </section>
  );
}

export function ProjectDetail({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const project = projects.find((p) => p.slug === slug)!;
  const service = services.find((s) => s.slug === project.service)!;
  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={project.sector}
        title={project.name}
        description={project.description}
      />
      <div className="container detail-hero-image">
        <Photo src={project.image} locale={locale} priority />
        <span className="image-tag">
          {t(locale, "interactive.illustrative_study")}
        </span>
      </div>
      <section className="section">
        <div className="container detail-layout">
          <div className="detail-body">
            <Note>
              {text(common.demo, locale)}.{" "}
              {t(locale, "pages.no_actual_client_location_or_results_are")}
            </Note>
            <h2>
              {t(locale, "pages.challenges_understood_a_purposeful_approach")}
            </h2>
            <p>{text(project.description, locale)}</p>
            <h3>{t(locale, "pages.illustrative_scope")}</h3>
            <p>{text(project.scope, locale)}</p>
            <h3>{t(locale, "pages.the_approach")}</h3>
            <ol className="numbered-list">
              <li>
                {t(locale, "pages.review_design_documents_and_agree_on_acceptance")}
              </li>
              <li>
                {t(locale, "pages.assess_installation_readiness_and_establish_a_suitable")}
              </li>
              <li>
                {t(locale, "pages.perform_measurements_or_inspections_within_scope_and")}
              </li>
              <li>
                {t(locale, "pages.prepare_a_report_to_support_follow_up")}
              </li>
            </ol>
            <TextLink href={url(locale, "projects")}>
              {t(locale, "pages.back_to_all_studies")}
            </TextLink>
          </div>
          <aside className="detail-sidebar">
            <span className="mini-label">{t(locale, "pages.sector")}</span>
            <h3>{text(project.sector, locale)}</h3>
            <div className="sidebar-links">
              <h4>{t(locale, "pages.related_service")}</h4>
              <Link href={url(locale, `services/${service.slug}`)}>
                {text(service.name, locale)}
                <ArrowUpRight size={17} />
              </Link>
            </div>
            <ButtonLink href={url(locale, "contact")}>
              {t(locale, "pages.discuss_a_similar_project")}
            </ButtonLink>
          </aside>
        </div>
      </section>
      <CallToAction locale={locale} />
    </>
  );
}

function Insights({ locale }: { locale: Locale }) {
  return (
    <section className="section">
      <div className="container">
        <div className="article-grid">
          {articles.map((article) => (
            <Link
              className="article-card"
              key={article.slug}
              href={url(locale, `insights/${article.slug}`)}
              data-reveal
            >
              <div className="article-image">
                <Photo src={article.image} locale={locale} />
                <span className="article-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <div className="article-meta">
                <span>{text(article.category, locale)}</span>
                <span>
                  {article.read} {t(locale, "home.min_read")}
                </span>
              </div>
              <h2>{text(article.title, locale)}</h2>
              <p>{text(article.excerpt, locale)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticleDetail({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const article = articles.find((a) => a.slug === slug)!;
  return (
    <>
      <section className="article-heading container">
        <Link className="back-link" href={url(locale, "insights")}>
          <ArrowLeft size={16} />
          {t(locale, "content.all_insights")}
        </Link>
        <Eyebrow>{text(article.category, locale)}</Eyebrow>
        <h1>{text(article.title, locale)}</h1>
        <p>{text(article.excerpt, locale)}</p>
        <div className="article-byline">
          <span className="author-mark">GR</span>
          <span>Green Ridge Journal</span>
          <span>·</span>
          <Clock3 size={14} />
          <span>
            {article.read} {t(locale, "home.min_read")}
          </span>
        </div>
      </section>
      <div className="container detail-hero-image">
        <Photo src={article.image} locale={locale} priority />
      </div>
      <section className="section article-body">
        {article.paragraphs.map((paragraph, i) => (
          <p key={i}>{text(paragraph, locale)}</p>
        ))}
        <div className="article-end">
          <span>GREEN RIDGE JOURNAL</span>
          <TextLink href={url(locale, "contact")}>
            {t(locale, "home.discuss_your_requirements")}
          </TextLink>
        </div>
      </section>
      <CallToAction locale={locale} />
    </>
  );
}

function Equipment({ locale }: { locale: Locale }) {
  const items = [
    {
      Icon: Wind,
      name: m("pages.airflow_measurement"),
      detail: m("pages.instruments_for_measuring_air_velocity_and_volume"),
      examples: m("ui.airflow_instruments"),
    },
    {
      Icon: Gauge,
      name: m("pages.pressure_measurement"),
      detail: m("pages.pressure_and_differential_pressure_measurement_to_understand"),
      examples: m("ui.pressure_instruments"),
    },
    {
      Icon: Thermometer,
      name: m("pages.thermal_measurement"),
      detail: m("pages.temperature_and_humidity_monitoring_for_environmental_and"),
      examples: m("ui.thermal_instruments"),
    },
    {
      Icon: Zap,
      name: m("pages.electrical_measurement"),
      detail: m("pages.instrument_categories_for_assessing_electrical_parameters_within"),
      examples: m("ui.electrical_instruments"),
    },
    {
      Icon: AudioLines,
      name: m("pages.environmental_measurement"),
      detail: m("pages.assessment_of_working_environments_and_equipment_response"),
      examples: m("ui.environmental_instruments"),
    },
    {
      Icon: ScanLine,
      name: m("pages.documentation_tracking"),
      detail: m("pages.structured_records_for_tracking_findings_follow_up"),
      examples: m("ui.documentation_instruments"),
    },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="equipment-grid">
          {items.map((item) => (
            <article className="equipment-card" key={item.name.en} data-reveal>
              <item.Icon size={33} strokeWidth={1.3} />
              <h2>{text(item.name, locale)}</h2>
              <p>{text(item.detail, locale)}</p>
              <span>{text(item.examples,locale)}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certifications({ locale }: { locale: Locale }) {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="status-panel">
            <div className="status-icon">
              <FileCheck2 size={40} strokeWidth={1} />
            </div>
            <div>
              <h2>
                {t(locale, "pages.quality_and_professional_standards")}
              </h2>
              <p>
                {t(locale, "pages.discuss_documentation_and_competency_requirements")}
              </p>
              <ButtonLink href={url(locale, "contact")}>
                {t(locale, "pages.discuss_project_requirements")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-tinted">
        <div className="container">
          <SectionHeading
            locale={locale}
            label={m("pages.quality_approach")}
            title={m("pages.quality_as_an_ongoing_process")}
          />
          <div className="values-grid three">
            {[
              {
                Icon: FileCheck2,
                title: m("pages.documented_processes"),
                copy: m("pages.consistent_records_help_keep_each_verification_step"),
              },
              {
                Icon: GraduationCap,
                title: m("pages.professional_development"),
                copy: m("pages.knowledge_and_skills_should_keep_developing_alongside"),
              },
              {
                Icon: ShieldCheck,
                title: m("pages.responsible_practices"),
                copy: m("pages.scope_readiness_and_safety_requirements_are_reviewed"),
              },
            ].map((v) => (
              <div className="value-card" key={v.title.en}>
                <v.Icon size={28} strokeWidth={1.3} />
                <h3>{text(v.title, locale)}</h3>
                <p>{text(v.copy, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Careers({ locale }: { locale: Locale }) {
  return (
    <>
      <section className="section">
        <div className="container careers-intro">
          <div data-reveal>
            <Eyebrow>{t(locale, "pages.grow_together")}</Eyebrow>
            <h2>
              {t(locale, "pages.curiosity_is_a_great_place_to_start")}
            </h2>
            <p>
              {t(locale, "pages.we_aim_to_build_a_workplace_that")}
            </p>
            <div className="career-values">
              <span>
                <Crosshair size={18} />
                {t(locale, "pages.learn_from_the_details")}
              </span>
              <span>
                <UsersRound size={18} />
                {t(locale, "pages.grow_as_a_team")}
              </span>
              <span>
                <Leaf size={18} />
                {t(locale, "pages.work_with_purpose")}
              </span>
            </div>
          </div>
          <div className="careers-photo" data-reveal>
            <Photo src="/images/industrial.jpg" locale={locale} />
          </div>
        </div>
      </section>
      <section className="section section-tinted">
        <div className="container">
          <div className="jobs-heading">
            <div>
              <Eyebrow>{t(locale, "pages.career_opportunities")}</Eyebrow>
              <h2>
                {t(locale, "pages.your_next_step")}
              </h2>
            </div>
            <span className="status-pill">
              0 {t(locale, "pages.open_positions")}
            </span>
          </div>
          <div className="empty-state">
            <BriefcaseBusiness size={35} strokeWidth={1.2} />
            <h3>
              {t(locale, "pages.no_open_positions")}
            </h3>
            <p>
              {t(locale, "pages.explore_our_expertise_and_working_approach")}
            </p>
            <TextLink href={url(locale, "about")}>
              {t(locale, "pages.get_to_know_green_ridge")}
            </TextLink>
          </div>
        </div>
      </section>
    </>
  );
}

function Contact({ locale }: { locale: Locale }) {
  return (
    <section className="section">
      <div className="container contact-layout">
        <aside className="contact-info">
          <Eyebrow>
            {t(locale, "pages.contact_green_ridge")}
          </Eyebrow>
          <h2>
            {t(locale, "pages.let_s_understand_what_you_need")}
          </h2>
          <p>
            {t(locale, "pages.a_new_project_system_verification_or_an")}
          </p>
          {company.email && <div className="contact-info-item">
            <Mail size={21} strokeWidth={1.4} />
            <div>
              <h3>{t(locale, "ui.email")}</h3>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </div>
          </div>}
          <div className="contact-info-item">
            <MapPin size={21} strokeWidth={1.4} />
            <div>
              <h3>{t(locale, "pages.office")}</h3>
              <p>{text(company.address, locale)}</p>
            </div>
          </div>
          <div className="contact-checklist">
            <h3>
              {t(locale, "pages.for_a_focused_conversation")}
            </h3>
            {[
              m("pages.facility_type_and_location"),
              m("pages.required_service_or_issue_to_discuss"),
              m("pages.approximate_project_schedule"),
              m("pages.available_drawings_or_specifications"),
            ].map((item) => (
              <p key={item.en}>
                <Check size={15} />
                {text(item, locale)}
              </p>
            ))}
          </div>
        </aside>
        <ContactForm locale={locale} />
      </div>
    </section>
  );
}

function Privacy({ locale }: { locale: Locale }) {
  return (
    <section className="section article-body">
      <h2>
        {t(locale, "pages.forms_and_personal_information")}
      </h2>
      <p>
        {t(locale, "pages.the_contact_form_processes_information_only_on")}
      </p>
      <h2>{t(locale, "pages.analytics_and_cookies")}</h2>
      <p>
        {t(locale, "pages.this_website_does_not_install_analytics_or")}
      </p>
      <h2>{t(locale, "pages.information_updates")}</h2>
      <p>
        {t(locale, "pages.privacy_information_updates")}
      </p>
    </section>
  );
}

export function ContentPage({
  locale,
  path,
}: {
  locale: Locale;
  path: string;
}) {
  const info = pageInfo[path];
  if (path === "about") {
    return <div className="about-page"><PageHero locale={locale} {...info} /><About locale={locale} /><CallToAction locale={locale} /></div>;
  }
  return (
    <>
      <PageHero locale={locale} {...info} />
      {path === "services" ? (
        <Services locale={locale} />
      ) : path === "projects" ? (
        <ProjectList locale={locale} />
      ) : path === "insights" ? (
        <Insights locale={locale} />
      ) : path === "gallery" ? (
        <section className="section">
          <div className="container">
            <Gallery locale={locale} />
          </div>
        </section>
      ) : path === "tools" ? (
        <Equipment locale={locale} />
      ) : path === "certifications" ? (
        <Certifications locale={locale} />
      ) : path === "careers" ? (
        <Careers locale={locale} />
      ) : path === "contact" ? (
        <Contact locale={locale} />
      ) : (
        <Privacy locale={locale} />
      )}
      {!["contact", "privacy"].includes(path) && (
        <CallToAction locale={locale} />
      )}
    </>
  );
}
