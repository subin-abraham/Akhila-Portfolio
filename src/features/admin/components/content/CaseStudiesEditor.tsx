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
import { EmptyState } from '@/components/EmptyState';
import {
  createCaseStudy,
  deleteCaseStudy,
  updateCaseStudy,
} from '@/features/admin/lib/content-actions';
import type { CaseStudiesEditorProps } from '@/types/components/admin-content';

export function CaseStudiesEditor({ items }: CaseStudiesEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Case studies"
        description="Create and edit project deep-dives for the /case-studies page. Distinct from Blog articles. Section headers are under Sections."
      />

      <div className="grid w-full gap-6">
        {items.length === 0 ? (
          <EmptyState
            title="No case studies yet"
            description="Add a project deep-dive below. It will appear on the public case studies page."
          />
        ) : null}

        {items.map((item) => {
          const formId = `admin-case-study-${item.id}`;

          return (
            <AdminFormCard key={item.id} title={item.title}>
              <div className="space-y-4">
                <AdminActionForm formId={formId} action={updateCaseStudy} className="space-y-4">
                  {({ state, isPending, statusId, hasError }) => (
                    <>
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AdminField
                          id={`${formId}-title`}
                          name="title"
                          label="Title"
                          defaultValue={item.title}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-client`}
                          name="client"
                          label="Client"
                          defaultValue={item.client ?? ''}
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
                        id={`${formId}-summary`}
                        name="summary"
                        label="Summary"
                        defaultValue={item.summary}
                        required
                        rows={3}
                        describedBy={statusId}
                        invalid={hasError}
                      />
                      <AdminTextareaField
                        id={`${formId}-description`}
                        name="description"
                        label="Description"
                        defaultValue={item.description}
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
                <DeleteItemForm
                  formId={`${formId}-delete`}
                  itemId={item.id}
                  action={deleteCaseStudy}
                  confirmMessage={`Delete "${item.title}"?`}
                />
              </div>
            </AdminFormCard>
          );
        })}

        <AdminFormCard title="Add case study">
          <AdminActionForm
            formId="admin-case-study-create"
            action={createCaseStudy}
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
        </AdminFormCard>
      </div>
    </main>
  );
}
