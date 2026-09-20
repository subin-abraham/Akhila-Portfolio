'use client';

import type { FormEvent } from 'react';

import {
  AdminActionForm,
  AdminStatus,
  AdminSubmitButton,
} from '@/features/admin/components/AdminFormPrimitives';
import type { AdminActionState } from '@/types/components/admin-shell';

interface DeleteItemFormProps {
  formId: string;
  itemId: string;
  action: (prevState: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  confirmMessage: string;
  label?: string;
}

export function DeleteItemForm({
  formId,
  itemId,
  action,
  confirmMessage,
  label = 'Delete',
}: DeleteItemFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
    }
  }

  return (
    <AdminActionForm formId={formId} action={action} onSubmit={handleSubmit} className="inline">
      {({ state, isPending, statusId }) => (
        <div className="space-y-2">
          <input type="hidden" name="id" value={itemId} />
          <AdminSubmitButton
            id={`${formId}-submit`}
            label={label}
            pendingLabel="Deleting…"
            isPending={isPending}
            variant="danger"
          />
          <AdminStatus id={statusId} state={state} />
        </div>
      )}
    </AdminActionForm>
  );
}
