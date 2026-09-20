import type { ReactNode } from 'react';

export type AppLoaderVariant = 'cluster' | 'stack' | 'assemble';

export type AppLoaderSize = 'sm' | 'md' | 'lg';

export interface AppLoaderProps {
  variant?: AppLoaderVariant;
  size?: AppLoaderSize;
  label?: string;
  className?: string;
}

export interface AppLoaderOverlayProps {
  label?: string;
  variant?: AppLoaderVariant;
  className?: string;
}

export interface AppLoaderContextValue {
  isLoading: boolean;
  label: string;
  start: (label?: string) => void;
  stop: () => void;
}

export interface AppLoaderProviderProps {
  children: ReactNode;
  variant?: AppLoaderVariant;
}
