import { AdminShell } from '@/features/admin/components/AdminShell';
import { requireUser } from '@/features/admin/lib/require-user';

export default async function AdminProtectedLayout({
  children,
}: LayoutProps<'/admin'>) {
  await requireUser();

  return <AdminShell>{children}</AdminShell>;
}
