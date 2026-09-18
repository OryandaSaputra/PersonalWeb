import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import { getDirectDatabaseUrl } from "../src/server/db/env";
import {
  educations,
  experiences,
  organizationExperiences,
  profiles,
  socialLinks,
} from "../src/server/db/schema";

config({ path: ".env.local" });

const IDS = {
  linkedin: "10000000-0000-4000-8000-000000000001",
  monitoringExperience: "20000000-0000-4000-8000-000000000001",
  supplyExperience: "20000000-0000-4000-8000-000000000002",
  csirtChair: "30000000-0000-4000-8000-000000000001",
  csirtFacilities: "30000000-0000-4000-8000-000000000002",
  education: "40000000-0000-4000-8000-000000000001",
} as const;

async function main() {
  const database = drizzle({ client: neon(getDirectDatabaseUrl()) });

  await database
    .insert(profiles)
    .values({
      id: 1,
      fullName: "Oryanda Saputra",
      professionalTitle: "Full-Stack Web Developer",
      shortIntroduction:
        "Lulusan D4 Teknik Informatika Politeknik Caltex Riau dengan pengalaman pengembangan aplikasi web melalui dua periode magang di PT Perkebunan Nusantara IV Regional III serta pengembangan sistem informasi untuk studi kasus SMAN 2 Pekanbaru. Berpengalaman membangun aplikasi web full-stack, dashboard analitik, sistem multi-peran, pengelolaan alur operasional, visualisasi data, serta basis data menggunakan Next.js, React, Laravel, TypeScript, PHP, PostgreSQL, dan MySQL. Memiliki sertifikasi MikroTik Certified Network Associate (MTCNA) dan BNSP Junior Network Administrator, dengan fokus karier pada pengembangan web dan rekayasa perangkat lunak.",
      about: null,
      location: "Pekanbaru, Riau",
      email: "oryandasaputra120504@gmail.com",
      phone: "0895-6180-80569",
      showPhonePublicly: false,
      careerFocus: "Pengembangan web dan rekayasa perangkat lunak",
      heroTagline: null,
    })
    .onConflictDoNothing();

  await database
    .insert(socialLinks)
    .values({
      id: IDS.linkedin,
      profileId: 1,
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/oryanda-saputra/",
      displayOrder: 0,
      isVisible: true,
    })
    .onConflictDoNothing();

  await database
    .insert(experiences)
    .values([
      {
        id: IDS.supplyExperience,
        company: "PT. Perkebunan Nusantara IV Regional III",
        position: "Full-Stack Web Developer Intern - Divisi Tanaman",
        employmentType: "Internship",
        location: null,
        startDate: "2026-02-01",
        endDate: "2026-07-01",
        isCurrent: false,
        description:
          "Mengembangkan aplikasi internal berbasis web untuk membantu pengelolaan pasokan, kontrak, dan penerimaan pupuk pada operasional perkebunan.",
        responsibilities: [
          "Mengembangkan pengelolaan data kontrak SPPBJ, kebun, jenis pupuk, pemasok, jumlah pasokan, periode kontrak, jenis anggaran, biaya, serta realisasi penerimaan.",
          "Membangun dashboard analitik untuk memonitor kontrak aktif, outstanding pasokan, kontrak overdue, progres penerimaan, performa pemasok, serta realisasi terhadap target.",
          "Mengimplementasikan sistem autentikasi dan hak akses berbasis peran serta cakupan kebun untuk Admin, Krani Tanaman, dan Krani Kebun.",
          "Mengembangkan fitur pencatatan penerimaan pupuk berdasarkan kontrak dengan validasi agar jumlah penerimaan tidak melebihi sisa volume kontrak.",
        ],
        technologies: [
          "Next.js",
          "React",
          "TypeScript",
          "PostgreSQL",
          "Prisma ORM",
          "Auth.js",
          "Tailwind CSS",
          "shadcn/ui",
          "Zod",
          "Recharts",
        ],
        achievements: [],
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: IDS.monitoringExperience,
        company: "PT. Perkebunan Nusantara IV Regional III",
        position: "Full-Stack Web Developer Intern - Divisi Tanaman",
        employmentType: "Internship",
        location: null,
        startDate: "2025-09-01",
        endDate: "2026-01-01",
        isCurrent: false,
        description:
          "Mengembangkan aplikasi internal berbasis web untuk membantu monitoring pemupukan dan curah hujan pada operasional Sub-Divisi Pemupukan.",
        responsibilities: [
          "Membangun dashboard visualisasi rencana dan realisasi pemupukan melalui grafik, tabel, filter bertingkat, serta analisis data berdasarkan area dan periode.",
          "Mengembangkan fitur monitoring data curah hujan untuk membantu pengguna melakukan analisis data operasional secara lebih terstruktur.",
          "Mengimplementasikan proses impor dan validasi data berbasis Excel, ekspor laporan Excel/PDF, pencatatan aktivitas pengguna, serta pengelolaan hak akses berbasis peran.",
        ],
        technologies: [
          "Next.js",
          "React",
          "TypeScript",
          "Prisma ORM",
          "PostgreSQL",
          "Tailwind CSS",
          "shadcn/ui",
        ],
        achievements: [],
        displayOrder: 1,
        isVisible: true,
      },
    ])
    .onConflictDoNothing();

  await database
    .insert(organizationExperiences)
    .values([
      {
        id: IDS.csirtChair,
        organization: "UKM Computer Security Incident Response Team (CSIRT)",
        position: "Ketua Umum",
        startDate: "2024-07-01",
        endDate: "2025-08-01",
        isCurrent: false,
        description: null,
        responsibilities: [
          "Memimpin dan mengkoordinasikan program kerja organisasi di bidang keamanan siber, termasuk kegiatan pelatihan, seminar, dan edukasi.",
          "Mengelola koordinasi pengurus serta kolaborasi dengan organisasi internal kampus dan komunitas IT eksternal.",
        ],
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: IDS.csirtFacilities,
        organization: "UKM Computer Security Incident Response Team (CSIRT)",
        position: "Kepala Bidang Sarana dan Prasarana",
        startDate: "2023-08-01",
        endDate: "2024-07-01",
        isCurrent: false,
        description: null,
        responsibilities: [
          "Mengelola kebutuhan fasilitas dan perangkat teknis untuk mendukung kegiatan pelatihan, simulasi, dan program organisasi.",
        ],
        displayOrder: 1,
        isVisible: true,
      },
    ])
    .onConflictDoNothing();

  await database
    .insert(educations)
    .values({
      id: IDS.education,
      institution: "Politeknik Caltex Riau",
      degree: "D4",
      major: "Teknik Informatika",
      startYear: 2022,
      graduationYear: 2026,
      gpa: 3.34,
      gpaScale: 4,
      description: null,
      displayOrder: 0,
      isVisible: true,
    })
    .onConflictDoNothing();

  console.log("Stage 6 initial professional content seed completed.");
  console.log("Existing records were not overwritten.");
}

main().catch((error: unknown) => {
  console.error("Stage 6 content seed failed.");

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exitCode = 1;
});
