import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { getDirectDatabaseUrl } from "../src/server/db/env";
import { projects, projectTechnologies, technologies } from "../src/server/db/schema";

config({
  path: ".env.local",
});

type TechnologyInsert = typeof technologies.$inferInsert;

type ProjectInsert = typeof projects.$inferInsert;

const TECHNOLOGY_IDS = {
  nextjs: "61000000-0000-4000-8000-000000000001",

  react: "61000000-0000-4000-8000-000000000002",

  typescript: "61000000-0000-4000-8000-000000000003",

  prisma: "61000000-0000-4000-8000-000000000004",

  postgresql: "61000000-0000-4000-8000-000000000005",

  tailwind: "61000000-0000-4000-8000-000000000006",

  shadcn: "61000000-0000-4000-8000-000000000007",

  authjs: "61000000-0000-4000-8000-000000000008",

  zod: "61000000-0000-4000-8000-000000000009",

  recharts: "61000000-0000-4000-8000-000000000010",

  laravel: "61000000-0000-4000-8000-000000000011",

  inertia: "61000000-0000-4000-8000-000000000012",

  mysql: "61000000-0000-4000-8000-000000000013",

  php: "61000000-0000-4000-8000-000000000014",

  javascript: "61000000-0000-4000-8000-000000000015",
} as const;

const PROJECT_IDS = {
  fertilizerRainfall: "62000000-0000-4000-8000-000000000001",

  fertilizerSupply: "62000000-0000-4000-8000-000000000002",

  itsa: "62000000-0000-4000-8000-000000000003",

  sikulda: "62000000-0000-4000-8000-000000000004",
} as const;

const technologySeeds: TechnologyInsert[] = [
  {
    id: TECHNOLOGY_IDS.nextjs,
    name: "Next.js",
    slug: "next-js",
  },
  {
    id: TECHNOLOGY_IDS.react,
    name: "React",
    slug: "react",
  },
  {
    id: TECHNOLOGY_IDS.typescript,
    name: "TypeScript",
    slug: "typescript",
  },
  {
    id: TECHNOLOGY_IDS.prisma,
    name: "Prisma ORM",
    slug: "prisma-orm",
  },
  {
    id: TECHNOLOGY_IDS.postgresql,
    name: "PostgreSQL",
    slug: "postgresql",
  },
  {
    id: TECHNOLOGY_IDS.tailwind,
    name: "Tailwind CSS",
    slug: "tailwind-css",
  },
  {
    id: TECHNOLOGY_IDS.shadcn,
    name: "shadcn/ui",
    slug: "shadcn-ui",
  },
  {
    id: TECHNOLOGY_IDS.authjs,
    name: "Auth.js",
    slug: "auth-js",
  },
  {
    id: TECHNOLOGY_IDS.zod,
    name: "Zod",
    slug: "zod",
  },
  {
    id: TECHNOLOGY_IDS.recharts,
    name: "Recharts",
    slug: "recharts",
  },
  {
    id: TECHNOLOGY_IDS.laravel,
    name: "Laravel",
    slug: "laravel",
  },
  {
    id: TECHNOLOGY_IDS.inertia,
    name: "Inertia.js",
    slug: "inertia-js",
  },
  {
    id: TECHNOLOGY_IDS.mysql,
    name: "MySQL",
    slug: "mysql",
  },
  {
    id: TECHNOLOGY_IDS.php,
    name: "PHP",
    slug: "php",
  },
  {
    id: TECHNOLOGY_IDS.javascript,
    name: "JavaScript",
    slug: "javascript",
  },
];

const projectSeeds: ProjectInsert[] = [
  {
    id: PROJECT_IDS.fertilizerRainfall,

    name: "Dashboard Monitoring Pemupukan dan Curah Hujan",

    slug: "dashboard-monitoring-pemupukan-dan-curah-hujan",

    projectType: null,

    organization: "PT Perkebunan Nusantara IV Regional III",

    shortDescription:
      "Aplikasi web internal untuk monitoring pemupukan dan curah hujan dengan dashboard rencana dan realisasi, filter data, impor Excel, ekspor laporan, serta kontrol akses berbasis peran.",

    fullDescription:
      "Aplikasi internal berbasis web yang membantu monitoring pemupukan dan curah hujan pada operasional Divisi Tanaman. Sistem menyediakan visualisasi rencana dan realisasi pemupukan melalui grafik, tabel, dan filter bertingkat, serta mendukung pengelolaan data curah hujan, impor dan validasi Excel, ekspor laporan, pencatatan aktivitas pengguna, dan pengelolaan hak akses berbasis peran.",

    background: null,

    problem: null,

    solution: null,

    role: "Full-Stack Web Developer Intern - Divisi Tanaman",

    keyFeatures: [
      "Dashboard rencana dan realisasi pemupukan",
      "Visualisasi grafik dan tabel dengan filter bertingkat",
      "Monitoring data curah hujan",
      "Impor dan validasi data berbasis Excel",
      "Ekspor laporan Excel dan PDF",
      "Pencatatan aktivitas pengguna",
      "Hak akses berbasis peran",
    ],

    challenges: null,

    learning: null,

    repositoryUrl: null,

    liveUrl: null,

    documentationUrl: null,

    startDate: null,

    endDate: null,

    status: "draft",

    caseStudyVisibility: "public",

    isFeatured: false,

    displayOrder: 0,

    publishedAt: null,
  },

  {
    id: PROJECT_IDS.fertilizerSupply,

    name: "Sistem Pengelolaan Pasokan, Kontrak, dan Penerimaan Pupuk",

    slug: "sistem-pengelolaan-pasokan-kontrak-dan-penerimaan-pupuk",

    projectType: null,

    organization: "PT Perkebunan Nusantara IV Regional III",

    shortDescription:
      "Aplikasi web internal untuk pengelolaan pasokan, kontrak, dan penerimaan pupuk dengan dashboard analitik, validasi volume kontrak, autentikasi, serta pembatasan akses berdasarkan peran dan cakupan kebun.",

    fullDescription:
      "Aplikasi internal berbasis web untuk membantu pengelolaan pasokan, kontrak, dan penerimaan pupuk pada operasional perkebunan. Sistem mengelola data kontrak SPPBJ, kebun, jenis pupuk, pemasok, jumlah pasokan, periode kontrak, jenis anggaran, biaya, dan realisasi penerimaan, serta menyediakan dashboard analitik untuk kontrak aktif, outstanding, overdue, progres penerimaan, performa pemasok, dan realisasi terhadap target.",

    background: null,

    problem: null,

    solution: null,

    role: "Full-Stack Web Developer Intern - Divisi Tanaman",

    keyFeatures: [
      "Pengelolaan kontrak SPPBJ",
      "Pengelolaan kebun, jenis pupuk, pemasok, pasokan, periode kontrak, anggaran, dan biaya",
      "Pencatatan realisasi penerimaan pupuk",
      "Dashboard kontrak aktif, outstanding, dan overdue",
      "Monitoring progres penerimaan",
      "Analisis performa pemasok",
      "Analisis realisasi terhadap target",
      "Autentikasi dan hak akses berdasarkan peran serta cakupan kebun",
      "Validasi penerimaan agar tidak melebihi sisa volume kontrak",
    ],

    challenges: null,

    learning: null,

    repositoryUrl: null,

    liveUrl: null,

    documentationUrl: null,

    startDate: null,

    endDate: null,

    status: "draft",

    caseStudyVisibility: "public",

    isFeatured: false,

    displayOrder: 1,

    publishedAt: null,
  },

  {
    id: PROJECT_IDS.itsa,

    name: "Sistem Kegiatan HIMA ITSA",

    slug: "sistem-kegiatan-hima-itsa",

    projectType: null,

    organization: "Politeknik Caltex Riau",

    shortDescription:
      "Sistem pengelolaan kegiatan organisasi untuk mendukung proposal, pendanaan, proses review dan revisi, approval, dokumen kegiatan, serta laporan pertanggungjawaban melalui workflow multi-peran.",

    fullDescription:
      "Sistem kegiatan HIMA ITSA yang mendukung pengelolaan proposal kegiatan, pendanaan, proses review, revisi, approval, dokumen, dan laporan pertanggungjawaban. Sistem dirancang dengan workflow multi-peran untuk membantu proses administrasi kegiatan organisasi secara terstruktur.",

    background: null,

    problem: null,

    solution: null,

    role: null,

    keyFeatures: [
      "Pengelolaan proposal kegiatan",
      "Pengelolaan pendanaan",
      "Review dan revisi pengajuan",
      "Workflow persetujuan multi-peran",
      "Pengelolaan dokumen kegiatan",
      "Laporan pertanggungjawaban kegiatan",
    ],

    challenges: null,

    learning: null,

    repositoryUrl: null,

    liveUrl: null,

    documentationUrl: null,

    startDate: null,

    endDate: null,

    status: "draft",

    caseStudyVisibility: "public",

    isFeatured: false,

    displayOrder: 2,

    publishedAt: null,
  },

  {
    id: PROJECT_IDS.sikulda,

    name: "Sistem Pengelolaan Kegiatan Ekstrakurikuler",

    slug: "sistem-pengelolaan-kegiatan-ekstrakurikuler",

    projectType: null,

    organization: "SMAN 2 Pekanbaru",

    shortDescription:
      "Sistem informasi ekstrakurikuler multi-peran untuk pengelolaan anggota, jadwal pelatihan, absensi, pengajuan kegiatan, verifikasi, notifikasi, laporan, dan riwayat kegiatan.",

    fullDescription:
      "Sistem pengelolaan kegiatan ekstrakurikuler untuk mendukung kebutuhan siswa, anggota, pelatih, pembina, pihak sekolah, dan administrator melalui alur kerja multi-peran. Sistem mencakup pengelolaan anggota, jadwal pelatihan, absensi, pengajuan dan verifikasi kegiatan, notifikasi, laporan, serta riwayat kegiatan.",

    background: null,

    problem: null,

    solution: null,

    role: null,

    keyFeatures: [
      "Pengelolaan anggota ekstrakurikuler",
      "Jadwal pelatihan rutin",
      "Absensi anggota",
      "Pengajuan kegiatan",
      "Verifikasi kegiatan",
      "Notifikasi",
      "Pelaporan kegiatan",
      "Riwayat kegiatan",
      "Hak akses multi-peran",
    ],

    challenges: null,

    learning: null,

    repositoryUrl: null,

    liveUrl: null,

    documentationUrl: null,

    startDate: null,

    endDate: null,

    status: "draft",

    caseStudyVisibility: "public",

    isFeatured: false,

    displayOrder: 3,

    publishedAt: null,
  },
];

const projectTechnologySlugs = {
  "dashboard-monitoring-pemupukan-dan-curah-hujan": [
    "next-js",
    "react",
    "typescript",
    "prisma-orm",
    "postgresql",
    "tailwind-css",
    "shadcn-ui",
  ],

  "sistem-pengelolaan-pasokan-kontrak-dan-penerimaan-pupuk": [
    "next-js",
    "react",
    "typescript",
    "postgresql",
    "prisma-orm",
    "auth-js",
    "tailwind-css",
    "shadcn-ui",
    "zod",
    "recharts",
  ],

  "sistem-kegiatan-hima-itsa": ["laravel", "react", "typescript", "inertia-js", "mysql"],

  "sistem-pengelolaan-kegiatan-ekstrakurikuler": ["laravel", "php", "mysql", "javascript"],
} as const;

async function main() {
  const database = drizzle({
    client: neon(getDirectDatabaseUrl()),
  });

  await database.insert(technologies).values(technologySeeds).onConflictDoNothing();

  await database.insert(projects).values(projectSeeds).onConflictDoNothing();

  const technologyRows = await database
    .select({
      id: technologies.id,
      slug: technologies.slug,
    })
    .from(technologies)
    .where(
      inArray(
        technologies.slug,
        technologySeeds.map((technology) => technology.slug),
      ),
    );

  const projectRows = await database
    .select({
      id: projects.id,
      slug: projects.slug,
    })
    .from(projects)
    .where(
      inArray(
        projects.slug,
        projectSeeds.map((project) => project.slug),
      ),
    );

  const technologyIdBySlug = new Map(
    technologyRows.map((technology) => [technology.slug, technology.id]),
  );

  const projectIdBySlug = new Map(projectRows.map((project) => [project.slug, project.id]));

  const relationships: Array<{
    projectId: string;
    technologyId: string;
    displayOrder: number;
  }> = [];

  for (const [projectSlug, technologySlugs] of Object.entries(projectTechnologySlugs)) {
    const projectId = projectIdBySlug.get(projectSlug);

    if (!projectId) {
      throw new Error(`Seed project not found: ${projectSlug}`);
    }

    technologySlugs.forEach((technologySlug, index) => {
      const technologyId = technologyIdBySlug.get(technologySlug);

      if (!technologyId) {
        throw new Error(`Seed technology not found: ${technologySlug}`);
      }

      relationships.push({
        projectId,
        technologyId,
        displayOrder: index,
      });
    });
  }

  if (relationships.length > 0) {
    await database.insert(projectTechnologies).values(relationships).onConflictDoNothing();
  }

  console.log("Stage 8 technology and project seed completed.");

  console.log("Existing records were not overwritten.");

  console.log(`Resolved ${technologyRows.length} technologies.`);

  console.log(`Resolved ${projectRows.length} projects.`);

  console.log(`Prepared ${relationships.length} project technology relationships.`);
}

main().catch((error: unknown) => {
  console.error("Stage 8 project seed failed.");

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exitCode = 1;
});
