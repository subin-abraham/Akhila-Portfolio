'use client';

import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import {
  AdminActionForm,
  AdminField,
  AdminPageHeader,
  AdminStatus,
  AdminSubmitButton,
} from '@/features/admin/components/AdminFormPrimitives';
import { updateNavLink } from '@/features/admin/lib/content-actions';
import type { AdminNavLinkItem, NavLinksEditorProps } from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const COLUMNS: AdminTableColumn<AdminNavLinkItem>[] = [
  { id: 'label', header: 'Label', cell: (row) => row.label },
  { id: 'href', header: 'URL', cell: (row) => row.href, hideBelow: 'sm' },
  {
    id: 'sortOrder',
    header: 'Order',
    cell: (row) => String(row.sortOrder),
    hideBelow: 'md',
  },
];

export function NavLinksEditor({ items }: NavLinksEditorProps) {
  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Layout"
        title="Navigation links"
        description="Edit menu link text, destinations, and display order."
      />

      <AdminDataTable
        caption="Navigation links"
        rows={items}
        columns={COLUMNS}
        getRowLabel={(row) => row.label}
        getDetailFields={(row) => [
          { label: 'Link text', value: row.label },
          { label: 'Link URL', value: row.href },
          { label: 'Display order', value: String(row.sortOrder) },
        ]}
        emptyTitle="No navigation links"
        emptyDescription="Navigation links will appear here once configured."
        renderEditForm={({ row, formId, onSuccess }) => (
          <AdminActionForm
            formId={formId}
            action={updateNavLink}
            onSuccess={onSuccess}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={row.id} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <AdminField
                    id={`${formId}-label`}
                    name="label"
                    label="Link text"
                    defaultValue={row.label}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id={`${formId}-href`}
                    name="href"
                    label="Link URL"
                    defaultValue={row.href}
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
    </main>
  );
}
