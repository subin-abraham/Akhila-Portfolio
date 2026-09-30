import { WorkedWithEditor } from '@/features/admin/components/content/WorkedWithEditor';
import { getAdminWorkedWith } from '@/features/admin/lib/get-admin-content';

export default async function AdminWorkedWithPage() {
  const items = await getAdminWorkedWith();
  return <WorkedWithEditor items={items} />;
}
