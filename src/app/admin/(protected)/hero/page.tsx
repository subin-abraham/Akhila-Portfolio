import { HeroEditor } from '@/features/admin/components/content/HeroEditor';
import { getAdminHomepage } from '@/features/admin/lib/get-admin-content';

export default async function AdminHeroPage() {
  const homepage = await getAdminHomepage();
  return <HeroEditor homepage={homepage} />;
}
