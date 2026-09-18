export function toNullableText(value: string): string | null {
  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}

export function multilineTextToList(value: string): string[] {
  const values = new Set<string>();

  for (const rawLine of value.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line) {
      values.add(line);
    }
  }

  return Array.from(values);
}

export function listToMultilineText(values: readonly string[]): string {
  return values.join("\n");
}
