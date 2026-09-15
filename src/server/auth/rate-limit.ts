import "server-only";

import { createHmac } from "node:crypto";

import { and, count, eq, gte, lt, or } from "drizzle-orm";

import { AUTH_CONFIG } from "@/server/auth/config";
import { getAuthSessionSecret } from "@/server/auth/env";
import { db } from "@/server/db/client";
import { adminLoginFailures } from "@/server/db/schema";

type LoginRateLimitResult = {
  allowed: boolean;
};

function hashIdentifier(scope: "email" | "ip", value: string): string {
  return createHmac("sha256", getAuthSessionSecret()).update(`${scope}:${value}`).digest("hex");
}

function normalizeIp(value: string): string {
  return value.trim().toLowerCase();
}

export function getClientIp(requestHeaders: Headers): string {
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  if (forwardedFor) {
    const firstAddress = forwardedFor.split(",")[0]?.trim();

    if (firstAddress) {
      return normalizeIp(firstAddress);
    }
  }

  const realIp = requestHeaders.get("x-real-ip");

  if (realIp?.trim()) {
    return normalizeIp(realIp);
  }

  return "unknown";
}

async function cleanupOldLoginFailures(now: Date): Promise<void> {
  const retentionCutoff = new Date(now.getTime() - AUTH_CONFIG.loginFailureRetentionMs);

  await db.delete(adminLoginFailures).where(lt(adminLoginFailures.attemptedAt, retentionCutoff));
}

export async function checkLoginRateLimit(
  email: string,
  ip: string,
): Promise<LoginRateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - AUTH_CONFIG.loginWindowMs);

  const emailHash = hashIdentifier("email", email);
  const ipHash = hashIdentifier("ip", ip);

  await cleanupOldLoginFailures(now);

  const [emailResult, ipResult] = await Promise.all([
    db
      .select({
        total: count(),
      })
      .from(adminLoginFailures)
      .where(
        and(
          eq(adminLoginFailures.emailHash, emailHash),
          gte(adminLoginFailures.attemptedAt, windowStart),
        ),
      ),
    db
      .select({
        total: count(),
      })
      .from(adminLoginFailures)
      .where(
        and(
          eq(adminLoginFailures.ipHash, ipHash),
          gte(adminLoginFailures.attemptedAt, windowStart),
        ),
      ),
  ]);

  const emailFailureCount = emailResult[0]?.total ?? 0;
  const ipFailureCount = ipResult[0]?.total ?? 0;

  return {
    allowed:
      emailFailureCount < AUTH_CONFIG.emailFailureLimit &&
      ipFailureCount < AUTH_CONFIG.ipFailureLimit,
  };
}

export async function recordLoginFailure(email: string, ip: string): Promise<void> {
  await db.insert(adminLoginFailures).values({
    emailHash: hashIdentifier("email", email),
    ipHash: hashIdentifier("ip", ip),
  });
}

export async function clearLoginFailures(email: string, ip: string): Promise<void> {
  const emailHash = hashIdentifier("email", email);
  const ipHash = hashIdentifier("ip", ip);

  await db
    .delete(adminLoginFailures)
    .where(or(eq(adminLoginFailures.emailHash, emailHash), eq(adminLoginFailures.ipHash, ipHash)));
}
