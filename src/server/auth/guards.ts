import "server-only";

import { redirect } from "next/navigation";

import { getCurrentAdmin, type CurrentAdmin } from "@/server/auth/session";

export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin");
  }

  return admin;
}
