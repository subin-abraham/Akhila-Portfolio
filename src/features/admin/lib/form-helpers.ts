export function readString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

export function readOptionalString(formData: FormData, key: string): string | null {
  const value = readString(formData, key);
  return value.length > 0 ? value : null;
}

export function readInteger(formData: FormData, key: string): number | null {
  const raw = readString(formData, key);

  if (!raw) {
    return null;
  }

  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value : null;
}

export function requireNonEmpty(
  fields: Record<string, string>,
): string | null {
  for (const [label, value] of Object.entries(fields)) {
    if (!value) {
      return `${label} is required.`;
    }
  }

  return null;
}
