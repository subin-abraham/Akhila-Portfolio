'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { AppToastProvider } from '@/components/AppToast';
import { signOut } from '@/features/admin/lib/auth-actions';
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
      { href: '/admin/social-links', label: 'Social', id: 'admin-nav-social' },
      { href: '/admin/footer', label: 'Footer', id: 'admin-nav-footer' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      { href: '/admin/worked-with', label: 'Worked with', id: 'admin-nav-worked-with' },
      { href: '/admin/professional-journey', label: 'Journey', id: 'admin-nav-journey' },
      { href: '/admin/education', label: 'Education', id: 'admin-nav-education' },
      { href: '/admin/technical-expertise', label: 'Expertise', id: 'admin-nav-expertise' },
      { href: '/admin/tools-and-technology', label: 'Tools', id: 'admin-nav-tools' },
    ],
  },
  {
    id: 'pages',
    label: 'Pages',
    items: [
      { href: '/admin/case-studies', label: 'Case studies', id: 'admin-nav-case-studies' },
      { href: '/admin/blog', label: 'Blog', id: 'admin-nav-blog' },
    ],
  },
  {
    id: 'inbox',
    label: 'Inbox',
    items: [{ href: '/admin/contact', label: 'Contact', id: 'admin-nav-contact' }],
  },
  {
    id: 'account',
    label: 'Account',
    items: [{ href: '/admin/settings', label: 'Settings', id: 'admin-nav-settings' }],
  },
];

const ICON_CLASS = 'size-5 shrink-0';

function DashboardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <path
        d="M12 3.5 13.6 8.4 18.5 10 13.6 11.6 12 16.5 10.4 11.6 5.5 10 10.4 8.4 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 15.5 19.2 17.3 21 18 19.2 18.7 18.5 20.5 17.8 18.7 16 18 17.8 17.3 18.5 15.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SocialIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <circle cx="7" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17" cy="7" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17" cy="17" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M9.1 11.1 14.9 8.1M9.1 12.9 14.9 15.9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FooterIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <rect
        x="3.5"
        y="4"
        width="17"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path d="M3.5 16.5h17" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M7 19h3.5M14 19h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <path
        d="M5 7h14M5 12h10M5 17h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WorkedWithIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <path
        d="M4 19V8.5A1.5 1.5 0 0 1 5.5 7H10l2 2.5h6.5A1.5 1.5 0 0 1 20 11v8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CaseStudiesIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <path
        d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <rect
        x="4"
        y="7"
        width="16"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function JourneyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <circle cx="6" cy="7" r="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M7.8 8.6 16.2 11.2M16.2 13.2 9.7 16.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EducationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <path
        d="M3.5 10 12 5.5 20.5 10 12 14.5 3.5 10Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M7 12.2v4.1c0 .4.9 1.6 5 1.6s5-1.2 5-1.6v-4.1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M20.5 10v5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <path
        d="M5 5.5h10.5A1.5 1.5 0 0 1 17 7v12.5H6.5A1.5 1.5 0 0 1 5 18V5.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h6.5M8 12.5h6.5M8 16h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M17 9.5h1.5A1.5 1.5 0 0 1 20 11v8a1.5 1.5 0 0 1-1.5 1.5H8.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ExpertiseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <path
        d="M5 19V10.5M10.5 19V6M16 19v-8M21 19H3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToolsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <path
        d="M14.5 6.5a3.5 3.5 0 0 0 3 3L20 12l-2.5 2.5-2.5-2.5a3.5 3.5 0 0 0-3-3L9.5 11.5 7 9l2.5-2.5 5 0Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 19.5 10 14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="m5 8.5 6.2 4.2a1.4 1.4 0 0 0 1.6 0L19 8.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
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

function SignOutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={ICON_CLASS} fill="none">
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
  switch (href) {
    case '/admin':
      return <DashboardIcon />;
    case '/admin/hero':
      return <HeroIcon />;
    case '/admin/social-links':
      return <SocialIcon />;
    case '/admin/footer':
      return <FooterIcon />;
    case '/admin/worked-with':
      return <WorkedWithIcon />;
    case '/admin/case-studies':
      return <CaseStudiesIcon />;
    case '/admin/professional-journey':
      return <JourneyIcon />;
    case '/admin/education':
      return <EducationIcon />;
    case '/admin/blog':
      return <BlogIcon />;
    case '/admin/technical-expertise':
      return <ExpertiseIcon />;
    case '/admin/tools-and-technology':
      return <ToolsIcon />;
    case '/admin/contact':
      return <ContactIcon />;
    case '/admin/settings':
      return <SettingsIcon />;
    default:
      return <SectionsIcon />;
  }
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
    <AppToastProvider>
      <div className="flex min-h-0 w-full flex-1 overflow-hidden bg-home-bg text-white">
        <aside
          className={`flex min-h-0 shrink-0 flex-col self-stretch border-r border-white/10 bg-[#121212] transition-[width] duration-300 ease-out ${
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

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
        {children}
      </div>
      </div>
    </AppToastProvider>
  );
}
