import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/server/db/client";
import { adminUsers } from "@/server/db/schema";

export type AdminAuthRecord = {
  id: number;
  email: string;
  passwordHash: string;
  isActive: boolean;
};

export async function findAdminByEmail(email: string): Promise<AdminAuthRecord | null> {
  const [admin] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      passwordHash: adminUsers.passwordHash,
      isActive: adminUsers.isActive,
    })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  return admin ?? null;
}

export async function updateAdminPasswordHash(
  adminUserId: number,
  passwordHash: string,
): Promise<void> {
  await db
    .update(adminUsers)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, adminUserId));
}

export async function updateAdminLastLogin(adminUserId: number): Promise<void> {
  const now = new Date();

  await db
    .update(adminUsers)
    .set({
      lastLoginAt: now,
      updatedAt: now,
    })
    .where(eq(adminUsers.id, adminUserId));
}
