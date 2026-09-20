'use client';

import {
  AdminActionForm,
  AdminField,
  AdminFormCard,
  AdminPageHeader,
  AdminStatus,
  AdminSubmitButton,
} from '@/features/admin/components/AdminFormPrimitives';
import { updateNavLink } from '@/features/admin/lib/content-actions';
import type { NavLinksEditorProps } from '@/types/components/admin-content';

export function NavLinksEditor({ items }: NavLinksEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Layout"
        title="Navigation links"
        description="Edit menu link text, destinations, and display order."
      />

      <div className="grid w-full gap-6">
        {items.map((item) => {
          const formId = `admin-nav-${item.id}`;

          return (
            <AdminFormCard key={item.id} title={item.label}>
              <AdminActionForm formId={formId} action={updateNavLink} className="space-y-4">
                {({ state, isPending, statusId, hasError }) => (
                  <>
                    <input type="hidden" name="id" value={item.id} />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <AdminField
                        id={`${formId}-label`}
                        name="label"
                        label="Link text"
                        defaultValue={item.label}
                        required
                        describedBy={statusId}
                        invalid={hasError}
                      />
                      <AdminField
                        id={`${formId}-href`}
                        name="href"
                        label="Link URL"
                        defaultValue={item.href}
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
