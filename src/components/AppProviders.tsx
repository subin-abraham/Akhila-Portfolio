'use client';

import type { ReactNode } from 'react';

import { AppLoaderProvider } from '@/components/AppLoader';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <AppLoaderProvider variant="stack">{children}</AppLoaderProvider>;
}
