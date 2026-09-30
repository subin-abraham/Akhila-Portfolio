import { FooterEditor } from '@/features/admin/components/content/FooterEditor';
import {
  getAdminFooter,
  getAdminSocialLinks,
} from '@/features/admin/lib/get-admin-content';

export default async function AdminFooterPage() {
  const [content, socialLinks] = await Promise.all([
    getAdminFooter(),
    getAdminSocialLinks(),
  ]);

  return <FooterEditor content={content} socialLinks={socialLinks} />;
}
