'use client';

import { useId, useMemo, useState } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { useAdminAction } from '@/features/admin/lib/use-admin-action';
import type { AdminActionState } from '@/types/components/admin-shell';
import type {
  AdminCategoryGroup,
  AdminCategoryGroupedTableProps,
  AdminDetailField,
} from '@/types/components/admin-table';

type ActiveModal = 'view' | 'edit' | 'delete' | null;

function groupRowsByCategory<T extends { id: string; category: string }>(
  rows: T[],
): AdminCategoryGroup<T>[] {
  const groups = new Map<string, T[]>();

  for (const row of rows) {
    const existing = groups.get(row.category);
    if (existing) {
      existing.push(row);
    } else {
      groups.set(row.category, [row]);
    }
  }

  return Array.from(groups.entries()).map(([category, groupRows]) => ({
    category,
    rows: groupRows,
  }));
}

function DetailList({ fields }: { fields: AdminDetailField[] }) {
  return (
    <dl className="space-y-3">
      {fields.map((field) => (
        <div
          key={field.label}
          className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
        >
          <dt className="text-xs font-medium tracking-wide text-home-muted uppercase">
            {field.label}
          </dt>
          <dd className="wrap-break-word text-sm text-white">
            {field.value === null ||
            field.value === undefined ||
            field.value === ''
              ? '—'
              : field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ActionButton({
  id,
  label,
  ariaLabel,
  onClick,
  variant = 'default',
}: {
  id: string;
  label: string;
  ariaLabel: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}) {
  const className =
    variant === 'danger'
      ? 'rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-400/10'
      : 'rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/25 hover:bg-white/10';

  return (
    <button
      id={id}
      type="button"
      title={ariaLabel}
      aria-label={ariaLabel}
      onClick={onClick}
      className={className}
    >
      {label}
    </button>
  );
}

interface AdminDeleteConfirmDialogProps {
  itemId: string;
  title: string;
  message: string;
  action: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  onClose: () => void;
}

function AdminDeleteConfirmDialog({
  itemId,
  title,
  message,
  action,
  onClose,
}: AdminDeleteConfirmDialogProps) {
  const baseId = useId();
  const { formAction, isPending } = useAdminAction({
    action,
    onSuccess: onClose,
    successFallbackMessage: 'Deleted.',
    pendingLabel: 'Deleting…',
  });

  return (
    <AdminModal
      title={title}
      description="This action cannot be undone."
      onClose={onClose}
      size="md"
      footer={
        <>
          <button
            id={`${baseId}-cancel`}
            type="button"
            title="Cancel delete"
            aria-label="Cancel delete"
            onClick={onClose}
            className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
          >
            Cancel
          </button>
          <form action={formAction}>
            <input type="hidden" name="id" value={itemId} />
            <button
              id={`${baseId}-confirm`}
              type="submit"
              title={isPending ? 'Deleting…' : 'Confirm delete'}
              aria-label={isPending ? 'Deleting…' : 'Confirm delete'}
              aria-busy={isPending}
              disabled={isPending}
              className="rounded-lg border border-red-400/40 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </button>
          </form>
        </>
      }
    >
      <p className="text-sm text-home-muted">{message}</p>
    </AdminModal>
  );
}

export function AdminCategoryGroupedTable<T extends { id: string; category: string }>({
  caption,
  rows,
  columns,
  getRowLabel,
  getDetailFields,
  renderEditForm,
  deleteAction,
  getDeleteConfirmMessage,
  onAddToCategory,
  addToCategoryLabel = 'Add',
  newCategoryTitle = 'Add new category',
  newCategoryDescription = 'Create a category and add the first item.',
  emptyTitle = 'No items yet',
  emptyDescription = 'Use Add new category to get started.',
}: AdminCategoryGroupedTableProps<T>) {
  const baseId = useId();
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const groups = useMemo(() => groupRowsByCategory(rows), [rows]);
  const activeRow = rows.find((row) => row.id === activeRowId) ?? null;
  const canEdit = Boolean(renderEditForm);
  const canDelete = Boolean(deleteAction);

  function closeModal() {
    setActiveModal(null);
    setActiveRowId(null);
  }

  function openModal(rowId: string, modal: Exclude<ActiveModal, null>) {
    setActiveRowId(rowId);
    setActiveModal(modal);
  }

  return (
    <>
      {groups.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => {
            const addId = `${baseId}-add-${group.category.replace(/\s+/g, '-').toLowerCase()}`;
            const addLabel = `${addToCategoryLabel} to ${group.category}`;

            return (
              <section
                key={group.category}
                className="rounded-2xl border border-white/10 bg-white/3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-semibold text-white">
                      {group.category}
                    </h2>
                    <p className="mt-0.5 text-xs text-home-muted">
                      {group.rows.length} {group.rows.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <button
                    id={addId}
                    type="button"
                    title={addLabel}
                    aria-label={addLabel}
                    onClick={() => onAddToCategory(group.category)}
                    className="home-cta shrink-0 rounded-lg bg-home-accent px-4 py-2 text-sm font-semibold text-home-ink transition"
                  >
                    {addToCategoryLabel}
                  </button>
                </div>
                <AdminTable
                  caption={`${caption} — ${group.category}`}
                  rows={group.rows}
                  columns={columns}
                  getRowLabel={getRowLabel}
                  framed={false}
                  layout="fixed"
                  renderActions={(row) => {
                    const label = getRowLabel(row);
                    return (
                      <>
                        <ActionButton
                          id={`${baseId}-view-${row.id}`}
                          label="View details"
                          ariaLabel={`View all details for ${label}`}
                          onClick={() => openModal(row.id, 'view')}
                        />
                        {canEdit ? (
                          <ActionButton
                            id={`${baseId}-edit-${row.id}`}
                            label="Edit"
                            ariaLabel={`Edit ${label}`}
                            onClick={() => openModal(row.id, 'edit')}
                          />
                        ) : null}
                        {canDelete ? (
                          <ActionButton
                            id={`${baseId}-delete-${row.id}`}
                            label="Delete"
                            ariaLabel={`Delete ${label}`}
                            variant="danger"
                            onClick={() => openModal(row.id, 'delete')}
                          />
                        ) : null}
                      </>
                    );
                  }}
                />
              </section>
            );
          })}
        </div>
      )}

      <button
        id={`${baseId}-new-category`}
        type="button"
        title={newCategoryTitle}
        aria-label={newCategoryTitle}
        onClick={() => onAddToCategory(null)}
        className="mt-6 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/2 px-6 py-10 text-center transition hover:border-home-accent/50 hover:bg-home-accent/5"
      >
        <span className="font-display text-base font-semibold text-white">
          {newCategoryTitle}
        </span>
        <span className="mt-1 max-w-sm text-sm text-home-muted">
          {newCategoryDescription}
        </span>
      </button>

      {activeRow && activeModal === 'view' ? (
        <AdminModal
          title={getRowLabel(activeRow)}
          description="Full record details"
          onClose={closeModal}
          size="xl"
        >
          <DetailList fields={getDetailFields(activeRow)} />
        </AdminModal>
      ) : null}

      {activeRow && activeModal === 'edit' && renderEditForm ? (
        <AdminModal
          title={`Edit ${getRowLabel(activeRow)}`}
          description="Update this record and save your changes."
          onClose={closeModal}
          size="xl"
        >
          {renderEditForm({
            row: activeRow,
            formId: `${baseId}-edit-form-${activeRow.id}`,
            onSuccess: closeModal,
          })}
        </AdminModal>
      ) : null}

      {activeRow && activeModal === 'delete' && deleteAction ? (
        <AdminDeleteConfirmDialog
          itemId={activeRow.id}
          title={`Delete ${getRowLabel(activeRow)}`}
          message={
            getDeleteConfirmMessage?.(activeRow) ??
            `Are you sure you want to delete "${getRowLabel(activeRow)}"?`
          }
          action={deleteAction}
          onClose={closeModal}
        />
      ) : null}
    </>
  );
}
