'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { signOut } from '@/features/admin/lib/auth-actions';
import { AdminToastProvider } from '@/features/admin/components/AdminToast';
import type {
  AdminNavGroup,
  AdminNavItem,
  AdminShellProps,
} from '@/types/components/admin-shell';

const NAV_GROUPS: AdminNavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', id: 'admin-nav-dashboard' }],
  },
  {
    id: 'layout',
    label: 'Layout',
    items: [
      { href: '/admin/hero', label: 'Hero', id: 'admin-nav-hero' },
      { href: '/admin/nav-links', label: 'Navigation', id: 'admin-nav-nav-links' },
      { href: '/admin/social-links', label: 'Social', id: 'admin-nav-social' },
      { href: '/admin/footer', label: 'Footer', id: 'admin-nav-footer' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      { href: '/admin/sections', label: 'Section headers', id: 'admin-nav-sections' },
      { href: '/admin/worked-with', label: 'Worked with', id: 'admin-nav-worked-with' },
      { href: '/admin/case-studies', label: 'Case studies', id: 'admin-nav-case-studies' },
      { href: '/admin/professional-journey', label: 'Journey', id: 'admin-nav-journey' },
      { href: '/admin/education', label: 'Education', id: 'admin-nav-education' },
      { href: '/admin/blog', label: 'Blog', id: 'admin-nav-blog' },
      { href: '/admin/technical-expertise', label: 'Expertise', id: 'admin-nav-expertise' },
      { href: '/admin/tools-and-technology', label: 'Tools', id: 'admin-nav-tools' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    items: [{ href: '/admin/settings', label: 'Settings', id: 'admin-nav-settings' }],
  },
];

function DashboardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M19.4 13a7.8 7.8 0 0 0 .05-2l2.05-1.6-2-3.46-2.45.8a7.7 7.7 0 0 0-1.73-1L15 3h-6l-.37 2.74a7.7 7.7 0 0 0-1.73 1l-2.45-.8-2 3.46L4.55 11a7.8 7.8 0 0 0 0 2l-2.05 1.6 2 3.46 2.45-.8a7.7 7.7 0 0 0 1.73 1L9 21h6l.37-2.74a7.7 7.7 0 0 0 1.73-1l2.45.8 2-3.46L19.4 13Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none">
      <path
        d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none">
      <path
        d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M15 16l4-4-4-4M9 12h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`size-5 shrink-0 transition-transform ${collapsed ? 'rotate-180' : ''}`}
      fill="none"
    >
      <path
        d="M14.5 6 8.5 12l6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavIcon({ href }: { href: string }) {
  if (href === '/admin/settings') {
    return <SettingsIcon />;
  }

  if (href === '/admin') {
    return <DashboardIcon />;
  }

  return <ContentIcon />;
}

function isNavItemActive(pathname: string, item: AdminNavItem) {
  if (item.href === '/admin') {
    return pathname === '/admin';
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AdminToastProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-home-bg text-white">
        <aside
          className={`flex h-dvh shrink-0 flex-col border-r border-white/10 bg-[#121212] transition-[width] duration-300 ease-out ${
            collapsed ? 'w-16' : 'w-60'
          }`}
        >
        <div
          className={`flex h-16 shrink-0 items-center border-b border-white/10 ${
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          {!collapsed ? (
            <span className="font-display text-sm font-semibold tracking-wide">Admin</span>
          ) : null}
          <button
            id="admin-sidebar-toggle"
            type="button"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((current) => !current)}
            className="inline-flex size-10 items-center justify-center rounded-lg text-home-muted transition hover:bg-white/5 hover:text-home-accent"
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        </div>

        <nav
          aria-label="Admin"
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-2"
        >
          {NAV_GROUPS.map((group, groupIndex) => (
            <div key={group.id} className="flex flex-col gap-1">
              {!collapsed ? (
                <p className="px-3 pt-1 text-[11px] font-semibold tracking-wider text-home-muted/70 uppercase">
                  {group.label}
                </p>
              ) : groupIndex > 0 ? (
                <div aria-hidden="true" className="mx-auto my-1 h-px w-6 bg-white/10" />
              ) : null}
              {group.items.map((item) => {
                const isActive = isNavItemActive(pathname, item);

                return (
                  <Link
                    key={item.id}
                    id={item.id}
                    href={item.href}
                    title={item.label}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`inline-flex min-h-10 shrink-0 items-center rounded-lg transition ${
                      collapsed ? 'justify-center px-2' : 'gap-3 px-3'
                    } ${
                      isActive
                        ? 'bg-home-accent/15 text-home-accent'
                        : 'text-home-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <NavIcon href={item.href} />
                    {!collapsed ? <span className="text-sm font-medium">{item.label}</span> : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-2">
          <form action={signOut}>
            <button
              id="admin-sign-out"
              type="submit"
              title="Sign out"
              aria-label="Sign out"
              className={`inline-flex min-h-10 w-full items-center rounded-lg text-home-muted transition hover:bg-white/5 hover:text-red-300 ${
                collapsed ? 'justify-center px-2' : 'gap-3 px-3'
              }`}
            >
              <SignOutIcon />
              {!collapsed ? <span className="text-sm font-medium">Sign out</span> : null}
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">{children}</div>
      </div>
    </AdminToastProvider>
  );
}
