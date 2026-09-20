'use client';

import { useId, useState } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { useAdminAction } from '@/features/admin/lib/use-admin-action';
import type { AdminActionState } from '@/types/components/admin-shell';
import type {
  AdminDataTableProps,
  AdminDetailField,
} from '@/types/components/admin-table';

type ActiveModal = 'view' | 'edit' | 'delete' | null;

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

export function AdminDataTable<T extends { id: string }>({
  caption,
  rows,
  columns,
  getRowLabel,
  getDetailFields,
  renderEditForm,
  deleteAction,
  getDeleteConfirmMessage,
  emptyTitle = 'No items yet',
  emptyDescription = 'Add an item below to get started.',
}: AdminDataTableProps<T>) {
  const baseId = useId();
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

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

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <>
      <AdminTable
        caption={caption}
        rows={rows}
        columns={columns}
        getRowLabel={getRowLabel}
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
