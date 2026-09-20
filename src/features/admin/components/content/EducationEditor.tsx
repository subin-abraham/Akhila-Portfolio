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
  createEducation,
  deleteEducation,
  updateEducation,
} from '@/features/admin/lib/content-actions';
import type { AdminEducationItem, EducationEditorProps } from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const COLUMNS: AdminTableColumn<AdminEducationItem>[] = [
  { id: 'degree', header: 'Degree', cell: (row) => row.degree },
  {
    id: 'institution',
    header: 'Institution',
    cell: (row) => row.institution,
    hideBelow: 'sm',
  },
  { id: 'period', header: 'Period', cell: (row) => row.period, hideBelow: 'md' },
];

export function EducationEditor({ items }: EducationEditorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Education"
        description="Edit degrees, institutions, grades, and descriptions."
        action={
          <AdminHeaderAddButton
            id="admin-education-add"
            label="Add"
            onClick={() => setIsCreateOpen(true)}
          />
        }
      />

      <AdminDataTable
        caption="Education entries"
        rows={items}
        columns={COLUMNS}
        getRowLabel={(row) => row.degree}
        getDetailFields={(row) => [
          { label: 'Degree', value: row.degree },
          { label: 'Institution', value: row.institution },
          { label: 'Location', value: row.location },
          { label: 'Time period', value: row.period },
          { label: 'Grade', value: row.grade },
          { label: 'Description', value: row.description },
          { label: 'Display order', value: String(row.sortOrder) },
        ]}
        deleteAction={deleteEducation}
        getDeleteConfirmMessage={(row) => `Delete "${row.degree}"?`}
        emptyTitle="No education entries yet"
        emptyDescription="Use Add to create an education entry."
        renderEditForm={({ row, formId, onSuccess }) => (
          <AdminActionForm
            formId={formId}
            action={updateEducation}
            onSuccess={onSuccess}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={row.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id={`${formId}-degree`}
                    name="degree"
                    label="Degree"
                    defaultValue={row.degree}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id={`${formId}-institution`}
                    name="institution"
                    label="Institution"
                    defaultValue={row.institution}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id={`${formId}-location`}
                    name="location"
                    label="Location"
                    defaultValue={row.location ?? ''}
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
                    id={`${formId}-grade`}
                    name="grade"
                    label="Grade"
                    defaultValue={row.grade ?? ''}
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
                  id={`${formId}-description`}
                  name="description"
                  label="Description"
                  defaultValue={row.description}
                  required
                  rows={4}
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
          title="Add education entry"
          description="Add a degree, institution, and description."
          onClose={() => setIsCreateOpen(false)}
          size="xl"
        >
          <AdminActionForm
            formId="admin-education-create"
            action={createEducation}
            onSuccess={() => setIsCreateOpen(false)}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id="admin-education-create-degree"
                    name="degree"
                    label="Degree"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-education-create-institution"
                    name="institution"
                    label="Institution"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-education-create-location"
                    name="location"
                    label="Location"
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-education-create-period"
                    name="period"
                    label="Time period"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-education-create-grade"
                    name="grade"
                    label="Grade"
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-education-create-sort"
                    name="sortOrder"
                    label="Display order"
                    type="number"
                    defaultValue={items.length + 1}
                    describedBy={statusId}
                    invalid={hasError}
                  />
                </div>
                <AdminTextareaField
                  id="admin-education-create-description"
                  name="description"
                  label="Description"
                  required
                  rows={4}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminStatus id={statusId} state={state} />
                <AdminSubmitButton
                  id="admin-education-create-submit"
                  label="Add entry"
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
