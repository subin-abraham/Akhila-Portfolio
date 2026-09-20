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
import { updateFooter, updateFooterLink } from '@/features/admin/lib/content-actions';
import type { FooterEditorProps } from '@/types/components/admin-content';

export function FooterEditor({ content, links }: FooterEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Layout"
        title="Footer"
        description="Edit footer brand copy and link labels."
      />

      <div className="grid w-full gap-6">
        <AdminFormCard title="Footer brand">
          <AdminActionForm formId="admin-footer" action={updateFooter} className="space-y-4">
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={content.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id="admin-footer-brand"
                    name="brandName"
                    label="Brand name"
                    defaultValue={content.brandName}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-footer-status"
                    name="statusLabel"
                    label="Availability"
                    defaultValue={content.statusLabel}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-footer-cta-label"
                    name="ctaLabel"
                    label="Button text"
                    defaultValue={content.ctaLabel}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-footer-cta-href"
                    name="ctaHref"
                    label="Button link"
                    defaultValue={content.ctaHref}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-footer-copyright"
                    name="copyrightName"
                    label="Copyright name"
                    defaultValue={content.copyrightName}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                </div>
                <AdminTextareaField
                  id="admin-footer-tagline"
                  name="tagline"
                  label="Tagline"
                  defaultValue={content.tagline}
                  required
                  rows={3}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminStatus id={statusId} state={state} />
                <AdminSubmitButton
                  id="admin-footer-submit"
                  label="Save footer"
                  pendingLabel="Saving…"
                  isPending={isPending}
                />
              </>
            )}
          </AdminActionForm>
        </AdminFormCard>

        {links.map((item) => {
          const formId = `admin-footer-link-${item.id}`;

          return (
            <AdminFormCard
              key={item.id}
              title={`${item.columnTitle} · ${item.label}`}
              description={`Group: ${item.columnKey}`}
            >
              <AdminActionForm formId={formId} action={updateFooterLink} className="space-y-4">
                {({ state, isPending, statusId, hasError }) => (
                  <>
                    <input type="hidden" name="id" value={item.id} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AdminField
                        id={`${formId}-column-key`}
                        name="columnKey"
                        label="Column group"
                        defaultValue={item.columnKey}
                        required
                        describedBy={statusId}
                        invalid={hasError}
                      />
                      <AdminField
                        id={`${formId}-column-title`}
                        name="columnTitle"
                        label="Column heading"
                        defaultValue={item.columnTitle}
                        required
                        describedBy={statusId}
                        invalid={hasError}
                      />
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
                        label="Link order"
                        type="number"
                        defaultValue={item.sortOrder}
                        required
                        describedBy={statusId}
                        invalid={hasError}
                      />
                      <AdminField
                        id={`${formId}-column-sort`}
                        name="columnSortOrder"
                        label="Column order"
                        type="number"
                        defaultValue={item.columnSortOrder}
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
