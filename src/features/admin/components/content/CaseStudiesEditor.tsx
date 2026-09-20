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
  AdminTextareaField,
} from '@/features/admin/components/AdminFormPrimitives';
import { AdminModal } from '@/features/admin/components/AdminModal';
import {
  createCaseStudy,
  deleteCaseStudy,
  updateCaseStudy,
} from '@/features/admin/lib/content-actions';
import type {
  AdminCaseStudyItem,
  CaseStudiesEditorProps,
} from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const COLUMNS: AdminTableColumn<AdminCaseStudyItem>[] = [
  { id: 'title', header: 'Title', cell: (row) => row.title },
  {
    id: 'client',
    header: 'Client',
    cell: (row) => row.client ?? '—',
    hideBelow: 'sm',
  },
  { id: 'period', header: 'Period', cell: (row) => row.period, hideBelow: 'md' },
];

export function CaseStudiesEditor({ items }: CaseStudiesEditorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Pages"
        title="Case studies"
        description="Create and edit project deep-dives for the /case-studies page. Distinct from Blog articles."
        action={
          <AdminHeaderAddButton
            id="admin-case-study-add"
            label="Add"
            onClick={() => setIsCreateOpen(true)}
          />
        }
      />

      <AdminDataTable
        caption="Case studies"
        rows={items}
        columns={COLUMNS}
        getRowLabel={(row) => row.title}
        getDetailFields={(row) => [
          { label: 'Title', value: row.title },
          { label: 'Client', value: row.client },
          { label: 'Time period', value: row.period },
          { label: 'Summary', value: row.summary },
          { label: 'Description', value: row.description },
          { label: 'Display order', value: String(row.sortOrder) },
        ]}
        deleteAction={deleteCaseStudy}
        getDeleteConfirmMessage={(row) => `Delete "${row.title}"?`}
        emptyTitle="No case studies yet"
        emptyDescription="Use Add to create a project deep-dive for the public case studies page."
        renderEditForm={({ row, formId, onSuccess }) => (
          <AdminActionForm
            formId={formId}
            action={updateCaseStudy}
            onSuccess={onSuccess}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={row.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id={`${formId}-title`}
                    name="title"
                    label="Title"
                    defaultValue={row.title}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id={`${formId}-client`}
                    name="client"
                    label="Client"
                    defaultValue={row.client ?? ''}
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id={`${formId}-period`}
                    name="period"
                    label="Time period"
                    defaultValue={row.period}
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
                <AdminTextareaField
                  id={`${formId}-summary`}
                  name="summary"
                  label="Summary"
                  defaultValue={row.summary}
                  required
                  rows={3}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminTextareaField
                  id={`${formId}-description`}
                  name="description"
                  label="Description"
                  defaultValue={row.description}
                  required
                  rows={5}
                  describedBy={statusId}
                  invalid={hasError}
                />
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
          title="Add case study"
          description="Create a project deep-dive for the public case studies page."
          onClose={() => setIsCreateOpen(false)}
          size="xl"
        >
          <AdminActionForm
            formId="admin-case-study-create"
            action={createCaseStudy}
            onSuccess={() => setIsCreateOpen(false)}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id="admin-case-study-create-title"
                    name="title"
                    label="Title"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-case-study-create-client"
                    name="client"
                    label="Client"
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-case-study-create-period"
                    name="period"
                    label="Time period"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-case-study-create-sort"
                    name="sortOrder"
                    label="Display order"
                    type="number"
                    defaultValue={items.length + 1}
                    describedBy={statusId}
                    invalid={hasError}
                  />
                </div>
                <AdminTextareaField
                  id="admin-case-study-create-summary"
                  name="summary"
                  label="Summary"
                  required
                  rows={3}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminTextareaField
                  id="admin-case-study-create-description"
                  name="description"
                  label="Description"
                  required
                  rows={5}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminStatus id={statusId} state={state} />
                <AdminSubmitButton
                  id="admin-case-study-create-submit"
                  label="Add case study"
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
