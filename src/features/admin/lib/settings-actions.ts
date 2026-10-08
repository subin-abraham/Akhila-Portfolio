'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { parseError } from '@/features/admin/lib/parse-error';
import { isSiteThemeMode } from '@/features/home/lib/site-settings';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { AdminActionState } from '@/types/components/admin-shell';

const EMPTY: AdminActionState = { error: null, success: null };

async function assertAuthenticated() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return user;
}

function readBooleanFlag(formData: FormData, key: string) {
  return formData.get(key) === 'true';
}

function revalidateSiteSettingsPaths() {
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/case-studies');
  revalidatePath('/admin/settings');
}

export async function updateSitePageFlags(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = String(formData.get('id') ?? '').trim();
  const blogEnabled = readBooleanFlag(formData, 'blogEnabled');
  const caseStudiesEnabled = readBooleanFlag(formData, 'caseStudiesEnabled');

  if (!id) {
    return { ...EMPTY, error: parseError('Settings id is required.') };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('site_settings')
    .update({
      blog_enabled: blogEnabled,
      case_studies_enabled: caseStudiesEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { ...EMPTY, error: parseError(error.message) };
  }

  revalidateSiteSettingsPaths();

  return { error: null, success: 'Page visibility updated.' };
}

export async function updateSiteThemeSettings(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const id = String(formData.get('id') ?? '').trim();
  const themeToggleEnabled = readBooleanFlag(formData, 'themeToggleEnabled');
  const defaultThemeRaw = String(formData.get('defaultTheme') ?? '').trim();

  if (!id) {
    return { ...EMPTY, error: parseError('Settings id is required.') };
  }

  if (!isSiteThemeMode(defaultThemeRaw)) {
    return { ...EMPTY, error: parseError('Choose a valid default theme.') };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('site_settings')
    .update({
      theme_toggle_enabled: themeToggleEnabled,
      default_theme: defaultThemeRaw,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { ...EMPTY, error: parseError(error.message) };
  }

  revalidateSiteSettingsPaths();

  return { error: null, success: 'Theme settings updated.' };
}
