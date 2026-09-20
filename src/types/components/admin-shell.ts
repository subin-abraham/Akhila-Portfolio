import type { ReactNode } from 'react';

export interface AdminActionState {
  error: string | null;
  success: string | null;
}

export interface AdminShellProps {
  children: ReactNode;
}

export interface AdminAuthFormProps {
  formId: string;
  title: string;
  description: string;
  emailLabel: string;
  passwordLabel: string;
  confirmLabel: string;
  submitLabel: string;
  pendingLabel: string;
  emailValue?: string;
  emailReadOnly?: boolean;
  action: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
}

export interface SettingsPageProps {
  currentUserEmail: string;
}

export interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export interface AdminFormCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export interface AdminFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  describedBy?: string;
  invalid?: boolean;
}

export interface AdminTextareaFieldProps {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  describedBy?: string;
  invalid?: boolean;
}

export interface AdminSelectOption {
  value: string;
  label: string;
}

export interface AdminSelectFieldProps {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  options: AdminSelectOption[];
  required?: boolean;
  describedBy?: string;
  invalid?: boolean;
}

export interface AdminPlatformLookupProps {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  options: AdminSelectOption[];
  required?: boolean;
  describedBy?: string;
  invalid?: boolean;
  placeholder?: string;
}

export interface AdminStatusProps {
  id: string;
  state: AdminActionState;
}

export interface AdminSubmitButtonProps {
  id: string;
  label: string;
  pendingLabel: string;
  isPending: boolean;
  variant?: 'primary' | 'danger';
}

export interface AdminNavItem {
  href: string;
  label: string;
  id: string;
}

export interface AdminNavGroup {
  id: string;
  label: string;
  items: AdminNavItem[];
}

