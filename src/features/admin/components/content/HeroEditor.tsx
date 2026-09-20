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
import { updateHomepage } from '@/features/admin/lib/content-actions';
import type { HeroEditorProps } from '@/types/components/admin-content';

export function HeroEditor({ homepage }: HeroEditorProps) {
  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Hero"
        description="Edit the homepage hero name, intro, and primary call to action."
      />

      <div className="w-full">
        <AdminFormCard title="Hero content">
          <AdminActionForm formId="admin-hero" action={updateHomepage} className="space-y-4">
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={homepage.id} />
                <AdminField
                  id="admin-hero-full-name"
                  name="fullName"
                  label="Full name"
                  defaultValue={homepage.fullName}
                  required
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminTextareaField
                  id="admin-hero-intro"
                  name="intro"
                  label="Intro"
                  defaultValue={homepage.intro}
                  required
                  rows={5}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id="admin-hero-cta-label"
                    name="ctaLabel"
                    label="Button text"
                    defaultValue={homepage.ctaLabel}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-hero-cta-href"
                    name="ctaHref"
                    label="Button link"
                    defaultValue={homepage.ctaHref}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                </div>
                <AdminStatus id={statusId} state={state} />
                <AdminSubmitButton
                  id="admin-hero-submit"
                  label="Save hero"
                  pendingLabel="Saving…"
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
