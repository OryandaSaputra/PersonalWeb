import { confirm, input, password } from "@inquirer/prompts";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import { hashPassword } from "../src/server/auth/password";
import { provisionAdminSchema } from "../src/server/auth/validation";
import { getDirectDatabaseUrl } from "../src/server/db/env";
import { adminUsers } from "../src/server/db/schema";

config({ path: ".env.local" });

async function main() {
  const database = drizzle({
    client: neon(getDirectDatabaseUrl()),
  });

  const [existingAdmin] = await database
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
    })
    .from(adminUsers)
    .limit(1);

  if (existingAdmin) {
    console.error(
      `Admin provisioning aborted. An Admin account already exists for ${existingAdmin.email}.`,
    );
    process.exitCode = 1;
    return;
  }

  const email = await input({
    message: "Admin email:",
    required: true,
  });

  const adminPassword = await password({
    message: "Admin password:",
    mask: "*",
  });

  const adminPasswordConfirmation = await password({
    message: "Confirm Admin password:",
    mask: "*",
  });

  if (adminPassword !== adminPasswordConfirmation) {
    console.error("Admin provisioning aborted. Password confirmation does not match.");
    process.exitCode = 1;
    return;
  }

  const validation = provisionAdminSchema.safeParse({
    email,
    password: adminPassword,
  });

  if (!validation.success) {
    console.error("Admin provisioning aborted.");

    for (const issue of validation.error.issues) {
      console.error(`- ${issue.message}`);
    }

    process.exitCode = 1;
    return;
  }

  const shouldCreate = await confirm({
    message: `Create the single portfolio Admin account for ${validation.data.email}?`,
    default: false,
  });

  if (!shouldCreate) {
    console.log("Admin provisioning cancelled.");
    return;
  }

  const passwordHash = await hashPassword(validation.data.password);

  await database.insert(adminUsers).values({
    id: 1,
    email: validation.data.email,
    passwordHash,
    isActive: true,
  });

  console.log("Admin account provisioned successfully.");
  console.log("No plaintext password was stored.");
}

main().catch((error: unknown) => {
  console.error("Admin provisioning failed.");

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exitCode = 1;
});
