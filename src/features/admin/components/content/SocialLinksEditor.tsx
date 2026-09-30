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
} from '@/features/admin/components/AdminFormPrimitives';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { AdminPlatformLookup } from '@/features/admin/components/AdminPlatformLookup';
import {
  createSocialLink,
  deleteSocialLink,
  updateSocialLink,
} from '@/features/admin/lib/content-actions';
import {
  getSocialPlatformLabel,
  SOCIAL_PLATFORM_OPTIONS,
} from '@/features/home/lib/social-platforms';
import { SocialPlatformIcon } from '@/features/home/components/SocialIcons';
import type {
  AdminSocialLinkItem,
  SocialLinksEditorProps,
} from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const PLATFORM_LOOKUP_OPTIONS = SOCIAL_PLATFORM_OPTIONS.map((option) => ({
  value: option.id,
  label: option.label,
}));

const COLUMNS: AdminTableColumn<AdminSocialLinkItem>[] = [
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

export function SocialLinksEditor({ items }: SocialLinksEditorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Layout"
        title="Social links"
        description="Add or edit social profiles shown in the header and footer."
        action={
          <AdminHeaderAddButton
            id="admin-social-add"
            label="Add"
            onClick={() => setIsCreateOpen(true)}
          />
        }
      />

      <AdminDataTable
        caption="Social profile links"
        rows={items}
        columns={COLUMNS}
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
        emptyTitle="No social links yet"
        emptyDescription="Use Add to create a social profile."
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

      {isCreateOpen ? (
        <AdminModal
          title="Add social link"
          description="Search for a platform and paste the profile URL."
          onClose={() => setIsCreateOpen(false)}
          size="lg"
        >
          <AdminActionForm
            formId="admin-social-create"
            action={createSocialLink}
            onSuccess={() => setIsCreateOpen(false)}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <AdminPlatformLookup
                    id="admin-social-create-platform"
                    name="platform"
                    label="Platform"
                    defaultValue="linkedin"
                    options={PLATFORM_LOOKUP_OPTIONS}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-social-create-href"
                    name="href"
                    label="Profile URL"
                    required
                    placeholder="https://"
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-social-create-sort"
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
                  id="admin-social-create-submit"
                  label="Add link"
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
