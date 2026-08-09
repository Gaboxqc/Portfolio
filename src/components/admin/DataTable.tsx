import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  /** Cell content. Kept as a render function so cells can hold links and badges. */
  cell: (row: T) => ReactNode
  /** Narrow, right-aligned column for row actions. */
  compact?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => number | string
  loading?: boolean
  error?: string | null
  emptyMessage: string
  /** Dims the table during a background refetch without unmounting it. */
  refreshing?: boolean
}

function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  error = null,
  emptyMessage,
  refreshing = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className='flex flex-col gap-2' aria-busy='true'>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className='h-12 animate-pulse rounded-lg bg-muted-foreground/10' />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p role='alert' className='rounded-xl border border-red-500/40 p-6 text-center text-red-400'>
        {error}
      </p>
    )
  }

  if (rows.length === 0) {
    return (
      <p className='rounded-xl border border-primary/20 p-10 text-center text-muted-foreground'>
        {emptyMessage}
      </p>
    )
  }

  return (
    // Wide tables scroll inside their own container so the page never scrolls
    // sideways on a narrow screen.
    <div className='overflow-x-auto rounded-xl border border-primary/20'>
      <table className={`w-full text-left text-sm ${refreshing ? 'opacity-60' : ''}`}>
        <thead className='border-b border-primary/20 bg-card/60'>
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope='col'
                className={`px-4 py-3 font-medium text-muted-foreground ${
                  column.compact ? 'w-px whitespace-nowrap text-right' : ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className='border-b border-primary/10 last:border-0'>
              {columns.map((column) => (
                <td
                  key={column.header}
                  className={`px-4 py-3 ${column.compact ? 'whitespace-nowrap text-right' : ''}`}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
