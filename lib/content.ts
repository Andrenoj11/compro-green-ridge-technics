export type Locale = "id" | "en";
export type Bilingual = { id: string; en: string };
export const b = (id: string, en: string): Bilingual => ({ id, en });
export const text = (value: Bilingual, locale: Locale) => value[locale];
export const isLocale = (value: string): value is Locale =>
  value === "id" || value === "en";
export const url = (locale: Locale, path = "") =>
  `/${locale}${path ? `/${path}` : ""}`;

// Replace the draft content here when the client's company information is ready.
export const company = {
  name: "Green Ridge Technics",
  email: "", // Set the approved company email to enable real contact links.
  phone: "",
  address: b(
    "Informasi kantor akan segera tersedia.",
    "Office information will be available soon.",
  ),
};

export const navigation = [
  { path: "", label: b("Beranda", "Home") },
  { path: "about", label: b("Tentang Kami", "About Us") },
  { path: "services", label: b("Layanan", "Services") },
  { path: "projects", label: b("Proyek", "Projects") },
  { path: "insights", label: b("Wawasan", "Insights") },
];
export const secondaryNavigation = [
  { path: "gallery", label: b("Galeri", "Gallery") },
  { path: "tools", label: b("Peralatan", "Equipment") },
  { path: "certifications", label: b("Sertifikasi", "Certifications") },
  { path: "careers", label: b("Karir", "Careers") },
];

export const services = [
  {
    slug: "testing",
    number: "01",
    icon: "activity",
    name: b("Testing & Balancing", "Testing & Balancing"),
    tagline: b(
      "Presisi dalam setiap pengukuran.",
      "Precision in every measurement.",
    ),
    description: b(
      "Memahami kinerja sistem Anda melalui pengujian menyeluruh, pengukuran yang akurat, dan analisis yang dapat ditindaklanjuti.",
      "Understand how your systems perform through thorough testing, accurate measurements, and actionable analysis.",
    ),
    image: "/images/engineering.jpg",
    scope: [
      b(
        "Testing, Adjusting & Balancing (TAB)",
        "Testing, Adjusting & Balancing (TAB)",
      ),
      b(
        "Pengujian mekanikal dan elektrikal",
        "Mechanical and electrical testing",
      ),
      b("Ductwork air leakage test", "Ductwork air leakage testing"),
      b("Room integrity test", "Room integrity testing"),
      b(
        "Verifikasi sensor dan instrumen",
        "Sensor and instrument verification",
      ),
    ],
    detail: b(
      "Sistem yang terpasang dengan baik perlu dibuktikan melalui pengukuran. Kami membantu memeriksa distribusi udara, aliran air, dan respons sistem terhadap kondisi operasi yang direncanakan. Ruang lingkup pengujian disepakati berdasarkan kebutuhan fasilitas dan dokumen desain.",
      "A well-installed system needs measured evidence. We help assess air distribution, water flow, and system response under planned operating conditions. The testing scope is agreed against the facility's requirements and design documents.",
    ),
    deliverable: b(
      "Laporan hasil pengukuran, perbandingan terhadap parameter desain, serta daftar temuan dan rekomendasi penyesuaian.",
      "A measurement report, comparison against design parameters, and a list of findings with adjustment recommendations.",
    ),
  },
  {
    slug: "inspection",
    number: "02",
    icon: "scan",
    name: b("Technical Inspection", "Technical Inspection"),
    tagline: b(
      "Detail diperiksa. Kualitas dijaga.",
      "Details checked. Quality protected.",
    ),
    description: b(
      "Pemeriksaan independen untuk membantu memastikan instalasi, material, dan sistem siap memasuki tahap operasi berikutnya.",
      "Independent inspections to help establish whether installations, materials, and systems are ready for the next stage of operation.",
    ),
    image: "/images/industrial.jpg",
    scope: [
      b("Inspeksi instalasi mekanikal", "Mechanical installation inspection"),
      b("Inspeksi sistem elektrikal", "Electrical system inspection"),
      b(
        "Pemeriksaan sistem proteksi kebakaran",
        "Fire protection system inspection",
      ),
      b(
        "Tinjauan dokumen dan gambar kerja",
        "Documentation and drawing review",
      ),
      b(
        "Pencatatan dan tindak lanjut temuan",
        "Findings documentation and follow-up",
      ),
    ],
    detail: b(
      "Kualitas dimulai dari hal-hal yang sering luput dari perhatian. Inspeksi kami dirancang untuk meninjau kondisi instalasi terhadap gambar yang disetujui, persyaratan proyek, dan kriteria penerimaan yang disepakati. Setiap temuan dicatat agar dapat ditelusuri dan ditindaklanjuti.",
      "Quality starts with details that are easy to overlook. Our inspections review installation conditions against approved drawings, project requirements, and agreed acceptance criteria. Findings are recorded so they can be traced and addressed.",
    ),
    deliverable: b(
      "Checklist inspeksi, dokumentasi temuan, dan daftar tindakan yang perlu diselesaikan sebelum tahap berikutnya.",
      "Inspection checklists, documented findings, and an action list to resolve before the next project stage.",
    ),
  },
  {
    slug: "commissioning",
    number: "03",
    icon: "settings",
    name: b("Commissioning", "Commissioning"),
    tagline: b(
      "Dari rencana menjadi kesiapan.",
      "From design intent to readiness.",
    ),
    description: b(
      "Menghubungkan desain, instalasi, dan operasi melalui proses verifikasi terstruktur untuk fasilitas yang bekerja sebagaimana direncanakan.",
      "Connect design, installation, and operation through structured verification for facilities that work as intended.",
    ),
    image: "/images/data-center.jpg",
    scope: [
      b("Commissioning agent & management", "Commissioning agent & management"),
      b(
        "Tinjauan desain dan kesiapan sistem",
        "Design and system readiness reviews",
      ),
      b(
        "Rencana dan prosedur commissioning",
        "Commissioning plans and procedures",
      ),
      b("Functional performance testing", "Functional performance testing"),
      b(
        "Integrated systems testing & handover",
        "Integrated systems testing & handover",
      ),
    ],
    detail: b(
      "Commissioning merupakan proses, bukan sekadar pengujian akhir. Kami mendukung koordinasi lintas disiplin dari penetapan kebutuhan hingga serah terima, membantu tim proyek memahami apa yang harus diverifikasi, kapan dilakukan, dan bagaimana hasilnya didokumentasikan.",
      "Commissioning is a process, not just a final test. We support multidisciplinary coordination from requirements definition to handover, helping project teams understand what needs verification, when it should happen, and how to document the results.",
    ),
    deliverable: b(
      "Rencana commissioning, catatan pengujian fungsional, pelacakan isu, dan dokumentasi serah terima sistem.",
      "A commissioning plan, functional test records, issue tracking, and system handover documentation.",
    ),
  },
  {
    slug: "energy-efficiency",
    number: "04",
    icon: "leaf",
    name: b("Energy & Performance", "Energy & Performance"),
    tagline: b(
      "Kinerja lebih baik. Energi lebih bijak.",
      "Better performance. Smarter energy.",
    ),
    description: b(
      "Mengidentifikasi peluang peningkatan efisiensi fasilitas melalui pemahaman pola operasi dan evaluasi kinerja sistem.",
      "Identify opportunities to improve facility efficiency by understanding operating patterns and evaluating system performance.",
    ),
    image: "/images/building.jpg",
    scope: [
      b(
        "Kajian kinerja sistem pendingin",
        "Cooling system performance assessment",
      ),
      b("Tinjauan pola penggunaan energi", "Energy use pattern review"),
      b(
        "Evaluasi kontrol dan otomasi gedung",
        "Building controls and automation review",
      ),
      b(
        "Identifikasi peluang optimasi",
        "Optimization opportunity identification",
      ),
      b("Rencana pemantauan kinerja", "Performance monitoring plan"),
    ],
    detail: b(
      "Efisiensi yang bermakna berawal dari kondisi aktual fasilitas. Kami meninjau data operasi dan pengukuran untuk mengidentifikasi peluang perbaikan, dengan mempertimbangkan kebutuhan operasional, kenyamanan, dan keandalan sistem.",
      "Meaningful efficiency starts with a facility's actual conditions. We review operating data and measurements to identify improvements while considering operational needs, occupant comfort, and system reliability.",
    ),
    deliverable: b(
      "Ringkasan baseline kinerja, prioritas peluang perbaikan, dan rekomendasi langkah pemantauan berikutnya.",
      "A performance baseline summary, prioritized improvement opportunities, and recommended monitoring next steps.",
    ),
  },
];

export const projects = [
  {
    slug: "data-center",
    name: b(
      "Kesiapan infrastruktur kritis",
      "Critical infrastructure readiness",
    ),
    sector: b("Data Center", "Data Centers"),
    category: "data",
    image: "/images/data-center.jpg",
    service: "commissioning",
    description: b(
      "Ilustrasi pendekatan commissioning terintegrasi pada sistem kelistrikan, pendinginan, dan kontrol sebuah data center.",
      "An illustrative integrated commissioning approach for a data center's power, cooling, and control systems.",
    ),
    scope: b(
      "Tinjauan desain, verifikasi fungsi, dan pengujian integrasi antarsistem.",
      "Design review, functional verification, and integrated systems testing.",
    ),
  },
  {
    slug: "commercial-building",
    name: b("Gedung yang bekerja lebih cerdas", "Buildings that work smarter"),
    sector: b("Gedung Komersial", "Commercial Buildings"),
    category: "building",
    image: "/images/building.jpg",
    service: "energy-efficiency",
    description: b(
      "Ilustrasi evaluasi sistem tata udara dan kontrol gedung untuk membantu menciptakan lingkungan yang nyaman dan efisien.",
      "An illustrative evaluation of HVAC and building controls to support a comfortable, efficient environment.",
    ),
    scope: b(
      "Pengujian distribusi udara, evaluasi kontrol, dan kajian kinerja energi.",
      "Air distribution testing, controls evaluation, and energy performance assessment.",
    ),
  },
  {
    slug: "industrial-facility",
    name: b("Keandalan untuk setiap proses", "Reliability in every process"),
    sector: b("Fasilitas Industri", "Industrial Facilities"),
    category: "industrial",
    image: "/images/industrial.jpg",
    service: "inspection",
    description: b(
      "Ilustrasi pemeriksaan instalasi mekanikal dan elektrikal untuk mendukung kesiapan operasional fasilitas industri.",
      "An illustrative inspection of mechanical and electrical installations to support industrial facility readiness.",
    ),
    scope: b(
      "Inspeksi instalasi, dokumentasi temuan, dan verifikasi tindakan perbaikan.",
      "Installation inspection, findings documentation, and corrective action verification.",
    ),
  },
];

export const articles = [
  {
    slug: "commissioning-from-the-start",
    image: "/images/data-center.jpg",
    category: b("Commissioning", "Commissioning"),
    read: 4,
    title: b(
      "Mengapa commissioning dimulai sebelum sistem dinyalakan?",
      "Why does commissioning begin before systems start?",
    ),
    excerpt: b(
      "Mengenal peran verifikasi sejak tahap desain hingga serah terima fasilitas.",
      "Understanding verification from design development through facility handover.",
    ),
    paragraphs: [
      b(
        "Ketika sebuah fasilitas siap beroperasi, banyak keputusan penting sebenarnya telah dibuat berbulan-bulan sebelumnya. Kebutuhan pemilik, kapasitas sistem, dan strategi kontrol menentukan bagaimana fasilitas tersebut akan bekerja. Commissioning membantu menjaga hubungan antara keputusan desain dan kinerja aktual.",
        "By the time a facility is ready to operate, many important decisions have been made months earlier. Owner requirements, system capacities, and control strategies shape how it will perform. Commissioning helps connect those design decisions to actual performance.",
      ),
      b(
        "Melibatkan proses commissioning lebih awal memberi kesempatan untuk meninjau kriteria penerimaan dan merencanakan pengujian. Tim dapat menyepakati dokumen yang diperlukan, pembagian tanggung jawab, dan urutan verifikasi sebelum jadwal konstruksi menjadi semakin padat.",
        "Starting the commissioning process early creates time to review acceptance criteria and plan testing. Teams can agree on required documents, responsibilities, and verification sequences before construction schedules become crowded.",
      ),
      b(
        "Pada tahap instalasi, catatan inspeksi dan kesiapan peralatan menjadi dasar untuk pengujian fungsional. Pengujian kemudian menilai respons sistem terhadap skenario operasi yang telah disepakati, termasuk interaksi antarsistem jika masuk dalam ruang lingkup proyek.",
        "During installation, inspection records and equipment readiness checks establish the basis for functional testing. Tests then assess system responses to agreed operating scenarios, including interactions between systems when included in the project scope.",
      ),
      b(
        "Hasil akhirnya adalah dokumentasi yang membantu pemilik memahami apa yang telah diverifikasi, temuan yang masih terbuka, dan langkah yang perlu dilakukan sebelum serah terima. Ruang lingkup setiap proyek tetap harus ditetapkan sesuai kebutuhan fasilitas.",
        "The result is documentation that helps owners understand what has been verified, which issues remain open, and what must happen before handover. Each project's scope should still be tailored to its facility requirements.",
      ),
    ],
  },
  {
    slug: "understanding-tab",
    image: "/images/engineering.jpg",
    category: b("Wawasan Teknis", "Technical Insights"),
    read: 3,
    title: b(
      "Mengenal TAB: keseimbangan di balik kenyamanan gedung.",
      "Understanding TAB: the balance behind building comfort.",
    ),
    excerpt: b(
      "Bagaimana pengukuran dan penyesuaian membantu sistem HVAC bekerja sesuai desain.",
      "How measurements and adjustments help HVAC systems perform as designed.",
    ),
    paragraphs: [
      b(
        "Testing, Adjusting, and Balancing atau TAB merupakan rangkaian pengukuran dan penyesuaian aliran udara maupun air pada sistem HVAC. Tujuannya adalah memahami distribusi aktual dan membandingkannya dengan kebutuhan desain yang telah disepakati.",
        "Testing, Adjusting, and Balancing, or TAB, is a sequence of air and water flow measurements and adjustments in HVAC systems. It helps establish actual distribution and compare it with agreed design requirements.",
      ),
      b(
        "Sebelum pengukuran, kesiapan sistem perlu ditinjau: apakah instalasi telah selesai, filter berada dalam kondisi yang tepat, dan pengaturan kontrol memungkinkan pengujian dilakukan. Kondisi-kondisi ini memengaruhi makna hasil yang dicatat.",
        "Before measurements begin, system readiness should be reviewed: installation completion, appropriate filter condition, and controls settings that allow testing. These conditions affect how recorded results should be interpreted.",
      ),
      b(
        "Setelah pengukuran, penyesuaian dilakukan secara sistematis dan hasilnya diverifikasi kembali. Catatan akhir sebaiknya menyertakan kondisi pengujian, referensi desain, dan temuan yang memerlukan perhatian. Penilaian proyek harus dilakukan oleh personel yang sesuai dengan ruang lingkupnya.",
        "Following measurements, adjustments are made systematically and results are checked again. Final records should include test conditions, design references, and findings requiring attention. Project assessment should be carried out by personnel suited to the scope.",
      ),
    ],
  },
  {
    slug: "efficient-building-systems",
    image: "/images/building.jpg",
    category: b("Keberlanjutan", "Sustainability"),
    read: 3,
    title: b(
      "Efisiensi energi berawal dari memahami sistem Anda.",
      "Energy efficiency starts with understanding your systems.",
    ),
    excerpt: b(
      "Langkah awal membaca pola operasi dan menemukan peluang perbaikan.",
      "First steps in understanding operating patterns and identifying improvements.",
    ),
    paragraphs: [
      b(
        "Upaya efisiensi energi sering diasosiasikan dengan penggantian peralatan. Padahal, memahami cara sistem yang ada beroperasi dapat menjadi titik awal yang berguna. Jadwal operasi, setpoint, dan interaksi kontrol perlu dilihat dalam konteks kebutuhan fasilitas.",
        "Energy efficiency is often associated with replacing equipment. Understanding how existing systems operate can be a useful starting point. Operating schedules, setpoints, and controls interactions should be considered in the context of facility requirements.",
      ),
      b(
        "Pengumpulan data membantu membentuk baseline: gambaran kinerja pada kondisi tertentu. Baseline yang jelas memudahkan tim membandingkan perubahan, mengidentifikasi pola yang tidak biasa, dan menyusun prioritas investigasi lebih lanjut.",
        "Data collection helps establish a baseline: a picture of performance under particular conditions. A clear baseline makes it easier to compare changes, identify unusual patterns, and prioritize further investigation.",
      ),
      b(
        "Peluang perbaikan harus dievaluasi bersama kebutuhan keandalan dan kenyamanan. Setiap rekomendasi memerlukan penilaian teknis yang sesuai, implementasi terencana, serta pemantauan untuk memahami hasilnya. Besarnya penghematan tidak dapat disimpulkan tanpa data fasilitas yang memadai.",
        "Improvement opportunities should be evaluated alongside reliability and comfort requirements. Recommendations need appropriate technical assessment, planned implementation, and monitoring to understand results. Savings cannot be established without sufficient facility data.",
      ),
    ],
  },
];

export const pageInfo: Record<
  string,
  { title: Bilingual; description: Bilingual; eyebrow: Bilingual }
> = {
  about: {
    eyebrow: b("TENTANG GREEN RIDGE", "ABOUT GREEN RIDGE"),
    title: b(
      "Ketelitian teknis.\nKepercayaan jangka panjang.",
      "Technical precision.\nLasting confidence.",
    ),
    description: b(
      "Kami percaya bahwa fasilitas yang andal dimulai dari pertanyaan yang tepat, pengukuran yang teliti, dan kolaborasi yang terbuka.",
      "We believe reliable facilities begin with the right questions, careful measurement, and open collaboration.",
    ),
  },
  services: {
    eyebrow: b("KEAHLIAN KAMI", "OUR EXPERTISE"),
    title: b(
      "Setiap sistem.\nDiverifikasi dengan cermat.",
      "Every system.\nThoughtfully verified.",
    ),
    description: b(
      "Dukungan teknis dari pengujian hingga serah terima. Temukan pendekatan yang sesuai untuk kebutuhan fasilitas Anda.",
      "Technical support from testing to handover. Find the right approach for your facility's requirements.",
    ),
  },
  projects: {
    eyebrow: b("APLIKASI KEAHLIAN", "EXPERTISE IN PRACTICE"),
    title: b(
      "Beragam fasilitas.\nSatu komitmen kualitas.",
      "Different facilities.\nOne commitment to quality.",
    ),
    description: b(
      "Jelajahi ilustrasi penerapan layanan kami pada infrastruktur kritis, gedung komersial, dan fasilitas industri.",
      "Explore illustrative applications of our services across critical infrastructure, commercial buildings, and industrial facilities.",
    ),
  },
  insights: {
    eyebrow: b("CATATAN GREEN RIDGE", "THE GREEN RIDGE JOURNAL"),
    title: b(
      "Perspektif baru.\nKeputusan lebih baik.",
      "Fresh perspectives.\nBetter decisions.",
    ),
    description: b(
      "Ide dan pengetahuan seputar commissioning, kinerja sistem, dan masa depan fasilitas yang lebih efisien.",
      "Ideas and knowledge on commissioning, system performance, and a more efficient future for facilities.",
    ),
  },
  gallery: {
    eyebrow: b("DI BALIK SISTEM", "BEHIND THE SYSTEMS"),
    title: b(
      "Melihat lebih dekat.\nMemahami lebih dalam.",
      "A closer look.\nA deeper understanding.",
    ),
    description: b(
      "Koleksi visual yang menggambarkan lingkungan kerja dan bidang keahlian Green Ridge Technics.",
      "A visual collection illustrating the working environments and expertise of Green Ridge Technics.",
    ),
  },
  tools: {
    eyebrow: b("PERALATAN & TEKNOLOGI", "EQUIPMENT & TECHNOLOGY"),
    title: b(
      "Pengukuran yang tepat.\nKeputusan yang terarah.",
      "The right measurements.\nWell-informed decisions.",
    ),
    description: b(
      "Kenali kategori instrumen yang mendukung pengujian dan verifikasi kinerja fasilitas.",
      "Explore instrument categories that support facility performance testing and verification.",
    ),
  },
  certifications: {
    eyebrow: b("KUALITAS & KOMPETENSI", "QUALITY & COMPETENCE"),
    title: b(
      "Kepercayaan dibangun\ndengan bukti.",
      "Confidence is built\non evidence.",
    ),
    description: b(
      "Komitmen pada proses yang terdokumentasi, pengembangan kompetensi, dan praktik kerja yang bertanggung jawab.",
      "A commitment to documented processes, professional development, and responsible working practices.",
    ),
  },
  careers: {
    eyebrow: b("KARIR DI GREEN RIDGE", "CAREERS AT GREEN RIDGE"),
    title: b(
      "Bangun keahlian.\nBeri dampak nyata.",
      "Build your expertise.\nMake a real difference.",
    ),
    description: b(
      "Untuk mereka yang ingin memahami cara kerja sistem, memperhatikan detail, dan tumbuh bersama tim.",
      "For people who want to understand how systems work, care about the details, and grow with a team.",
    ),
  },
  contact: {
    eyebrow: b("MULAI PERCAKAPAN", "START A CONVERSATION"),
    title: b(
      "Proyek hebat dimulai\ndari percakapan.",
      "Great projects begin\nwith a conversation.",
    ),
    description: b(
      "Ceritakan kebutuhan fasilitas Anda. Mari susun langkah berikutnya bersama.",
      "Tell us what your facility needs. Let's work out the next steps together.",
    ),
  },
  privacy: {
    eyebrow: b("INFORMASI WEBSITE", "WEBSITE INFORMATION"),
    title: b("Privasi & penggunaan data.", "Privacy & data use."),
    description: b(
      "Penjelasan penggunaan informasi pada versi presentasi website ini.",
      "How information is handled in this presentation version of the website.",
    ),
  },
};

export const paths = [
  "",
  ...Object.keys(pageInfo),
  ...services.map((s) => `services/${s.slug}`),
  ...projects.map((p) => `projects/${p.slug}`),
  ...articles.map((a) => `insights/${a.slug}`),
];
export const imageAlt = {
  "/images/data-center.jpg": b(
    "Lorong server pada fasilitas data center modern",
    "Server aisle inside a modern data center",
  ),
  "/images/building.jpg": b(
    "Fasad kaca gedung komersial modern",
    "Glass facade of a modern commercial building",
  ),
  "/images/engineering.jpg": b(
    "Ilustrasi aktivitas teknis dan peralatan engineering",
    "Illustration of technical work and engineering equipment",
  ),
  "/images/industrial.jpg": b(
    "Pipa dan menara proses pada fasilitas industri",
    "Process towers and pipework at an industrial facility",
  ),
};

export const common = {
  contact: b("Diskusikan Proyek", "Let's Talk"),
  explore: b("Jelajahi layanan", "Explore our services"),
  learn: b("Selengkapnya", "Learn more"),
  allProjects: b("Jelajahi proyek", "Explore projects"),
  allArticles: b("Semua wawasan", "All insights"),
  demo: b(
    "Ilustrasi proyek — bukan portofolio aktual",
    "Illustrative project — not an actual portfolio entry",
  ),
  photo: b("Foto ilustrasi", "Illustrative photography"),
  draft: b(
    "Versi presentasi · Konten perusahaan masih dalam pengembangan",
    "Presentation version · Company content is in development",
  ),
};
