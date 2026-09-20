'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { after } from 'next/server';

import {
  ADMIN_LOGIN_LOCKOUT_MS,
  buildAdminLoginKeys,
  clearAdminLoginFailures,
  consumeAdminLoginRateLimit,
  getAdminLoginLockout,
  recordAdminLoginFailure,
} from '@/features/admin/lib/admin-login-rate-limit';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
} from '@/features/admin/lib/admin-session';
import { notifyAdminLoginFailure } from '@/features/admin/lib/notify-admin-login-failure';
import {
  createMathChallenge,
  verifyMathChallenge,
} from '@/features/home/lib/contact-math-challenge';
import { getClientIp } from '@/features/home/lib/contact-rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { AdminActionState } from '@/types/components/admin-shell';
import type { SignInState } from '@/types/components/login-form';

const EMPTY_ACTION_STATE: AdminActionState = { error: null, success: null };
const INVALID_CREDENTIALS = 'Invalid email or password.';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCKOUT_MINUTES = Math.max(1, Math.ceil(ADMIN_LOGIN_LOCKOUT_MS / 60000));

function nextSignInState(
  partial: Partial<Pick<SignInState, 'error' | 'email'>>
): SignInState {
  return {
    error: partial.error ?? null,
    email: partial.email ?? null,
    challenge: createMathChallenge(),
  };
}

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
  formData: FormData
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const challengeToken = String(formData.get('challengeToken') ?? '').trim();
  const challengeAnswer = String(formData.get('challengeAnswer') ?? '').trim();
  const honeypot = String(formData.get('company') ?? '').trim();
  const requestHeaders = await headers();
  const ipAddress = getClientIp(requestHeaders);
  const { ipKey, emailKey } = buildAdminLoginKeys(ipAddress, email);

  if (honeypot) {
    return nextSignInState({ error: INVALID_CREDENTIALS, email });
  }

  const ipLockout = getAdminLoginLockout(ipKey);
  const emailLockout = emailKey ? getAdminLoginLockout(emailKey) : null;

  if (ipLockout.locked) {
    return nextSignInState({ error: ipLockout.message, email });
  }

  if (emailLockout?.locked) {
    return nextSignInState({ error: emailLockout.message, email });
  }

  const rateLimit = consumeAdminLoginRateLimit(ipKey);

  if (rateLimit.limited) {
    return nextSignInState({ error: rateLimit.message, email });
  }

  const challengeError = verifyMathChallenge(challengeToken, challengeAnswer);

  if (challengeError) {
    return nextSignInState({ error: challengeError, email });
  }

  if (!email || !password) {
    return nextSignInState({
      error: 'Email and password are required.',
      email,
    });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return nextSignInState({ error: 'Enter a valid email address.', email });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const ipFailure = recordAdminLoginFailure(ipKey);
    const emailFailure = emailKey ? recordAdminLoginFailure(emailKey) : null;
    const locked = ipFailure.locked || Boolean(emailFailure?.locked);
    const failureCount = Math.max(
      ipFailure.failures,
      emailFailure?.failures ?? 0
    );
    let lockoutMessage: string | null = null;

    if (ipFailure.locked) {
      lockoutMessage = ipFailure.message;
    } else if (emailFailure?.locked) {
      lockoutMessage = emailFailure.message;
    }

    after(() => {
      void notifyAdminLoginFailure({
        email,
        ipAddress,
        userAgent: requestHeaders.get('user-agent'),
        failureCount,
        locked,
        lockoutMinutes: locked ? LOCKOUT_MINUTES : null,
      });
    });

    return nextSignInState({
      error: lockoutMessage ?? INVALID_CREDENTIALS,
      email,
    });
  }

  clearAdminLoginFailures(ipKey);

  if (emailKey) {
    clearAdminLoginFailures(emailKey);
  }

  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(),
    getAdminSessionCookieOptions()
  );

  redirect('/admin');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    ...getAdminSessionCookieOptions(0),
    maxAge: 0,
  });

  redirect('/admin/login');
}

export async function registerUser(
  _prevState: AdminActionState,
  formData: FormData
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
  formData: FormData
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
