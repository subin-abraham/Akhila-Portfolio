import { SectionsEditor } from '@/features/admin/components/content/SectionsEditor';
import { getAdminSections } from '@/features/admin/lib/get-admin-content';

export default async function AdminSectionsPage() {
  const sections = await getAdminSections();
  return <SectionsEditor sections={sections} />;
}
