import { ContactEditor } from '@/features/admin/components/content/ContactEditor';
import {
  getAdminContactDeliverySettings,
  getAdminContactRateLimitEvents,
  getAdminContactSubmissions,
} from '@/features/admin/lib/get-admin-content';

export default async function AdminContactPage() {
  const [submissions, rateLimitEvents] = await Promise.all([
    getAdminContactSubmissions(),
    getAdminContactRateLimitEvents(),
  ]);

  return (
    <ContactEditor
      settings={getAdminContactDeliverySettings()}
      submissions={submissions}
      rateLimitEvents={rateLimitEvents}
    />
  );
}
