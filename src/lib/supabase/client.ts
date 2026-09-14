import { createBrowserClient } from '@supabase/ssr';

import { env } from '@/config';

export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabasePublishableKey);
}
