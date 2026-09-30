import { SocialLinksEditor } from '@/features/admin/components/content/SocialLinksEditor';
import { getAdminSocialLinks } from '@/features/admin/lib/get-admin-content';

export default async function AdminSocialLinksPage() {
  const items = await getAdminSocialLinks();
  return <SocialLinksEditor items={items} />;
}
