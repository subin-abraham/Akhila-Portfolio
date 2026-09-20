'use client';

import {
  AdminActionForm,
  AdminField,
  AdminFormCard,
  AdminPageHeader,
  AdminStatus,
  AdminSubmitButton,
} from '@/features/admin/components/AdminFormPrimitives';
import { DeleteItemForm } from '@/features/admin/components/DeleteItemForm';
import {
  createToolsAndTechnology,
  deleteToolsAndTechnology,
  updateToolsAndTechnology,
} from '@/features/admin/lib/content-actions';
import type { ToolsEditorProps } from '@/types/components/admin-content';

export function ToolsEditor({ items }: ToolsEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Tools & technology"
        description="Edit toolkit categories and item names. Section headers are under Sections."
      />

      <div className="grid w-full gap-6">
        {items.map((item) => {
          const formId = `admin-tools-${item.id}`;

          return (
            <AdminFormCard key={item.id} title={`${item.name} · ${item.category}`}>
              <div className="space-y-4">
                <AdminActionForm
                  formId={formId}
                  action={updateToolsAndTechnology}
                  className="space-y-4"
                >
                  {({ state, isPending, statusId, hasError }) => (
                    <>
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-4 sm:grid-cols-3">
                        <AdminField
                          id={`${formId}-category`}
                          name="category"
                          label="Category"
                          defaultValue={item.category}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-name`}
                          name="name"
                          label="Name"
                          defaultValue={item.name}
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
                  action={deleteToolsAndTechnology}
                  confirmMessage={`Delete tool "${item.name}"?`}
                />
              </div>
            </AdminFormCard>
          );
        })}

        <AdminFormCard title="Add tool">
          <AdminActionForm
            formId="admin-tools-create"
            action={createToolsAndTechnology}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <AdminField
                    id="admin-tools-create-category"
                    name="category"
                    label="Category"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-tools-create-name"
                    name="name"
                    label="Name"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-tools-create-sort"
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
                  id="admin-tools-create-submit"
                  label="Add tool"
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
