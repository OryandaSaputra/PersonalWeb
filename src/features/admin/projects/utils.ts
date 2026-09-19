export function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

export function parseMultilineList(value: string): string[] {
  const items = value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return Array.from(new Set(items));
}

export function jsonToStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function toMultilineText(value: unknown): string {
  return jsonToStringArray(value).join("\n");
}
