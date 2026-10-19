import { m, type Localized } from "./i18n";
export { m, t, text, url, isLocale, locales, type Locale } from "./i18n";
export type { Localized } from "./i18n";

// Company information follows the supplied 2026 company profile.
export const company = {
  name: "Green Ridge Technics",
  email: "", // Set the approved company email to enable real contact links.
  phone: "",
  address: m("content.jl_bintaro_raya_selatan_no_8_rt"),
};

export const navigation = [
  { path: "", label: m("content.home") },
  { path: "about", label: m("content.about_us") },
  { path: "services", label: m("content.services") },
  { path: "insights", label: m("content.insights") },
];
export const secondaryNavigation = [
  { path: "gallery", label: m("content.gallery") },
  { path: "tools", label: m("content.equipment") },
  { path: "certifications", label: m("content.certifications") },
  { path: "careers", label: m("content.careers") },
];

export const profile = {
  eyebrow: m("content.about_us_b414b"),
  heading: m("content.your_trusted_partner_for_mep_systems"),
  introduction: m("content.pt_green_ridge_technics_is_a_company"),
  principles: m("content.in_conducting_our_business_we_consistently_uphold"),
  commitment: m("content.we_are_committed_to_being_your_trusted"),
  visionLabel: m("content.vision"),
  vision: m("content.to_become_a_professional_reliable_and_trusted"),
  missionLabel: m("content.mission"),
  directorLabel: m("content.director_s_statement"),
  directorTitle: m("content.creating_meaningful_value"),
  directorStatement: m("content.building_a_company_that_creates_meaningful_value"),
  directorRole: m("content.director"),
  directorName: "Muhammad Zikri Pratama",
  missions: [m("content.delivering_the_best_and_most_trusted_services"),
    m("content.developing_and_empowering_high_quality_human_resources"),
    m("content.creating_broad_employment_opportunities_by_prioritizing_the"),
    m("content.upholding_a_strong_commitment_to_professional_standards")],
};

export const services = [
  {
    slug: "management", number: "01", icon: "settings",
    name: m("content.management_services"),
    tagline: m("content.focused_management_at_every_project_stage"),
    description: m("content.management_consultancy_for_project_delivery_commissioning_coordination"),
    image: "/images/engineering.jpg",
    scope: [m("content.project_management_handling"),
      m("content.commissioning_management_handling"),
      m("content.commissioning_document_control_handling"),
      m("content.engineering_calculation"),
      m("content.mep_assessment")],
    detail: m("content.management_consultancy_for_project_delivery_commissioning_coordination"),
    deliverable: m("content.documentation_of_service_activities_and_results_in"),
  },
  {
    slug: "inspection", number: "02", icon: "scan",
    name: m("content.inspection_services"),
    tagline: m("content.attention_to_every_installation_and_item_of"),
    description: m("content.inspection_of_piping_installations_welding_cable_installations"),
    image: "/images/industrial.jpg",
    scope: [m("content.piping_installation_inspection"),
      m("content.welding_inspection"),
      m("content.mechanical_equipment_inspection"),
      m("content.cable_installation_inspection"),
      m("content.electrical_equipment_inspection"),
      m("content.equipment_fire_inspection")],
    detail: m("content.inspection_of_piping_installations_welding_cable_installations"),
    deliverable: m("content.documentation_of_service_activities_and_results_in"),
  },
  {
    slug: "testing", number: "03", icon: "activity",
    name: m("content.system_test_services"),
    tagline: m("content.system_performance_demonstrated_through_testing"),
    description: m("content.testing_for_piping_systems_mechanical_and_electrical"),
    image: "/images/engineering.jpg",
    scope: [m("content.pressure_test_for_piping_system"),
      m("content.flushing_for_piping_system"),
      m("content.equipment_mechanical_test"),
      m("content.cable_test"),
      m("content.equipment_electrical_test"),
      m("content.equipment_fire_test"),
      m("content.indoor_air_quality"),
      m("content.testing_adjusting_and_balancing"),
      m("content.breaker_test"),
      m("content.room_integrity_test"),
      m("content.duct_air_leakage_pressure_test"),
      m("content.transmitter_verification")],
    detail: m("content.testing_for_piping_systems_mechanical_and_electrical"),
    deliverable: m("content.documentation_of_service_activities_and_results_in"),
  },
  {
    slug: "commissioning", number: "04", icon: "settings",
    name: m("content.commissioning_services"),
    tagline: m("content.system_readiness_from_function_to_integration"),
    description: m("content.commissioning_for_mechanical_electrical_fire_protection_plumbing"),
    image: "/images/data-center.jpg",
    scope: [m("content.commissioning_for_mechanical_system"),
      m("content.commissioning_for_electrical_system"),
      m("content.commissioning_for_fire_system"),
      m("content.commissioning_for_plumbing_system"),
      m("content.commissioning_for_bms_system")],
    detail: m("content.commissioning_for_mechanical_electrical_fire_protection_plumbing"),
    deliverable: m("content.documentation_of_service_activities_and_results_in"),
  },
];

export const projects = [
  {
    slug: "data-center",
    name: m("content.critical_infrastructure_readiness"),
    sector: m("content.data_centers"),
    category: "data",
    image: "/images/data-center.jpg",
    service: "commissioning",
    description: m("content.an_illustrative_integrated_commissioning_approach_for_a"),
    scope: m("content.design_review_functional_verification_and_integrated_systems"),
  },
  {
    slug: "commercial-building",
    name: m("content.buildings_that_work_smarter"),
    sector: m("content.commercial_buildings"),
    category: "building",
    image: "/images/building.jpg",
    service: "management",
    description: m("content.an_illustrative_evaluation_of_hvac_and_building"),
    scope: m("content.air_distribution_testing_controls_evaluation_and_energy"),
  },
  {
    slug: "industrial-facility",
    name: m("content.reliability_in_every_process"),
    sector: m("content.industrial_facilities"),
    category: "industrial",
    image: "/images/industrial.jpg",
    service: "inspection",
    description: m("content.an_illustrative_inspection_of_mechanical_and_electrical"),
    scope: m("content.installation_inspection_findings_documentation_and_corrective_action"),
  },
];

export const articles = [
  {
    slug: "commissioning-from-the-start",
    image: "/images/data-center.jpg",
    category: m("content.commissioning"),
    read: 4,
    title: m("content.why_does_commissioning_begin_before_systems_start"),
    excerpt: m("content.understanding_verification_from_design_development_through_facility"),
    paragraphs: [
      m("content.by_the_time_a_facility_is_ready"),
      m("content.starting_the_commissioning_process_early_creates_time"),
      m("content.during_installation_inspection_records_and_equipment_readiness"),
      m("content.the_result_is_documentation_that_helps_owners"),
    ],
  },
  {
    slug: "understanding-tab",
    image: "/images/engineering.jpg",
    category: m("content.technical_insights"),
    read: 3,
    title: m("content.understanding_tab_the_balance_behind_building_comfort"),
    excerpt: m("content.how_measurements_and_adjustments_help_hvac_systems"),
    paragraphs: [
      m("content.testing_adjusting_and_balancing_or_tab_is"),
      m("content.before_measurements_begin_system_readiness_should_be"),
      m("content.following_measurements_adjustments_are_made_systematically_and"),
    ],
  },
  {
    slug: "efficient-building-systems",
    image: "/images/building.jpg",
    category: m("content.sustainability"),
    read: 3,
    title: m("content.energy_efficiency_starts_with_understanding_your_systems"),
    excerpt: m("content.first_steps_in_understanding_operating_patterns_and"),
    paragraphs: [
      m("content.energy_efficiency_is_often_associated_with_replacing"),
      m("content.data_collection_helps_establish_a_baseline_a"),
      m("content.improvement_opportunities_should_be_evaluated_alongside_reliability"),
    ],
  },
];

export const pageInfo: Record<
  string,
  { title: Localized; description: Localized; eyebrow: Localized }
> = {
  about: {
    eyebrow: m("content.about_green_ridge"),
    title: profile.heading,
    description: profile.commitment,
  },
  services: {
    eyebrow: m("content.our_expertise"),
    title: m("content.every_system_thoughtfully_verified"),
    description: m("content.technical_support_from_testing_to_handover_find"),
  },
  projects: {
    eyebrow: m("content.expertise_in_practice"),
    title: m("content.different_facilities_one_commitment_to_quality"),
    description: m("content.explore_illustrative_applications_of_our_services_across"),
  },
  insights: {
    eyebrow: m("content.the_green_ridge_journal"),
    title: m("content.fresh_perspectives_better_decisions"),
    description: m("content.ideas_and_knowledge_on_commissioning_system_performance"),
  },
  gallery: {
    eyebrow: m("content.behind_the_systems"),
    title: m("content.a_closer_look_a_deeper_understanding"),
    description: m("content.a_visual_collection_illustrating_the_working_environments"),
  },
  tools: {
    eyebrow: m("content.equipment_technology"),
    title: m("content.the_right_measurements_well_informed_decisions"),
    description: m("content.explore_instrument_categories_that_support_facility_performance"),
  },
  certifications: {
    eyebrow: m("content.quality_competence"),
    title: m("content.confidence_is_built_on_evidence"),
    description: m("content.a_commitment_to_documented_processes_professional_development"),
  },
  careers: {
    eyebrow: m("content.careers_at_green_ridge"),
    title: m("content.build_your_expertise_make_a_real_difference"),
    description: m("content.for_people_who_want_to_understand_how"),
  },
  contact: {
    eyebrow: m("content.start_a_conversation"),
    title: m("content.great_projects_begin_with_a_conversation"),
    description: m("content.tell_us_what_your_facility_needs_let"),
  },
  privacy: {
    eyebrow: m("content.website_information"),
    title: m("content.privacy_data_use"),
    description: m("content.how_information_is_handled_in_this_presentation"),
  },
};

export const paths = [
  "",
  ...Object.keys(pageInfo).filter(path => path !== "projects"),
  ...services.map((s) => `services/${s.slug}`),
  ...articles.map((a) => `insights/${a.slug}`),
];
export const imageAlt = {
  "/images/profile-about.png": m("ui.profile_illustration"),
  "/images/data-center.jpg": m("content.server_aisle_inside_a_modern_data_center"),
  "/images/building.jpg": m("content.glass_facade_of_a_modern_commercial_building"),
  "/images/engineering.jpg": m("content.illustration_of_technical_work_and_engineering_equipment"),
  "/images/industrial.jpg": m("content.process_towers_and_pipework_at_an_industrial"),
};

export const common = {
  contact: m("content.let_s_talk"),
  explore: m("content.explore_our_services"),
  learn: m("content.learn_more"),
  allProjects: m("content.explore_projects"),
  allArticles: m("content.all_insights"),
  demo: m("content.illustrative_project_not_an_actual_portfolio_entry"),
  photo: m("content.illustrative_photography"),
  draft: m("content.presentation_version_company_content_is_in_development"),
};
