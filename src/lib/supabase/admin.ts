import { createClient } from '@supabase/supabase-js';

import { env } from '@/config';

function requireSecretKey(): string {
  const value = process.env.NEXT_SUPABASE_SECRET_KEY;

  if (!value) {
    throw new Error('Missing required environment variable: NEXT_SUPABASE_SECRET_KEY');
  }

  return value;
}

export function createAdminClient() {
  return createClient(env.supabaseUrl, requireSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
