import { CaseStudiesEditor } from '@/features/admin/components/content/CaseStudiesEditor';
import { getAdminCaseStudies } from '@/features/admin/lib/get-admin-content';

export default async function AdminCaseStudiesPage() {
  const items = await getAdminCaseStudies();
  return <CaseStudiesEditor items={items} />;
}
