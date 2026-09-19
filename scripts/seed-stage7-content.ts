import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import { getDirectDatabaseUrl } from "../src/server/db/env";
import { certifications, skillCategories, skills } from "../src/server/db/schema";

config({
  path: ".env.local",
});

const CATEGORY_IDS = {
  programming: "51000000-0000-4000-8000-000000000001",
  frameworks: "51000000-0000-4000-8000-000000000002",
  database: "51000000-0000-4000-8000-000000000003",
  developmentTools: "51000000-0000-4000-8000-000000000004",
  networking: "51000000-0000-4000-8000-000000000005",
  supportingTools: "51000000-0000-4000-8000-000000000006",
} as const;

const CERTIFICATION_IDS = {
  bnsp: "53000000-0000-4000-8000-000000000001",
  mtcna: "53000000-0000-4000-8000-000000000002",
} as const;

function skillId(sequence: number): string {
  return `52000000-0000-4000-8000-${sequence.toString().padStart(12, "0")}`;
}

async function main() {
  const database = drizzle({
    client: neon(getDirectDatabaseUrl()),
  });

  /*
   * =========================================================
   * SKILL CATEGORIES
   * =========================================================
   *
   * IDs dibuat deterministic agar seed dapat dijalankan ulang.
   *
   * Field `slug` wajib karena merupakan bagian dari schema
   * skill_categories yang sudah dibuat pada Tahap 2.
   */
  await database
    .insert(skillCategories)
    .values([
      {
        id: CATEGORY_IDS.programming,
        name: "Bahasa Pemrograman",
        slug: "bahasa-pemrograman",
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: CATEGORY_IDS.frameworks,
        name: "Framework & Library",
        slug: "framework-and-library",
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: CATEGORY_IDS.database,
        name: "Basis Data & ORM",
        slug: "basis-data-and-orm",
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: CATEGORY_IDS.developmentTools,
        name: "Tools Pengembangan",
        slug: "tools-pengembangan",
        displayOrder: 3,
        isVisible: true,
      },
      {
        id: CATEGORY_IDS.networking,
        name: "Jaringan Komputer",
        slug: "jaringan-komputer",
        displayOrder: 4,
        isVisible: true,
      },
      {
        id: CATEGORY_IDS.supportingTools,
        name: "Tools Pendukung",
        slug: "tools-pendukung",
        displayOrder: 5,
        isVisible: true,
      },
    ])
    .onConflictDoNothing();

  /*
   * =========================================================
   * SKILLS — BAHASA PEMROGRAMAN
   * =========================================================
   */
  await database
    .insert(skills)
    .values([
      {
        id: skillId(1),
        categoryId: CATEGORY_IDS.programming,
        name: "PHP",
        icon: null,
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: skillId(2),
        categoryId: CATEGORY_IDS.programming,
        name: "JavaScript",
        icon: null,
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: skillId(3),
        categoryId: CATEGORY_IDS.programming,
        name: "TypeScript",
        icon: null,
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: skillId(4),
        categoryId: CATEGORY_IDS.programming,
        name: "Python",
        icon: null,
        displayOrder: 3,
        isVisible: true,
      },
      {
        id: skillId(5),
        categoryId: CATEGORY_IDS.programming,
        name: "HTML",
        icon: null,
        displayOrder: 4,
        isVisible: true,
      },
      {
        id: skillId(6),
        categoryId: CATEGORY_IDS.programming,
        name: "CSS",
        icon: null,
        displayOrder: 5,
        isVisible: true,
      },

      /*
       * =====================================================
       * FRAMEWORK & LIBRARY
       * =====================================================
       */
      {
        id: skillId(7),
        categoryId: CATEGORY_IDS.frameworks,
        name: "Laravel",
        icon: null,
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: skillId(8),
        categoryId: CATEGORY_IDS.frameworks,
        name: "React.js",
        icon: null,
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: skillId(9),
        categoryId: CATEGORY_IDS.frameworks,
        name: "Next.js",
        icon: null,
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: skillId(10),
        categoryId: CATEGORY_IDS.frameworks,
        name: "Inertia.js",
        icon: null,
        displayOrder: 3,
        isVisible: true,
      },
      {
        id: skillId(11),
        categoryId: CATEGORY_IDS.frameworks,
        name: "Tailwind CSS",
        icon: null,
        displayOrder: 4,
        isVisible: true,
      },
      {
        id: skillId(12),
        categoryId: CATEGORY_IDS.frameworks,
        name: "shadcn/ui",
        icon: null,
        displayOrder: 5,
        isVisible: true,
      },

      /*
       * =====================================================
       * BASIS DATA & ORM
       * =====================================================
       */
      {
        id: skillId(13),
        categoryId: CATEGORY_IDS.database,
        name: "MySQL",
        icon: null,
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: skillId(14),
        categoryId: CATEGORY_IDS.database,
        name: "PostgreSQL",
        icon: null,
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: skillId(15),
        categoryId: CATEGORY_IDS.database,
        name: "Prisma ORM",
        icon: null,
        displayOrder: 2,
        isVisible: true,
      },

      /*
       * =====================================================
       * TOOLS PENGEMBANGAN
       * =====================================================
       */
      {
        id: skillId(16),
        categoryId: CATEGORY_IDS.developmentTools,
        name: "Git",
        icon: null,
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: skillId(17),
        categoryId: CATEGORY_IDS.developmentTools,
        name: "GitHub",
        icon: null,
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: skillId(18),
        categoryId: CATEGORY_IDS.developmentTools,
        name: "Postman",
        icon: null,
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: skillId(19),
        categoryId: CATEGORY_IDS.developmentTools,
        name: "Visual Studio Code",
        icon: null,
        displayOrder: 3,
        isVisible: true,
      },

      /*
       * =====================================================
       * JARINGAN KOMPUTER
       * =====================================================
       */
      {
        id: skillId(20),
        categoryId: CATEGORY_IDS.networking,
        name: "MikroTik",
        icon: null,
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: skillId(21),
        categoryId: CATEGORY_IDS.networking,
        name: "TCP/IP",
        icon: null,
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: skillId(22),
        categoryId: CATEGORY_IDS.networking,
        name: "Konfigurasi dan Troubleshooting Jaringan",
        icon: null,
        displayOrder: 2,
        isVisible: true,
      },

      /*
       * =====================================================
       * TOOLS PENDUKUNG
       * =====================================================
       */
      {
        id: skillId(23),
        categoryId: CATEGORY_IDS.supportingTools,
        name: "Microsoft Excel",
        icon: null,
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: skillId(24),
        categoryId: CATEGORY_IDS.supportingTools,
        name: "Word",
        icon: null,
        displayOrder: 1,
        isVisible: true,
      },
      {
        id: skillId(25),
        categoryId: CATEGORY_IDS.supportingTools,
        name: "PowerPoint",
        icon: null,
        displayOrder: 2,
        isVisible: true,
      },
      {
        id: skillId(26),
        categoryId: CATEGORY_IDS.supportingTools,
        name: "Visual Paradigm",
        icon: null,
        displayOrder: 3,
        isVisible: true,
      },
      {
        id: skillId(27),
        categoryId: CATEGORY_IDS.supportingTools,
        name: "Bizagi Modeler",
        icon: null,
        displayOrder: 4,
        isVisible: true,
      },
    ])
    .onConflictDoNothing();

  /*
   * =========================================================
   * CERTIFICATIONS
   * =========================================================
   *
   * CV saat ini tidak memberikan:
   *
   * - issueDate
   * - expirationDate
   * - credentialId
   * - credentialUrl
   * - certificateMediaId
   *
   * Oleh karena itu seluruh informasi tersebut tetap null.
   *
   * Field schema menggunakan `issuer`, bukan `organization`.
   * Field media menggunakan `certificateMediaId`.
   */
  await database
    .insert(certifications)
    .values([
      {
        id: CERTIFICATION_IDS.bnsp,
        name: "Junior Network Administrator",
        issuer: "BNSP",
        status: null,
        issueDate: null,
        expirationDate: null,
        credentialId: null,
        credentialUrl: null,
        certificateMediaId: null,
        displayOrder: 0,
        isVisible: true,
      },
      {
        id: CERTIFICATION_IDS.mtcna,
        name: "MikroTik Certified Network Associate (MTCNA)",
        issuer: "MikroTik",
        status: null,
        issueDate: null,
        expirationDate: null,
        credentialId: null,
        credentialUrl: null,
        certificateMediaId: null,
        displayOrder: 1,
        isVisible: true,
      },
    ])
    .onConflictDoNothing();

  console.log("Stage 7 initial skills and certifications seed completed.");

  console.log("Existing records were not overwritten.");
}

main().catch((error: unknown) => {
  console.error("Stage 7 content seed failed.");

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exitCode = 1;
});
