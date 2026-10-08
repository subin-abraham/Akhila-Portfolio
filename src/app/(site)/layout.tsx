import type { ReactNode } from 'react';

import { SiteShell } from '@/features/home/components/SiteShell';
import { getSiteShellData } from '@/features/home/lib/get-site-shell-data';

export const dynamic = 'force-dynamic';

interface SiteLayoutProps {
  children: ReactNode;
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const data = await getSiteShellData();

  return <SiteShell data={data}>{children}</SiteShell>;
}
