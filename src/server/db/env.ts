const POSTGRES_PROTOCOLS = new Set(["postgres:", "postgresql:"]);

function getRequiredDatabaseUrl(name: "DATABASE_URL" | "DATABASE_URL_DIRECT"): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid PostgreSQL connection URL.`);
  }

  if (!POSTGRES_PROTOCOLS.has(parsedUrl.protocol)) {
    throw new Error(`${name} must use the postgres:// or postgresql:// protocol.`);
  }

  return value;
}

export function getDatabaseUrl(): string {
  return getRequiredDatabaseUrl("DATABASE_URL");
}

export function getDirectDatabaseUrl(): string {
  return getRequiredDatabaseUrl("DATABASE_URL_DIRECT");
}
