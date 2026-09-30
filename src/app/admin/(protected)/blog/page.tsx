import { BlogEditor } from '@/features/admin/components/content/BlogEditor';
import { getAdminBlogPosts } from '@/features/admin/lib/get-admin-content';

export default async function AdminBlogPage() {
  const items = await getAdminBlogPosts();
  return <BlogEditor items={items} />;
}
