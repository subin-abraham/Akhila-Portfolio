import type { ReactNode } from 'react';

export type AppToastVariant = 'success' | 'error';

export interface AppToastItem {
  id: string;
  message: string;
  variant: AppToastVariant;
}

export interface AppToastContextValue {
  push: (message: string, variant: AppToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  dismiss: (id: string) => void;
}

export interface AppToastProviderProps {
  children: ReactNode;
}

export interface ToastBannerProps {
  id?: string;
  message: string;
  variant: AppToastVariant;
  onDismiss?: () => void;
}
