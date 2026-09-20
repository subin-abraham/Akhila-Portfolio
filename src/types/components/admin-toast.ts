export type AdminToastVariant = 'success' | 'error';

export interface AdminToastItem {
  id: string;
  message: string;
  variant: AdminToastVariant;
}

export interface AdminToastContextValue {
  push: (message: string, variant: AdminToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  dismiss: (id: string) => void;
}

export interface AdminToastViewportProps {
  toasts: AdminToastItem[];
  onDismiss: (id: string) => void;
}

export interface AdminToastProviderProps {
  children: import('react').ReactNode;
}
