import "server-only";

const MINIMUM_AUTH_SECRET_BYTES = 32;

export function getAuthSessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET?.trim();

  if (!secret) {
    throw new Error("AUTH_SESSION_SECRET is not configured.");
  }

  if (Buffer.byteLength(secret, "utf8") < MINIMUM_AUTH_SECRET_BYTES) {
    throw new Error(
      `AUTH_SESSION_SECRET must contain at least ${MINIMUM_AUTH_SECRET_BYTES} bytes.`,
    );
  }

  return secret;
}
