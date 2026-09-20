import { EducationEditor } from '@/features/admin/components/content/EducationEditor';
import { getAdminEducation } from '@/features/admin/lib/get-admin-content';

export default async function AdminEducationPage() {
  const items = await getAdminEducation();
  return <EducationEditor items={items} />;
}
