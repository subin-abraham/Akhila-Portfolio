'use client';

import {
  AdminActionForm,
  AdminField,
  AdminFormCard,
  AdminPageHeader,
  AdminSelectField,
  AdminStatus,
  AdminSubmitButton,
  AdminTextareaField,
} from '@/features/admin/components/AdminFormPrimitives';
import { updateHomepageSection } from '@/features/admin/lib/content-actions';
import type { SectionsEditorProps } from '@/types/components/admin-content';

const HIGHLIGHT_OPTIONS = [
  { value: 'title', label: 'Main title' },
  { value: 'accent', label: 'Highlighted title' },
];

export function SectionsEditor({ sections }: SectionsEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Section headers"
        description="Edit the small label, titles, description, and which title gets highlighted."
      />

      <div className="grid w-full gap-6">
        {sections.map((section) => {
          const formId = `admin-section-${section.sectionKey}`;

          return (
            <AdminFormCard
              key={section.id}
              title={section.sectionKey.replaceAll('_', ' ')}
              description={`Section: ${section.sectionKey.replaceAll('_', ' ')}`}
            >
              <AdminActionForm
                formId={formId}
                action={updateHomepageSection}
                className="space-y-4"
              >
                {({ state, isPending, statusId, hasError }) => (
                  <>
                    <input type="hidden" name="id" value={section.id} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AdminField
                        id={`${formId}-eyebrow`}
                        name="eyebrow"
                        label="Section label"
                        defaultValue={section.eyebrow}
                        required
                        describedBy={statusId}
                        invalid={hasError}
                      />
                      <AdminSelectField
                        id={`${formId}-highlight`}
                        name="highlightTarget"
                        label="Highlight on"
                        defaultValue={section.highlightTarget}
                        options={HIGHLIGHT_OPTIONS}
                        required
                        describedBy={statusId}
                        invalid={hasError}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AdminField
                        id={`${formId}-title`}
                        name="title"
                        label="Title"
                        defaultValue={section.title}
                        required
                        describedBy={statusId}
                        invalid={hasError}
                      />
                      <AdminField
                        id={`${formId}-accent-title`}
                        name="accentTitle"
                        label="Highlighted title"
                        defaultValue={section.accentTitle ?? ''}
                        describedBy={statusId}
                        invalid={hasError}
                      />
                    </div>
                    <AdminTextareaField
                      id={`${formId}-description`}
                      name="description"
                      label="Description"
                      defaultValue={section.description}
                      required
                      rows={3}
                      describedBy={statusId}
                      invalid={hasError}
                    />
                    <AdminStatus id={statusId} state={state} />
                    <AdminSubmitButton
                      id={`${formId}-submit`}
                      label="Save section"
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
