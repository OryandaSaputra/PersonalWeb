export function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

export function formatProjectMonthYear(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatProjectDateRange(
  startDate: string | null,
  endDate: string | null,
): string | null {
  if (!startDate) {
    return null;
  }

  const start = formatProjectMonthYear(startDate);

  if (!endDate) {
    return start;
  }

  return `${start} — ${formatProjectMonthYear(endDate)}`;
}

export function normalizeProjectSearchValue(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}
