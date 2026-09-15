import { hash, parseOptions, verify } from "@node-rs/argon2";

const ARGON2ID_ALGORITHM = 2;
const ARGON2_VERSION_19 = 1;

export const ARGON2_POLICY = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
} as const;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_POLICY);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

export async function consumePasswordHashWork(password: string): Promise<void> {
  await hash(password, ARGON2_POLICY);
}

export function passwordHashNeedsRehash(passwordHash: string): boolean {
  try {
    const parsed = parseOptions(passwordHash);

    return (
      parsed.algorithm !== ARGON2ID_ALGORITHM ||
      parsed.version !== ARGON2_VERSION_19 ||
      parsed.memoryCost !== ARGON2_POLICY.memoryCost ||
      parsed.timeCost !== ARGON2_POLICY.timeCost ||
      parsed.parallelism !== ARGON2_POLICY.parallelism ||
      parsed.outputLen !== ARGON2_POLICY.outputLen ||
      parsed.saltLen < 16
    );
  } catch {
    return true;
  }
}
