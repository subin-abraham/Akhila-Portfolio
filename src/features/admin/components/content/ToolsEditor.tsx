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
  createToolsAndTechnology,
  deleteToolsAndTechnology,
  updateToolsAndTechnology,
} from '@/features/admin/lib/content-actions';
import type { AdminToolsItem, ToolsEditorProps } from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const COLUMNS: AdminTableColumn<AdminToolsItem>[] = [
  {
    id: 'name',
    header: 'Name',
    cell: (row) => row.name,
  },
  {
    id: 'sortOrder',
    header: 'Order',
    cell: (row) => String(row.sortOrder),
    hideBelow: 'md',
    widthClassName: 'w-24',
    headerClassName: 'text-right',
    cellClassName: 'text-right tabular-nums',
  },
];

export function ToolsEditor({ items }: ToolsEditorProps) {
  const [createCategory, setCreateCategory] = useState<string | null | undefined>(
    undefined,
  );

  const isCreateOpen = createCategory !== undefined;
  const isNewCategory = createCategory === null;

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Tools & technology"
        description="Edit toolkit categories and item names."
      />

      <AdminCategoryGroupedTable
        caption="Tools and technology items"
        rows={items}
        columns={COLUMNS}
        getRowLabel={(row) => row.name}
        getDetailFields={(row) => [
          { label: 'Name', value: row.name },
          { label: 'Category', value: row.category },
          { label: 'Display order', value: String(row.sortOrder) },
        ]}
        deleteAction={deleteToolsAndTechnology}
        getDeleteConfirmMessage={(row) => `Delete tool "${row.name}"?`}
        onAddToCategory={setCreateCategory}
        addToCategoryLabel="Add"
        newCategoryTitle="Add new category"
        newCategoryDescription="Create a toolkit category and add the first item."
        emptyTitle="No tools yet"
        emptyDescription="Use Add new category to create a tool for the homepage."
        renderEditForm={({ row, formId, onSuccess }) => (
          <AdminActionForm
            formId={formId}
            action={updateToolsAndTechnology}
            onSuccess={onSuccess}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={row.id} />
                <div className="grid gap-4 sm:grid-cols-3">
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
                    id={`${formId}-name`}
                    name="name"
                    label="Name"
                    defaultValue={row.name}
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
          title={isNewCategory ? 'Add category & tool' : `Add tool to ${createCategory}`}
          description={
            isNewCategory
              ? 'Create a new toolkit category and add the first item.'
              : 'Add an item name to this category.'
          }
          onClose={() => setCreateCategory(undefined)}
          size="lg"
        >
          <AdminActionForm
            formId="admin-tools-create"
            action={createToolsAndTechnology}
            onSuccess={() => setCreateCategory(undefined)}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  {isNewCategory ? (
                    <AdminField
                      id="admin-tools-create-category"
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
                    id="admin-tools-create-name"
                    name="name"
                    label="Name"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-tools-create-sort"
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
                  id="admin-tools-create-submit"
                  label={isNewCategory ? 'Add category' : 'Add tool'}
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
