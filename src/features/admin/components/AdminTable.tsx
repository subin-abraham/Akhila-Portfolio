'use client';

import type { AdminTableProps } from '@/types/components/admin-table';

const HIDE_BELOW_CLASS = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
} as const;

const HIDE_BELOW_COL_CLASS = {
  sm: 'hidden sm:table-column',
  md: 'hidden md:table-column',
  lg: 'hidden lg:table-column',
} as const;

export function AdminTable<T extends { id: string }>({
  caption,
  rows,
  columns,
  getRowLabel,
  renderActions,
  framed = true,
  layout = 'auto',
  actionsWidthClassName = 'w-72',
}: AdminTableProps<T>) {
  const shellClassName = framed
    ? 'overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]'
    : 'overflow-x-auto';
  const tableClassName =
    layout === 'fixed'
      ? 'w-full min-w-[36rem] table-fixed border-collapse text-left text-sm'
      : 'w-full min-w-[36rem] border-collapse text-left text-sm';
  const useColgroup = layout === 'fixed' || columns.some((column) => column.widthClassName);

  return (
    <div className={shellClassName}>
      <table className={tableClassName}>
        <caption className="sr-only">{caption}</caption>
        {useColgroup ? (
          <colgroup>
            {columns.map((column) => (
              <col
                key={column.id}
                className={[
                  column.widthClassName,
                  column.hideBelow ? HIDE_BELOW_COL_CLASS[column.hideBelow] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            ))}
            <col className={actionsWidthClassName} />
          </colgroup>
        ) : null}
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`px-4 py-3 text-xs font-medium tracking-wide text-home-muted uppercase ${
                  column.hideBelow ? HIDE_BELOW_CLASS[column.hideBelow] : ''
                } ${column.headerClassName ?? ''}`}
              >
                {column.header}
              </th>
            ))}
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium tracking-wide text-home-muted uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-white/5 last:border-b-0">
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={`truncate px-4 py-3 text-white ${
                    column.hideBelow ? HIDE_BELOW_CLASS[column.hideBelow] : ''
                  } ${column.cellClassName ?? ''}`}
                >
                  {column.cell(row)}
                </td>
              ))}
              <td className="px-4 py-3">
                <div
                  className="flex flex-wrap items-center justify-end gap-2"
                  aria-label={`Actions for ${getRowLabel(row)}`}
                >
                  {renderActions(row)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
