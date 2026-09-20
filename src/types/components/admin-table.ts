import type { ReactNode } from 'react';

import type { AdminActionState } from '@/types/components/admin-shell';

export interface AdminTableColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  hideBelow?: 'sm' | 'md' | 'lg';
  headerClassName?: string;
  cellClassName?: string;
  widthClassName?: string;
}

export interface AdminDetailField {
  label: string;
  value: ReactNode;
}

export interface AdminTableProps<T extends { id: string }> {
  caption: string;
  rows: T[];
  columns: AdminTableColumn<T>[];
  getRowLabel: (row: T) => string;
  renderActions: (row: T) => ReactNode;
  framed?: boolean;
  layout?: 'auto' | 'fixed';
  actionsWidthClassName?: string;
}

export interface AdminCategoryGroup<T extends { id: string }> {
  category: string;
  rows: T[];
}

export interface AdminCategoryGroupedTableProps<T extends { id: string; category: string }> {
  caption: string;
  rows: T[];
  columns: AdminTableColumn<T>[];
  getRowLabel: (row: T) => string;
  getDetailFields: (row: T) => AdminDetailField[];
  renderEditForm?: (args: {
    row: T;
    formId: string;
    onSuccess: () => void;
  }) => ReactNode;
  deleteAction?: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  getDeleteConfirmMessage?: (row: T) => string;
  onAddToCategory: (category: string | null) => void;
  addToCategoryLabel?: string;
  newCategoryTitle?: string;
  newCategoryDescription?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export interface AdminModalProps {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

export interface AdminDataTableProps<T extends { id: string }> {
  caption: string;
  rows: T[];
  columns: AdminTableColumn<T>[];
  getRowLabel: (row: T) => string;
  getDetailFields: (row: T) => AdminDetailField[];
  renderEditForm?: (args: {
    row: T;
    formId: string;
    onSuccess: () => void;
  }) => ReactNode;
  deleteAction?: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  getDeleteConfirmMessage?: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
}
