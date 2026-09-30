'use client';

import { useState } from 'react';

import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import {
  AdminActionForm,
  AdminField,
  AdminHeaderAddButton,
  AdminPageHeader,
  AdminStatus,
  AdminSubmitButton,
} from '@/features/admin/components/AdminFormPrimitives';
import { AdminModal } from '@/features/admin/components/AdminModal';
import {
  createWorkedWith,
  deleteWorkedWith,
  updateWorkedWith,
} from '@/features/admin/lib/content-actions';
import type {
  AdminWorkedWithItem,
  WorkedWithEditorProps,
} from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const COLUMNS: AdminTableColumn<AdminWorkedWithItem>[] = [
  { id: 'name', header: 'Name', cell: (row) => row.name },
  {
    id: 'sortOrder',
    header: 'Order',
    cell: (row) => String(row.sortOrder),
  },
];

export function WorkedWithEditor({ items }: WorkedWithEditorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Worked with"
        description="Edit company names and display order."
        action={
          <AdminHeaderAddButton
            id="admin-worked-with-add"
            label="Add"
            onClick={() => setIsCreateOpen(true)}
          />
        }
      />

      <AdminDataTable
        caption="Companies worked with"
        rows={items}
        columns={COLUMNS}
        getRowLabel={(row) => row.name}
        getDetailFields={(row) => [
          { label: 'Name', value: row.name },
          { label: 'Display order', value: String(row.sortOrder) },
        ]}
        deleteAction={deleteWorkedWith}
        getDeleteConfirmMessage={(row) => `Delete "${row.name}"?`}
        emptyTitle="No companies yet"
        emptyDescription="Use Add to create a company."
        renderEditForm={({ row, formId, onSuccess }) => (
          <AdminActionForm
            formId={formId}
            action={updateWorkedWith}
            onSuccess={onSuccess}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={row.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id={`${formId}-name`}
                    name="name"
                    label="Name"
                    defaultValue={row.name}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id={`${formId}-sort`}
                    name="sortOrder"
                    label="Display order"
                    type="number"
                    defaultValue={row.sortOrder}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                </div>
                <AdminStatus id={statusId} state={state} />
                <AdminSubmitButton
                  id={`${formId}-submit`}
                  label="Save"
                  pendingLabel="Saving…"
                  isPending={isPending}
                />
              </>
            )}
          </AdminActionForm>
        )}
      />

      {isCreateOpen ? (
        <AdminModal
          title="Add company"
          description="Add a company name and display order."
          onClose={() => setIsCreateOpen(false)}
          size="md"
        >
          <AdminActionForm
            formId="admin-worked-with-create"
            action={createWorkedWith}
            onSuccess={() => setIsCreateOpen(false)}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id="admin-worked-with-create-name"
                    name="name"
                    label="Name"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-worked-with-create-sort"
                    name="sortOrder"
                    label="Display order"
                    type="number"
                    defaultValue={items.length + 1}
                    describedBy={statusId}
                    invalid={hasError}
                  />
                </div>
                <AdminStatus id={statusId} state={state} />
                <AdminSubmitButton
                  id="admin-worked-with-create-submit"
                  label="Add company"
                  pendingLabel="Adding…"
                  isPending={isPending}
                />
              </>
            )}
          </AdminActionForm>
        </AdminModal>
      ) : null}
    </main>
  );
}
