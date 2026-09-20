'use client';

import {
  AdminActionForm,
  AdminField,
  AdminFormCard,
  AdminPageHeader,
  AdminStatus,
  AdminSubmitButton,
} from '@/features/admin/components/AdminFormPrimitives';
import { AdminPlatformLookup } from '@/features/admin/components/AdminPlatformLookup';
import { DeleteItemForm } from '@/features/admin/components/DeleteItemForm';
import {
  createSocialLink,
  deleteSocialLink,
  updateSocialLink,
} from '@/features/admin/lib/content-actions';
import {
  getSocialPlatformLabel,
  SOCIAL_PLATFORM_OPTIONS,
} from '@/features/home/lib/social-platforms';
import type { SocialLinksEditorProps } from '@/types/components/admin-content';

const PLATFORM_LOOKUP_OPTIONS = SOCIAL_PLATFORM_OPTIONS.map((option) => ({
  value: option.id,
  label: option.label,
}));

export function SocialLinksEditor({ items }: SocialLinksEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Layout"
        title="Social links"
        description="Add or edit social profiles shown in the header and footer."
      />

      <div className="grid w-full gap-6">
        {items.map((item) => {
          const formId = `admin-social-${item.id}`;
          const platformLabel = getSocialPlatformLabel(item.platform);

          return (
            <AdminFormCard key={item.id} title={platformLabel}>
              <div className="space-y-4">
                <AdminActionForm formId={formId} action={updateSocialLink} className="space-y-4">
                  {({ state, isPending, statusId, hasError }) => (
                    <>
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-4 sm:grid-cols-3">
                        <AdminPlatformLookup
                          id={`${formId}-platform`}
                          name="platform"
                          label="Platform"
                          defaultValue={item.platform}
                          options={PLATFORM_LOOKUP_OPTIONS}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-href`}
                          name="href"
                          label="Profile URL"
                          defaultValue={item.href}
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
                  action={deleteSocialLink}
                  confirmMessage={`Remove the ${platformLabel} link?`}
                />
              </div>
            </AdminFormCard>
          );
        })}

        <AdminFormCard
          title="Add social link"
          description="Search for a platform and paste the profile URL."
        >
          <AdminActionForm
            formId="admin-social-create"
            action={createSocialLink}
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
        </AdminFormCard>
      </div>
    </main>
  );
}
