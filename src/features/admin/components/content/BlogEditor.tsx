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
import { DeleteItemForm } from '@/features/admin/components/DeleteItemForm';
import { EmptyState } from '@/components/EmptyState';
import {
  createBlogPost,
  deleteBlogPost,
  updateBlogPost,
} from '@/features/admin/lib/content-actions';
import type { BlogEditorProps } from '@/types/components/admin-content';

export function BlogEditor({ items }: BlogEditorProps) {
  return (
    <main className="flex-1 px-6 py-8 sm:px-10">
      <AdminPageHeader
        eyebrow="Content"
        title="Blog"
        description="Create and edit posts for the /blog page. Full body text opens in a reading modal."
      />

      <div className="grid w-full gap-6">
        {items.length === 0 ? (
          <EmptyState
            title="No blog posts yet"
            description="Add your first post below. It will appear on the public blog page."
          />
        ) : null}

        {items.map((item) => {
          const formId = `admin-blog-${item.id}`;

          return (
            <AdminFormCard key={item.id} title={item.title}>
              <div className="space-y-4">
                <AdminActionForm formId={formId} action={updateBlogPost} className="space-y-4">
                  {({ state, isPending, statusId, hasError }) => (
                    <>
                      <input type="hidden" name="id" value={item.id} />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AdminField
                          id={`${formId}-title`}
                          name="title"
                          label="Title"
                          defaultValue={item.title}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-slug`}
                          name="slug"
                          label="Slug"
                          defaultValue={item.slug}
                          required
                          describedBy={statusId}
                          invalid={hasError}
                        />
                        <AdminField
                          id={`${formId}-published`}
                          name="publishedOn"
                          label="Published on"
                          type="date"
                          defaultValue={item.publishedOn}
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
                      <AdminTextareaField
                        id={`${formId}-excerpt`}
                        name="excerpt"
                        label="Excerpt"
                        defaultValue={item.excerpt}
                        required
                        rows={3}
                        describedBy={statusId}
                        invalid={hasError}
                      />
                      <AdminTextareaField
                        id={`${formId}-body`}
                        name="body"
                        label="Body"
                        defaultValue={item.body}
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
                <DeleteItemForm
                  formId={`${formId}-delete`}
                  itemId={item.id}
                  action={deleteBlogPost}
                  confirmMessage={`Delete "${item.title}"?`}
                />
              </div>
            </AdminFormCard>
          );
        })}

        <AdminFormCard title="Add blog post">
          <AdminActionForm
            formId="admin-blog-create"
            action={createBlogPost}
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
                  <AdminField
                    id="admin-blog-create-published"
                    name="publishedOn"
                    label="Published on"
                    type="date"
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
        </AdminFormCard>
      </div>
    </main>
  );
}
