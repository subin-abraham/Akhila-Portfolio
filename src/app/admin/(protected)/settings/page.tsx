import { SettingsPage } from '@/features/admin/components/SettingsPage';
import { requireUser } from '@/features/admin/lib/require-user';

export default async function AdminSettingsRoute() {
  const user = await requireUser();

  return <SettingsPage currentUserEmail={user.email ?? ''} />;
}
