import { SettingsPage } from '@/features/admin/components/SettingsPage';
import { requireUser } from '@/features/admin/lib/require-user';
import { getSiteSettings } from '@/features/home/lib/site-settings';

export default async function AdminSettingsRoute() {
  const [user, siteSettings] = await Promise.all([requireUser(), getSiteSettings()]);

  return (
    <SettingsPage
      currentUserEmail={user.email ?? ''}
      siteSettings={{
        id: siteSettings.id,
        blogEnabled: siteSettings.blogEnabled,
        caseStudiesEnabled: siteSettings.caseStudiesEnabled,
      }}
    />
  );
}
