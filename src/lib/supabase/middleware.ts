import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  isAdminSessionTokenValid,
} from '@/features/admin/lib/admin-session';
import { env } from '@/config';

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
}

function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    ...getAdminSessionCookieOptions(0),
    maxAge: 0,
  });
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isLoginRoute = pathname === '/admin/login';
  const sessionBoundValid = isAdminSessionTokenValid(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  );
  const hasValidAdminSession = Boolean(user) && sessionBoundValid;

  if (isAdminRoute && !isLoginRoute && user && !sessionBoundValid) {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    const redirectResponse = NextResponse.redirect(url);
    copyCookies(supabaseResponse, redirectResponse);
    clearAdminSessionCookie(redirectResponse);
    return redirectResponse;
  }

  if (isAdminRoute && !isLoginRoute && !hasValidAdminSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    const redirectResponse = NextResponse.redirect(url);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (isLoginRoute && hasValidAdminSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    const redirectResponse = NextResponse.redirect(url);
    copyCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (isLoginRoute && user && !sessionBoundValid) {
    await supabase.auth.signOut();
    clearAdminSessionCookie(supabaseResponse);
  }

  return supabaseResponse;
}
