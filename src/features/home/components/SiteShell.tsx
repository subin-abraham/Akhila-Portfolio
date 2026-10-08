import { SidePanel } from '@/features/home/components/SidePanel';
import { SiteFooter } from '@/features/home/components/SiteFooter';
import type { SiteShellProps } from '@/types/components/site-shell';

export function SiteShell({ data, children }: SiteShellProps) {
  return (
    <div className="home-shell">
      <SidePanel
        homepage={data.homepage}
        navLinks={data.navLinks}
        socialLinks={data.socialLinks}
        locationLabel={data.locationLabel}
        roleLabel={data.roleLabel}
        themeToggleEnabled={data.themeToggleEnabled}
      />

      <div className="home-main">
        <main className="home-main-inner">{children}</main>
        <SiteFooter footer={data.footer} socialLinks={data.socialLinks} />
      </div>
    </div>
  );
}
