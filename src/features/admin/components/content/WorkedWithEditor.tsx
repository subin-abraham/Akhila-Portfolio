'use client';

import {
  AdminActionForm,
  AdminField,
  AdminFormCard,
  AdminPageHeader,
  AdminStatus,
  AdminSubmitButton,
} from '@/features/admin/components/AdminFormPrimitives';
import { updateWorkedWith } from '@/features/admin/lib/content-actions';
import type { WorkedWithEditorProps } from '@/types/components/admin-content';

export function WorkedWithEditor({ items }: WorkedWithEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Worked with"
        description="Edit company names, logo image paths, and display order."
      />

      <div className="grid w-full gap-6">
        {items.map((item) => {
          const formId = `admin-worked-${item.id}`;

          return (
            <AdminFormCard key={item.id} title={item.name}>
              <AdminActionForm formId={formId} action={updateWorkedWith} className="space-y-4">
                {({ state, isPending, statusId, hasError }) => (
                  <>
                    <input type="hidden" name="id" value={item.id} />
                    <div className="grid gap-4 sm:grid-cols-3">
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
                        id={`${formId}-logo`}
                        name="logoUrl"
                        label="Logo image path"
                        defaultValue={item.logoUrl}
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
            </AdminFormCard>
          );
        })}
      </div>
    </main>
  );
}
