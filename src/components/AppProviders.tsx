'use client';

import type { ReactNode } from 'react';

import { AppLoaderProvider } from '@/components/AppLoader';
import { NavigationLoader } from '@/components/NavigationLoader';
import { ThemeProvider } from '@/components/ThemeProvider';
import type { SiteThemeMode } from '@/types/home/site-settings';

interface AppProvidersProps {
  children: ReactNode;
  defaultTheme: SiteThemeMode;
}

export function AppProviders({ children, defaultTheme }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <AppLoaderProvider variant="assemble">
        <NavigationLoader />
        {children}
      </AppLoaderProvider>
    </ThemeProvider>
  );
}
