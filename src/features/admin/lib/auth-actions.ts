'use server';

import { redirect } from 'next/navigation';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { AdminActionState } from '@/types/components/admin-shell';
import type { SignInState } from '@/types/components/login-form';

const EMPTY_ACTION_STATE: AdminActionState = { error: null, success: null };

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

export async function signInWithPassword(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect('/admin');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function registerUser(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await assertAuthenticated();

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!email || !password) {
    return { ...EMPTY_ACTION_STATE, error: 'Email and password are required.' };
  }

  if (password !== confirmPassword) {
    return { ...EMPTY_ACTION_STATE, error: 'Passwords do not match.' };
  }

  if (password.length < 8) {
    return { ...EMPTY_ACTION_STATE, error: 'Password must be at least 8 characters.' };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return { ...EMPTY_ACTION_STATE, error: error.message };
    }

    return {
      error: null,
      success: `User ${email} registered and confirmed.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to register user.';
    return { ...EMPTY_ACTION_STATE, error: message };
  }
}

export async function resetUserPassword(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const user = await assertAuthenticated();

  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!password) {
    return { ...EMPTY_ACTION_STATE, error: 'New password is required.' };
  }

  if (password !== confirmPassword) {
    return { ...EMPTY_ACTION_STATE, error: 'Passwords do not match.' };
  }

  if (password.length < 8) {
    return { ...EMPTY_ACTION_STATE, error: 'Password must be at least 8 characters.' };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.updateUserById(user.id, { password });

    if (error) {
      return { ...EMPTY_ACTION_STATE, error: error.message };
    }

    return {
      error: null,
      success: `Password updated for ${user.email}.`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reset password.';
    return { ...EMPTY_ACTION_STATE, error: message };
  }
}
