const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

function normalizeMessage(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return FALLBACK_MESSAGE;
  }

  const lower = trimmed.toLowerCase();

  if (
    lower.includes('duplicate key') ||
    lower.includes('unique constraint') ||
    lower.includes('already exists')
  ) {
    return 'That entry already exists. Try a different value.';
  }

  if (lower.includes('foreign key') || lower.includes('violates')) {
    return 'This change conflicts with related data. Check your values and try again.';
  }

  if (
    lower.includes('jwt') ||
    lower.includes('not authenticated') ||
    lower.includes('invalid claim') ||
    lower.includes('session')
  ) {
    return 'Your session expired. Sign in again and try again.';
  }

  if (
    lower.includes('network') ||
    lower.includes('failed to fetch') ||
    lower.includes('fetch failed')
  ) {
    return 'Network error. Check your connection and try again.';
  }

  if (lower.includes('permission') || lower.includes('row-level security') || lower.includes('rls')) {
    return 'Database permission denied. Apply the latest admin migrations, then try again.';
  }

  if (lower.includes('timeout') || lower.includes('timed out')) {
    return 'The request timed out. Please try again.';
  }

  if (
    lower.includes('pq_') ||
    lower.includes('pgrst') ||
    lower.includes('code:') ||
    lower.includes('postgres') ||
    trimmed.length > 160
  ) {
    return FALLBACK_MESSAGE;
  }

  return trimmed;
}

export function parseError(error: unknown): string {
  if (typeof error === 'string') {
    return normalizeMessage(error);
  }

  if (error instanceof Error) {
    return normalizeMessage(error.message);
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') {
      return normalizeMessage(message);
    }
  }

  return FALLBACK_MESSAGE;
}
