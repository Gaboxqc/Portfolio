interface PaginationProps {
  offset: number
  limit: number
  /** Unpaginated total, from the API's X-Total-Count header. */
  total: number
  onOffsetChange: (offset: number) => void
}

/**
 * Offset-based pager.
 *
 * Only possible because the list endpoints report a total; without it a client
 * cannot tell a last page from a full one.
 */
const Pagination = ({ offset, limit, total, onOffsetChange }: PaginationProps) => {
  const page = Math.floor(offset / limit) + 1
  const pageCount = Math.max(1, Math.ceil(total / limit))
  const first = total === 0 ? 0 : offset + 1
  const last = Math.min(offset + limit, total)

  if (total <= limit) {
    return (
      <p className='text-sm text-muted-foreground'>
        {total} {total === 1 ? 'record' : 'records'}
      </p>
    )
  }

  return (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <p className='text-sm text-muted-foreground' aria-live='polite'>
        Showing {first}–{last} of {total}
      </p>

      <div className='flex items-center gap-2'>
        <button
          type='button'
          onClick={() => onOffsetChange(Math.max(0, offset - limit))}
          disabled={offset === 0}
          className='cursor-pointer rounded-lg bg-primary/10 px-3 py-2 text-sm outline-1 hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40'
        >
          Previous
        </button>
        <span className='text-sm text-muted-foreground'>
          Page {page} of {pageCount}
        </span>
        <button
          type='button'
          onClick={() => onOffsetChange(offset + limit)}
          disabled={last >= total}
          className='cursor-pointer rounded-lg bg-primary/10 px-3 py-2 text-sm outline-1 hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination
