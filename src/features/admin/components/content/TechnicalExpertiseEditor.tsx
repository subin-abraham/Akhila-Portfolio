'use client';

import { useState } from 'react';

import { AdminCategoryGroupedTable } from '@/features/admin/components/AdminCategoryGroupedTable';
import {
  AdminActionForm,
  AdminField,
  AdminPageHeader,
  AdminStatus,
  AdminSubmitButton,
} from '@/features/admin/components/AdminFormPrimitives';
import { AdminModal } from '@/features/admin/components/AdminModal';
import {
  createTechnicalExpertise,
  deleteTechnicalExpertise,
  updateTechnicalExpertise,
} from '@/features/admin/lib/content-actions';
import type {
  AdminTechnicalExpertiseItem,
  TechnicalExpertiseEditorProps,
} from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const COLUMNS: AdminTableColumn<AdminTechnicalExpertiseItem>[] = [
  {
    id: 'skill',
    header: 'Skill',
    cell: (row) => row.skill,
  },
  {
    id: 'proficiency',
    header: 'Level',
    cell: (row) => String(row.proficiency),
    hideBelow: 'md',
    widthClassName: 'w-24',
    headerClassName: 'text-right',
    cellClassName: 'text-right tabular-nums',
  },
];

export function TechnicalExpertiseEditor({ items }: TechnicalExpertiseEditorProps) {
  const [createCategory, setCreateCategory] = useState<string | null | undefined>(
    undefined,
  );

  const isCreateOpen = createCategory !== undefined;
  const isNewCategory = createCategory === null;

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Technical expertise"
        description="Edit skill categories, names, and skill level (0–100)."
      />

      <AdminCategoryGroupedTable
        caption="Technical expertise skills"
        rows={items}
        columns={COLUMNS}
        getRowLabel={(row) => row.skill}
        getDetailFields={(row) => [
          { label: 'Skill', value: row.skill },
          { label: 'Category', value: row.category },
          { label: 'Skill level', value: String(row.proficiency) },
          { label: 'Display order', value: String(row.sortOrder) },
        ]}
        deleteAction={deleteTechnicalExpertise}
        getDeleteConfirmMessage={(row) => `Delete skill "${row.skill}"?`}
        onAddToCategory={setCreateCategory}
        addToCategoryLabel="Add"
        newCategoryTitle="Add new category"
        newCategoryDescription="Create a skill category and add the first item."
        emptyTitle="No skills yet"
        emptyDescription="Use Add new category to create a skill for the homepage."
        renderEditForm={({ row, formId, onSuccess }) => (
          <AdminActionForm
            formId={formId}
            action={updateTechnicalExpertise}
            onSuccess={onSuccess}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={row.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id={`${formId}-category`}
                    name="category"
                    label="Category"
                    defaultValue={row.category}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id={`${formId}-skill`}
                    name="skill"
                    label="Skill"
                    defaultValue={row.skill}
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
                    defaultValue={row.proficiency}
                    required
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
          title={isNewCategory ? 'Add category & skill' : `Add skill to ${createCategory}`}
          description={
            isNewCategory
              ? 'Create a new skill category and add the first item.'
              : 'Add a skill name and level to this category.'
          }
          onClose={() => setCreateCategory(undefined)}
          size="lg"
        >
          <AdminActionForm
            formId="admin-expertise-create"
            action={createTechnicalExpertise}
            onSuccess={() => setCreateCategory(undefined)}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {isNewCategory ? (
                    <AdminField
                      id="admin-expertise-create-category"
                      name="category"
                      label="Category"
                      required
                      describedBy={statusId}
                      invalid={hasError}
                    />
                  ) : (
                    <input type="hidden" name="category" value={createCategory ?? ''} />
                  )}
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
                  label={isNewCategory ? 'Add category' : 'Add skill'}
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
