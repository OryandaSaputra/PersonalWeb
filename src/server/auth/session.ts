import "server-only";

import { createHmac, randomBytes } from "node:crypto";

import { and, eq, isNull, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";

import { AUTH_CONFIG } from "@/server/auth/config";
import { getAuthSessionSecret } from "@/server/auth/env";
import { db } from "@/server/db/client";
import { adminSessions, adminUsers } from "@/server/db/schema";

const DEVELOPMENT_SESSION_COOKIE_NAME = "oryanda_admin_session";
const PRODUCTION_SESSION_COOKIE_NAME = "__Host-oryanda_admin_session";

export type CurrentAdmin = {
  id: number;
  email: string;
};

function getSessionCookieName(): string {
  return process.env.NODE_ENV === "production"
    ? PRODUCTION_SESSION_COOKIE_NAME
    : DEVELOPMENT_SESSION_COOKIE_NAME;
}

function createRawSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

function hashSessionToken(rawToken: string): string {
  return createHmac("sha256", getAuthSessionSecret()).update(rawToken).digest("hex");
}

async function setSessionCookie(rawToken: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: getSessionCookieName(),
    value: rawToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(getSessionCookieName());
}

async function revokeActiveSessions(adminUserId: number, now: Date): Promise<void> {
  await db
    .update(adminSessions)
    .set({
      revokedAt: now,
    })
    .where(and(eq(adminSessions.adminUserId, adminUserId), isNull(adminSessions.revokedAt)));
}

async function cleanupExpiredSessions(now: Date): Promise<void> {
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, now));
}

export async function createAdminSession(adminUserId: number): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + AUTH_CONFIG.sessionDurationMs);

  await revokeActiveSessions(adminUserId, now);
  await cleanupExpiredSessions(now);

  const rawToken = createRawSessionToken();
  const tokenHash = hashSessionToken(rawToken);

  await db.insert(adminSessions).values({
    adminUserId,
    tokenHash,
    expiresAt,
    lastSeenAt: now,
  });

  await setSessionCookie(rawToken, expiresAt);
}

export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(getSessionCookieName())?.value;

  if (!rawToken) {
    return null;
  }

  const tokenHash = hashSessionToken(rawToken);

  const [record] = await db
    .select({
      sessionId: adminSessions.id,
      expiresAt: adminSessions.expiresAt,
      adminUserId: adminUsers.id,
      adminEmail: adminUsers.email,
      adminIsActive: adminUsers.isActive,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.adminUserId, adminUsers.id))
    .where(and(eq(adminSessions.tokenHash, tokenHash), isNull(adminSessions.revokedAt)))
    .limit(1);

  if (!record) {
    return null;
  }

  if (!record.adminIsActive) {
    return null;
  }

  if (record.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return {
    id: record.adminUserId,
    email: record.adminEmail,
  };
});

export async function revokeCurrentAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(getSessionCookieName())?.value;

  if (rawToken) {
    const tokenHash = hashSessionToken(rawToken);

    await db
      .update(adminSessions)
      .set({
        revokedAt: new Date(),
      })
      .where(and(eq(adminSessions.tokenHash, tokenHash), isNull(adminSessions.revokedAt)));
  }

  await deleteSessionCookie();
}
