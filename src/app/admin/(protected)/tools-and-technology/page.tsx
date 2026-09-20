import { ToolsEditor } from '@/features/admin/components/content/ToolsEditor';
import { getAdminToolsAndTechnology } from '@/features/admin/lib/get-admin-content';

export default async function AdminToolsPage() {
  const items = await getAdminToolsAndTechnology();
  return <ToolsEditor items={items} />;
}
