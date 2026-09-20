'use client';

import {
  AdminActionForm,
  AdminField,
  AdminFormCard,
  AdminPageHeader,
  AdminStatus,
  AdminSubmitButton,
  AdminTextareaField,
} from '@/features/admin/components/AdminFormPrimitives';
import { DeleteItemForm } from '@/features/admin/components/DeleteItemForm';
import {
  createProfessionalJourney,
  deleteProfessionalJourney,
  updateProfessionalJourney,
} from '@/features/admin/lib/content-actions';
import type { ProfessionalJourneyEditorProps } from '@/types/components/admin-content';

export function ProfessionalJourneyEditor({ items }: ProfessionalJourneyEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Professional journey"
        description="Edit roles, organizations, periods, and descriptions. Section headers are under Sections."
      />

      <div className="grid w-full gap-6">
        {items.map((item) => {
          const formId = `admin-journey-${item.id}`;

          return (
            <AdminFormCard key={item.id} title={item.role}>
              <div className="space-y-4">
                <AdminActionForm
                  formId={formId}
                  action={updateProfessionalJourney}
                  className="space-y-4"
                >
                  {({ state, isPending, statusId, hasError }) => (
                    <>
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AdminField
                          id={`${formId}-role`}
                          name="role"
                          label="Role"
                          defaultValue={item.role}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-organization`}
                          name="organization"
                          label="Organization"
                          defaultValue={item.organization}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-location`}
                          name="location"
                          label="Location"
                          defaultValue={item.location ?? ''}
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-period`}
                          name="period"
                          label="Time period"
                          defaultValue={item.period}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-sort`}
                          name="sortOrder"
                          label="Display order"
                          type="number"
                          defaultValue={item.sortOrder}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                      </div>
                      <AdminTextareaField
                        id={`${formId}-description`}
                        name="description"
                        label="Description"
                        defaultValue={item.description}
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
                <DeleteItemForm
                  formId={`${formId}-delete`}
                  itemId={item.id}
                  action={deleteProfessionalJourney}
                  confirmMessage={`Delete "${item.role}"?`}
                />
              </div>
            </AdminFormCard>
          );
        })}

        <AdminFormCard title="Add journey entry">
          <AdminActionForm
            formId="admin-journey-create"
            action={createProfessionalJourney}
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
        </AdminFormCard>
      </div>
    </main>
  );
}
