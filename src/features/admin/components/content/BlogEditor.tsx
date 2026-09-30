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
  AdminTextareaField,
} from '@/features/admin/components/AdminFormPrimitives';
import { AdminDateField } from '@/features/admin/components/AdminDateField';
import { AdminModal } from '@/features/admin/components/AdminModal';
import {
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
} from '@/features/admin/lib/content-actions';
import type { AdminBlogPostItem, BlogEditorProps } from '@/types/components/admin-content';
import type { AdminTableColumn } from '@/types/components/admin-table';

const COLUMNS: AdminTableColumn<AdminBlogPostItem>[] = [
  { id: 'title', header: 'Title', cell: (row) => row.title },
  { id: 'slug', header: 'Slug', cell: (row) => row.slug, hideBelow: 'sm' },
  {
    id: 'publishedOn',
    header: 'Published',
    cell: (row) => row.publishedOn,
    hideBelow: 'md',
  },
];

export function BlogEditor({ items }: BlogEditorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <main className="px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Pages"
        title="Blog"
        description="Create and edit posts for the /blog page. Full body text opens in a reading modal."
        action={
          <AdminHeaderAddButton
            id="admin-blog-add"
            label="Add"
            onClick={() => setIsCreateOpen(true)}
          />
        }
      />

      <AdminDataTable
        caption="Blog posts"
        rows={items}
        columns={COLUMNS}
        getRowLabel={(row) => row.title}
        getDetailFields={(row) => [
          { label: 'Title', value: row.title },
          { label: 'Slug', value: row.slug },
          { label: 'Published on', value: row.publishedOn },
          { label: 'Excerpt', value: row.excerpt },
          { label: 'Body', value: row.body },
          { label: 'Display order', value: String(row.sortOrder) },
        ]}
        deleteAction={deleteBlogPost}
        getDeleteConfirmMessage={(row) => `Delete "${row.title}"?`}
        emptyTitle="No blog posts yet"
        emptyDescription="Use Add to create a post for the public blog page."
        renderEditForm={({ row, formId, onSuccess }) => (
          <AdminActionForm
            formId={formId}
            action={updateBlogPost}
            onSuccess={onSuccess}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <input type="hidden" name="id" value={row.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id={`${formId}-title`}
                    name="title"
                    label="Title"
                    defaultValue={row.title}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id={`${formId}-slug`}
                    name="slug"
                    label="Slug"
                    defaultValue={row.slug}
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminDateField
                    id={`${formId}-published`}
                    name="publishedOn"
                    label="Published on"
                    defaultValue={row.publishedOn}
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
                <AdminTextareaField
                  id={`${formId}-excerpt`}
                  name="excerpt"
                  label="Excerpt"
                  defaultValue={row.excerpt}
                  required
                  rows={3}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminTextareaField
                  id={`${formId}-body`}
                  name="body"
                  label="Body"
                  defaultValue={row.body}
                  required
                  rows={10}
                  describedBy={statusId}
                  invalid={hasError}
                />
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
          title="Add blog post"
          description="Create a post for the public blog page."
          onClose={() => setIsCreateOpen(false)}
          size="xl"
        >
          <AdminActionForm
            formId="admin-blog-create"
            action={createBlogPost}
            onSuccess={() => setIsCreateOpen(false)}
            className="space-y-4"
          >
            {({ state, isPending, statusId, hasError }) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField
                    id="admin-blog-create-title"
                    name="title"
                    label="Title"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-blog-create-slug"
                    name="slug"
                    label="Slug"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminDateField
                    id="admin-blog-create-published"
                    name="publishedOn"
                    label="Published on"
                    required
                    describedBy={statusId}
                    invalid={hasError}
                  />
                  <AdminField
                    id="admin-blog-create-sort"
                    name="sortOrder"
                    label="Display order"
                    type="number"
                    defaultValue={items.length + 1}
                    describedBy={statusId}
                    invalid={hasError}
                  />
                </div>
                <AdminTextareaField
                  id="admin-blog-create-excerpt"
                  name="excerpt"
                  label="Excerpt"
                  required
                  rows={3}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminTextareaField
                  id="admin-blog-create-body"
                  name="body"
                  label="Body"
                  required
                  rows={10}
                  describedBy={statusId}
                  invalid={hasError}
                />
                <AdminStatus id={statusId} state={state} />
                <AdminSubmitButton
                  id="admin-blog-create-submit"
                  label="Add post"
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
