import { ProfessionalJourneyEditor } from '@/features/admin/components/content/ProfessionalJourneyEditor';
import { getAdminProfessionalJourney } from '@/features/admin/lib/get-admin-content';

export default async function AdminProfessionalJourneyPage() {
  const items = await getAdminProfessionalJourney();
  return <ProfessionalJourneyEditor items={items} />;
}
