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
  createProfessionalJourney,
  deleteProfessionalJourney,
  updateProfessionalJourney,
} from '@/features/admin/lib/content-actions';
import type {
  AdminProfessionalJourneyItem,
  ProfessionalJourneyEditorProps,
} from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const COLUMNS: AdminTableColumn<AdminProfessionalJourneyItem>[] = [
  { id: 'role', header: 'Role', cell: (row) => row.role },
  {
    id: 'organization',
    header: 'Organization',
    cell: (row) => row.organization,
    hideBelow: 'sm',
  },
  { id: 'period', header: 'Period', cell: (row) => row.period, hideBelow: 'md' },
];

export function ProfessionalJourneyEditor({ items }: ProfessionalJourneyEditorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Professional journey"
        description="Edit roles, organizations, periods, and descriptions."
        action={
          <AdminHeaderAddButton
            id="admin-journey-add"
            label="Add"
            onClick={() => setIsCreateOpen(true)}
          />
        }
      />

      <AdminDataTable
        caption="Professional journey entries"
        rows={items}
        columns={COLUMNS}
        getRowLabel={(row) => row.role}
        getDetailFields={(row) => [
          { label: 'Role', value: row.role },
          { label: 'Organization', value: row.organization },
          { label: 'Location', value: row.location },
          { label: 'Time period', value: row.period },
          { label: 'Description', value: row.description },
          { label: 'Display order', value: String(row.sortOrder) },
        ]}
        deleteAction={deleteProfessionalJourney}
        getDeleteConfirmMessage={(row) => `Delete "${row.role}"?`}
        emptyTitle="No journey entries yet"
        emptyDescription="Use Add to create a role."
        renderEditForm={({ row, formId, onSuccess }) => (
          <AdminActionForm
            formId={formId}
            action={updateProfessionalJourney}
            onSuccess={onSuccess}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={row.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id={`${formId}-role`}
                    name="role"
                    label="Role"
                    defaultValue={row.role}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id={`${formId}-organization`}
                    name="organization"
                    label="Organization"
                    defaultValue={row.organization}
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
          title="Add journey entry"
          description="Add a role, organization, and description."
          onClose={() => setIsCreateOpen(false)}
          size="xl"
        >
          <AdminActionForm
            formId="admin-journey-create"
            action={createProfessionalJourney}
            onSuccess={() => setIsCreateOpen(false)}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id="admin-journey-create-role"
                    name="role"
                    label="Role"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-journey-create-organization"
                    name="organization"
                    label="Organization"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-journey-create-location"
                    name="location"
                    label="Location"
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-journey-create-period"
                    name="period"
                    label="Time period"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-journey-create-sort"
                    name="sortOrder"
                    label="Display order"
                    type="number"
                    defaultValue={items.length + 1}
                    describedBy={statusId}
                    invalid={hasError}
                  />
                </div>
                <AdminTextareaField
                  id="admin-journey-create-description"
                  name="description"
                  label="Description"
                  required
                  rows={4}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminStatus id={statusId} state={state} />
                <AdminSubmitButton
                  id="admin-journey-create-submit"
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
