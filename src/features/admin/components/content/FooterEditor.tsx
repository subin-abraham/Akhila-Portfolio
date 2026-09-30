'use client';

import { useState } from 'react';

import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import {
  AdminActionForm,
  AdminField,
  AdminFormCard,
  AdminHeaderAddButton,
  AdminPageHeader,
  AdminStatus,
  AdminSubmitButton,
  AdminTextareaField,
} from '@/features/admin/components/AdminFormPrimitives';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { AdminPlatformLookup } from '@/features/admin/components/AdminPlatformLookup';
import {
  createSocialLink,
  deleteSocialLink,
  updateFooter,
  updateSocialLink,
} from '@/features/admin/lib/content-actions';
import { SocialPlatformIcon } from '@/features/home/components/SocialIcons';
import {
  getSocialPlatformLabel,
  SOCIAL_PLATFORM_OPTIONS,
} from '@/features/home/lib/social-platforms';
import type {
  AdminSocialLinkItem,
  FooterEditorProps,
} from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const PLATFORM_LOOKUP_OPTIONS = SOCIAL_PLATFORM_OPTIONS.map((option) => ({
  value: option.id,
  label: option.label,
}));

const SOCIAL_COLUMNS: AdminTableColumn<AdminSocialLinkItem>[] = [
  {
    id: 'platform',
    header: 'Platform',
    cell: (row) => (
      <span className="inline-flex items-center gap-2.5">
        <span className="inline-flex size-5 text-home-muted" aria-hidden="true">
          <SocialPlatformIcon platform={row.platform} />
        </span>
        <span>{getSocialPlatformLabel(row.platform)}</span>
      </span>
    ),
  },
  { id: 'href', header: 'URL', cell: (row) => row.href, hideBelow: 'sm' },
  {
    id: 'sortOrder',
    header: 'Order',
    cell: (row) => String(row.sortOrder),
    hideBelow: 'md',
  },
];

export function FooterEditor({ content, socialLinks }: FooterEditorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Layout"
        title="Footer"
        description="Edit footer brand copy, CTA, and social icons."
      />

      <div className="grid w-full gap-6">
        <AdminFormCard title="Footer brand">
          <AdminActionForm formId="admin-footer" action={updateFooter} className="space-y-4">
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={content.id} />
                <input type="hidden" name="ctaHref" value={content.ctaHref} />
                <input type="hidden" name="statusLabel" value={content.statusLabel} />
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
                    id="admin-footer-cta-label"
                    name="ctaLabel"
                    label="Button text"
                    defaultValue={content.ctaLabel}
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

        <section aria-labelledby="admin-footer-social-heading" className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2
                id="admin-footer-social-heading"
                className="font-display text-xl font-semibold text-white"
              >
                Social icons
              </h2>
              <p className="mt-1 text-sm text-home-muted">
                Icons use the site theme colors. Pick a platform from the list to add more.
              </p>
            </div>
            <AdminHeaderAddButton
              id="admin-footer-social-add"
              label="Add"
              onClick={() => setIsCreateOpen(true)}
            />
          </div>

          <AdminDataTable
            caption="Footer social icons"
            rows={socialLinks}
            columns={SOCIAL_COLUMNS}
            getRowLabel={(row) => getSocialPlatformLabel(row.platform)}
            getDetailFields={(row) => [
              { label: 'Platform', value: getSocialPlatformLabel(row.platform) },
              { label: 'Profile URL', value: row.href },
              { label: 'Display order', value: String(row.sortOrder) },
            ]}
            deleteAction={deleteSocialLink}
            getDeleteConfirmMessage={(row) =>
              `Remove the ${getSocialPlatformLabel(row.platform)} link?`
            }
            emptyTitle="No social icons yet"
            emptyDescription="Use Add to choose a platform and paste the profile URL."
            renderEditForm={({ row, formId, onSuccess }) => (
              <AdminActionForm
                formId={formId}
                action={updateSocialLink}
                onSuccess={onSuccess}
                className="space-y-4"
              >
                {({ state, isPending, statusId, hasError }) => (
                  <>
                    <input type="hidden" name="id" value={row.id} />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <AdminPlatformLookup
                        id={`${formId}-platform`}
                        name="platform"
                        label="Platform"
                        defaultValue={row.platform}
                        options={PLATFORM_LOOKUP_OPTIONS}
                        required
                        describedBy={statusId}
                        invalid={hasError}
                      />
                      <AdminField
                        id={`${formId}-href`}
                        name="href"
                        label="Profile URL"
                        defaultValue={row.href}
                        required
                        placeholder="https://"
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
        </section>
      </div>

      {isCreateOpen ? (
        <AdminModal
          title="Add social icon"
          description="Search for a platform and paste the profile URL."
          onClose={() => setIsCreateOpen(false)}
          size="lg"
        >
          <AdminActionForm
            formId="admin-footer-social-create"
            action={createSocialLink}
            onSuccess={() => setIsCreateOpen(false)}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <AdminPlatformLookup
                    id="admin-footer-social-create-platform"
                    name="platform"
                    label="Platform"
                    defaultValue="linkedin"
                    options={PLATFORM_LOOKUP_OPTIONS}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-footer-social-create-href"
                    name="href"
                    label="Profile URL"
                    required
                    placeholder="https://"
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-footer-social-create-sort"
                    name="sortOrder"
                    label="Display order"
                    type="number"
                    defaultValue={socialLinks.length + 1}
                    describedBy={statusId}
                    invalid={hasError}
                  />
                </div>
                <AdminStatus id={statusId} state={state} />
                <AdminSubmitButton
                  id="admin-footer-social-create-submit"
                  label="Add icon"
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
