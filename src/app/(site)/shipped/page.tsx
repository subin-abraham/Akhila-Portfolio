import type { Metadata } from 'next';

import { ShippedPage } from '@/features/shipped/components/ShippedPage';

export const metadata: Metadata = {
  title: 'Shipped Work | Akhila Anns Jacob',
  description:
    'Selected builds, boards, and products — a closer look at recent work. Coming soon.',
};

export default function ShippedRoutePage() {
  return <ShippedPage />;
}
