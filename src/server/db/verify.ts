import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { getDatabaseUrl } from "./env";

config({ path: ".env.local" });

async function main() {
  const neonClient = neon(getDatabaseUrl());
  const database = drizzle({ client: neonClient });

  await database.execute(sql`select 1`);

  await database.execute(sql`
    select count(*)
    from information_schema.tables
    where table_schema = 'public'
  `);

  console.log("Database connection verified successfully.");
  console.log("Neon runtime connection and Drizzle query execution are working.");
}

main().catch((error: unknown) => {
  console.error("Database verification failed.");

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exitCode = 1;
});
