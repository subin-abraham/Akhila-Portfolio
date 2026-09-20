import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  ADMIN_SESSION_COOKIE,
  isAdminSessionTokenValid,
} from '@/features/admin/lib/admin-session';
import { createClient } from '@/lib/supabase/server';

async function hasValidAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const cookieStore = await cookies();
  const bound = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isAdminSessionTokenValid(bound)) {
    await supabase.auth.signOut();
    return null;
  }

  return user;
}

export async function requireUser() {
  const user = await hasValidAdminSession();

  if (!user) {
    redirect('/admin/login');
  }

  return user;
}

export async function redirectIfAuthenticated() {
  const user = await hasValidAdminSession();

  if (user) {
    redirect('/admin');
  }
}
