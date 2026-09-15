"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { LoginActionState, LoginFieldErrors } from "@/features/auth/types";
import {
  findAdminByEmail,
  updateAdminLastLogin,
  updateAdminPasswordHash,
} from "@/server/auth/admin-repository";
import {
  consumePasswordHashWork,
  hashPassword,
  passwordHashNeedsRehash,
  verifyPassword,
} from "@/server/auth/password";
import {
  checkLoginRateLimit,
  clearLoginFailures,
  getClientIp,
  recordLoginFailure,
} from "@/server/auth/rate-limit";
import { createAdminSession, revokeCurrentAdminSession } from "@/server/auth/session";
import { loginSchema } from "@/server/auth/validation";

const INVALID_CREDENTIALS_MESSAGE = "Email or password is incorrect.";

const RATE_LIMIT_MESSAGE = "Too many sign-in attempts. Please try again later.";

function buildFieldErrors(
  issues: ReadonlyArray<{
    path: PropertyKey[];
    message: string;
  }>,
): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  for (const issue of issues) {
    const field = issue.path[0];

    if (field === "email" && !errors.email) {
      errors.email = issue.message;
    }

    if (field === "password" && !errors.password) {
      errors.password = issue.message;
    }
  }

  return errors;
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const emailForState = typeof rawEmail === "string" ? rawEmail.trim().slice(0, 320) : "";

  const validation = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!validation.success) {
    return {
      fieldErrors: buildFieldErrors(validation.error.issues),
      values: {
        email: emailForState,
      },
    };
  }

  const requestHeaders = await headers();
  const clientIp = getClientIp(requestHeaders);

  const rateLimit = await checkLoginRateLimit(validation.data.email, clientIp);

  if (!rateLimit.allowed) {
    return {
      formError: RATE_LIMIT_MESSAGE,
      values: {
        email: validation.data.email,
      },
    };
  }

  const admin = await findAdminByEmail(validation.data.email);

  let passwordMatches = false;

  if (admin) {
    passwordMatches = await verifyPassword(admin.passwordHash, validation.data.password);
  } else {
    await consumePasswordHashWork(validation.data.password);
  }

  if (!admin || !admin.isActive || !passwordMatches) {
    await recordLoginFailure(validation.data.email, clientIp);

    return {
      formError: INVALID_CREDENTIALS_MESSAGE,
      values: {
        email: validation.data.email,
      },
    };
  }

  if (passwordHashNeedsRehash(admin.passwordHash)) {
    const upgradedHash = await hashPassword(validation.data.password);

    await updateAdminPasswordHash(admin.id, upgradedHash);
  }

  await clearLoginFailures(validation.data.email, clientIp);

  await updateAdminLastLogin(admin.id);

  await createAdminSession(admin.id);

  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  await revokeCurrentAdminSession();

  redirect("/admin");
}
