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
  createTechnicalExpertise,
  deleteTechnicalExpertise,
  updateTechnicalExpertise,
} from '@/features/admin/lib/content-actions';
import type { TechnicalExpertiseEditorProps } from '@/types/components/admin-content';

export function TechnicalExpertiseEditor({ items }: TechnicalExpertiseEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Technical expertise"
        description="Edit skill categories, names, and skill level (0–100). Section headers are under Sections."
      />

      <div className="grid w-full gap-6">
        {items.map((item) => {
          const formId = `admin-expertise-${item.id}`;

          return (
            <AdminFormCard key={item.id} title={`${item.skill} · ${item.category}`}>
              <div className="space-y-4">
                <AdminActionForm
                  formId={formId}
                  action={updateTechnicalExpertise}
                  className="space-y-4"
                >
                  {({ state, isPending, statusId, hasError }) => (
                    <>
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-4 sm:grid-cols-2">
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
                          id={`${formId}-skill`}
                          name="skill"
                          label="Skill"
                          defaultValue={item.skill}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-proficiency`}
                          name="proficiency"
                          label="Skill level (0–100)"
                          type="number"
                          min={0}
                          max={100}
                          defaultValue={item.proficiency}
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
                  action={deleteTechnicalExpertise}
                  confirmMessage={`Delete skill "${item.skill}"?`}
                />
              </div>
            </AdminFormCard>
          );
        })}

        <AdminFormCard title="Add skill">
          <AdminActionForm
            formId="admin-expertise-create"
            action={createTechnicalExpertise}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id="admin-expertise-create-category"
                    name="category"
                    label="Category"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-expertise-create-skill"
                    name="skill"
                    label="Skill"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-expertise-create-proficiency"
                    name="proficiency"
                    label="Skill level (0–100)"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={80}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-expertise-create-sort"
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
                  id="admin-expertise-create-submit"
                  label="Add skill"
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
