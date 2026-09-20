import { FooterEditor } from '@/features/admin/components/content/FooterEditor';
import { getAdminFooter } from '@/features/admin/lib/get-admin-content';

export default async function AdminFooterPage() {
  const { content, links } = await getAdminFooter();
  return <FooterEditor content={content} links={links} />;
}
