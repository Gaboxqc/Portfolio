import { useState } from 'react'
import { Link } from 'react-router'

import ConfirmDialog from './ConfirmDialog'
import DataTable, { type Column } from './DataTable'
import Pagination from './Pagination'
import { useAdminList, useAdminMutations } from '../../hooks/admin/useAdminResource'
import useNoIndex from '../../hooks/useNoIndex'
import { errorMessage } from '../../services/adminApi'

const PAGE_SIZE = 20

interface AdminListPageProps<T> {
  title: string
  /** API path, e.g. '/portfolio/projects'. */
  path: string
  /** Route base for the create and edit screens, e.g. '/admin/projects'. */
  routeBase: string
  columns: Column<T>[]
  rowKey: (row: T) => number
  /** Names the record in the delete confirmation, so it is not a blind "are you sure". */
  describe: (row: T) => string
  emptyMessage: string
  newLabel: string
}

/**
 * List, paginate and delete, shared by projects, courses and certifications.
 *
 * The three differ only in their columns, so the surrounding machinery — paging,
 * the confirmation dialog, error handling, cache invalidation — lives here once.
 * Actions are appended as a final column rather than passed separately, which
 * keeps the table generic.
 */
function AdminListPage<T>({
  title,
  path,
  routeBase,
  columns,
  rowKey,
  describe,
  emptyMessage,
  newLabel,
}: AdminListPageProps<T>) {
  useNoIndex(`${title} — Admin`)

  const [offset, setOffset] = useState(0)
  const [pendingDelete, setPendingDelete] = useState<T | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { items, total, loading, fetching, error } = useAdminList<T>(path, offset, PAGE_SIZE)
  const { remove } = useAdminMutations<unknown, unknown>(path)

  const confirmDelete = async () => {
    if (!pendingDelete) return
    setDeleteError(null)
    try {
      await remove.mutateAsync(rowKey(pendingDelete))
      setPendingDelete(null)
      // Deleting the only row on the last page would otherwise leave the table
      // empty on a page that no longer exists.
      if (items.length === 1 && offset > 0) setOffset(Math.max(0, offset - PAGE_SIZE))
    } catch (caught) {
      setDeleteError(errorMessage(caught, 'Could not delete this record.'))
    }
  }

  const withActions: Column<T>[] = [
    ...columns,
    {
      header: 'Actions',
      compact: true,
      cell: (row) => (
        <span className='flex justify-end gap-2'>
          <Link
            to={`${routeBase}/${rowKey(row)}`}
            className='rounded-lg bg-primary/10 px-3 py-1.5 outline-1 hover:bg-primary/20'
          >
            Edit
          </Link>
          <button
            type='button'
            onClick={() => {
              setDeleteError(null)
              setPendingDelete(row)
            }}
            className='cursor-pointer rounded-lg px-3 py-1.5 text-red-400 outline-1 outline-red-500/40 hover:bg-red-500/10'
          >
            Delete
          </button>
        </span>
      ),
    },
  ]

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-3xl'>{title}</h1>
        <Link
          to={`${routeBase}/new`}
          className='rounded-xl bg-linear-to-r from-primary to-accent px-4 py-2 font-medium text-white'
        >
          {newLabel}
        </Link>
      </div>

      <DataTable
        columns={withActions}
        rows={items}
        rowKey={rowKey}
        loading={loading}
        error={error}
        emptyMessage={emptyMessage}
        refreshing={fetching && !loading}
      />

      <Pagination offset={offset} limit={PAGE_SIZE} total={total} onOffsetChange={setOffset} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title='Delete this record?'
        message={
          pendingDelete
            ? `“${describe(pendingDelete)}” will be permanently removed, along with its translations and tag links.`
            : ''
        }
        busy={remove.isPending}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

export default AdminListPage
