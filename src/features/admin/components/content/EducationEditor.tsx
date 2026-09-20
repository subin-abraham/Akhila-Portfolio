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
  createEducation,
  deleteEducation,
  updateEducation,
} from '@/features/admin/lib/content-actions';
import type { EducationEditorProps } from '@/types/components/admin-content';

export function EducationEditor({ items }: EducationEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Education"
        description="Edit degrees, institutions, grades, and descriptions. Section headers are under Sections."
      />

      <div className="grid w-full gap-6">
        {items.map((item) => {
          const formId = `admin-education-${item.id}`;

          return (
            <AdminFormCard key={item.id} title={item.degree}>
              <div className="space-y-4">
                <AdminActionForm formId={formId} action={updateEducation} className="space-y-4">
                  {({ state, isPending, statusId, hasError }) => (
                    <>
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AdminField
                          id={`${formId}-degree`}
                          name="degree"
                          label="Degree"
                          defaultValue={item.degree}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-institution`}
                          name="institution"
                          label="Institution"
                          defaultValue={item.institution}
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
                          id={`${formId}-grade`}
                          name="grade"
                          label="Grade"
                          defaultValue={item.grade ?? ''}
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
                  action={deleteEducation}
                  confirmMessage={`Delete "${item.degree}"?`}
                />
              </div>
            </AdminFormCard>
          );
        })}

        <AdminFormCard title="Add education entry">
          <AdminActionForm
            formId="admin-education-create"
            action={createEducation}
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
        </AdminFormCard>
      </div>
    </main>
  );
}
