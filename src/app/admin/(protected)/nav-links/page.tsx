import { NavLinksEditor } from '@/features/admin/components/content/NavLinksEditor';
import { getAdminNavLinks } from '@/features/admin/lib/get-admin-content';

export default async function AdminNavLinksPage() {
  const items = await getAdminNavLinks();
  return <NavLinksEditor items={items} />;
}
