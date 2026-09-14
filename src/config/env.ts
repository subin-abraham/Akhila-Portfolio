import type { Env } from '@/types/env';

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env: Env = {
  supabaseUrl: requireEnv('NEXT_SUPABASE_URL'),
  supabasePublishableKey: requireEnv('NEXT_SUPABASE_PUBLISHABLE_KEY'),
};
