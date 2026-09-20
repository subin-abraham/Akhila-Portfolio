import { TechnicalExpertiseEditor } from '@/features/admin/components/content/TechnicalExpertiseEditor';
import { getAdminTechnicalExpertise } from '@/features/admin/lib/get-admin-content';

export default async function AdminTechnicalExpertisePage() {
  const items = await getAdminTechnicalExpertise();
  return <TechnicalExpertiseEditor items={items} />;
}
